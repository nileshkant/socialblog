export default function({ $axios, redirect, store }) {
  $axios.setBaseURL('https://nileshkant.xyz/api')
  $axios.onRequest((request) => {
    const tokenData = localStorage.getItem('userData')
    if (tokenData) {
      request.headers.common.Authorization = `Bearer ${
        JSON.parse(tokenData).token
      }`
    }
  })
}
