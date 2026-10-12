import { ReadingActivity } from '~/utils/reading-activity'
import { readingToken } from '~/plugins/api/reading'
import { Message } from 'element-ui'

export default ({ app }, inject) => {
  const reporter = new ReadingActivity({ token: readingToken, now: Date.now, visible: () => document.visibilityState === 'visible', report: (seconds,id) => app.$api.reader.exp(seconds,id), reward: amount => Message.success(`阅读任务完成，成长值 +${amount}`), warning: message => Message.warning(message) })
  const enter = route => reporter.setActive(/^\/article\/\d+\/?$/.test(route.path) || /^\/manga\/read\/\d+\/?$/.test(route.path))
  const removeHook = app.router.afterEach(enter)
  enter(app.router.currentRoute)
  const mark = () => reporter.markActive()
  const visibility = () => { reporter.tick(); if (document.visibilityState === 'hidden') reporter.flush(true); else reporter.markActive() }
  const storage = event => { if (event.key === 'token') reporter.checkAccount() }
  const pagehide = () => reporter.flush(true)
  for (const event of ['scroll', 'pointerdown', 'keydown', 'wheel']) window.addEventListener(event, mark, { passive: true })
  window.addEventListener('storage', storage); window.addEventListener('pagehide', pagehide); document.addEventListener('visibilitychange', visibility)
  const timer = setInterval(() => { if (app.$readerAudio && app.$readerAudio.state.status === 'playing' && app.$readerAudio.state.speechStarted) reporter.markActive(); reporter.tick() }, 1000)
  if (module.hot) module.hot.dispose(() => { clearInterval(timer); removeHook(); for (const event of ['scroll', 'pointerdown', 'keydown', 'wheel']) window.removeEventListener(event, mark); window.removeEventListener('storage', storage); window.removeEventListener('pagehide', pagehide); document.removeEventListener('visibilitychange', visibility) })
  inject('readingActivity', reporter)
}
