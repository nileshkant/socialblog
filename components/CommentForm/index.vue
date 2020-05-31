<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-row>
        <v-col align-self="end" class="py-0">
          <v-img v-if="base64File" :src="base64File">
            <v-btn
              small
              fab
              color="error"
              class="closeImage"
              type="button"
              @click="clearFile"
            >
              <v-icon small>
                mdi-close
              </v-icon>
            </v-btn>
          </v-img>
          <div v-if="noembedLink" v-html="noembedLink.html"></div>
          <v-form>
            <v-row>
              <v-col align-self="center" cols="auto" class="pb-0">
                <v-btn
                  rounded
                  dark
                  outlined
                  small
                  title="Upload image"
                  :disabled="isSelecting || (noembedLink && true)"
                  class="mb-2"
                  @click="onButtonClick"
                >
                  <v-icon>mdi-attachment</v-icon>
                  <span></span>
                </v-btn>
              </v-col>
              <v-col class="py-0">
                <VTextFieldWithValidation
                  v-model="linkEmbeded"
                  :rules="{
                    regex: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/
                  }"
                  label="Link of tweet, video, etc."
                  clearable
                  :disabled="base64File && true"
                  @blur="onChange"
                />
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col class="py-0">
                <RichtextEditor
                  v-model="formData.textComment"
                  :limitcharcount="250"
                  @charCount="charCount"
                  @richContent="richContent"
                />
              </v-col>
              <v-col cols="auto" class="pl-0 py-0">
                <v-row class="ma-0 fill-height" align="end" justify="end">
                  <v-col cols="auto" class="px-0">
                    <v-btn
                      fab
                      small
                      color="primary"
                      type="submit"
                      :disabled="error"
                      @click="submit"
                    >
                      <v-icon>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <file-upload
              ref="upload"
              v-model="formData.file"
              rules="image|size:10000"
              label="Upload Image"
              is-icon
            />
          </v-form>
        </v-col>
      </v-row>
    </ValidationObserver>
  </client-only>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
import { mapGetters } from 'vuex'
import { image, size, regex } from 'vee-validate/dist/rules'
import { toBase64 } from '../../utilities/common'
import RichtextEditor from '../FormComponents/RichTextEditor'
import VTextFieldWithValidation from '../FormComponents/Textfield'
import FileUpload from '../FormComponents/fileUpload'
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
    // VTextFieldWithValidation,
    RichtextEditor,
    FileUpload,
    VTextFieldWithValidation
  },
  data: () => ({
    fab: '',
    error: false,
    isSelecting: false,
    base64File: null,
    totalCharBody: 0,
    activeField: 'mdi-comment-text-outline',
    linkEmbeded: null,
    formData: {
      file: null,
      textComment: null,
      embedUrl: null
    }
  }),
  computed: {
    ...mapGetters({
      dropdownCategories: 'article/dropdownCategories',
      initValue: 'article/latestArticle',
      noembedLink: 'noembed/noembedLink'
    })
  },
  watch: {
    formData: {
      async handler(newValue, oldValue) {
        this.$emit('formData', newValue)
        if (newValue.file) {
          this.base64File = newValue.file ? await toBase64(newValue.file) : null
        }
      },
      deep: true
    }
  },
  methods: {
    fieldChange(icon) {
      this.activeField = icon
    },
    async onChange() {
      const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/
      const regex = new RegExp(expression, 'g')
      if (this.linkEmbeded && regex.test(this.linkEmbeded)) {
        try {
          await this.$store.dispatch(
            'noembed/noembedLink',
            encodeURIComponent(this.linkEmbeded)
          )
          if (this.noembedLink.error) {
            this.error = true
            this.$store.commit('noembed/noembedLink', null)
          } else {
            this.formData.embedUrl = Object.assign({}, this.noembedLink)
            this.error = false
          }
        } catch (err) {
          this.error = true
          this.$store.commit('noembed/noembedLink', null)
        }
      } else {
        this.error = false
        this.$store.commit('noembed/noembedLink', null)
      }
    },
    onButtonClick() {
      this.isSelecting = true
      window.addEventListener(
        'focus',
        () => {
          this.isSelecting = false
        },
        { once: true }
      )
      this.$refs.upload.$refs.uploader.click()
    },
    charCount(count) {
      this.totalCharBody = count
    },
    richContent(content) {
      this.formData.textComment = content
    },
    clearFile() {
      this.formData.file = null
      this.base64File = null
    },
    async submit(e) {
      e.preventDefault()
      const success = await this.$refs.obs.validate()
      if (success && !this.error) {
        if (
          this.formData.file ||
          this.formData.embedUrl ||
          (this.formData.textComment && this.totalCharBody <= 250)
        ) {
          this.$emit('onSubmit')
          this.formData.file = this.formData.textComment = this.linkEmbeded = this.formData.embedUrl = null
          this.$store.commit('noembed/noembedLink', null)
        }
      }
    }
  }
}
</script>

<style scoped>
.closeImage {
  right: 8px;
  position: absolute;
  top: 8px;
}
</style>
