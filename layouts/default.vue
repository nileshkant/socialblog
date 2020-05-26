<template>
  <v-app>
    <v-content>
      <SnackBar />
      <v-container class="py-0" fluid>
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
        <v-navigation-drawer
          v-model="drawer"
          color="primary"
          absolute
          dark
          bottom
          width="25%"
          right
          @input="drawerAction"
        >
          <v-list dense nav class="py-0">
            <div class="mb-2">
              <v-list-item class="px-0 pt-2">
                <v-list-item-avatar v-if="user">
                  <img
                    :src="
                      `https://graph.facebook.com/${user.userDetails.facebook.id}/picture?type=square`
                    "
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-row class="mx-0" no-gutters>
                    <v-col v-if="user" align-self="center">
                      {{ user.userDetails.facebook.displayName }}
                    </v-col>
                    <v-col v-if="!user">
                      <v-btn outlined block type="button" @click="loginPopUp">
                        Login / SignUp
                      </v-btn>
                    </v-col>
                    <v-col v-else cols="auto">
                      <v-btn outlined type="button" @click="logout">
                        Logout
                      </v-btn>
                    </v-col>
                    <v-col cols="auto" @click="closeDrawer">
                      <v-btn icon>
                        <v-icon>
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </div>
            <div v-for="item in items" :key="item.title">
              <v-list-item
                v-if="item.visible()"
                link
                :to="item.to"
                @click="item.action() || ''"
              >
                <v-list-item-icon>
                  <v-icon>{{ item.icon() }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list>
        </v-navigation-drawer>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginPopUp from '../components/LoginPopUp'
import SnackBar from '../components/Snackbar'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  components: {
    LoginPopUp,
    SnackBar
  },
  data() {
    return {
      window: {
        height: 0,
        width: 0
      },
      snackbar: false,
      drawer: false,
      items: [
        {
          title: 'Profile',
          icon: () => 'mdi-view-dashboard',
          action: () => {
            this.closeDrawer()
          },
          visible: () => this.user || false,
          to: null
        },
        {
          title: 'Photos',
          icon: () => 'mdi-image',
          action: () => {
            this.closeDrawer()
          },
          visible: () => true,
          to: null
        },
        {
          title: 'Change Theme',
          icon: () =>
            (this.isDarkMode && 'mdi-weather-sunny') || 'mdi-weather-night',
          action: () => this.onThemeChange(),
          visible: () => true,
          to: null
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      isDrawerOpen: 'commonState/isDrawerOpen',
      isDarkMode: 'commonState/isDarkMode',
      user: 'user'
    })
  },
  watch: {
    isDrawerOpen(newValue) {
      this.drawer = newValue
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
    },
    drawerAction(data) {
      if (!data) {
        this.$store.dispatch('commonState/isDrawerOpen', false)
      }
    },
    closeDrawer() {
      this.$store.dispatch('commonState/isDrawerOpen', false)
    },
    onThemeChange() {
      this.$store.dispatch('commonState/changeTheme')
    },
    loginPopUp() {
      this.$store.dispatch('commonState/loginPopUp')
    },
    logout() {
      Cookie.remove('auth')
      Cookie.remove('user')
      this.$store.commit('setAuth', null)
      this.$store.commit('setUserDetails', null)
    }
  }
}
</script>
