<template>
  <div>
    <v-toolbar v-if="!removeToolbar" flat>
      <v-btn icon large class="d-flex d-md-none" to="/">
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>
      <v-toolbar-title class="title pl-0">{{
        titleSection || 'Sorry no content found'
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/search">
        <v-icon>
          mdi-magnify
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
      <v-row
        v-for="(article, index) in articles"
        :key="article._id"
        class="mx-0"
      >
        <v-col
          v-if="article.articleType === 'quoteCard' && article.quoteCard"
          md="8"
          cols="10"
          :class="{ 'ml-auto': index % 2 === 0 }"
        >
          <QuoteCard :cardcontent="article"> </QuoteCard>
        </v-col>
        <v-col
          v-if="
            article.articleType === 'fullDetailsCard' && article.fullDetailsCard
          "
          md="8"
          cols="10"
          :class="{ 'ml-auto': index % 2 === 0 }"
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
import AllCommentList from '~/components/AllCommentList'
export default {
  components: {
    'chat-card': ChatCard,
    QuoteCard,
    AllCommentList
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
    }
  },
  data() {
    return {
      autoRight: true
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
    }, 500)
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
