<template>
  <v-row align="center" justify="center">
    <v-col cols="12">
      <div class="text-center title text-secondary">
        Select Story Type
      </div>
    </v-col>
    <v-col v-for="(card, index) in cardType" :key="index" cols="12" md="4">
      <v-sheet class="pos-r">
        <v-skeleton-loader :boilerplate="true" :type="card.skeletonType">
        </v-skeleton-loader>
        <v-overlay absolute opacity="0.1">
          <v-btn type="button" color="accent" @click="selectedCard(card.name)">
            {{ card.button }}
          </v-btn>
        </v-overlay>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  inject: ['theme'],
  data() {
    return {
      cardType: [
        {
          name: 'fullDetailsCard',
          skeletonType: 'card-avatar, article, actions',
          button: 'Full Story'
        },
        {
          name: 'quoteCard',
          skeletonType: 'article, actions',
          button: 'Quote Story'
        },
        {
          name: 'movieReviewCard',
          skeletonType: 'article, actions',
          button: 'Movie/Series Review Story'
        }
      ]
    }
  },
  methods: {
    selectedCard(card) {
      this.$emit('selectedCard', card)
    }
  }
}
</script>

<style scoped>
.pos-r {
  position: relative;
}
.no-event {
  pointer-events: none;
}
</style>
