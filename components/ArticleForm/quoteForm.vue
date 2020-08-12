<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-form>
        <VTextFieldWithValidation
          v-model="formData.title"
          rules="required|min:5|max:100"
          label="Title*"
        />
        <!-- <VTextarea
          v-model="formData.quote"
          rules="required|min:5|max:800"
          auto-grow
          label="Quote/Poem/Song/Small story*"
          show-counter
          :rows="3"
          classes="mt-4"
        /> -->
        <CommentFormMD
          v-model="formData.quote"
          no-send-button
          :optional-props="{ label: 'Quote/Poem/Song/Short story*' }"
          @formData="richContent"
        />
        <VTextFieldWithValidation
          v-model="formData.source"
          rules="required|min:3|max:200"
          label="Source*"
        />
        <v-row>
          <v-col>
            <ColorPicker
              :optional-props="{ disabled: !formData.color }"
              v-model="color"
            />
          </v-col>
          <v-col cols="auto" align-self="end" class="mb-3">
            <v-btn icon @click="formData.color = formData.color ? null : color">
              <v-icon>mdi-invert-colors-off</v-icon>
            </v-btn>
          </v-col>
        </v-row>
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
// import VTextarea from '../FormComponents/TextArea'
import CommentFormMD from '~/components/CommentFormMD'
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
    ColorPicker,
    // VTextarea
    CommentFormMD
  },
  data: () => ({
    items: ['No Image', 'Upload Image', 'Image/Video Url'],
    // cardoption: ['Image Card', 'Quote Card'],
    select: '',
    totalCharBody: 0,
    file: null,
    color: '#000000',
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
    color: {
      handler(newVal) {
        this.formData.color = newVal
      }
    },
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
    richContent(content) {
      this.formData.quote = content.textComment
      if (!this.formData.isMarkdown) {
        this.formData.isMarkdown = true
      }
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
