<template>
  <AllArticleList v-if="bookmarks" :articles="bookmarks" :user="user" />
</template>

<script>
import { mapGetters } from 'vuex'
import AllArticleList from '../../../components/AllArticleList'
export default {
  components: {
    AllArticleList
  },
  computed: {
    ...mapGetters({
      bookmarks: 'article/bookmarks',
      user: 'user'
    })
  },
  watch: {
    $route(newValue, oldValue) {
      if (newValue.fullPath === '/bookmarks') {
        this.$store.dispatch('article/setTitle', { title: 'My bookmarks' })
      }
    }
  },
  mounted() {
    this.$store.dispatch('article/setTitle', { title: 'My bookmarks' })
  }
}
</script>

<style></style>
