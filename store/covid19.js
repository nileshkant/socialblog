export const state = () => ({
  covidSummary: null
})

export const mutations = {
  covidSummary(state, payload) {
    state.covidSummary = payload
  }
}

export const actions = {
  async covidSummary({ commit }) {
    const covid19 = await this.$axios.$get(`/covid19/summary`)
    commit('covidSummary', covid19)
  }
}

export const getters = {
  covidSummary: (state) => {
    return state.covidSummary
  }
}
