<template>
  <div>
    <v-toolbar flat>
      <v-btn icon large class="d-flex d-md-none" to="/">
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>
      <v-row>
        <v-col>
          <div class="mt-7">
            <SearchForm />
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
        search: route.query.search
      })
    } else {
      await store.dispatch('article/removeSearchState')
    }
  },
  computed: {
    ...mapGetters({
      articles: 'article/articles',
      allComments: 'article/allComments',
      user: 'user'
    })
  }
}
</script>

<style></style>
