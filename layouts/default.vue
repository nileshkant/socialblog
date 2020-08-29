<template>
  <v-app>
    <v-content>
      <SnackBar />
      <v-container class="py-0">
        <v-overlay :value="user && !user.userDetails.username">
          <v-card class="pa-5" width="400" max-width="100vw">
            <UpdateUser />
          </v-card>
        </v-overlay>
        <LoginPopUp />
        <v-snackbar
          v-model="snackbar"
          bottom
          color="cyan darken-2"
          left
          :timeout="0"
        >
          <span class="mr-1"
            >By using our website you agree to our
            <NLink class="white--text" to="/privacy-policies">
              Cookie policy
            </NLink></span
          >
          <v-btn dark icon @click="acceptCookie">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-snackbar>
        <MenuDrawer />
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginPopUp from '../components/LoginPopUp'
import SnackBar from '../components/Snackbar'
import MenuDrawer from '../components/MenuDrawer'
import UpdateUser from '../components/UpdateUser'

export default {
  components: {
    LoginPopUp,
    SnackBar,
    MenuDrawer,
    UpdateUser
  },
  data() {
    return {
      window: {
        height: 0,
        width: 0
      },
      snackbar: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  mounted() {
    if (this.user) {
      this.$store.dispatch('users/isLoggedin')
    }
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.$store.dispatch(
      'commonState/changeTheme',
      JSON.parse(localStorage.getItem('isDarkMode'))
    )
    this.$store.commit('article/loadBookmark')
    this.snackbar = localStorage.getItem('cookiePolicy')
      ? JSON.parse(localStorage.getItem('cookiePolicy'))
      : true
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
    },
    acceptCookie() {
      localStorage.setItem('cookiePolicy', JSON.stringify(false))
      this.snackbar = false
    }
  }
}
</script>
