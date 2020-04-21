// const Cookie = process.client ? require('js-cookie') : undefined

export default function({ $axios, redirect, store }) {
  $axios.setBaseURL('https://nileshkant.xyz/api')
  $axios.onRequest((request) => {
    const tokenData = store.state.auth && store.state.auth.accessToken
    if (tokenData) {
      request.headers.common.Authorization = `Bearer ${tokenData}`
    }
  })
  // $axios.onResponseError((error) => {
  //   if (error.response && error.response.status === 500) {
  //     Cookie.remove('auth')
  //     store.commit('setAuth', null)
  //     redirect('/')
  //   }
  // })
}
