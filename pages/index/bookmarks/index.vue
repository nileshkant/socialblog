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
  mounted() {
    this.$store.dispatch('article/setTitle', 'My bookmarks')
  }
}
</script>

<style></style>
