//〔 FINALIZED FILE: ~/utils/PcmPlayer.js (v2 - The Alchemist's Tool)

/**
 * PcmPlayer – main-thread façade with back-pressure awareness
 *
 * Public API:
 *   const player = new PcmPlayer()
 *   await player.start()
 *   await player.enqueue(chunk)   // Uint8Array
 *   player.getAudioContext()      // returns the active AudioContext
 *   await player.stop()
 */

export default class PcmPlayer {
  constructor({
    pcmSampleRate = 24000,
    channelCount = 1,
    bufferSeconds = 8,
    highWaterMark = 0.9,
    pollInterval = 50,
  } = {}) {
    this.pcmRate = pcmSampleRate
    this.channels = channelCount
    this.capacity = pcmSampleRate * bufferSeconds * channelCount
    this.controlSAB = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 2)
    this.dataSAB = new SharedArrayBuffer(
      Int16Array.BYTES_PER_ELEMENT * this.capacity
    )
    this.control = new Int32Array(this.controlSAB)
    this.data = new Int16Array(this.dataSAB)
    this.ctx = null
    this.worklet = null
    this.highWater = Math.floor(this.capacity * highWaterMark)
    this.pollMs = pollInterval
  }

  async #boot() {
    if (this.ctx) return
    try {
      this.ctx = new AudioContext({ sampleRate: this.pcmRate })
    } catch {
      this.ctx = new AudioContext()
    }
    await this.ctx.audioWorklet.addModule("pcm-player.js")
    this.worklet = new AudioWorkletNode(this.ctx, "pcm-player", {
      channelCount: this.channels,
      outputChannelCount: [this.channels],
      processorOptions: {
        controlSAB: this.controlSAB,
        dataSAB: this.dataSAB,
        channelCount: this.channels,
      },
    })
    this.worklet.connect(this.ctx.destination)
  }

  async start() {
    await this.#boot()
    if (this.ctx.state === "suspended") await this.ctx.resume()
  }

  async stop() {
    if (!this.ctx) return
    await this.ctx.close()
    this.ctx = this.worklet = null
  }

  #sleep() {
    return new Promise((resolve) => setTimeout(resolve, this.pollMs))
  }

  //〔 this is the new, holy method that exposes the cauldron.
  getAudioContext() {
    if (!this.ctx) {
      throw new Error(
        "PcmPlayer has not been started. Cannot get AudioContext."
      )
    }
    return this.ctx
  }

  async enqueue(uint8) {
    if (!(uint8 instanceof Uint8Array))
      throw new TypeError("enqueue() expects Uint8Array")

    const src = new Int16Array(
      uint8.buffer,
      uint8.byteOffset,
      uint8.byteLength >> 1
    )
    let offset = 0
    const cap = this.capacity

    while (offset < src.length) {
      const readIdx = Atomics.load(this.control, 0)
      const writeIdx = Atomics.load(this.control, 1)
      const used = (writeIdx - readIdx + cap) % cap

      if (used >= this.highWater) {
        await this.#sleep()
        continue
      }

      const space = cap - used - 1
      const chunk = Math.min(space, src.length - offset)

      if (writeIdx + chunk <= cap) {
        this.data.set(src.subarray(offset, offset + chunk), writeIdx)
      } else {
        const first = cap - writeIdx
        this.data.set(src.subarray(offset, offset + first), writeIdx)
        this.data.set(src.subarray(offset + first, offset + chunk), 0)
      }

      Atomics.store(this.control, 1, (writeIdx + chunk) % cap)
      offset += chunk
    }
  }
}
