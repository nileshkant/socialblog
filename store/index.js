const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => ({
  auth: null
})
export const mutations = {
  setAuth(state, auth) {
    console.log('aythhhhhh', auth)

    state.auth = auth
  }
}
export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let auth = null
    console.log('req.headers.cookie', req.headers.cookie)

    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
      } catch (err) {
        // No valid cookie found
      }
    }
    console.log('req.headers.parse', auth)
    commit('setAuth', auth)
  }
}
