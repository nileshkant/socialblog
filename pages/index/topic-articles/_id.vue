<template>
  <AllArticleList :articles="articles" :user="user" />
</template>

<script>
import { mapGetters } from 'vuex'
import AllArticleList from '../../../components/AllArticleList'
export default {
  components: {
    AllArticleList
  },
  async fetch({ store, params, route }) {
    await store.dispatch('article/getArticles', route.params.id)
  },
  computed: {
    ...mapGetters({
      articles: 'article/articles',
      user: 'user'
    })
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
