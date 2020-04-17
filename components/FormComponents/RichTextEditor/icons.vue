<template>
  <div
    class="icon iconColor"
    :class="[`icon-${name}`, `icon-${size}`, { 'has-align-fix': fixAlign }]"
  ></div>
</template>

<script>
export default {
  props: {
    name: {},
    size: {
      default: 'normal'
    },
    modifier: {
      default: null
    },
    fixAlign: {
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
