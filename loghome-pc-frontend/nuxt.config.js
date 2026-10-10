export default {
  buildDir: process.env.WRITER_BUILD_DIR || '.nuxt',
  env: {
    readerAiUrl: process.env.READER_AI_URL || (process.env.NODE_ENV === 'production' ? 'https://ai.loghome.ink' : 'http://127.0.0.1:9101'),
    writerAiUrl: process.env.WRITER_AI_URL || (process.env.NODE_ENV === 'production' ? 'https://ai.loghome.ink' : 'http://127.0.0.1:9101'),
    writerWsUrl: process.env.WRITER_WS_URL || (process.env.NODE_ENV === 'production' ? 'wss://ai.loghome.ink' : 'ws://127.0.0.1:9102'),
    STATIC_URL: process.env.STATIC_URL || '',
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://loghomeservice.codesocean.top' // 生产环境API地址
      : 'http://127.0.0.1:9000', // 开发环境API地址，与 APP 端一致（本地后端连同一数据库）
    // 移动端SPA应用的URL配置
    mobileUrl: process.env.NODE_ENV === 'production'
      ? "https://m.loghome.ink" // 生产环境移动端URL
      : "https://m.loghome.ink" // 开发环境移动端URL，可根据实际端口调整
  },
  /*
   ** Build configuration
   */
  build: {
    publicPath: process.env.STATIC_URL,
    extend(config, { isDev, isClient }) {
      // Modern collaboration packages ship .cjs too; Nuxt 2's loader only matches .js/.mjs.
      const javascriptRule = config.module.rules.find(rule => rule.test && rule.test.test('writer.js') && rule.use)
      if (javascriptRule) javascriptRule.test = /\.[cm]?jsx?$/i
      if (!isDev && process.env.STATIC_URL) {
        config.output.publicPath = process.env.STATIC_URL
      }
    },
    // Nuxt tests the complete path here, so dependency patterns cannot start with ^.
    transpile: ['element-ui', '@tiptap', '@hocuspocus', 'yjs', 'y-indexeddb', 'y-prosemirror', 'y-protocols', 'lib0', /prosemirror-/],
    babel: {
      plugins: ['@babel/plugin-transform-class-static-block', '@babel/plugin-transform-class-properties', '@babel/plugin-transform-private-methods', '@babel/plugin-transform-private-property-in-object'],
    },
    loaders: {
      scss: {
        implementation: require('sass'),
        sassOptions: {
          fiber: false,
          silenceDeprecations: ['import', 'slash-div', 'global-builtin', 'legacy-js-api', 'color-functions'],
        },
      },
    },
    postcss: null
  },
  router: {
    // base route
    base: '/',
    // 添加全局中间件
    middleware: ['device-detect'],
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
        content: '原木社区是专为Minecraft及其衍生文化爱好者搭建的文艺作品读写一体化平台，你可以在这里自由地创作与Minecraft相关的文艺内容，也可以在这些作品中徜徉，感受方块世界的美好。'
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
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/css/global.css',
    '~/assets/css/reading-theme.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/api.js',
    '~/plugins/element-ui.js',
    '~/plugins/window-manager.js',
    '~/plugins/mobile-window.js',
    '~/plugins/image-preview.js',
    { src: '~/plugins/reader-audio.client.js', mode: 'client' },
    { src: '~/plugins/reading-activity.client.js', mode: 'client' },
    '~/plugins/device-detect.js'
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
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: process.env.baseUrl,
    credentials: true
  },

  /*
   ** Vue configuration
   */
  vue: {
    config: {
      ignoredElements: [
      ]
    }
  },
}
