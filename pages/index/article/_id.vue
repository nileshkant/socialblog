<template>
  <client-only>
    <div>
      <v-toolbar flat>
        <v-toolbar-title class="title">{{
          (article && article.categories[0].name) || 'Please select a topic'
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
        :style="{
          'min-height': windowHeight - 66 - editorHeight + 'px',
          'max-height': windowHeight - 66 - editorHeight + 'px'
        }"
        class="overflowY-auto scrollBar"
      >
        <v-row v-if="article" class="mx-0">
          <v-col
            v-if="article.articleType === 'Quote Card'"
            md="8"
            cols="10"
            class="mr-auto"
          >
            <QuoteCard :cardcontent="article"> </QuoteCard>
          </v-col>
          <v-col v-else md="8" cols="10" class="mr-auto">
            <chat-card :cardcontent="article"> </chat-card>
          </v-col>
        </v-row>
        <v-row v-for="comments in allComments" :key="comments._id" class="mx-0">
          <v-col md="8" cols="10" class="ml-auto">
            <MessageCard :cardcontent="comments" />
          </v-col>
        </v-row>
      </div>
      <v-divider />
      <div class="editor-pos">
        <v-card flat class="br-0 px-3">
          <v-img v-if="formdata && formdata.file" :src="formdata.file"></v-img>
          <resize-observer @notify="handleResize" />
          <CommentForm @formData="formUpdate" @onSubmit="onSubmit" />
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

export default {
  components: {
    'chat-card': ChatCard,
    QuoteCard,
    CommentForm,
    MessageCard
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
      user: 'user'
    })
  },
  methods: {
    handleResize({ height }) {
      this.editorHeight = height
    },
    async formUpdate(data) {
      this.formdata = {
        ...data,
        file: data && data.file ? await toBase64(data.file) : null
      }
    },
    onSubmit() {
      const sendForm = { ...this.formdata, articleId: this.$route.params.id }
      this.$store.dispatch('article/postComment', sendForm)
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
.br-0 {
  border-radius: 0 !important;
}
</style>
