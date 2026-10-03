import { Message } from 'element-ui'

// 移动端功能页的默认宽度：uni-app 页面按窄屏设计，过宽会露出空白
const DEFAULT_WIDTH = 420

function buildLoginUrl(pagePath, crossSiteToken) {
  return `${process.env.mobileUrl}/#/pages/users/external_login` +
    `?token=${crossSiteToken}&hideback=true&redirectTo=${encodeURIComponent(pagePath)}`
}

// 用浮窗内嵌移动端页面，替代整页跳转到 m.loghome.ink
async function openMobileWindow(app, pagePath, options = {}) {
  if (!localStorage.getItem('token')) {
    app.router.push('/login')
    return false
  }

  try {
    const response = await app.$api.users.generateCrossSiteToken()
    const crossSiteToken = response && response.crossSiteToken
    if (!crossSiteToken) throw new Error('未获取到跨站登录令牌')

    app.$windowManager.createWindow({
      title: options.title || '功能页',
      url: buildLoginUrl(pagePath, crossSiteToken),
      width: options.width || DEFAULT_WIDTH,
      height: options.height || Math.min(800, window.screen.height - 200)
    })
    return true
  } catch (error) {
    console.error('打开功能页失败', error)
    Message.error('打开失败，请稍后重试')
    return false
  }
}

export default ({ app }, inject) => {
  inject('openMobileWindow', (pagePath, options) => openMobileWindow(app, pagePath, options))
}
