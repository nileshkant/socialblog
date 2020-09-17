<template>
  <div>
    <v-row>
      <v-col
        sm="12"
        md="3"
        cols="12"
        class="py-0 sidebar"
        :class="showCategories ? '' : 'd-none d-md-block'"
      >
        <sidebar
          @closeCategory="
            showCategories = false
            bottomNav = 1
          "
        />
      </v-col>
      <v-col
        class="pa-0 border-left-grey border-right-grey middle-col ml-auto"
        sm="12"
        md="6"
        cols="12"
      >
        <NuxtChild
          v-if="!showCategories && !isTrending"
          :key="$route.params.id"
          keep-alive
        />
        <div v-if="$route.path === '/' && !showCategories && !isTrending">
          <AllArticleList :articles="articles" :user="user" />
        </div>
        <v-row
          v-if="$route.path === '/' && articles.length === page * pageSize"
          v-show="!showCategories && !isTrending"
          class="mb-14 mb-mb-4 mx-0"
        >
          <v-col cols="auto" class="mx-auto">
            <v-btn @click="loadMore">
              <v-icon class="pr-2">mdi-arrow-down</v-icon>
              Load more
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        sm="12"
        md="3"
        cols="12"
        class="py-0 sidebar"
        :class="isTrending ? '' : 'd-none d-md-block'"
      >
        <v-row>
          <v-col cols="12" class="px-0 py-0 text-right py-2">
            <v-btn icon large @click="drawer">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
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
      <v-bottom-navigation
        v-if="!this.$route.path.startsWith('/article/')"
        v-model="bottomNav"
        shift
        grow
        color="accent"
        class="d-flex d-md-none pos-f"
      >
        <v-btn
          v-for="(menu, index) in bottomMenu"
          :key="index"
          @click="menu.action()"
        >
          <span>{{ menu.title }}</span>
          <v-icon>{{ menu.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-row>
  </div>
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
        pageSize: 10
      })
    }
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      isTrending: false,
      bottomNav: this.$route.path.startsWith('/search') ? 2 : 1,
      showCategories: false,
      prevRoute: null,
      bottomMenu: [
        {
          title: 'Topics',
          icon: 'mdi-format-list-text',
          isActive: () => this.showCategories,
          action: () => {
            this.showCategories = true
            this.isTrending = false
          }
        },
        {
          title: 'Stories',
          icon: 'mdi-post-outline',
          isActive: () =>
            !this.showCategories &&
            !this.isTrending &&
            !this.$route.path.startsWith('/search'),
          action: () => {
            this.showCategories = false
            this.isTrending = false
            if (this.$route.path.startsWith('/search')) {
              this.$router.push(this.prevRoute || '/')
              this.prevRoute = null
            }
          }
        },
        {
          title: 'Search',
          icon: 'mdi-magnify',
          isActive: () =>
            !this.showCategories &&
            !this.isTrending &&
            this.$route.path.startsWith('/search'),
          action: () => {
            this.showCategories = false
            this.isTrending = false
            if (!this.$route.path.startsWith('/search')) {
              this.prevRoute = this.$route.path
              this.$router.push('/search')
            }
          }
        },
        {
          title: 'Highlights',
          icon: 'mdi-trending-up',
          isActive: () => this.isTrending,
          action: () => {
            this.isTrending = true
            this.showCategories = false
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight',
      isDarkMode: 'commonState/isDarkMode',
      titleSection: 'article/titleSection',
      articles: 'article/articles',
      isDrawerOpen: 'commonState/isDrawerOpen',
      user: 'user'
    })
  },
  watch: {
    $route(to, from) {
      if (to.path === '/') {
        this.$store.dispatch('article/getArticles', {
          page: 1,
          pageSize: 30
        })
      }
      if (this.$route.path.startsWith('/search')) {
        this.bottomNav = 2
      }
    }
  },
  mounted() {
    this.$meta().refresh()
    this.$store.dispatch('covid19/covidSummary')
    if (this.user) {
      this.$store.dispatch('userProfile/userAdditionalDetails')
    }
  },
  methods: {
    closeModel() {
      this.overlay = false
    },
    drawer() {
      this.$store.dispatch('commonState/isDrawerOpen', true)
    },
    menuClicked(value) {
      this.viewCategory = value
    },
    async loadMore() {
      this.page = this.page + 1
      await this.$store.dispatch('article/getArticles', {
        page: this.page,
        pageSize: this.pageSize
      })
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
.border-left-grey {
  border-left: 1px solid var(--v-greyAccent-base);
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
.pos-f {
  position: fixed;
}
.sidebar {
  /* position: fixed;
  height: 100%;
  max-width: 295px; */
  position: sticky;
  height: 100%;
  top: 0;
}
</style>
