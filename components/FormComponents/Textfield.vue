<template>
  <div :class="$attrs.classes">
    <ValidationProvider :name="$attrs.label" :rules="rules">
      <v-text-field
        v-model="innerValue"
        slot-scope="{ errors, valid }"
        :error-messages="errors"
        :success="rules ? valid : null"
        :autofocus="autofocus"
        :loading="loading"
        :hint="hint"
        :placeholder="placeholder"
        :shaped="shaped"
        :outlined="outlined"
        :rounded="rounded"
        :solo="solo"
        :single-line="singleLine"
        :filled="filled"
        :clearable="clearable"
        :persistent-hint="persistentHint"
        :flat="flat"
        :counter="counterEn ? counter : false"
        :dense="dense"
        :append-icon="appendIcon"
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
    loading: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    shaped: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    solo: {
      type: Boolean,
      default: false
    },
    singleLine: {
      type: Boolean,
      default: false
    },
    filled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    counterEn: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    appendIcon: {
      type: String,
      default: null
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
