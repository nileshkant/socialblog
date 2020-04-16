<template>
  <div
    class="icon"
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
