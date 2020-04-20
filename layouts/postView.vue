<template>
  <v-app>
    <v-content>
      <v-container class="pa-0" fluid>
        <v-toolbar flat>
          <v-btn icon @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title class="title">Create Post</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-container>
      <v-container class="py-0">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch(
      'commonState/changeTheme',
      JSON.parse(localStorage.getItem('isDarkMode'))
    )
  }
}
</script>
