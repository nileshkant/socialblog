<template>
  <v-card raised class="mb-3 pr-2" :href="embedData.canonical">
    <v-row align="center" justify="center" no-gutters>
      <v-col v-if="embedData.og_img" cols="4">
        <v-img :src="embedData.og_img"></v-img>
      </v-col>
      <v-col>
        <v-row class="pl-2 py-1">
          <v-col
            cols="12 line-clamp-1 py-0 caption text--secondary font-weight-bold"
          >
            {{ embedData.og_title || embedData.title }}
          </v-col>
          <v-col cols="12 line-clamp-2 py-0 caption my-1 text--secondary">
            {{ embedData.og_description || embedData.description }}
          </v-col>
          <v-col cols="12 line-clamp-1 word-break py-0 caption text--disabled">
            {{ embedData.canonical }}
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    embedData: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.word-break {
  word-break: break-all;
}
</style>
