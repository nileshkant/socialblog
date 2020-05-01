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
          rules="min:5"
          label="Subtitle"
        />

        <VTextFieldWithValidation
          v-model="formData.source"
          rules="min:3"
          label="Source"
        />
        <RichtextEditor
          v-model="formData.articleBody"
          :limitcharcount="200"
          @richContent="richContent"
          @charCount="charCount"
        />
        <v-row>
          <v-col md="4" sm="6" cols="6">
            <SelectBox
              v-model="select"
              :items="items"
              label="Select"
              classes="mt-4"
              @change="changeValue"
            />
          </v-col>
          <v-col md="8" sm="6" cols="6">
            <file-upload
              v-if="select === 'Upload Image'"
              v-model="file"
              rules="image|size:10000"
              label="Upload Image"
            />
            <VTextFieldWithValidation
              v-if="select === 'Image Url'"
              v-model="formData.mediaUrl"
              classes="mt-4"
              :rules="{
                min: 3,
                regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
              }"
              label="Image Url"
            />
            <div v-if="select === 'Image Url'" class="caption text--disabled">
              It must be valid image url
            </div>
          </v-col>
        </v-row>
        <v-card-actions>
          <!-- <v-btn @click="submit('save')">Save</v-btn> -->
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
import {
  required,
  min,
  email,
  image,
  size,
  regex
} from 'vee-validate/dist/rules'
// import cloneDeep from 'lodash/cloneDeep'
import VTextFieldWithValidation from '../FormComponents/Textfield'
import RichtextEditor from '../FormComponents/RichTextEditor'
import FileUpload from '../FormComponents/fileUpload'
import SelectBox from '../FormComponents/selectBox'
extend('email', email)
extend('required', required)
extend('min', min)
extend('image', image)
extend('size', size)
extend('regex', regex)

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    RichtextEditor,
    FileUpload,
    SelectBox
  },
  data: () => ({
    items: ['No Image', 'Upload Image', 'Image Url'],
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
    changeValue() {
      if (this.select === 'uploadImage') {
        this.formData.mediaUrl = null
      } else if (this.select === 'Image/Video Url') {
        this.file = null
      } else {
        this.formData.mediaUrl = null
        this.file = null
      }
    },
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
        if (this.totalCharBody > 5 && this.totalCharBody <= 200) {
          this.$emit('onSubmit', data)
        }
      }
    }
  }
}
</script>
