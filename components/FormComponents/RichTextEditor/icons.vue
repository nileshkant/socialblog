<template>
  <div
    class="icon iconColor"
    :class="[`icon-${name}`, `icon-${size}`, { 'has-align-fix': fixAlign }]"
  ></div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'normal'
    },
    modifier: {
      type: String,
      default: null
    },
    fixAlign: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style scoped>
.iconColor {
  color: var(--v-colorTheme-base);
}
</style>
