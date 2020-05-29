export const state = () => ({
  profileLoading: false,
  userPosts: null
})

export const mutations = {
  profileLoading(state, payload) {
    state.profileLoading = payload
  },
  userPosts(state, payload) {
    state.userPosts = payload
  }
}

export const actions = {
  async userPosts({ commit }) {
    commit('profileLoading', true)
    const userArticles = await this.$axios.$get(`/user-profile/get-posts`)
    commit('userPosts', userArticles)
    commit('profileLoading', false)
  }
}

export const getters = {
  profileLoading: (state) => {
    return state.profileLoading
  },
  userPosts: (state) => {
    return state.userPosts
  }
}
