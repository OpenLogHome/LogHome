import { buildMobileUrl, parseUrl } from '~/utils/uri-resolver.js'

export default ({ app }, inject) => {
  // 设备检测工具函数
  const device = {
    // 检测是否为移动设备
    isMobile() {
      if (process.server) return false
      
      const userAgent = navigator.userAgent || ''
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i
      const screenWidth = window.innerWidth || document.documentElement.clientWidth
      
      return mobileRegex.test(userAgent) || screenWidth <= 768
    },

    // 检测是否为平板设备
    isTablet() {
      if (process.server) return false
      
      const userAgent = navigator.userAgent || ''
      const tabletRegex = /iPad|Android(?!.*Mobile)/i
      const screenWidth = window.innerWidth || document.documentElement.clientWidth
      
      return tabletRegex.test(userAgent) || (screenWidth > 768 && screenWidth <= 1024)
    },

    // 检测是否为桌面设备
    isDesktop() {
      return !this.isMobile() && !this.isTablet()
    },

    // 获取设备类型
    getDeviceType() {
      if (this.isMobile()) return 'mobile'
      if (this.isTablet()) return 'tablet'
      return 'desktop'
    },

    // 获取屏幕尺寸分类
    getScreenSize() {
      if (process.server) return 'unknown'
      
      const width = window.innerWidth || document.documentElement.clientWidth
      
      if (width < 576) return 'xs'
      if (width < 768) return 'sm'
      if (width < 992) return 'md'
      if (width < 1200) return 'lg'
      return 'xl'
    },

    // 重定向到移动端SPA应用（支持URI解析）
    redirectToMobile(path = null) {
      if (process.server) return
      
      const mobileUrl = app.context.env.mobileUrl
      if (!mobileUrl) {
        console.warn('移动端URL未配置')
        return
      }
      
      // 获取当前路径和查询参数
      const currentPath = path || window.location.pathname
      const currentQuery = parseUrl(window.location.href).query
      
      try {
        // 使用URI解析器构建移动端URL
        const redirectUrl = buildMobileUrl(mobileUrl, currentPath, currentQuery)
        
        // 防止无限重定向
        if (window.location.href === redirectUrl) {
          console.warn('检测到可能的无限重定向，取消跳转')
          return
        }
        
        window.location.href = redirectUrl
      } catch (error) {
        console.error('URI解析失败，使用后备方案:', error)
        
        // 后备方案：使用简单的hash路由
        let redirectUrl = mobileUrl
        if (currentPath && currentPath !== '/') {
          redirectUrl += '/#' + currentPath
        }
        
        // 添加查询参数
        if (currentQuery && Object.keys(currentQuery).length > 0) {
          const queryString = new URLSearchParams(currentQuery).toString()
          redirectUrl += (redirectUrl.includes('?') ? '&' : '?') + queryString
        }
        
        window.location.href = redirectUrl
      }
    },

    // 重定向到桌面端
    redirectToDesktop(path = null) {
      if (process.server) return
      
      // 获取当前域名，替换为桌面端域名
      const currentUrl = window.location.href
      const mobileUrl = app.context.env.mobileUrl
      
      if (!mobileUrl) {
        console.warn('移动端URL未配置，无法推断桌面端URL')
        return
      }
      
      // 简单的域名替换逻辑（可根据实际情况调整）
      let desktopUrl = currentUrl.replace(new URL(mobileUrl).origin, window.location.origin)
      
      // 如果指定了路径，直接跳转到该路径
      if (path) {
        desktopUrl = window.location.origin + path
      }
      
      window.location.href = desktopUrl
    },

    // 获取当前设备信息
    getDeviceInfo() {
      return {
        type: this.getDeviceType(),
        screenSize: this.getScreenSize(),
        isMobile: this.isMobile(),
        isTablet: this.isTablet(),
        isDesktop: this.isDesktop(),
        userAgent: process.server ? '' : navigator.userAgent,
        screenWidth: process.server ? 0 : (window.innerWidth || document.documentElement.clientWidth),
        screenHeight: process.server ? 0 : (window.innerHeight || document.documentElement.clientHeight)
      }
    }
  }

  // 注入到Vue实例中
  inject('device', device)
}