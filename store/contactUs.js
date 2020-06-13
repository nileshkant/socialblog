export const state = () => ({
  loading: false,
  postMessage: null
})

export const mutations = {
  postMessage(state, payload) {
    state.postMessage = payload
  },
  loading(state, payload) {
    state.loading = payload
  }
}

export const actions = {
  async postMessage({ commit }, payload) {
    commit('loading', true)
    const contacted = await this.$axios.$post(
      `/contact-us/post-message`,
      payload
    )
    commit('postMessage', contacted)
    commit('loading', false)
  }
}

export const getters = {
  postMessage: (state) => {
    return state.postMessage
  },
  loading: (state) => {
    return state.loading
  }
}
