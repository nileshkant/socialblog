<template>
  <div>
    <v-row
      v-for="comments in allComments"
      :ref="comments._id"
      :key="comments._id"
      class="mx-0"
    >
      <v-col
        v-if="!comments.reportedBy || comments.reportedBy.length < 4"
        cols="auto"
        class="message-card"
        :class="
          (user &&
            (user.userDetails._id === comments.commentor._id ||
              user.userDetails._id === comments.commentor) &&
            'ml-auto') ||
            'mr-auto'
        "
      >
        <MessageCard
          v-if="
            comments.embedUrl &&
              comments.embedUrl.provider_name === 'Twitter' &&
              isTwitterLoaded
          "
          :show-article-link="showArticleLink"
          :cardcontent="comments"
          :comment-disabled="commentDisable"
        />
        <MessageCard
          v-else
          :show-article-link="showArticleLink"
          :cardcontent="comments"
          :comment-disabled="commentDisable"
        />
      </v-col>
      <v-col
        v-if="
          user &&
            comments &&
            comments.commentor._id === user.userDetails._id &&
            comments.reportedBy &&
            comments.reportedBy.length > 3
        "
        cols="auto"
        class="message-card"
        :class="
          (user &&
            (user.userDetails._id === comments.commentor._id ||
              user.userDetails._id === comments.commentor) &&
            'ml-auto') ||
            'mr-auto'
        "
      >
        <v-card class="pa-3" color="error">
          <v-card-text class="pa-0">
            This comment is reported by some users!
          </v-card-text>
          <v-card-text class="caption pa-0">
            We are reviewing it!
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MessageCard from '~/components/ChatCard/MessageCard'
export default {
  components: {
    MessageCard
  },
  props: {
    allComments: {
      type: Array,
      default: null
    },
    user: {
      type: Object,
      default: null
    },
    showArticleLink: {
      type: Boolean,
      default: false
    },
    isTwitterLoaded: {
      type: Boolean,
      default: false
    },
    commentDisable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.$route.hash) {
      const element = this.$refs[this.$route.hash.replace('#', '')][0]
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.message-card {
  max-width: 90%;
}
</style>
