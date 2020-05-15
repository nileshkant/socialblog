const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => ({
  auth: null,
  user: null
})
export const mutations = {
  setAuth(state, auth) {
    state.auth = auth
  },
  setUserDetails(state, payload) {
    state.user = payload
  }
}
export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let auth = null
    let user = null
    let ipdata = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        ipdata = JSON.parse(parsed.ipdata)
      } catch (err) {
        // No valid cookie found
      }
      try {
        auth = JSON.parse(parsed.auth)
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setAuth', auth)
    commit('setUserDetails', user)
    commit('highlights/ipAddressDetails', ipdata, { root: true })
  }
}

export const getters = {
  user: (state) => {
    return state.user
  }
}
