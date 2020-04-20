<template>
  <v-app>
    <v-content>
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
