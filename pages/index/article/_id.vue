<template>
  <client-only>
    <div>
      <v-toolbar flat>
        <v-btn icon large class="d-flex d-md-none" to="/">
          <v-icon>mdi-home-outline</v-icon>
        </v-btn>
        <v-toolbar-title class="title pl-0">{{
          titleSection || 'Please select a topic'
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          v-if="user && user.userDetails.role != user"
          color="accent"
          to="/create-post"
        >
          + Article
        </v-btn>
        <v-btn icon large>
          <v-icon>mdi-bookmark-check-outline</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <div
        id="articleContainer"
        :style="{
          'min-height': windowHeight - 66 - editorHeight + 'px',
          'max-height': windowHeight - 66 - editorHeight + 'px'
        }"
        class="overflowY-auto scrollBar"
      >
        <v-row v-if="article" class="mx-0">
          <v-col
            v-if="article.articleType === 'quoteCard'"
            md="8"
            cols="10"
            class="mr-auto"
          >
            <QuoteCard :cardcontent="article"> </QuoteCard>
          </v-col>
          <v-col v-else md="8" cols="10" class="mr-auto">
            <chat-card :cardcontent="article" showfullcard> </chat-card>
          </v-col>
        </v-row>
        <v-row v-for="comments in allComments" :key="comments._id" class="mx-0">
          <v-col
            md="8"
            cols="10"
            :class="
              (user &&
                (user.userDetails._id === comments.commentor._id ||
                  user.userDetails._id === comments.commentor) &&
                'ml-auto') ||
                'mr-auto'
            "
          >
            <MessageCard :cardcontent="comments" />
          </v-col>
        </v-row>
      </div>
      <v-divider />
      <div class="editor-pos">
        <v-card flat class="br-0 px-3">
          <v-btn
            v-if="replyComment"
            class="mx-2 right-menu pos-a"
            icon
            small
            @click="removeReply"
            ><v-icon small>mdi-close</v-icon>
          </v-btn>
          <ReplyCard v-if="replyComment" :replycontent="replyComment" />
          <v-img v-if="formdata && formdata.file" :src="formdata.file"></v-img>
          <resize-observer @notify="handleResize" />
          <CommentForm
            v-if="user && user.userDetails && isAllowed()"
            @formData="formUpdate"
            @onSubmit="onSubmit"
          />
          <v-row v-else-if="user">
            <v-col class="pa-0">
              <v-card-text color="accent" class="subtitle-1 text--disabled">
                <resize-observer @notify="handleResize" />
                Thank you for your contribution
                <div class="caption text--disabled">
                  You can comment only once
                </div>
              </v-card-text>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col class="pa-0">
              <v-card-text color="accent" class="subtitle-1 text--disabled">
                <resize-observer @notify="handleResize" />
                Login to Comment
              </v-card-text>
            </v-col>
            <v-col cols="auto">
              <v-btn class="accent" type="button" @click="loginPopUp">
                Login
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import { toBase64 } from '~/utilities/common'
import ChatCard from '~/components/ChatCard'
import QuoteCard from '~/components/ChatCard/QuoteCard'
import CommentForm from '~/components/CommentForm'
import MessageCard from '~/components/ChatCard/MessageCard'
import ReplyCard from '~/components/ChatCard/ReplyCard'

export default {
  components: {
    'chat-card': ChatCard,
    QuoteCard,
    CommentForm,
    MessageCard,
    ReplyCard
  },
  async fetch({ store, params, route }) {
    await store.dispatch('article/getSingleArticle', route.params.id)
    await store.dispatch('article/getComments', { articleId: route.params.id })
  },
  data() {
    return {
      autoRight: true,
      editorHeight: 0,
      comment: '',
      formdata: null
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight',
      article: 'article/singleArticle',
      allComments: 'article/allComments',
      user: 'user',
      titleSection: 'article/titleSection',
      replyComment: 'commonState/replyComment'
    })
  },
  watch: {
    article(newValue) {
      if (!newValue) {
        this.$router.replace({ path: '/' })
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('commonState/replyComment', null)
    this.formdata = null
    next()
  },
  mounted() {
    this.$meta().refresh()
  },
  methods: {
    handleResize({ height }) {
      this.editorHeight = height
    },
    isAllowed() {
      if (this.article.articleType === 'quoteCard') return false
      if (this.user.userDetails.role === 'admin') return true
      if (this.article.author._id === this.user.userDetails._id) return true
      const filterComment = this.allComments.filter((comment) => {
        return comment.commentor._id === this.user.userDetails._id
      })
      if (filterComment.length >= 1) {
        return false
      } else {
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
      const container = this.$el.querySelector('#articleContainer')
      container.scrollTop = container.scrollHeight
    },
    removeReply() {
      this.$store.dispatch('commonState/replyComment', null)
    }
  }
}
</script>

<style scoped>
.pos-r {
  position: relative;
}
.pos-a {
  position: absolute;
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
</style>
