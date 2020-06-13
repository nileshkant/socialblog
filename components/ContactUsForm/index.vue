<template>
  <ValidationObserver ref="obs">
    <v-form @submit.prevent="sendIssue">
      <VTextFieldWithValidation
        v-if="!user"
        v-model="formData.email"
        rules="required|email"
        label="Email Id*"
      />
      <VTextFieldWithValidation
        v-model="formData.contactNo"
        type="number"
        rules="required|min:7"
        label="Contact Number*"
      />
      <VTextFieldWithValidation
        v-model="formData.reason"
        rules="required|min:5"
        label="Reason*"
      />
      <VTextarea
        v-model="formData.message"
        rules="required|min:50"
        auto-grow
        label="Message*"
        show-counter
        outlined
        :rows="3"
        classes="mt-4"
      />
      <v-card-actions class="mt-4">
        <!-- <v-btn @click="submit('save')">Save</v-btn> -->
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          type="submit"
          :loading="loading"
          :disabled="loading"
          @click.prevent="sendIssue"
          >Send</v-btn
        >
      </v-card-actions>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
import { mapGetters } from 'vuex'
import { required, min, email, regex } from 'vee-validate/dist/rules'
import VTextFieldWithValidation from '../FormComponents/Textfield'
import VTextarea from '../FormComponents/TextArea'
// import cloneDeep from 'lodash/cloneDeep'
extend('required', {
  ...required,
  message: '{_field_} is required'
})
extend('min', min)
extend('email', email)
extend('regex', regex)

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VTextarea
  },
  data() {
    return {
      formData: {
        email: '',
        userId: '',
        reason: '',
        message: '',
        contactNo: null
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user',
      loading: 'contactUs/loading'
    })
  },
  methods: {
    async sendIssue() {
      if (this.user) {
        this.formData.userId = this.user.userDetails._id
      }
      const success = await this.$refs.obs.validate()
      if (success) {
        await this.$store.dispatch('contactUs/postMessage', this.formData)
        this.$notifier.showMessage({
          message: 'Thank you for contacting us. We will review it soon.',
          color: 'success',
          timeout: 3000
        })
        this.$router.push({ path: '/' })
      }
    }
  }
}
</script>

<style></style>
