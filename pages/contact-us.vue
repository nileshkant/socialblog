<template>
  <div>
    <v-app-bar fixed elevate-on-scroll>
      <v-btn icon large @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title class="title pl-0">Contact Us</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon large @click="drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-container class="mt-12">
      <v-row>
        <v-col
          class="mt-md-10 pt-md-10"
          cols="12"
          md="6"
          order-md="1"
          order="2"
        >
          <v-card class="pa-5">
            <ContactUsForm />
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="mt-md-10 pt-md-10"
          order-md="2"
          order="1"
        >
          <v-img :src="`${baseUrl}/images/contact-us.svg`"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { BASE_URL } from '../utilities/constant'
import ContactUsForm from '../components/ContactUsForm'

export default {
  components: {
    ContactUsForm
  },
  data() {
    return {
      baseUrl: BASE_URL
    }
  },
  methods: {
    drawer(item) {
      this.$store.dispatch('commonState/isDrawerOpen', true)
    }
  }
}
</script>

<style></style>
