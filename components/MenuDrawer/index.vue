<template>
  <v-navigation-drawer
    v-model="drawer"
    color="primary"
    absolute
    dark
    bottom
    hide-overlay
    floating
    width="25%"
    right
    class="menu-drawer"
    :style="{
      height: styleDrawer
    }"
    @transitionend="transitionend"
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
</template>

<script>
import { mapGetters } from 'vuex'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      drawer: false,
      styleDrawer: 0,
      items: [
        // {
        //   title: 'Profile',
        //   icon: () => 'mdi-view-dashboard',
        //   action: () => {
        //     this.closeDrawer()
        //   },
        //   visible: () => this.user || false,
        //   to: null
        // },
        {
          title: 'Add New Story',
          icon: () => 'mdi-note-plus-outline',
          action: () => {
            this.closeDrawer()
          },
          visible: () => this.user || false,
          to: '/create-post'
        },
        {
          title: 'My BookMarks',
          icon: () => 'mdi-bookmark-check-outline',
          action: () => {
            this.closeDrawer()
          },
          visible: () => true,
          to: '/bookmarks'
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
  methods: {
    drawerAction(data) {
      if (!data) {
        this.closeDrawer()
      }
    },
    closeDrawer() {
      this.$store.dispatch('commonState/isDrawerOpen', false)
    },
    onThemeChange() {
      this.$store.dispatch('commonState/changeTheme')
      this.closeDrawer()
    },
    loginPopUp() {
      this.$store.dispatch('commonState/loginPopUp')
      this.closeDrawer()
    },
    logout() {
      Cookie.remove('auth')
      Cookie.remove('user')
      this.$store.commit('setAuth', null)
      this.$store.commit('setUserDetails', null)
      this.closeDrawer()
    },
    transitionend() {
      this.styleDrawer = this.drawer ? '100%' : 0
    }
  }
}
</script>

<style scoped>
.menu-drawer {
  z-index: 21;
}
</style>
