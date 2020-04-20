<template>
  <v-row>
    <v-col sm="12" md="4" cols="12" class="py-0 border-right-grey">
      <sidebar />
    </v-col>
    <v-col class="pa-0 border-right-grey middle-col" sm="12" md="5" cols="12">
      <v-toolbar flat>
        <v-toolbar-title class="title">Politics</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="accent" to="/create-post">
          + Article
        </v-btn>
        <v-btn icon large>
          <v-icon>mdi-bookmark-check-outline</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <div
        :style="{ 'max-height': windowHeight - 66 + 'px' }"
        class="overflowY-auto scrollBar"
      >
        <v-row class="mx-0">
          <v-col md="8" :class="{ 'ml-auto': !autoRight }">
            <chat-card :left="true" :image-no-temp="1"> </chat-card>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col md="8" :class="{ 'ml-auto': autoRight }">
            <chat-card :right="true" :image-no-temp="4"> </chat-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col sm="12" md="3" cols="12" class="py-0">
      <v-row>
        <v-col cols="12" class="px-0 py-0">
          <v-toolbar flat>
            <v-toolbar-title class="title">#Trending Today</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon large>
              <v-icon>mdi-weather-night</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider />
        </v-col>
        <div
          :style="{ 'max-height': windowHeight - 66 + 'px' }"
          class="overflowY-auto scrollBar"
        >
          <v-col cols="12" class="px-5">
            <quote-card></quote-card>
          </v-col>
          <v-col cols="12" class="px-5">
            <trending-card></trending-card>
          </v-col>
        </div>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebar from '../components/Sidebar'
import ChatCard from '../components/ChatCard'
import QuoteCard from '../components/ChatCard/QuoteCard'
import TrendingCard from '../components/TrendingCard'
export default {
  components: {
    sidebar,
    'chat-card': ChatCard,
    'quote-card': QuoteCard,
    'trending-card': TrendingCard
  },
  data() {
    return {
      autoRight: true
    }
  },
  mounted() {
    this.$meta().refresh()
    this.$store.dispatch('article/getArticle')
  },
  methods: {
    closeModel() {
      this.overlay = false
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight',
      isDarkMode: 'commonState/isDarkMode'
    })
  }
}
</script>

<style scoped>
.overflowY-auto {
  overflow-y: auto;
}
.border-right-grey {
  border-right: 1px solid var(--v-greyAccent-base);
}
.editor-pos {
  position: relative;
  bottom: 0;
  background: white;
  width: 100%;
}
.middle-col {
  position: relative;
}
</style>
