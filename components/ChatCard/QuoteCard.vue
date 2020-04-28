<template>
  <v-card
    class="mx-auto"
    :color="cardcontent.quoteCard && cardcontent.quoteCard.color"
    :dark="checkColor"
    max-width="400"
  >
    <v-card-title>
      <span
        class="title font-weight-light"
        :class="!checkColor && 'black--text'"
        >{{ cardcontent.quoteCard && cardcontent.quoteCard.title }}</span
      >
    </v-card-title>

    <v-card-text
      v-if="cardcontent.quoteCard && cardcontent.quoteCard.quote"
      class="headline font-weight-bold"
      :class="!checkColor && 'black--text'"
    >
      " {{ cardcontent.quoteCard.quote }} "
    </v-card-text>
    <v-card-actions>
      <v-btn icon text :color="!checkColor ? 'black' : ''">
        <v-icon>mdi-heart-outline</v-icon>
      </v-btn>

      <v-btn icon text :color="!checkColor ? 'black' : ''">
        <v-icon>mdi-bookmark-plus-outline</v-icon>
      </v-btn>

      <v-btn icon text :color="!checkColor ? 'black' : ''">
        <v-icon>mdi-share-outline</v-icon>
      </v-btn>
      <v-card-text
        v-if="cardcontent.quoteCard && cardcontent.quoteCard.source"
        class="caption py-0 text-truncate text-right"
        :class="!checkColor && 'black--text'"
      >
        {{ cardcontent.quoteCard.source }}
      </v-card-text>
    </v-card-actions>
  </v-card>
</template>

<script>
import { lightOrDark } from '../../utilities/common'
export default {
  props: {
    cardcontent: {
      type: Object,
      default: () => {
        return {
          quoteCard: {
            title: 'Top western road trips',
            quote: '1,000 miles of wonder',
            source: 'Me',
            color: '#cccccc'
          }
        }
      }
    }
  },
  computed: {
    checkColor() {
      if (
        this.cardcontent.quoteCard &&
        lightOrDark(this.cardcontent.quoteCard.color) === 'dark'
      ) {
        return true
      }
      return false
    }
  }
}
</script>

<style></style>
