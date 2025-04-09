export default {
  env: {
    STATIC_URL: process.env.STATIC_URL || '',
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.original-community.com' // 生产环境API地址
      : 'http://localhost:9000', // 开发环境API地址
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
    }
  },
  router: {
    // base route
    base: '/',
    // custom route
    extendRoutes(routes, resolve) {
      let customRoutes = [
        {
          name: 'release',
          path: '/release/',
          component: resolve(__dirname, 'pages/index.vue')
        }
      ]
      customRoutes?.forEach(item => routes.push(item));
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Serverless Nuxt.js Application',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Serverless Nuxt.js Application Created By Serverless Framework'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${process.env.STATIC_URL || ''}/favicon.ico` }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/api.js'
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
