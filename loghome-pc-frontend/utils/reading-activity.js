// Foreground time only. An unconfirmed report retains its own ID and duration;
// newly read seconds never become part of a retry of that report.
export function readingActivityRequestId() {
  return `read-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}`
}
export function readingActivityReceipt(result, pending) {
  if (!result || result.msg !== 'ok' || result.client_request_id !== pending.id || result.accepted_seconds !== pending.seconds || typeof result.replayed !== 'boolean' || !Number.isSafeInteger(result.total_reward) || result.total_reward < 0 || !Array.isArray(result.settled_tasks)) throw Object.assign(new Error('阅读时长回执异常，请刷新后核对任务状态。'), { status:409 })
  const sum = result.settled_tasks.reduce((total, task) => {
    if (!task || !Number.isSafeInteger(task.reward) || task.reward < 0 || !Number.isSafeInteger(task.settled_times) || task.settled_times < 1) throw Object.assign(new Error('阅读奖励回执异常，请刷新后核对。'), { status:409 })
    return total + task.reward
  }, 0)
  if (sum !== result.total_reward || (result.replayed && sum !== 0)) throw Object.assign(new Error('阅读奖励回执异常，请刷新后核对。'), { status:409 })
  return sum
}
export class ReadingActivity {
  constructor(environment) {
    this.env=environment; this.account=environment.token(); this.epoch=0; this.buffer=0; this.remainder=0; this.lastTick=environment.now(); this.lastActive=this.lastTick; this.active=false; this.inFlight=null; this.pending=null; this.retryAt=0; this.failures=0; this.blocked=false; this.forceAfterFlight=false
  }
  markActive() { this.lastActive=this.env.now() }
  setActive(value) { this.tick(); this.active=Boolean(value); if(value)this.markActive(); else this.flush(true) }
  checkAccount() {
    const token=this.env.token()
    if(token!==this.account){this.epoch++;this.account=token;this.buffer=0;this.remainder=0;this.pending=null;this.retryAt=0;this.failures=0;this.blocked=false;this.forceAfterFlight=false;this.lastTick=this.env.now();this.lastActive=this.lastTick}
  }
  tick() {
    this.checkAccount()
    const now=this.env.now(),elapsed=Math.max(0,Math.min(5000,now-this.lastTick));this.lastTick=now
    if(!this.account||!this.active||!this.env.visible()||now-this.lastActive>180000){this.remainder=0;return}
    this.remainder+=elapsed;const seconds=Math.floor(this.remainder/1000);this.remainder%=1000;this.buffer=Math.min(300,this.buffer+seconds);this.flush()
  }
  async flush(force=false) {
    this.checkAccount()
    if(this.inFlight){if(force)this.forceAfterFlight=true;return}
    if(!this.account||this.blocked||this.env.now()<this.retryAt)return
    if(!this.pending){const seconds=force?Math.floor(this.buffer):Math.floor(this.buffer/60)*60;if(!seconds)return;this.buffer-=seconds;this.pending={id:(this.env.requestId||readingActivityRequestId)(),seconds}}
    const pending=this.pending,token=this.account,epoch=this.epoch,current=()=>epoch===this.epoch&&token===this.account&&token===this.env.token()&&this.pending===pending
    this.inFlight=Promise.resolve().then(()=>current()?this.env.report(pending.seconds,pending.id):null).then(result=>{
      if(!current()||!result)return
      const reward=readingActivityReceipt(result,pending)
      this.pending=null;this.failures=0;this.retryAt=0
      if(reward>0)this.env.reward(reward)
    }).catch(error=>{
      if(!current())return
      if([400,401,403,409,422].includes(error.status)){this.blocked=true;if(this.env.warning)this.env.warning(error.message||'阅读任务暂不可用，请重新登录或刷新页面核对。');return}
      this.retryAt=this.env.now()+Math.min(60000,5000*(2**Math.min(6,this.failures++)))
    }).finally(()=>{this.inFlight=null;if(this.forceAfterFlight){this.forceAfterFlight=false;this.flush(true)}})
    return this.inFlight
  }
}
