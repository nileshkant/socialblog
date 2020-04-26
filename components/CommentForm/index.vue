<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-row>
        <v-col class="py-0">
          <!-- <iframe
            v-if="formData.embededUrl"
            height="300"
            :src="formData.embededUrl"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen,
          ></iframe> -->
          <v-form>
            <!-- <VTextFieldWithValidation
              v-if="activeField === 'mdi-vector-link'"
              v-model="formData.embededUrl"
              rules="required|min:5"
              label="Embeded Urls like youtube,vimeo, twitter url*"
            /> -->
            <RichtextEditor
              v-if="activeField === 'mdi-comment-text-outline'"
              v-model="formData.textComment"
              :limitcharcount="250"
              @charCount="charCount"
              @richContent="richContent"
            />
            <file-upload
              v-if="activeField === 'mdi-attachment'"
              v-model="formData.file"
              rules="image|size:10000"
              label="Upload Image"
            />
          </v-form>
        </v-col>

        <v-col cols="auto" class="pl-0 py-0">
          <v-row class="ma-0 fill-height" align="end" justify="end">
            <v-col cols="auto" class="px-3">
              <v-speed-dial
                v-model="fab"
                direction="top"
                transition="slide-y-reverse-transition"
              >
                <template v-slot:activator>
                  <v-btn v-model="fab" color="primary" dark fab small>
                    <v-icon v-if="fab">mdi-close</v-icon>
                    <v-icon v-else>{{ activeField }}</v-icon>
                  </v-btn>
                </template>
                <v-btn
                  fab
                  dark
                  small
                  color="accent"
                  @click="fieldChange('mdi-comment-text-outline')"
                >
                  <v-icon>mdi-comment-text-outline</v-icon>
                </v-btn>
                <!-- <v-btn
                  fab
                  dark
                  small
                  color="accent"
                  @click="fieldChange('mdi-vector-link')"
                >
                  <v-icon>mdi-vector-link</v-icon>
                </v-btn> -->
                <v-btn
                  fab
                  dark
                  small
                  color="accent"
                  @click="fieldChange('mdi-attachment')"
                >
                  <v-icon>mdi-attachment</v-icon>
                </v-btn>
              </v-speed-dial>
            </v-col>
            <v-col cols="auto" class="px-0">
              <v-btn fab small color="primary" type="submit" @click="submit">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </ValidationObserver>
  </client-only>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
import { mapGetters } from 'vuex'
import { required, min, image, size, regex } from 'vee-validate/dist/rules'
// import VTextFieldWithValidation from '../FormComponents/Textfield'
import RichtextEditor from '../FormComponents/RichTextEditor'
import FileUpload from '../FormComponents/fileUpload'
extend('required', required)
extend('min', min)
extend('image', image)
extend('size', size)
extend('regex', regex)

export default {
  components: {
    ValidationObserver,
    // VTextFieldWithValidation,
    RichtextEditor,
    FileUpload
  },
  data: () => ({
    fab: '',
    totalCharBody: 0,
    activeField: 'mdi-comment-text-outline',
    formData: {
      //   embededUrl: null,
      file: null,
      textComment: null
    }
  }),
  computed: {
    ...mapGetters({
      dropdownCategories: 'article/dropdownCategories',
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
  methods: {
    fieldChange(icon) {
      this.activeField = icon
    },
    charCount(count) {
      this.totalCharBody = count
    },
    richContent(content) {
      this.formData.textComment = content
    },
    async submit() {
      const success = await this.$refs.obs.validate()
      if (success) {
        if (this.formData.file) {
          this.$emit('onSubmit')
          this.formData.file = this.formData.textComment = null
        }
        if (this.formData.textComment && this.totalCharBody <= 250) {
          this.$emit('onSubmit')
          this.formData.file = this.formData.textComment = null
        }
      }
    }
  }
}
</script>
