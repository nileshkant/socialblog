<template>
  <div>
    <v-app-bar elevate-on-scroll class="pos-sticky app-bar">
      <v-btn icon large class="d-flex d-md-none" to="/">
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>
      <v-avatar
        v-if="
          titleSection.user &&
            titleSection.user.facebook &&
            article.articleType !== 'movieReviewCard'
        "
        size="40"
        class="mr-3"
      >
        <img
          :src="
            `https://graph.facebook.com/${titleSection.user.facebook.id}/picture?type=square`
          "
        />
      </v-avatar>
      <div v-if="article.articleType !== 'movieReviewCard'">
        <div
          class="py-0 title"
          :class="user && 'primary--text pointer'"
          @click="profileVisit"
        >
          {{
            (titleSection &&
              titleSection.user &&
              ((titleSection.user.facebook &&
                titleSection.user.facebook.displayName) ||
                titleSection.user.username)) ||
              'Please select a topic'
          }}
        </div>
        <div class="caption text--secondary">{{ titleSection.title }}</div>
      </div>
      <div v-if="article.articleType === 'movieReviewCard'" class="title">
        {{ article.movieReviewCard.Title }} -
        <span class="text--secondary">{{ article.movieReviewCard.Year }}</span>
      </div>
    </v-app-bar>
    <v-divider />
    <div id="articleContainer" class="overflowY-auto scrollBar">
      <v-row v-if="article" class="mx-0">
        <v-col v-if="article.articleType === 'quoteCard'" cols="12">
          <QuoteCard :cardcontent="article"> </QuoteCard>
        </v-col>
        <v-col v-if="article.articleType === 'movieReviewCard'" cols="12">
          <MovieCard :cardcontent="article" />
        </v-col>
        <v-col v-if="article.articleType === 'fullDetailsCard'" cols="12">
          <chat-card :cardcontent="article" showfullcard> </chat-card>
        </v-col>
      </v-row>
      <div class="text-line my-3 caption text--disabled">
        Scroll down for more details
      </div>
      <AllCommentList
        :user="user"
        :all-comments="allComments"
        :is-twitter-loaded="isTwitterLoaded"
        :comment-disable="commentDisable"
      />
    </div>
    <v-btn
      fab
      dark
      color="accent"
      class="pos-f action-button d-block d-md-none"
      @click="writeComment"
    >
      <v-icon dark>mdi-pencil</v-icon>
    </v-btn>
    <v-row class="mx-0 pos-sticky footer d-none d-md-flex">
      <v-col cols="auto" class="mx-auto">
        <v-btn dark color="accent" @click="writeComment">
          <v-icon dark class="pr-2">mdi-pencil</v-icon>
          Write Comment
        </v-btn>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" :dark="isDarkMode">
      <div class="editor-pos overlay">
        <v-toolbar>
          <v-toolbar-title>Write your comment</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon @click="overlay = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-btn
          v-if="replyComment"
          class="right-menu pos-a"
          icon
          small
          @click="removeReply"
          ><v-icon small>mdi-close</v-icon>
        </v-btn>
        <v-sheet class="h-100">
          <v-row class="ma-0 h-100">
            <v-col cols="11" md="auto" class="ma-auto">
              <ReplyCard v-if="replyComment" :replycontent="replyComment" />
              <div v-if="user && user.userDetails && isAllowed()">
                <CommentFormMD @formData="formUpdate" @onSubmit="onSubmit" />
              </div>
            </v-col>
          </v-row>
        </v-sheet>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import storyHeader from './headerData'
import { toBase64 } from '~/utilities/common'
import ChatCard from '~/components/ChatCard'
import AllCommentList from '~/components/AllCommentList'
import QuoteCard from '~/components/ChatCard/QuoteCard'
// import CommentForm from '~/components/CommentForm'
import ReplyCard from '~/components/ChatCard/ReplyCard'
import MovieCard from '~/components/ChatCard/MovieCard'
import CommentFormMD from '~/components/CommentFormMD'
// import LoadingSkeleton from '~/components/LoadingSkeleton'

export default {
  components: {
    'chat-card': ChatCard,
    QuoteCard,
    // CommentForm,
    AllCommentList,
    ReplyCard,
    MovieCard,
    CommentFormMD
    // LoadingSkeleton
  },
  async fetch({ store, params, route, redirect }) {
    try {
      await store.dispatch('article/getSingleArticle', route.params.id)
      await store.dispatch('article/getComments', {
        articleId: route.params.id
      })
    } catch (err) {
      redirect('/')
    }
  },
  data() {
    return {
      autoRight: true,
      editorHeight: 0,
      comment: '',
      formdata: null,
      isTwitterLoaded: false,
      commentDisable: false,
      overlay: false
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight',
      article: 'article/singleArticle',
      allComments: 'article/allComments',
      user: 'user',
      titleSection: 'article/titleSection',
      replyComment: 'commonState/replyComment',
      contentLoading: 'article/contentLoading',
      isDarkMode: 'commonState/isDarkMode'
    })
  },
  watch: {
    article(newValue) {
      if (!newValue) {
        this.$router.replace({ path: '/' })
      }
    },
    replyComment(newVal) {
      if (newVal) {
        this.overlay = true
      }
    }
  },
  mounted() {
    this.$meta().refresh()
  },
  methods: {
    handleResize({ height }) {
      this.editorHeight = height
    },
    isAllowed() {
      if (this.user.userDetails.role === 'admin') return true
      if (
        this.article.author._id === this.user.userDetails._id &&
        this.article.articleType !== 'movieReviewCard'
      )
        return true
      const filterComment = this.allComments.filter((comment) => {
        return (
          comment.commentor === this.user.userDetails._id ||
          comment.commentor._id === this.user.userDetails._id
        )
      })

      if (filterComment.length >= 1) {
        this.commentDisable = true
        return false
      } else {
        this.commentDisable = false
        return true
      }
    },
    async formUpdate(data) {
      this.formdata = {
        ...data,
        file: data && data.file ? await toBase64(data.file) : null
      }
    },
    loginPopUp() {
      this.$store.dispatch('commonState/loginPopUp')
    },
    async onSubmit() {
      if (this.replyComment) {
        this.formdata.replyComment = this.replyComment._id
      }
      const sendForm = { ...this.formdata, articleId: this.$route.params.id }
      await this.$store.dispatch('article/postComment', sendForm)
      this.overlay = false
      window.scrollTo(
        0,
        document.body.scrollHeight || document.documentElement.scrollHeight
      )
      // const container = this.$el.querySelector('#articleContainer')
      // container.scrollTop = container.scrollHeight
    },
    removeReply() {
      this.$store.dispatch('commonState/replyComment', null)
    },
    profileVisit() {
      if (this.user && this.user.userDetails) {
        this.$router.push(
          `/profile/${this.titleSection &&
            this.titleSection.user &&
            this.titleSection.user._id}`
        )
      }
    },
    writeComment() {
      if (!this.user) {
        this.loginPopUp()
      } else {
        this.overlay = true
      }
    }
  },
  head() {
    return {
      ...storyHeader(this.article),
      script: [
        {
          src: '//platform.twitter.com/widgets.js',
          async: true,
          defer: true,
          callback: () => {
            this.isTwitterLoaded = true
          }
        }
      ]
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('commonState/replyComment', null)
    this.formdata = null
    next()
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.right-menu {
  right: 0;
  top: 0;
  z-index: 1;
}
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
.br-0 {
  border-radius: 0 !important;
}
.text-line {
  overflow: hidden;
  text-align: center;
}

.text-line:before,
.text-line:after {
  background-color: var(--v-greyAccent-base);
  content: '';
  display: inline-block;
  height: 1px;
  position: relative;
  vertical-align: middle;
  width: 50%;
}

.text-line:before {
  right: 0.5em;
  margin-left: -50%;
}

.text-line:after {
  left: 0.5em;
  margin-right: -50%;
}

.action-button {
  bottom: 20px;
  right: 20px;
}
.app-bar {
  top: 0;
  z-index: 1;
}
.footer {
  bottom: 0;
  z-index: 1;
}
@media screen and (max-width: 960px) {
  .overlay {
    height: 100vh;
    width: 100vw;
  }
  .h-100 {
    height: 100%;
  }
}
</style>
