export default {
  env: {
    STATIC_URL: process.env.STATIC_URL || '',
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://loghomeservice.codesocean.top' // 生产环境API地址
      : 'http://127.0.0.1:9000', // 开发环境API地址
    // mobileUrl: "http://loghome.codesocean.top"
    mobileUrl: process.env.NODE_ENV === 'production' ? "https://loghome.codesocean.top" : "http://127.0.0.1:8080"
  },
  /*
   ** Build configuration
   */
  build: {
	publicPath : process.env.STATIC_URL,
    extend(config, { isDev, isClient }) {
      if (!isDev && process.env.STATIC_URL) {
        config.output.publicPath = process.env.STATIC_URL
      }
    },
    transpile: [/^element-ui/],
    loaders: {
      scss: {
        implementation: require('sass'),
        sassOptions: {
          fiber: false
        }
      }
    }
  },
  router: {
    // base route
    base: '/',
    // custom route
    extendRoutes(routes, resolve) {
      // 移除不存在的路由配置
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: '原木社区 - 方块人的文艺世界',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '原木社区 - 方块人的文艺世界'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${process.env.STATIC_URL || ''}/favicon.ico` }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#947358', // 使用主题色
    height: '6px',
    throttle: 200,
    continuous: true
  },
  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/api.js',
    '~/plugins/element-ui.js',
    '~/plugins/window-manager.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  /*
   ** Auth module configuration
   */
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' }
        }
      }
    },
    redirect: {
      login: '/login',
      logout: '/',
      home: '/'
    }
  },
  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: process.env.baseUrl,
    credentials: true
  }
}
