const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => ({
  ipDetails: null,
  weatherReport: null
})

export const mutations = {
  ipAddressDetails(state, payload) {
    state.ipDetails = payload
  },
  weatherReport(state, payload) {
    state.weatherReport = payload
  }
}

export const actions = {
  async ipAddressDetails({ commit }, payload) {
    try {
      const ipDetails = await this.$axios({
        url: '/',
        baseURL: 'http://ip-api.com/json',
        transformRequest: [
          (data, headers) => {
            delete headers.common.Authorization
            return data
          }
        ]
      })
      Cookie.set('ipdata', ipDetails.data)
      commit('ipAddressDetails', ipDetails.data)
    } catch (err) {
      commit('ipAddressDetails', 'not found')
    }
  },
  async weatherReport({ commit }, payload) {
    const weather = await this.$axios.$get(
      `/weather?lat=${payload.lat}&lon=${payload.lon}`,
      payload
    )
    localStorage.setItem('weatherReport', JSON.stringify(weather.weather))
    localStorage.setItem(
      'weatherTimeout',
      JSON.stringify(new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000))
    )
    commit('weatherReport', weather.weather)
  }
}

export const getters = {
  ipDetails: (state) => {
    return state.ipDetails
  },
  weatherReport: (state) => {
    return state.weatherReport
  }
}
