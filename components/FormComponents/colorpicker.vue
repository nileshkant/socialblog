<template>
  <div>
    <div class="subtitle-1 text--secondary">
      Pick Card Background
    </div>
    <v-color-picker
      v-model="color"
      hide-canvas
      hide-inputs
      class="fullWidth"
      v-bind="optionalProps"
    ></v-color-picker>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'hex'
    },
    optionalProps: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    types: ['hex', 'hexa', 'rgba', 'hsla', 'hsva'],
    hex: '#FF00FF'
  }),
  computed: {
    color: {
      get() {
        return this[this.type]
      },
      set(v) {
        this[this.type] = v
        this.$emit('input', v)
      }
    },
    showColor() {
      if (typeof this.color === 'string') return this.color

      return JSON.stringify(
        Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2))
          return color
        }, {}),
        null,
        2
      )
    }
  },
  watch: {
    value(newVal) {
      this.color = newVal
    }
  },
  mounted() {
    if (this.value) {
      this[this.value.type] = this.value.value
    }
  }
}
</script>

<style scoped>
.fullWidth {
  width: 100%;
  max-width: 100% !important;
}
</style>
