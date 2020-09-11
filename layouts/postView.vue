<template>
  <v-app>
    <v-main>
      <v-container class="pa-0" fluid>
        <v-toolbar flat>
          <v-btn icon to="/">
            <v-icon>mdi-home-outline</v-icon>
          </v-btn>
          <v-toolbar-title class="title pl-0">Create Story</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="accent" outlined @click="logout">
            Logout
          </v-btn>
        </v-toolbar>
        <v-divider />
      </v-container>
      <v-container class="py-0">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  mounted() {
    this.$store.dispatch(
      'commonState/changeTheme',
      JSON.parse(localStorage.getItem('isDarkMode'))
    )
  },
  methods: {
    logout() {
      Cookie.remove('auth')
      Cookie.remove('user')
      this.$store.commit('setAuth', null)
      this.$store.commit('setUserDetails', null)
      this.$router.push('/')
    }
  }
}
</script>
