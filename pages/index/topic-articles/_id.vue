<template>
  <AllArticleList :articles="articles" :user="user" @scrolled="scrolled" />
</template>

<script>
import { mapGetters } from 'vuex'
import AllArticleList from '../../../components/AllArticleList'
export default {
  components: {
    AllArticleList
  },
  async fetch({ store, params, route }) {
    await store.dispatch('article/getArticles', {
      id: route.params.id,
      page: (this.articleDetails && this.articleDetails.page) || 1,
      pageSize: (this.articleDetails && this.articleDetails.pageSize) || 30
    })
  },
  computed: {
    ...mapGetters({
      articles: 'article/articles',
      user: 'user',
      articleDetails: 'article/articleDetails'
    })
  },
  methods: {
    scrolled({ scrolledTop, totalHeight }) {
      if (
        scrolledTop + window.innerHeight - 50 > totalHeight &&
        !this.articleDetails.isLastPage
      ) {
        this.$store.dispatch('article/getArticles', {
          id: this.$route.params.id,
          page: this.articleDetails && this.articleDetails.page + 1,
          pageSize: 30
        })
      }
    }
  },
  head() {
    return {
      title:
        this.articles && this.articles[0] && this.articles[0].categories[0]
          ? this.articles[0].categories[0].name
          : 'The open stories',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            this.articles && this.articles[0] && this.articles[0].categories[0]
              ? this.articles[0].categories[0].summary
              : 'The open stories'
        }
      ]
    }
  }
}
</script>

<style></style>
