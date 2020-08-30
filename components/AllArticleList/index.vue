<template>
  <div>
    <v-toolbar v-if="!removeToolbar" flat>
      <span
        ><v-img
          :src="icon"
          max-height="22"
          max-width="45"
          contain
          class="pointer d-flex d-md-none"
          @click="$router.push({ path: `/` })"
        ></v-img
      ></span>
      <v-toolbar-title class="title ml-md-0 pl-0 ml-3">{{
        (titleSection && titleSection.title) || 'Sorry no content found'
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon class="d-none d-md-flex" to="/search">
        <v-icon>
          mdi-magnify
        </v-icon>
      </v-btn>
      <v-btn icon class="d-flex d-md-none" @click="openMenu">
        <v-icon>
          mdi-menu
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <div
      id="articleContainer"
      :style="{
        'min-height': windowHeight - 66 + 'px',
        'max-height': windowHeight - 66 + 'px'
      }"
      class="overflowY-auto scrollBar"
      @scroll="ondivScroll"
    >
      <NoRecords
        v-if="
          apiCalled &&
            articles &&
            articles.length === 0 &&
            allComments &&
            allComments.length === 0
        "
      />
      <v-row
        v-for="(article, index) in articles"
        :key="article._id"
        class="mx-0"
        :class="index === articles.length - 1 && 'mb-12 mb-md-2'"
      >
        <v-col
          v-if="article.articleType === 'quoteCard' && article.quoteCard"
          cols="12"
          class="mx-auto"
        >
          <QuoteCard :cardcontent="article"> </QuoteCard>
        </v-col>
        <v-col
          v-if="
            article.articleType === 'movieReviewCard' && article.movieReviewCard
          "
          cols="12"
          class="mx-auto"
        >
          <MovieCard :cardcontent="article" />
        </v-col>
        <v-col
          v-if="
            article.articleType === 'fullDetailsCard' && article.fullDetailsCard
          "
          cols="12"
          class="mx-auto"
        >
          <chat-card :cardcontent="article"> </chat-card>
        </v-col>
      </v-row>
      <AllCommentList
        v-if="allComments"
        :user="user"
        :all-comments="allComments"
        :show-article-link="showArticleLink"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import ChatCard from '~/components/ChatCard'
import QuoteCard from '~/components/ChatCard/QuoteCard'
import MovieCard from '~/components/ChatCard/MovieCard'
import AllCommentList from '~/components/AllCommentList'
import NoRecords from '~/components/NoRecords'
import icon from '~/static/images/TOSIcon.png'

export default {
  components: {
    'chat-card': ChatCard,
    QuoteCard,
    MovieCard,
    AllCommentList,
    NoRecords
  },
  props: {
    articles: {
      type: Array,
      default: null
    },
    user: {
      type: Object,
      default: null
    },
    allComments: {
      type: Array,
      default: null
    },
    removeToolbar: {
      type: Boolean,
      default: false
    },
    showArticleLink: {
      type: Boolean,
      default: false
    },
    apiCalled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      autoRight: true,
      icon
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight',
      titleSection: 'article/titleSection'
    })
  },
  mounted() {
    this.$meta().refresh()
    // const container = this.$el.querySelector('#articleContainer')
    // if (container && !this.showArticleLink) {
    //   setTimeout(() => {
    //     container.scrollTop = container.scrollHeight
    //   }, 0)
    // }
  },
  methods: {
    ondivScroll: debounce(function(e) {
      this.$emit('scrolled', {
        scrolledTop: e.target.scrollTop,
        totalHeight: e.target.scrollHeight
      })
    }, 500),
    openMenu() {
      this.$store.dispatch('commonState/isDrawerOpen', true)
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
