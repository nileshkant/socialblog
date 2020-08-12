<template>
  <div
    v-if="cardcontent.createdDate"
    class="caption pb-0 text-truncate px-4 py-2"
    :class="{
      'black--text': checkColor === 'light',
      'white--text': checkColor === 'dark'
    }"
  >
    {{
      $dateFns.formatDistanceToNow(new Date(cardcontent.createdDate), {
        addSuffix: true
      })
    }}
    <span
      >-
      {{
        cardcontent.author.username || cardcontent.author.facebook.displayName
      }}</span
    >
  </div>
</template>

<script>
export default {
  props: {
    cardcontent: {
      type: Object,
      required: true
    },
    checkColor: {
      type: String,
      default: 'noColor'
    },
    useTheme: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style></style>
