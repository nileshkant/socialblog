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
  allComments: null,
  bookmarks: []
})

export const mutations = {
  loading(state, payload) {
    state.loading = payload
  },
  getArticle(state, payload) {
    state.articles = payload
    state.titleSection =
      state.articles &&
      state.articles[0] &&
      state.articles[0].categories[0].name
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
  },
  likeArticle(state, payload) {
    if (state.articles && state.articles.length > 0) {
      state.articles.map((value) => {
        if (value._id === payload.articleId) {
          value.likes.push(payload)
        }
        return value
      })
    }
    if (state.singleArticle && state.singleArticle._id === payload.articleId) {
      state.singleArticle.likes.push(payload)
    }
  },
  dislikeArticle(state, payload) {
    if (state.articles && state.articles.length > 0) {
      state.articles.map((value) => {
        if (value._id === payload.articleId) {
          const filterlikes = value.likes.filter((likeItem) => {
            return likeItem.likedBy !== payload.userId
          })
          value.likes = filterlikes
        }
        return value
      })
    }
    if (state.singleArticle && state.singleArticle._id === payload.articleId) {
      state.singleArticle.likes = state.singleArticle.likes.filter(
        (likeItem) => {
          return likeItem.likedBy !== payload.userId
        }
      )
    }
  },
  bookmarkArticle(state, payload) {
    const bookmark =
      state.bookmarks &&
      state.bookmarks.length > 0 &&
      state.bookmarks.find((article) => article._id === payload._id)
    if (bookmark) {
      state.bookmarks = state.bookmarks.filter((article) => {
        return article._id !== payload._id
      })
    } else {
      state.bookmarks = [...state.bookmarks].concat([payload])
    }
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
  },
  loadBookmark(state) {
    state.bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
  },
  setTitle(state, payload) {
    state.titleSection = payload
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
  },
  async likeArticle(context, payload) {
    const like = await this.$axios.$get(`/article/like?articleId=${payload}`)
    if (like.likeData) {
      context.commit('likeArticle', like.likeData)
    } else {
      context.commit('dislikeArticle', {
        userId: context.rootState.user.userDetails._id,
        articleId: payload
      })
    }
  },
  bookmarkArticle(context, payload) {
    context.commit('bookmarkArticle', payload)
  },
  setTitle(context, payload) {
    context.commit('setTitle', payload)
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
  },
  bookmarks(state) {
    return state.bookmarks
  }
}
