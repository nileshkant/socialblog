export const state = () => ({
  loading: false,
  error: false,
  articles: [],
  articleDetails: null,
  categories: [],
  dropdownCategories: [],
  latestArticle: {},
  singleArticle: null,
  latestComment: null,
  titleSection: null,
  allComments: [],
  bookmarks: [],
  contentLoading: false
})

export const mutations = {
  loading(state, payload) {
    state.loading = payload
  },
  contentLoading(state, payload) {
    state.contentLoading = payload
  },
  getArticle(state, { articles, page, pageSize, categoryId }) {
    if (!page || page === 1) {
      state.articles = articles
    } else {
      state.articles = [...state.articles, ...articles]
    }
    state.articleDetails = {
      page,
      pageSize,
      isLastPage: articles.length < pageSize
    }
    if (categoryId) {
      const data =
        articles &&
        articles[0] &&
        articles[0].categories.filter((value) => {
          return value._id === categoryId
        })
      state.titleSection = { title: (data && data[0].name) || null }
    } else {
      state.titleSection = { title: 'Latest Stories' }
    }
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
    state.titleSection = {
      title:
        state.singleArticle &&
        state.singleArticle &&
        state.singleArticle.categories[0].name,
      user:
        state.singleArticle && state.singleArticle && state.singleArticle.author
    }
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
    const addBookmark = state.bookmarks || []
    const bookmark =
      state.bookmarks &&
      state.bookmarks.length > 0 &&
      state.bookmarks.find((article) => article._id === payload._id)
    if (bookmark) {
      state.bookmarks = state.bookmarks.filter((article) => {
        return article._id !== payload._id
      })
    } else {
      state.bookmarks = addBookmark.concat([payload])
    }
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
  },
  loadBookmark(state) {
    state.bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
  },
  setTitle(state, payload) {
    state.titleSection = payload
  },
  deleteComment(state, payload) {
    state.allComments = state.allComments.filter((value) => {
      return value._id !== payload.deletedcomment._id
    })
  },
  search(state, payload) {
    if (payload.type === 'article') {
      if (payload.searchData.page < 2) {
        state.articles = payload.searchData.result
      } else {
        state.articles = [...state.articles, ...payload.searchData.result]
      }
    } else {
      state.allComments =
        payload.searchData.page < 2
          ? payload.searchData.result
          : [...state.allComments, ...payload.searchData.result]
    }
    state.articleDetails = {
      page: payload.searchData.page,
      pageSize: payload.searchData.pageSize,
      isLastPage: payload.searchData.result.length < payload.searchData.pageSize
    }
  },
  removeSearchState(state) {
    state.articles = []
    state.allComments = []
  }
}

export const actions = {
  async getArticles(context, payload) {
    context.commit('contentLoading', true)
    const ip = await this.$axios.$get(
      `/article/get-articles?categoryid=${payload.id || ''}&page=${
        payload.page
      }&pageSize=${payload.pageSize}`
    )
    context.commit('getArticle', {
      articles: ip.articles,
      page: ip.page,
      pageSize: ip.pageSize,
      categoryId: payload.id
    })
    context.commit('contentLoading', false)
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
    if (payload.articleType !== 'movieReviewCard') {
      this.$router.replace({
        path: `/article/${article.savedArticle._id}`
      })
    }
  },
  async deleteArticle(context, payload) {
    context.commit('loading', true)
    await this.$axios.$delete(`/article/delete-article?articleId=${payload}`)
    context.commit('deletedArticle', payload)
    context.commit('loading', false)
  },
  async getSingleArticle(context, payload) {
    context.commit('contentLoading', true)
    const singleArticle = await this.$axios.$get(
      `/article/single-article?articleid=${payload}`
    )
    context.commit('getSingleArticle', singleArticle)
    context.commit('contentLoading', false)
  },
  async postComment({ commit, rootState }, payload) {
    commit('loading', true)
    const comment = await this.$axios.$post('/article/add-comment', payload)
    if (rootState.commonState.replyComment && comment.newComment) {
      comment.newComment.replyComment = rootState.commonState.replyComment
      commit('commonState/replyComment', null, { root: true })
    }
    commit('postComment', comment)
    commit('loading', false)
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
  },
  async deleteComment(context, payload) {
    const deletedComment = await this.$axios.$delete(
      `/article/delete-comments?commentId=${payload}`
    )
    context.commit('deleteComment', deletedComment)
  },
  async reportComment(context, payload) {
    await this.$axios.$put(`/article/report-comment?commentId=${payload}`)
  },
  async search(context, payload) {
    context.commit('loading', true)
    if (payload.page < 2) {
      context.commit('removeSearchState')
    }
    const searchData = await this.$axios.$get(
      `/article/search?${payload.type}=${encodeURIComponent(
        payload.search
      )}&limit=${payload.pageSize}&page=${payload.page}`
    )
    context.commit('search', {
      searchData,
      type: payload.type
    })
    context.commit('loading', false)
  },
  removeSearchState(context) {
    context.commit('removeSearchState')
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
  },
  articleDetails(state) {
    return state.articleDetails
  },
  contentLoading(state) {
    return state.contentLoading
  }
}
