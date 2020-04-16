<template>
  <div>
    Wait...
  </div>
</template>

<script>
export default {
  mounted() {
    const urlParams = location.search.slice(5)
    const data = JSON.parse(decodeURIComponent(urlParams))
    this.$store.dispatch('auth/setToken', data.token)
    localStorage.setItem('userData', JSON.stringify(data))
    this.$router.replace('/')
  }
}
</script>

<style></style>
