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
        <v-col
          v-if="article.articleType === 'Quote Card'"
          md="8"
          cols="10"
          :class="{ 'ml-auto': index % 2 === 0 }"
        >
          <QuoteCard :cardcontent="article"> </QuoteCard>
        </v-col>
        <v-col v-else md="8" cols="10" :class="{ 'ml-auto': index % 2 === 0 }">
          <chat-card :cardcontent="article"> </chat-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatCard from '~/components/ChatCard'
import QuoteCard from '~/components/ChatCard/QuoteCard'

export default {
  components: {
    'chat-card': ChatCard,
    QuoteCard
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
