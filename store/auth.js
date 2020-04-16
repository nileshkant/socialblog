export const state = () => ({
  token: ''
})

export const mutations = {
  setToken(state, payload) {
    console.log('payyyyyyyyyyyyyy', payload)

    state.token = payload
  }
}

export const actions = {
  setToken(context, payload) {
    context.commit('setToken', payload)
  }
}

export const getters = {
  token: (state) => {
    return state.token
  }
}
