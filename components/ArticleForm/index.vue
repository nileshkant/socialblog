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
          v-model="formData.subtitle"
          rules="required|min:5|max:200"
          label="Subtitle*"
        />

        <VTextFieldWithValidation
          v-model="formData.source"
          rules="required|min:3|max:50"
          label="Source*"
        />
        <RichtextEditor
          v-model="formData.articleBody"
          :limitcharcount="300"
          @richContent="richContent"
          @charCount="charCount"
        />
        <v-row>
          <v-col md="8" cols="12">
            <file-upload
              v-model="file"
              rules="image|size:10000"
              label="Upload Image"
            />
            <!-- <VTextFieldWithValidation
              v-if="select === 'Image Url'"
              v-model="formData.mediaUrl"
              classes="mt-4"
              :rules="{
                min: 3,
                regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
              }"
              label="Image Url"
            /> -->
            <!-- <div v-if="select === 'Image Url'" class="caption text--disabled">
              It must be valid image url
            </div> -->
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
            >Publish</v-btn
          >
        </v-card-actions>
      </v-form>
    </ValidationObserver>
  </client-only>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
import { mapGetters } from 'vuex'
import { required, min, max, image, size, regex } from 'vee-validate/dist/rules'
// import cloneDeep from 'lodash/cloneDeep'
import VTextFieldWithValidation from '../FormComponents/Textfield'
import RichtextEditor from '../FormComponents/RichTextEditor'
import FileUpload from '../FormComponents/fileUpload'
// import SelectBox from '../FormComponents/selectBox'
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
extend('image', image)
extend('size', {
  ...size,
  message: 'Please provide image less than 10mb'
})
extend('regex', {
  ...regex,
  message: 'Please provide valid link'
})

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    RichtextEditor,
    FileUpload
    // SelectBox
  },
  data: () => ({
    // items: ['No Image', 'Upload Image', 'Image Url'],
    // cardoption: ['Image Card', 'Quote Card'],
    select: '',
    totalCharBody: 0,
    file: null,
    formData: {
      title: '',
      subtitle: '',
      source: '',
      articleBody: '',
      mediaUrl: ''
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
    },
    file: {
      handler(newValue) {
        this.$emit('file', newValue)
      },
      deep: true
    }
  },

  // later it can be used for editing post
  // mounted() {
  //   this.formData = cloneDeep(this.initValue.savedArticle)
  // },
  methods: {
    // changeValue() {
    //   if (this.select === 'uploadImage') {
    //     this.formData.mediaUrl = null
    //   } else if (this.select === 'Image/Video Url') {
    //     this.file = null
    //   } else {
    //     this.formData.mediaUrl = null
    //     this.file = null
    //   }
    // },
    charCount(count) {
      this.totalCharBody = count
    },
    clear() {
      this.$nextTick(() => {
        this.$refs.obs.reset()
      })
    },
    richContent(content) {
      this.formData.articleBody = content
    },
    async submit(data) {
      const success = await this.$refs.obs.validate()
      if (success) {
        if (this.totalCharBody > 5 && this.totalCharBody <= 300) {
          this.$emit('onSubmit', data)
        }
      }
    }
  }
}
</script>
