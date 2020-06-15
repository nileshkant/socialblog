import Vue from 'vue'
export const state = () => ({
  windowHeight: 0,
  windowWidth: 0,
  isDarkMode: false,
  loginPopUp: false,
  autoFocusComment: false,
  replyComment: null,
  toastMessage: null,
  isDrawerOpen: false,
  isViewCategory: false
})

export const mutations = {
  setWindowHeight(state, payload) {
    state.windowHeight = payload
  },
  setWindowWidth(state, payload) {
    state.windowWidth = payload
  },
  changeTheme(state, payload) {
    state.isDarkMode =
      typeof payload === 'undefined' ? !state.isDarkMode : payload
    Vue.prototype.$nuxt.$vuetify.theme.dark = state.isDarkMode
    localStorage.setItem('isDarkMode', state.isDarkMode)
  },
  loginPopUp(state) {
    state.loginPopUp = !state.loginPopUp
  },
  autoFocusComment(state, payload) {
    state.autoFocusComment = payload
  },
  replyComment(state, payload) {
    state.replyComment = payload
  },
  toastMessage(state, payload) {
    state.toastMessage = payload
  },
  isDrawerOpen(state, payload) {
    state.isDrawerOpen = payload
  },
  isViewCategory(state, payload) {
    state.isViewCategory = payload
  }
}

export const actions = {
  setWindowHeight(context, payload) {
    context.commit('setWindowHeight', payload)
  },
  setWindowWidth(context, payload) {
    context.commit('setWindowWidth', payload)
  },
  changeTheme(context, payload) {
    context.commit('changeTheme', payload)
  },
  loginPopUp(context) {
    context.commit('loginPopUp')
  },
  autoFocusComment(context, payload) {
    context.commit('autoFocusComment', payload)
  },
  replyComment(context, payload) {
    context.commit('replyComment', payload)
  },
  toastMessage(context, payload) {
    context.commit('toastMessage', payload)
  },
  isDrawerOpen(context, payload) {
    context.commit('isDrawerOpen', payload)
  },
  isViewCategory(context, payload) {
    context.commit('isViewCategory', payload)
  }
}

export const getters = {
  windowHeight: (state) => {
    return state.windowHeight
  },
  windowWidth: (state) => {
    return state.windowWidth
  },
  isDarkMode: (state) => {
    return state.isDarkMode
  },
  loginPopUp: (state) => {
    return state.loginPopUp
  },
  autoFocusComment: (state) => {
    return state.autoFocusComment
  },
  replyComment: (state) => {
    return state.replyComment
  },
  toastMessage: (state) => {
    return state.toastMessage
  },
  isDrawerOpen: (state) => {
    return state.isDrawerOpen
  },
  isViewCategory: (state) => {
    return state.isViewCategory
  }
}
