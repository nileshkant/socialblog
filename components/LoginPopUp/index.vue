<template>
  <v-overlay :dark="isDarkMode" :value="overlay">
    <v-card min-width="30vw">
      <v-toolbar flat>
        <v-toolbar-title class="title">Login / SignUp</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="loginPopUp">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card-actions class="px-6 py-10">
        <v-row>
          <v-col align-self="center" class="text-center">
            <v-btn
              :href="`${baseUrl}/api/authentication/auth/facebook`"
              color="blue darken-3"
              dark
            >
              <v-icon left>mdi-facebook</v-icon> Login with facebook
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-card-text class="caption text-disabled text-center">
        <NLink class="text--secondary" to="/privacy-policies">
          Privacy Policy
        </NLink>
        and
        <NLink class="text--secondary" to="/terms-of-services"
          >Terms of Service</NLink
        >
        apply.
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'
import { BASE_URL } from '../../utilities/constant'

export default {
  data() {
    return {
      baseUrl: BASE_URL
    }
  },
  computed: {
    ...mapGetters({
      overlay: 'commonState/loginPopUp',
      isDarkMode: 'commonState/isDarkMode'
    })
  },
  methods: {
    loginPopUp() {
      this.$store.dispatch('commonState/loginPopUp')
    }
  }
}
</script>

<style></style>
