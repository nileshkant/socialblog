<template>
  <v-card class="mx-auto" color="#26c6da" dark max-width="400">
    <v-card-title>
      <span class="title font-weight-light">{{ cardcontent.title }}</span>
    </v-card-title>

    <v-card-text v-if="cardcontent.subtitle" class="headline font-weight-bold">
      " {{ cardcontent.subtitle }} "
    </v-card-text>

    <v-card-text>
      <v-list-item-content v-if="cardcontent.source">
        <v-list-item-title>- {{ cardcontent.source }}</v-list-item-title>
      </v-list-item-content>
    </v-card-text>
    <v-card-actions>
      <v-list-item class="grow">
        <v-row align="center" justify="end">
          <v-icon class="mr-1">mdi-heart</v-icon>
          <span class="subheading mr-2">256</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">mdi-share-variant</v-icon>
          <span class="subheading">45</span>
        </v-row>
      </v-list-item>
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
