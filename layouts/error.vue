<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12">
          <v-img max-height="80vh" :src="NotFoundImg" contain></v-img>
        </v-col>
        <v-col cols="auto">
          <v-btn color="accent" to="/">
            Home page
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import NotFoundImg from '../static/images/not-found.svg'
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
      NotFoundImg
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
