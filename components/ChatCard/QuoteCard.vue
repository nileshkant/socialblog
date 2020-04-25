<template>
  <v-card class="mx-auto" color="#26c6da" dark max-width="400">
    <v-card-title>
      <span class="title font-weight-light">{{ cardcontent.title }}</span>
    </v-card-title>

    <v-card-text v-if="cardcontent.subtitle" class="headline font-weight-bold">
      " {{ cardcontent.subtitle }} "
    </v-card-text>
    <v-card-actions>
      <v-btn icon text>
        <v-icon>mdi-heart-outline</v-icon>
      </v-btn>

      <v-btn icon text>
        <v-icon>mdi-bookmark-plus-outline</v-icon>
      </v-btn>

      <v-btn icon text>
        <v-icon>mdi-share-outline</v-icon>
      </v-btn>
      <v-card-text
        v-if="cardcontent.source"
        class="caption py-0 text--secondary text-truncate text-right"
      >
        {{ cardcontent.source }}
      </v-card-text>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    cardcontent: {
      type: Object,
      default: () => {
        return {
          title: 'Top western road trips',
          subtitle: '1,000 miles of wonder',
          source: 'Me'
        }
      }
    }
  }
}
</script>

<style></style>
