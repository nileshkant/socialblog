export const state = () => ({
  articles: [],
  categories: [],
  dropdownCategories: [],
  latestArticle: {},
  singleArticle: null,
  latestComment: null
})

export const mutations = {
  getArticle(state, payload) {
    state.articles = payload
  },
  getCategories(state, payload) {
    state.categories = payload
    state.dropdownCategories = payload.map((data) => {
      const category = {
        text: data.name,
        value: data._id
      }
      return category
    })
  },
  latestArticle(state, payload) {
    state.latestArticle = payload
  },
  getSingleArticle(state, payload) {
    state.singleArticle = payload
  },
  postComment(state, payload) {
    state.latestComment = payload.newComment
  }
}

export const actions = {
  async getArticles(context, payload) {
    const ip = await this.$axios.$get(
      `/article/get-articles?categoryid=${payload}`
    )
    context.commit('getArticle', ip)
  },
  async getCategories(context) {
    const categories = await this.$axios.$get('/article/categories')
    context.commit('getCategories', categories)
  },
  async postArticle(context, payload) {
    const article = await this.$axios.$post('/article', payload)
    context.commit('latestArticle', article)
  },
  async getSingleArticle(context, payload) {
    const singleArticle = await this.$axios.$get(
      `/article/single-article?articleid=${payload}`
    )
    context.commit('getSingleArticle', singleArticle)
  },
  async postComment(context, payload) {
    context.commit('postComment', payload)
    const comment = await this.$axios.$post('/article/add-comment', payload)
    context.commit('postComment', comment)
  }
}

export const getters = {
  categories: (state) => {
    return state.categories
  },
  dropdownCategories: (state) => {
    return state.dropdownCategories
  },
  latestArticle: (state) => {
    return state.latestArticle
  },
  articles: (state) => {
    return state.articles
  },
  singleArticle: (state) => {
    return state.singleArticle
  },
  latestComment: (state) => {
    return state.latestComment
  }
}
