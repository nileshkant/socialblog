<template>
  <div :class="$attrs.classes">
    <ValidationProvider
      v-slot="{ errors, valid }"
      :name="$attrs.label"
      :rules="rules"
    >
      <v-select
        v-model="innerValue"
        :success="valid"
        :error-messages="errors"
        v-bind="$attrs"
        v-on="$listeners"
      ></v-select>
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
  }
}
</script>
