<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-form @submit.prevent="submitZip">
        <v-row align="center" justify="center" no-gutters>
          <v-col>
            <VTextFieldWithValidation
              v-model="zipcode"
              rules="required"
              label="Zipcode"
              autofocus
              :loading="loadingHighlights"
            />
          </v-col>
          <v-col cols="auto">
            <v-btn
              type="submit"
              small
              outlined
              :disabled="loadingHighlights"
              @click.prevent="submitZip"
            >
              <v-icon small>
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <div class="caption error--text">
              {{ error }}
            </div>
          </v-col>
        </v-row>
      </v-form>
    </ValidationObserver>
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import VTextFieldWithValidation from '../FormComponents/Textfield'
extend('required', required)

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation
  },
  data: () => {
    return {
      zipcode: '',
      error: null
    }
  },
  computed: {
    ...mapGetters({
      ipDetails: 'highlights/ipDetails',
      loadingHighlights: 'highlights/loadingHighlights'
    })
  },
  methods: {
    async submitZip() {
      this.error = null
      try {
        await this.$store.dispatch('highlights/weatherReport', {
          zip: `${this.zipcode},${this.ipDetails.country_code}`
        })
        this.$emit('closeInput', false)
        localStorage.setItem(
          'userZipCode',
          JSON.stringify(`${this.zipcode},${this.ipDetails.country_code}`)
        )
      } catch (err) {
        this.error = 'Please enter valid zipcode !'
        this.$store.commit('highlights/loadingHighlights', false)
      }
    }
  }
}
</script>

<style></style>
