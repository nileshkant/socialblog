<template>
  <div>
    <div
      :style="{
        'min-height': windowHeight - 66 + 'px',
        'max-height': windowHeight - 66 + 'px'
      }"
      class="overflowY-auto scrollBar"
    >
      <v-row
        v-for="(article, index) in articles"
        :key="article._id"
        class="mx-0"
      >
        <v-col md="8" cols="10" :class="{ 'ml-auto': index % 2 === 0 }">
          <chat-card :cardcontent="article" :left="true" :image-no-temp="1">
          </chat-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatCard from '~/components/ChatCard'

export default {
  components: {
    'chat-card': ChatCard
  },
  data() {
    return {
      autoRight: true
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight',
      articles: 'article/articles'
    })
  },
  mounted() {
    this.$store.dispatch('article/getArticles', this.$route.params.id)
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
