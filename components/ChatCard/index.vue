<template>
  <v-card class="mx-auto" max-width="344">
    <v-img
      v-if="cardcontent.imageUrl || cardcontent.file"
      :src="cardcontent.file"
      height="200px"
    ></v-img>
    <v-card-title class="title">
      {{ cardcontent.title }}
    </v-card-title>

    <v-card-subtitle>
      {{ cardcontent.subtitle }}
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
        <v-card-text v-html="cardcontent.mainArticle"> </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
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
    },
    cardcontent: {
      type: Object,
      default: () => {
        return {
          title: 'Top western road trips',
          subtitle: '1,000 miles of wonder',
          imageUrl: null,
          file: null,
          mainArticle: `I'm a thing. But, like most politicians, he promised more than he
          could deliver. You won't have time for sleeping, soldier, not with all
          the bed making you'll be doing. Then we'll go with that data file!
          Hey, you add a one and two zeros to that or we walk! You're going to
          do his laundry? I've got to find a way to escape.`
        }
      }
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
