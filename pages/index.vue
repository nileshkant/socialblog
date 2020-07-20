<template>
  <v-row>
    <v-col
      sm="12"
      md="3"
      cols="12"
      class="py-0 border-right-grey"
      :class="showCategories ? '' : 'd-none d-md-block'"
    >
      <sidebar
        @closeCategory="
          showCategories = false
          bottomNav = 1
        "
      />
    </v-col>
    <v-col class="pa-0 border-right-grey middle-col" sm="12" md="6" cols="12">
      <NuxtChild
        v-if="!showCategories && !isTrending"
        :key="$route.params.id"
        keep-alive
      />
      <div v-if="$route.path === '/' && !showCategories && !isTrending">
        <AllArticleList :articles="articles" :user="user" />
      </div>
    </v-col>
    <v-col
      sm="12"
      md="3"
      cols="12"
      class="py-0"
      :class="isTrending ? '' : 'd-none d-md-block'"
    >
      <v-row>
        <v-col cols="12" class="px-0 py-0">
          <v-toolbar flat>
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
.pos-f {
  position: fixed;
}
</style>
