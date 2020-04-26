import Vue from 'vue'
export const state = () => ({
  windowHeight: 0,
  windowWidth: 0,
  isDarkMode: false,
  loginPopUp: false
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
  }
}
