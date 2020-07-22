<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-form>
        <VTextFieldWithValidation
          v-model="formData.title"
          rules="required|min:5|max:100"
          label="Title*"
        />
        <VTextFieldWithValidation
          v-model="formData.quote"
          rules="required|min:5|max:300"
          label="Quote*"
        />
        <VTextFieldWithValidation
          v-model="formData.source"
          rules="required|min:3|max:200"
          label="Source*"
        />
        <ColorPicker v-model="formData.color" />
        <v-card-actions>
          <!-- <v-btn @click="submit('save')">Save</v-btn> -->
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="submit('publish')"
            >Continue</v-btn
          >
        </v-card-actions>
      </v-form>
    </ValidationObserver>
  </client-only>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
import { mapGetters } from 'vuex'
import { required, min, max } from 'vee-validate/dist/rules'
import VTextFieldWithValidation from '../FormComponents/Textfield'
import ColorPicker from '../FormComponents/colorpicker'
// import cloneDeep from 'lodash/cloneDeep'
extend('required', {
  ...required,
  message: '{_field_} is required'
})
extend('min', {
  ...min,
  message: '{_field_} must be minimum {length} characters'
})
extend('max', {
  ...max,
  message: 'Must be less than {length} characters'
})

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    ColorPicker
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
      source: '',
      color: '#000000'
    }
  }),
  computed: {
    ...mapGetters({
      initValue: 'article/latestArticle',
      loading: 'article/loading'
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
