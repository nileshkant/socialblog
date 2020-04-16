<template>
  <v-card class="mx-auto" max-width="344">
    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      height="200px"
    ></v-img>

    <v-card-title>
      Top western road trips
    </v-card-title>

    <v-card-subtitle>
      1,000 miles of wonder
    </v-card-subtitle>

    <v-card-actions>
      <v-btn icon color="secondary" text>
        <v-icon>mdi-heart-outline</v-icon>
      </v-btn>

      <v-btn icon color="secondary" text>
        <v-icon>mdi-bookmark-plus-outline</v-icon>
      </v-btn>

      <v-btn icon color="secondary" text>
        <v-icon>mdi-share-outline</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn fab small color="primary" @click="show = !show">
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          I'm a thing. But, like most politicians, he promised more than he
          could deliver. You won't have time for sleeping, soldier, not with all
          the bed making you'll be doing. Then we'll go with that data file!
          Hey, you add a one and two zeros to that or we walk! You're going to
          do his laundry? I've got to find a way to escape.
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
  <!-- <v-card
    class="ma-3 rounded-card"
    :class="{ 'no-bdbl': left, 'no-bdbr': right }"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"
          >Comprehensive, up-to-date news coverage, aggregated from sources all
          over the world
        </v-list-item-title>
        <v-list-item-subtitle>by Kurt Wagner</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list-item class="px-0 backgroudColor">
      <v-row no-gutters fill-height>
        <v-col md="6" :order="left && 2">
          <v-card-item>
            <v-row no-gutters>
              <v-col
                v-for="(n, index) in imageNoTemp"
                :key="n"
                class="d-flex child-flex"
                :cols="n % 2 !== 0 && index === imageNoTemp - 1 ? 12 : 6"
              >
                <v-card tile class="d-flex">
                  <v-img
                    :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
                    :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                    :min-height="imageNoTemp > 2 ? 125 : 250"
                    :max-height="imageNoTemp > 2 ? 125 : 250"
                    aspect-ratio="1"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                  <v-overlay
                    v-if="index === imageNoTemp - 1 && imageNoTemp >= 4"
                    absolute
                    color="#036358"
                    class="display-1"
                  >
                    + 2
                  </v-overlay>
                </v-card>
              </v-col>
            </v-row>
          </v-card-item>
        </v-col>
        <v-col md="6">
          <div
            class="d-flex align-content-space-between flex-column card-height"
          >
            <v-card-text class="white--text flex-grow-1">
              Visit ten places on our planet that are undergoing the biggest
              changes today. Visit ten places on our planet that are undergoing
              the biggest changes today.
            </v-card-text>
            <v-card-actions class="d-flex">
              <v-btn icon color="white">
                <v-icon>mdi-heart-outline</v-icon>
              </v-btn>
              <v-btn icon color="white">
                <v-icon>mdi-bookmark-plus-outline</v-icon>
              </v-btn>
              <v-btn icon color="white" class="ml-auto">
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </div>
        </v-col>
      </v-row>
    </v-list-item>
  </v-card> -->
</template>

<script>
export default {
  props: {
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    imageNoTemp: {
      type: Number,
      default: 2
    }
  },
  data: () => ({
    show: false
  })
}
</script>

<style scoped>
.rounded-card {
  border-radius: 10px !important;
}
.no-bdbl {
  border-bottom-left-radius: 0 !important;
}
.bdbl-10 {
  border-bottom-left-radius: 10px;
}
.bdbr-10 {
  border-bottom-right-radius: 10px;
}
.no-bdbr {
  border-bottom-right-radius: 0 !important;
}
.over-h {
  overflow: hidden !important;
}
.card-height {
  min-height: 250px;
  max-height: 250px;
}
.backgroudColor {
  background-image: radial-gradient(
    circle farthest-corner at 12.3% 19.3%,
    rgba(85, 88, 218, 1) 0%,
    rgba(95, 209, 249, 1) 100.2%
  );
}
</style>
