<template>
  <ValidationObserver ref="obs">
    <v-form @submit.prevent="updateProfile">
      <v-row>
        <v-col cols="12" class="mb-2">
          Continue with a username
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" class="mt-2">
          <VTextFieldWithValidation
            v-model="username"
            :rules="{
              min: 3,
              max: 20,
              required: true,
              regex: /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
            }"
            label="Username"
            autofocus
            outlined
            counter-en
            counter="20"
          />
        </v-col>
        <v-col cols="12" class="py-0">
          <div class="caption error--text">
            {{ error }}
          </div>
        </v-col>
        <v-col cols="12" class="mt-2 text-right">
          <v-btn
            type="submit"
            :loading="loading"
            @click.prevent="updateProfile"
          >
            Update
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver, extend } from 'vee-validate'
import { required, regex, min, max } from 'vee-validate/dist/rules'
import VTextFieldWithValidation from '../FormComponents/Textfield'
extend('required', required)
extend('min', {
  ...min,
  message: '{_field_} must be minimum {length} characters'
})
extend('max', {
  ...max,
  message: 'Must be less than {length} characters'
})
extend('regex', {
  ...regex,
  message: '{_field_} allowed alphabets, numbers, _ and ,'
})

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation
  },
  data: () => {
    return {
      username: '',
      error: null
    }
  },
  computed: {
    ...mapGetters({
      ipDetails: 'highlights/ipDetails',
      loadingHighlights: 'highlights/loadingHighlights',
      loading: 'loading'
    })
  },
  methods: {
    async updateProfile() {
      if (this.error) {
        this.error = null
      }
      const isValid = await this.$refs.obs.validate()
      if (isValid) {
        try {
          await this.$store.dispatch('updateProfile', {
            username: this.username
          })
        } catch (err) {
          this.error = err.response.data.msg
          this.$store.commit('loading', false)
        }
      }
    }
  }
}
</script>

<style></style>
