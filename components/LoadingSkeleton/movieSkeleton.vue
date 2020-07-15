<template>
  <v-sheet class="pos-r">
    <v-overlay v-if="showOverlay" absolute opacity="0.1">
      <v-btn
        type="button"
        color="accent"
        @click="selectedCard('movieReviewCard')"
      >
        Movie Review Story
      </v-btn>
    </v-overlay>
    <v-row class="ma-0">
      <v-col>
        <v-skeleton-loader :boilerplate="true" type="article">
        </v-skeleton-loader>
      </v-col>
      <v-col>
        <div class="v-sheet--offset">
          <v-skeleton-loader :boilerplate="true" type="image">
          </v-skeleton-loader>
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mx-0">
      <v-col v-for="i in 3" :key="i">
        <v-skeleton-loader :boilerplate="true" type="chip"> </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mx-0">
      <v-col>
        <v-skeleton-loader :boilerplate="true" type="sentences">
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  props: {
    showOverlay: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectedCard(value) {
      this.$emit('selectedCard', value)
    }
  }
}
</script>

<style></style>
