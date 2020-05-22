// import https from 'https'
import { BASE_URL } from '../utilities/constant'
const Cookie = process.client ? require('js-cookie') : undefined

export default function({ $axios, redirect, store, app }) {
  // $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })
  $axios.setBaseURL(
    // 'https://theopenstories.xyz/api'
    `${BASE_URL}/api`
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
      Cookie.remove('user')
      store.commit('setAuth', null)
      store.commit('setUserDetails', null)
      app.$notifier.showMessage({
        message: 'Session Expired! You have been logged out',
        color: 'error',
        timeout: 3000
      })
      redirect('/')
    }
  })
}
