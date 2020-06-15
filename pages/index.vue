<template>
  <v-row>
    <v-col
      sm="12"
      md="3"
      cols="12"
      class="py-0 border-right-grey"
      :class="isViewCategory && !isTrending ? '' : 'd-none d-md-flex'"
    >
      <sidebar @trending="isTrending = true" />
    </v-col>
    <v-col class="pa-0 border-right-grey middle-col" sm="12" md="6" cols="12">
      <NuxtChild v-if="!isViewCategory" :key="$route.params.id" keep-alive />
      <div v-if="$route.path === '/' && !isViewCategory">
        <AllArticleList :articles="articles" :user="user" />
      </div>
    </v-col>
    <v-col
      sm="12"
      md="3"
      cols="12"
      class="py-0"
      :class="isTrending ? '' : 'd-none d-md-flex'"
    >
      <v-row>
        <v-col cols="12" class="px-0 py-0">
          <v-toolbar flat>
            <v-btn
              icon
              large
              class="d-flex d-md-none"
              @click="isTrending = false"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title class="title pl-0"
              >Highlights Today</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn icon large @click="drawer">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider />
        </v-col>
        <v-col
          :style="{
            'min-height': windowHeight - 66 + 'px',
            'max-height': windowHeight - 66 + 'px'
          }"
          class="overflowY-auto scrollBar"
          cols="12"
        >
          <div>
            <Hightlights />
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebar from '../components/Sidebar'
import Hightlights from '../components/Highlights'
import AllArticleList from '../components/AllArticleList'

export default {
  components: {
    sidebar,
    Hightlights,
    AllArticleList
  },
  async fetch({ store, params, route }) {
    await store.dispatch('article/getCategories')
    if (route.path === '/') {
      await store.dispatch('article/getArticles', {
        page: 1,
        pageSize: 30
      })
    }
  },
  data() {
    return {
      isTrending: false
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/') {
        this.$store.dispatch('article/getArticles', {
          page: 1,
          pageSize: 30
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight',
      isDarkMode: 'commonState/isDarkMode',
      isViewCategory: 'commonState/isViewCategory',
      titleSection: 'article/titleSection',
      articles: 'article/articles',
      user: 'user'
    })
  },
  mounted() {
    this.$meta().refresh()
    this.$store.dispatch('covid19/covidSummary')
  },
  methods: {
    closeModel() {
      this.overlay = false
    },
    drawer(item) {
      this.$store.dispatch('commonState/isDrawerOpen', true)
    },
    menuClicked(value) {
      this.viewCategory = value
    }
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
