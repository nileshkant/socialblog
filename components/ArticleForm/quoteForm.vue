<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-form>
        <VTextFieldWithValidation
          v-model="formData.title"
          rules="required|min:5"
          label="Title*"
        />
        <VTextFieldWithValidation
          v-model="formData.quote"
          rules="required|min:5"
          label="Subtitle*"
        />
        <VTextFieldWithValidation
          v-model="formData.source"
          rules="min:3"
          label="Source"
        />
        <v-card-actions>
          <v-btn color="primary" @click="submit('save')">Save</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit('publish')">Publish</v-btn>
        </v-card-actions>
      </v-form>
    </ValidationObserver>
  </client-only>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
import { mapGetters } from 'vuex'
import { required, min, size, regex } from 'vee-validate/dist/rules'
// import cloneDeep from 'lodash/cloneDeep'
extend('required', required)
extend('min', min)
extend('size', size)
extend('regex', regex)

export default {
  components: {
    ValidationObserver
  },
  data: () => ({
    items: ['No Image', 'Upload Image', 'Image/Video Url'],
    // cardoption: ['Image Card', 'Quote Card'],
    select: '',
    totalCharBody: 0,
    file: null,
    formData: {
      title: '',
      quote: '',
      source: ''
    }
  }),
  computed: {
    ...mapGetters({
      // dropdownCategories: 'article/dropdownCategories',
      initValue: 'article/latestArticle'
    })
  },
  watch: {
    formData: {
      handler(newValue) {
        this.$emit('formData', newValue)
      },
      deep: true
    }
  },

  // later it can be used for editing post
  // mounted() {
  //   this.formData = cloneDeep(this.initValue.savedArticle)
  // },
  methods: {
    clear() {
      this.$nextTick(() => {
        this.$refs.obs.reset()
      })
    },
    async submit(data) {
      const success = await this.$refs.obs.validate()
      if (success) {
        this.$emit('onSubmit', data)
      }
    }
  }
}
</script>
