<template>
  <v-app>
    <v-content>
      <v-container class="py-0" fluid>
        <LoginPopUp />
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import LoginPopUp from '../components/LoginPopUp'
export default {
  components: {
    LoginPopUp
  },
  data() {
    return {
      window: {
        height: 0,
        width: 0
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
    this.$store.commit('article/loadBookmark')
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.window.height = window.innerHeight
      this.window.width = window.innerWidth
      this.$store.dispatch('commonState/setWindowHeight', this.window.height)
      this.$store.dispatch('commonState/setWindowWidth', this.window.width)
    }
  }
}
</script>
