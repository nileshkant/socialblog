<template>
  <div :class="$attrs.classes">
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
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  },
  methods: {
    async handleFileChange(e) {
      this.$refs.provider.syncValue(e)
      this.valid = await this.$refs.provider.validate(e)
    }
  }
}
</script>
