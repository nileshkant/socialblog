<template>
  <div :class="$attrs.classes">
    <ValidationProvider :name="$attrs.label" :rules="rules">
      <v-text-field
        v-model="innerValue"
        slot-scope="{ errors, valid }"
        :error-messages="errors"
        :success="valid"
        v-bind="$attrs"
        v-on="$listeners"
      ></v-text-field>
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
      default: ''
    },
    class: {
      type: String,
      default: ''
    },
    // must be included in props
    value: {
      type: null,
      default: ''
    }
  },
  data: () => ({
    innerValue: ''
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
  mounted() {
    if (this.value) {
      this.innerValue = this.value
    }
  }
}
</script>
