<template>
  <v-card-text
    v-if="cardcontent.createdDate"
    class="caption pb-0 text--secondary text-truncate"
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
  </v-card-text>
</template>

<script>
export default {
  props: {
    cardcontent: {
      type: Object,
      required: true
    }
  }
}
</script>

<style></style>
