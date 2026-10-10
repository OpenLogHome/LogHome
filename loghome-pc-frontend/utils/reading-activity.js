// Count actual foreground reading time, with the same read_seconds protocol as the app.
export class ReadingActivity {
  constructor(environment) {
    this.env = environment; this.account = environment.token(); this.buffer = 0; this.remainder = 0; this.lastTick = environment.now(); this.lastActive = this.lastTick; this.active = false; this.inFlight = null; this.retryAt = 0; this.failures = 0
  }
  markActive() { this.lastActive = this.env.now() }
  setActive(value) { this.tick(); this.active = Boolean(value); if (value) this.markActive(); else this.flush(true) }
  checkAccount() {
    const token = this.env.token()
    if (token !== this.account) { this.account = token; this.buffer = 0; this.remainder = 0; this.retryAt = 0; this.failures = 0; this.lastTick = this.env.now() }
  }
  tick() {
    this.checkAccount()
    const now = this.env.now(), elapsed = Math.max(0, Math.min(5000, now - this.lastTick))
    this.lastTick = now
    if (!this.account || !this.active || !this.env.visible() || now - this.lastActive > 180000) { this.remainder = 0; return }
    this.remainder += elapsed
    const seconds = Math.floor(this.remainder / 1000)
    this.remainder %= 1000; this.buffer = Math.min(300, this.buffer + seconds)
    this.flush()
  }
  async flush(force = false) {
    this.checkAccount()
    if (this.inFlight) { if (force) this.forceAfterFlight = true; return }
    if (!this.account || this.env.now() < this.retryAt) return
    const seconds = force ? Math.floor(this.buffer) : Math.floor(this.buffer / 60) * 60
    if (!seconds) return
    const token = this.account
    this.buffer -= seconds
    this.inFlight = Promise.resolve().then(() => {
      if (token !== this.env.token()) return null
      return this.env.report(seconds)
    }).then(result => {
      if (token !== this.env.token() || !result) return
      this.failures = 0; this.retryAt = 0
      // Only announce a reward that the server has actually settled.
      if (Number(result.total_reward) > 0 && Array.isArray(result.settled_tasks) && result.settled_tasks.length) this.env.reward(Number(result.total_reward))
    }).catch(() => {
      if (token !== this.env.token()) return
      this.buffer = Math.min(300, this.buffer + seconds)
      this.retryAt = this.env.now() + Math.min(60000, 5000 * (2 ** this.failures++))
    }).finally(() => { this.inFlight = null; if (this.forceAfterFlight) { this.forceAfterFlight = false; this.flush(true) } })
    return this.inFlight
  }
}
