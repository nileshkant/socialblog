<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-card>
        <v-card-text>
          <v-form>
            <SelectBox
              v-model="formData.cardselect"
              :items="cardoption"
              label="Select"
              classes="mt-4"
            />
            <VTextFieldWithValidation
              v-model="formData.title"
              rules="required|min:5"
              label="Title*"
            />

            <VTextFieldWithValidation
              v-model="formData.subtitle"
              rules="min:5"
              :label="
                formData.cardselect === 'Quote Card' ? 'Quote' : 'Subtitle'
              "
            />

            <VTextFieldWithValidation
              v-model="formData.source"
              rules="min:3"
              label="Source"
            />
            <RichtextEditor
              v-if="formData.cardselect !== 'Quote Card'"
              :limitcharcount="200"
              @richContent="richContent"
              @charCount="charCount"
            />
            <v-row v-if="formData.cardselect !== 'Quote Card'">
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
                  v-model="formData.file"
                  rules="image|size:10000"
                  label="Upload Image"
                />
                <VTextFieldWithValidation
                  v-if="select === 'Image/Video Url'"
                  v-model="formData.imageUrl"
                  classes="mt-4"
                  :rules="{
                    min: 3,
                    regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
                  }"
                  label="Image Url"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">Post</v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </client-only>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
import {
  required,
  min,
  email,
  image,
  size,
  regex
} from 'vee-validate/dist/rules'
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
    items: ['No Image', 'Upload Image', 'Image/Video Url'],
    cardoption: ['Image Card', 'Quote Card'],
    select: '',
    totalCharBody: 0,
    formData: {
      title: '',
      subtitle: '',
      source: '',
      mainArticle: '',
      file: null,
      imageUrl: '',
      cardselect: 'Image Card'
    }
  }),
  watch: {
    formData: {
      handler(newValue) {
        this.$emit('formData', newValue)
      },
      deep: true
    }
  },
  methods: {
    changeValue() {
      if (this.select === 'uploadImage') {
        this.formData.imageUrl = null
      } else if (this.select === 'Image/Video Url') {
        this.formData.file = null
      } else {
        this.formData.imageUrl = null
        this.formData.file = null
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
      this.formData.mainArticle = content
    },
    async submit() {
      await this.$refs.obs.validate()
    }
  }
}
</script>
