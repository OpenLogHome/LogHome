import { buildMobileUrl } from '~/utils/uri-resolver.js'

export default function ({ req, redirect, route, $config, app }) {
  // 只在服务端执行设备检测
  if (process.server && req) {
    const userAgent = req.headers['user-agent'] || ''
    
    // 移动设备检测正则表达式
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i
    const isMobile = mobileRegex.test(userAgent)
    
    // 获取移动端SPA应用URL配置
    const mobileUrl = app.context.env.mobileUrl
    
    // 如果是移动设备且配置了移动端URL，则重定向到移动端SPA应用
    if (isMobile && mobileUrl && mobileUrl !== '') {
      try {
        // 使用URI解析器构建移动端URL
        const redirectUrl = buildMobileUrl(mobileUrl, route.path, route.query)
        
        // 执行外部重定向到移动端SPA应用
        return redirect(302, redirectUrl)
      } catch (error) {
        // 如果URI解析失败，使用原始逻辑作为后备方案
        console.error('URI解析失败，使用后备方案:', error)
        
        let redirectUrl = mobileUrl
        if (route.path && route.path !== '/') {
          redirectUrl += '/#' + route.path
        }
        
        // 添加查询参数
        if (route.query && Object.keys(route.query).length > 0) {
          const queryString = new URLSearchParams(route.query).toString()
          redirectUrl += (redirectUrl.includes('?') ? '&' : '?') + queryString
        }
        
        return redirect(302, redirectUrl)
      }
    }
  }
}