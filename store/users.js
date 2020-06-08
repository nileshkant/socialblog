export const state = () => ({
  isLoggedin: null
})

export const mutations = {
  isLoggedin(state, payload) {
    state.isLoggedin = payload
  }
}

export const actions = {
  async isLoggedin({ commit }) {
    const Loggedin = await this.$axios.$get(`/authentication/check-session`)
    commit('isLoggedin', Loggedin)
  }
}
