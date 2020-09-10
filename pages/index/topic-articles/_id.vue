<template>
  <div>
    <div v-if="articles || (page === 1 && !contentLoading)">
      <AllArticleList :articles="articles" :user="user" />
      <v-row v-if="articles.length === page * pageSize" class="mb-4 mx-0">
        <v-col cols="auto" class="mx-auto">
          <v-btn @click="scrolled">
            <v-icon class="pr-2">mdi-arrow-down</v-icon>
            Load more
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <LoadingSkeleton v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AllArticleList from '../../../components/AllArticleList'
import LoadingSkeleton from '../../../components/LoadingSkeleton'
export default {
  components: {
    AllArticleList,
    LoadingSkeleton
  },
  async fetch({ store, params, route }) {
    await store.dispatch('article/getArticles', {
      id: route.params.id,
      page: (this.articleDetails && this.articleDetails.page) || 1,
      pageSize: (this.articleDetails && this.articleDetails.pageSize) || 5
    })
  },
  data() {
    return {
      page: 1,
      pageSize: 20
    }
  },
  computed: {
    ...mapGetters({
      articles: 'article/articles',
      user: 'user',
      articleDetails: 'article/articleDetails',
      contentLoading: 'article/contentLoading'
    })
  },
  methods: {
    scrolled() {
      this.page = this.articleDetails && this.articleDetails.page + 1
      this.$store.dispatch('article/getArticles', {
        id: this.$route.params.id,
        page: this.page,
        pageSize: this.pageSize
      })
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
