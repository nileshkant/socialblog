const cookieparser = process.server ? require('cookieparser') : undefined
const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => ({
  auth: null,
  user: null,
  loading: false
})
export const mutations = {
  setAuth(state, auth) {
    state.auth = auth
  },
  setUserDetails(state, payload) {
    state.user = payload
  },
  updateProfile(state, payload) {
    state.user = { ...state.user, userDetails: payload }
  },
  loading(state, payload) {
    state.loading = payload
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
  },
  async updateProfile({ commit }, payload) {
    commit('loading', true)
    const updatedUser = await this.$axios.$put(
      `/user-profile/update-profile`,
      payload
    )
    if (updatedUser) {
      Cookie.set('user', { ...state.user, userDetails: updatedUser })
      commit('updateProfile', updatedUser)
    }
    commit('loading', false)
  }
}

export const getters = {
  user: (state) => {
    return state.user
  },
  loading: (state) => {
    return state.loading
  }
}
