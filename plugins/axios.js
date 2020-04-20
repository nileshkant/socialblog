export default function({ $axios, redirect, store }) {
  $axios.setBaseURL('https://nileshkant.xyz/api')
  $axios.onRequest((request) => {
    const tokenData = store.state.auth.accessToken
    if (tokenData) {
      request.headers.common.Authorization = `Bearer ${tokenData}`
    }
  })
}
