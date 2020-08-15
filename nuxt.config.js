// const hljs = require('highlight.js')
const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'universal',
  debug: true,
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: 'The Open Stories',
    title: 'The Open Stories',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      { name: 'msapplication-TileColor', content: '#00aba9' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=Rym8WqW9rM' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png?v=Rym8WqW9rM'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png?v=Rym8WqW9rM'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png?v=Rym8WqW9rM'
      },
      { rel: 'manifest', href: '/site.webmanifest?v=Rym8WqW9rM' },
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg?v=Rym8WqW9rM',
        color: '#5bbad5'
      },
      { rel: 'shortcut icon', href: '/favicon.ico?v=Rym8WqW9rM' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'red' },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/main.css',
    '~/assets/css/tiptap.css',
    '~/assets/css/weather.css',
    '~/assets/css/weather-dark.css',
    '~/assets/css/highlight.css',
    '~/assets/sass/scssStyles.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios',
    '~/plugins/vue-resize',
    '~/plugins/notifier.js',
    { src: '~/plugins/vue-masonry', ssr: false }
    // '~/plugins/vuex-persist.client.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/date-fns',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-151222977-2'
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    '@nuxtjs/markdownit'
  ],

  markdownit: {
    injected: true,
    linkify: true,
    breaks: true,
    use: [
      '~/utilities/markdownHashtag',
      '~/utilities/markdownVideo',
      ['markdown-it-highlightjs', { inline: true }]
    ]
  },

  styleResources: {
    scss: ['~/assets/scss/_main.scss', '~/assets/sass/scssStyles.scss']
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  // axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    server: true,
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      options: { customProperties: true },
      themes: {
        dark: {
          primary: '#587FFC',
          accent: '#FF8692',
          secondary: '#FAF9F9',
          info: '#23182d',
          warning: '#bda034',
          error: '#f44336',
          success: '#40b06c',
          greyAccent: colors.grey.darken2,
          colorTheme: '#FFFFFF',
          colorReverseTheme: '#000000'
        },
        light: {
          primary: '#587FFC',
          secondary: '#23182D',
          accent: '#FF8692',
          info: '#23182d',
          success: '#40b06c',
          warning: '#bda034',
          error: '#f44336',
          white: '#FFFFFF',
          greyAccent: colors.grey.lighten2,
          colorTheme: '#000000',
          colorReverseTheme: '#FFFFFF'
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    transpile: ['vee-validate/dist/rules'],
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
    }
  },

  serverMiddleware: [
    // API middleware
    '~/api/index.js'
  ],

  proxy: {
    // With options
    '/api2': {
      target: 'https://json.geoiplookup.io/',
      pathRewrite: { '^/api2/': '' }
    }
  }
}
