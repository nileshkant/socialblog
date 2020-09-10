<template>
  <div>
    <v-app-bar elevate-on-scroll class="pos-sticky app-bar">
      <v-row>
        <v-col>
          <div class="mt-7">
            <SearchForm @searched="searched" />
          </div>
        </v-col>
      </v-row>
    </v-app-bar>
    <AllArticleList
      v-if="articles"
      :articles="articles"
      :user="user"
      :all-comments="allComments"
      remove-toolbar
      show-article-link
      :api-called="apiCalled"
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
      type: '',
      apiCalled: false
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
      this.apiCalled = true
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

<style scoped>
.app-bar {
  top: 0;
  z-index: 1;
}
</style>
