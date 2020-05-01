export const state = () => ({
  loading: false,
  error: false,
  articles: [],
  categories: [],
  dropdownCategories: [],
  latestArticle: {},
  singleArticle: null,
  latestComment: null,
  titleSection: null,
  allComments: null
})

export const mutations = {
  loading(state, payload) {
    state.loading = payload
  },
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
    state.titleSection = state.singleArticle.categories[0]
  },
  postComment(state, payload) {
    state.allComments.push(payload.newComment)
  },
  allComments(state, payload) {
    state.allComments = payload
  },
  deletedArticle(state, payload) {
    state.articles = state.articles.filter((article) => {
      return article._id !== payload
    })
    state.singleArticle = null
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
    context.commit('loading', true)
    const article = await this.$axios.$post('/article', payload)
    context.commit('latestArticle', article)
    context.commit('loading', false)
    this.$router.replace({
      path: `/article/${article.savedArticle._id}`
    })
  },
  async deleteArticle(context, payload) {
    context.commit('loading', true)
    await this.$axios.$delete(`/article/delete-article?articleId=${payload}`)
    context.commit('deletedArticle', payload)
    context.commit('loading', false)
  },
  async getSingleArticle(context, payload) {
    const singleArticle = await this.$axios.$get(
      `/article/single-article?articleid=${payload}`
    )
    context.commit('getSingleArticle', singleArticle)
  },
  async postComment(context, payload) {
    context.commit('loading', true)
    const comment = await this.$axios.$post('/article/add-comment', payload)
    context.commit('postComment', comment)
    context.commit('loading', false)
  },
  async getComments(context, payload) {
    const allComments = await this.$axios.$get(
      `/article/get-comments?articleId=${payload.articleId}`
    )
    context.commit('allComments', allComments)
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
  },
  titleSection: (state) => {
    return state.titleSection
  },
  allComments: (state) => {
    return state.allComments
  },
  loading(state) {
    return state.loading
  }
}
