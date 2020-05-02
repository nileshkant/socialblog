<template>
  <div>
    <v-toolbar flat>
      <v-toolbar-title class="title">{{
        (articles && articles[0] && articles[0].categories[0].name) ||
          'Sorry no content found'
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="user && user.userDetails.role != user"
        color="accent"
        to="/create-post"
      >
        + Article
      </v-btn>
      <v-btn icon large>
        <v-icon>mdi-bookmark-check-outline</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <div
      id="articleContainer"
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
          v-if="article.articleType === 'quoteCard' && article.quoteCard"
          md="8"
          cols="10"
          :class="{ 'ml-auto': index % 2 === 0 }"
        >
          <QuoteCard :cardcontent="article"> </QuoteCard>
        </v-col>
        <v-col
          v-if="
            article.articleType === 'fullDetailsCard' && article.fullDetailsCard
          "
          md="8"
          cols="10"
          :class="{ 'ml-auto': index % 2 === 0 }"
        >
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
  async fetch({ store, params, route }) {
    await store.dispatch('article/getArticles', route.params.id)
  },
  data() {
    return {
      autoRight: true
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight',
      articles: 'article/articles',
      user: 'user'
    })
  },
  mounted() {
    const container = this.$el.querySelector('#articleContainer')
    container.scrollTop = container.scrollHeight
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
