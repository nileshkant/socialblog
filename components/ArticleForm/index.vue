<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-card
        :max-width="maxWidth"
        :min-width="maxWidth"
        :max-height="maxHeight"
        :min-height="minHeight"
      >
        <v-toolbar>
          <v-toolbar-title class="title">Create Post</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon color="error" @click="clear">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <VTextFieldWithValidation
              v-model="heading"
              rules="required|min:5"
              label="Heading*"
            />

            <VTextFieldWithValidation
              v-model="subheading"
              rules="min:5"
              label="SubHeading"
            />

            <VTextFieldWithValidation
              v-model="source"
              rules="min:3"
              label="Source"
            />
            <RichtextEditor
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
                  v-if="select === 'Image/Video Url'"
                  v-model="imageUrl"
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
import { mapGetters } from 'vuex'
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
    heading: '',
    subheading: '',
    source: '',
    richText: '',
    file: '',
    imageUrl: '',
    select: '',
    totalCharBody: 0
  }),
  computed: {
    ...mapGetters({
      windowWidth: 'commonState/windowWidth'
      // windowHeight: 'commonState/windowHeight'
    }),
    maxWidth() {
      return this.windowWidth > 768 ? '50vw' : '100vw'
    },
    maxHeight() {
      return this.windowWidth < 768 ? '100vh' : ''
    },
    minHeight() {
      return this.windowWidth < 768 ? '100vh' : ''
    }
  },
  methods: {
    changeValue() {
      if (this.select === 'uploadImage') {
        this.imageUrl = null
      } else if (this.select === 'Image/Video Url') {
        this.file = null
      }
    },
    charCount(count) {
      this.totalCharBody = count
    },
    clear() {
      this.name = this.email = ''
      this.$nextTick(() => {
        this.$refs.obs.reset()
      })
      this.$emit('closeModel')
    },
    richContent(content) {
      this.richText = content
    },
    async submit() {
      await this.$refs.obs.validate()
    }
  }
}
</script>
