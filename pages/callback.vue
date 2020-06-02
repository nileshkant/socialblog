<template>
  <div>
    Wait...
  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  mounted() {
    this.$meta().refresh()
    const urlParams = location.search.slice(5)
    const data = JSON.parse(decodeURIComponent(urlParams))
    const auth = {
      accessToken: data.token
    }
    const user = data
    this.$store.commit('setAuth', auth)
    this.$store.commit('setUserDetails', user)
    Cookie.set('auth', auth)
    Cookie.set('user', user)
    this.$router.replace('/')
  }
}
</script>

<style></style>
