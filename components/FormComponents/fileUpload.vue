<template>
  <div :class="$attrs.classes">
    <div v-if="!isIcon">
      <ValidationProvider ref="provider" :name="$attrs.label" :rules="rules">
        <v-file-input
          v-model="innerValue"
          slot-scope="{ errors, valid }"
          :error-messages="errors"
          :success="valid"
          show-size
          accept="image/*"
          v-bind="$attrs"
          v-on="$listeners"
          @change="handleFileChange"
        />
      </ValidationProvider>
    </div>
    <div v-if="isIcon">
      <!-- <v-btn
        :fab="!iconLabel && !(showFileName && innerValue)"
        rounded
        dark
        small
        color="accent"
        @click="onButtonClick"
      >
        <v-icon>{{ iconName }}</v-icon>
        <span v-if="showFileName && innerValue && innerValue.name">{{
          innerValue.name
        }}</span>
        <span v-else>{{ iconLabel }}</span>
      </v-btn> -->
      <ValidationProvider
        ref="uploadIcon"
        v-slot="{ errors }"
        :name="$attrs.label"
        :rules="rules"
      >
        <input
          ref="uploader"
          class="d-none"
          type="file"
          accept="image/*"
          @change="onFileChanged"
        />
        <div v-if="iconLabel" class="caption error--text">{{ errors[0] }}</div>
      </ValidationProvider>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider
  },
  props: {
    rules: {
      type: [Object, String],
      default: null
    },
    classes: {
      type: String,
      default: ''
    },
    value: {
      type: null,
      default: null
    },
    isIcon: {
      type: Boolean,
      default: false
    },
    clear: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String,
      default: 'mdi-attachment'
    },
    iconLabel: {
      type: String,
      default: ''
    },
    showFileName: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    innerValue: null
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit('input', newVal)
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal
      if (this.isIcon && !this.innerValue) {
        this.$refs.uploadIcon.reset()
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  },
  methods: {
    onButtonClick() {
      this.isSelecting = true
      window.addEventListener(
        'focus',
        () => {
          this.isSelecting = false
        },
        { once: true }
      )
      this.$refs.uploader.click()
    },
    async onFileChanged(e) {
      this.$refs.uploadIcon.syncValue(e.target.files[0])
      this.valid = await this.$refs.uploadIcon.validate(e.target.files[0])
      this.innerValue = e.target.files[0]
    },
    async handleFileChange(e) {
      this.$refs.provider.syncValue(e)
      this.valid = await this.$refs.provider.validate(e)
    }
  }
}
</script>
