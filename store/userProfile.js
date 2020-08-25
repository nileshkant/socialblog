export const state = () => ({
  profileLoading: false,
  userPosts: null,
  anyUserDetails: null,
  repostedStory: null
})

export const mutations = {
  profileLoading(state, payload) {
    state.profileLoading = payload
  },
  userPosts(state, payload) {
    state.userPosts = payload
  },
  anyUserDetails(state, payload) {
    state.anyUserDetails = payload
  },
  repostStory(state, payload) {
    state.repostedStory = payload
    const updatedArticle = state.userPosts.articles.map((article) => {
      if (article._id === payload.articleId) {
        article.modifiedDate = new Date()
      }
      return article
    })
    state.userPosts.articles = updatedArticle
  }
}

export const actions = {
  async userPosts({ commit }, payload) {
    commit('profileLoading', true)
    const userArticles = await this.$axios.$get(
      `/user-profile/get-posts?userId=${payload}`
    )
    commit('userPosts', userArticles)
    commit('profileLoading', false)
  },
  async anyUserDetails({ commit }, payload) {
    const userDetails = await this.$axios.$get(
      `/user-profile/user?userId=${payload}`
    )
    commit('anyUserDetails', userDetails)
  },
  async repostStory({ commit, rootState }, payload) {
    await this.$axios.$post(`/article/repost-story`, payload)
    commit('repostStory', payload)
  }
}

export const getters = {
  profileLoading: (state) => {
    return state.profileLoading
  },
  userPosts: (state) => {
    return state.userPosts
  },
  anyUserDetails: (state) => {
    return state.anyUserDetails
  },
  repostedStory: (state) => {
    return state.repostedStory
  }
}
