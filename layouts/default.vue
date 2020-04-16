<template>
  <v-app>
    <v-content>
      <v-container class="py-0" fluid>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      window: {
        height: 0
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.$store.dispatch(
      'commonState/changeTheme',
      JSON.parse(localStorage.getItem('isDarkMode'))
    )
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.window.height = window.innerHeight
      this.$store.dispatch('commonState/setWindowHeight', this.window.height)
    }
  }
}
</script>
