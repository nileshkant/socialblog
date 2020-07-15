export const state = () => ({
  movieDetails: null
})

export const mutations = {
  movieDetails(state, payload) {
    state.movieDetails = payload
  }
}

export const actions = {
  async movieDetails({ commit }, payload) {
    const details = await this.$axios.$post(`/movie-details`, payload)
    commit('movieDetails', details)
  }
}

export const getters = {
  movieDetails: (state) => {
    return state.movieDetails
  }
}
