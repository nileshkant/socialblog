<template>
  <div>
    <ValidationObserver ref="obs">
      <v-row>
        <v-img v-if="base64File" :src="base64File" height="300" contain>
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
      </v-row>
      <v-tabs v-model="tab">
        <v-tabs-slider></v-tabs-slider>
        <v-btn-toggle
          v-model="toggle_exclusive"
          dense
          class="mr-2 mt-1 d-none d-md-block"
        >
          <v-btn
            v-for="(format, index) in buttonAction"
            :key="index"
            small
            retain-focus-on-click
            @click.prevent="
              (e) => insertText(e, format.openTag, format.closeTag)
            "
          >
            <v-icon>{{ format.icon }}</v-icon>
          </v-btn>
          <v-btn
            v-if="!noSendButton"
            small
            title="Upload image"
            :disabled="isSelecting"
            @click="onButtonClick"
          >
            <v-icon>mdi-attachment</v-icon>
            <span></span>
          </v-btn>
        </v-btn-toggle>

        <file-upload
          ref="upload"
          v-model="formData.file"
          rules="image|size:10000"
          label="Upload Image"
          is-icon
        />
        <v-tab v-for="i in 2" :key="i" :href="`#tab-${i}`">
          <span v-if="i === 1">Editor</span>
          <span v-if="i === 2">Preview</span>
        </v-tab>
        <v-tab-item v-for="i in 2" :key="i" :value="'tab-' + i">
          <v-row class="mt-2 mt-md-0">
            <v-col class="py-0">
              <VTextarea
                v-if="i === 1"
                ref="text"
                v-model="formData.textComment"
                rules="required|min:5|max:800"
                auto-grow
                label="Add more details"
                show-counter
                :rows="0"
                validate-on-blur
              />
              <div
                v-if="i === 2"
                class="mdStyle"
                v-html="$md.render(formData.textComment)"
              ></div>
            </v-col>
            <v-col
              v-if="!noSendButton"
              cols="auto"
              class="py-0 text-center mb-6"
              align-self="end"
            >
              <!-- <div class="pb-2 pt-1">

                    </div> -->
              <v-btn fab small color="primary" type="submit" @click="submit">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
      <v-row class="d-flex mx-0 d-md-none">
        <v-col class="pa-0">
          <v-btn-toggle v-model="toggle_exclusive" dense>
            <v-btn
              v-for="(format, index) in buttonAction"
              :key="index"
              small
              :disabled="tab === 'tab-2'"
              @click.prevent="
                (e) => insertText(e, format.openTag, format.closeTag)
              "
            >
              <v-icon>{{ format.icon }}</v-icon>
            </v-btn>
            <v-btn
              v-if="!noSendButton"
              small
              title="Upload image"
              :disabled="isSelecting"
              @click="onButtonClick"
            >
              <v-icon>mdi-attachment</v-icon>
              <span></span>
            </v-btn>
          </v-btn-toggle>
          <file-upload
            ref="upload"
            v-model="formData.file"
            rules="image|size:10000"
            label="Upload Image"
            is-icon
          />
        </v-col>
      </v-row>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
// import { mapGetters } from 'vuex'
import { image, size, required, min, max } from 'vee-validate/dist/rules'
import { toBase64 } from '../../utilities/common'
import VTextarea from '../FormComponents/TextArea'
import FileUpload from '../FormComponents/fileUpload'
extend('image', image)
extend('size', {
  ...size,
  message: 'Please provide image less than 10mb'
})
extend('required', {
  ...required,
  message: '{_field_} is required'
})
extend('min', min)
extend('max', max)
export default {
  components: {
    VTextarea,
    FileUpload,
    ValidationObserver
  },
  props: {
    noSendButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      buttonAction: [
        {
          icon: 'mdi-format-bold',
          openTag: '**',
          closeTag: '** '
        },
        {
          icon: 'mdi-format-italic',
          openTag: '*',
          closeTag: '* '
        },
        {
          icon: 'mdi-format-strikethrough',
          openTag: '~~',
          closeTag: '~~ '
        },
        {
          icon: 'mdi-format-quote-close',
          openTag: '\n>',
          closeTag: ' '
        },
        {
          icon: 'mdi-code-braces',
          openTag: '\n```\n',
          closeTag: '\n```'
        }
      ],
      tab: null,
      toggle_exclusive: null,
      base64File: null,
      isSelecting: false,
      formData: {
        textComment: '',
        file: null,
        isMarkdown: true
      }
    }
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
    insertText(e, openTag, closeTag) {
      const textArea = this.$refs.text[0].$refs.childText.$el.querySelector(
        'textarea'
      )
      const len = textArea.value.length
      const start = textArea.selectionStart
      const end = textArea.selectionEnd
      const selectedText = textArea.value.substring(start, end).trim()
      let replacement = ` ${openTag}${closeTag} `
      if (selectedText) {
        replacement = ` ${openTag}${selectedText}${closeTag}`
      }
      this.formData.textComment =
        textArea.value.substring(0, start) +
        replacement +
        textArea.value.substring(end, len)
      this.$nextTick().then(() => {
        textArea.focus()
        textArea.selectionEnd =
          start +
          replacement.length -
          (closeTag.length + (selectedText ? 0 : 1))
      })
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
    clearFile() {
      this.formData.file = null
      this.base64File = null
    },
    async submit(e) {
      e.preventDefault()
      const success = await this.$refs.obs.validate()
      const data = this.$md.render(this.formData.textComment)
      if (success && data.replace(/<[^>]*>?/gm, '')) {
        if (this.formData.file || this.formData.textComment) {
          this.$emit('onSubmit')
          this.formData.file = this.base64File = null
          this.formData.textComment = ''
          this.$refs.obs.reset()
        }
      }
    }
  }
}
</script>

<style scoped>
::v-deep .v-tabs-bar {
  height: 36px !important;
}
.closeImage {
  right: 8px;
  position: absolute;
  top: 8px;
}
</style>
