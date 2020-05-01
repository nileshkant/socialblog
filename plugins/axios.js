const Cookie = process.client ? require('js-cookie') : undefined

export default function({ $axios, redirect, store }) {
  $axios.setBaseURL(
    'https://theopenstories.xyz/api'
    // 'http://localhost:3000/api'
  )
  $axios.onRequest((request) => {
    const tokenData = store.state.auth && store.state.auth.accessToken
    if (tokenData) {
      request.headers.common.Authorization = `Bearer ${tokenData}`
    }
  })
  $axios.onResponseError((error) => {
    if (error.response && error.response.status === 401) {
      Cookie.remove('auth')
      store.commit('setAuth', null)
      redirect('/')
    }
  })
}
