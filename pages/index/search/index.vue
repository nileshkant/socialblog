<template>
  <div>
    <v-toolbar flat>
      <v-btn icon large class="d-flex d-md-none" to="/">
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>
      <v-row>
        <v-col>
          <div class="mt-7">
            <SearchForm @searched="searched" />
          </div>
        </v-col>
      </v-row>
    </v-toolbar>
    <AllArticleList
      v-if="articles"
      :articles="articles"
      :user="user"
      :all-comments="allComments"
      remove-toolbar
      show-article-link
      @scrolled="scrolled"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchForm from '~/components/SearchForm'
import AllArticleList from '~/components/AllArticleList'
export default {
  components: {
    AllArticleList,
    SearchForm
  },
  async fetch({ store, params, route }) {
    if (route.query && route.query.search) {
      await store.dispatch('article/search', {
        type: route.query.type || 'article',
        search: route.query.search,
        pageSize: 30,
        page: 1
      })
    } else {
      await store.dispatch('article/removeSearchState')
    }
  },
  data() {
    return {
      text: '',
      type: ''
    }
  },
  computed: {
    ...mapGetters({
      articles: 'article/articles',
      allComments: 'article/allComments',
      articleDetails: 'article/articleDetails',
      user: 'user'
    })
  },
  methods: {
    searched({ text, type }) {
      this.text = text
      this.type = type
    },
    scrolled({ scrolledTop, totalHeight }) {
      if (
        scrolledTop + window.innerHeight - 50 > totalHeight &&
        !this.articleDetails.isLastPage
      ) {
        this.$store.dispatch('article/search', {
          type: this.type,
          search: this.text,
          page: this.articleDetails && this.articleDetails.page + 1,
          pageSize: (this.articleDetails && this.articleDetails.pageSize) || 30
        })
      }
    }
  }
}
</script>

<style></style>
