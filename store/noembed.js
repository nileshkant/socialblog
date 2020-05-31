export const state = () => ({
  loading: false,
  noembedLink: null
})

export const mutations = {
  noembedLink(state, payload) {
    state.noembedLink = payload
  }
}

export const actions = {
  async noembedLink({ commit }, payload) {
    const embed = await this.$axios.$get(`/noembed?url=${payload}`)
    commit('noembedLink', embed)
  }
}

export const getters = {
  noembedLink: (state) => {
    return state.noembedLink
  }
}
