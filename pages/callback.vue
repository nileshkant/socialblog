<template>
  <div>
    Wait...
  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  mounted() {
    const urlParams = location.search.slice(5)
    const data = JSON.parse(decodeURIComponent(urlParams))
    const auth = {
      accessToken: data.token
    }
    this.$store.commit('setAuth', auth)
    localStorage.setItem('userData', JSON.stringify(data))
    Cookie.set('auth', auth)
    this.$router.replace('/')
  }
}
</script>

<style></style>
