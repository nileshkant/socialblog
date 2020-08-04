<template>
  <div :class="classes">
    <ValidationProvider v-slot="{ errors, valid }" :name="label" :rules="rules">
      <v-textarea
        ref="childText"
        v-model="innerValue"
        :error-messages="errors"
        :success="valid"
        :auto-grow="autoGrow"
        :clearable="clearable"
        :counter="showCounter ? counter : false"
        :filled="filled"
        :flat="flat"
        :hint="hint"
        :label="label"
        :autofocus="autofocus"
        :loading="loading"
        :no-resize="noResize"
        :outlined="outlined"
        :persistent-hint="persistentHint"
        :placeholder="placeholder"
        :rounded="rounded"
        :row-height="rowHeight"
        :rows="rows"
        :shaped="shaped"
        :single-line="singleLine"
        :solo="solo"
        :validate-on-blur="validateOnBlur"
        v-bind="$attrs"
        v-on="$listeners"
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
      default: ''
    },
    classes: {
      type: String,
      default: ''
    },
    // must be included in props
    value: {
      type: null,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    autoGrow: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showCounter: {
      type: Boolean,
      default: false
    },
    filled: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    noResize: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    rounded: {
      type: Boolean,
      default: false
    },
    rowHeight: {
      type: Number,
      default: 50
    },
    rows: {
      type: Number,
      default: 6
    },
    shaped: {
      type: Boolean,
      default: false
    },
    singleLine: {
      type: Boolean,
      default: false
    },
    solo: {
      type: Boolean,
      default: false
    },
    validateOnBlur: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    innerValue: '',
    counter: 0
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
