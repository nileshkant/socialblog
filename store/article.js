export const state = () => ({
  getArticle: ''
})

export const mutations = {
  getArticle(state, payload) {
    state.getArticle = payload
  }
}

export const actions = {
  async getArticle(context) {
    const ip = await this.$axios.$get('/authentication/profile')
    context.commit('getArticle', ip)
  }
}
