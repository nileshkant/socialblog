<template>
  <div>
    <v-card
      v-if="post && post.articleType === 'fullDetailsCard'"
      class="mx-auto"
    >
      <v-img height="250" :src="post.fullDetailsCard.mediaUrl"></v-img>
      <v-card-title class="title pb-0">{{
        post.fullDetailsCard.title
      }}</v-card-title>
      <v-card-text class="pt-0 caption">
        {{
          $dateFns.formatDistanceToNow(new Date(post.createdDate), {
            addSuffix: true
          })
        }}</v-card-text
      >
      <div class="px-4">
        {{ post.fullDetailsCard.subtitle }}
      </div>

      <v-card-actions>
        <v-btn text outlined class="ml-2" :to="`/article/${post.id}`">
          View Story
        </v-btn>
        <v-btn
          v-if="user && user.userDetails._id === post.author && post.isVerified"
          title="Repost Story"
          icon
          @click="repostStory(post._id)"
        >
          <v-icon :color="checkRepost ? '' : 'red'">mdi-twitter-retweet</v-icon>
        </v-btn>
        <v-card-text v-if="!post.isVerified" class="pa-0 caption px-2">
          This Story is blocked!
        </v-card-text>
      </v-card-actions>
    </v-card>
    <v-card
      v-if="post && post.articleType === 'quoteCard'"
      :color="post.quoteCard && post.quoteCard.color"
      :class="{
        'black--text': checkColor === 'light',
        'white--text': checkColor === 'dark'
      }"
    >
      <v-card-title class="pb-0">
        <span class="title font-weight-light">{{ post.quoteCard.title }}</span>
      </v-card-title>
      <v-card-text
        class="pt-0 pb-2 caption"
        :class="{
          'black--text': checkColor === 'light',
          'white--text': checkColor === 'dark'
        }"
      >
        {{
          $dateFns.formatDistanceToNow(new Date(post.createdDate), {
            addSuffix: true
          })
        }}</v-card-text
      >
      <!-- <v-card-text
        v-if="post.quoteCard.quote"
        class="headline font-weight-bold"
        :class="!checkColor && 'black--text'"
      >
        " {{ post.quoteCard.quote }} "
      </v-card-text> -->
      <v-card-text
        v-if="post.quoteCard.quote"
        class="mdStyle"
        :class="{
          'black--text': checkColor === 'light',
          'white--text': checkColor === 'dark'
        }"
        v-html="$md.render(post.quoteCard.quote)"
      ></v-card-text>
      <v-card-actions>
        <v-btn
          v-if="post.isVerified"
          :color="
            checkColor === 'light'
              ? 'black'
              : checkColor === 'dark'
              ? 'white'
              : ''
          "
          :dark="checkColor === 'dark'"
          outlined
          text
          :to="`/article/${post.id}`"
        >
          View Story
        </v-btn>
        <v-btn
          v-if="user && user.userDetails._id === post.author && post.isVerified"
          title="Repost Story"
          icon
          @click="repostStory(post._id)"
        >
          <v-icon :color="checkRepost ? '' : 'red'">mdi-twitter-retweet</v-icon>
        </v-btn>
        <v-card-text v-if="!post.isVerified" class="pa-0 caption px-2">
          This Story is blocked!
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-text
          v-if="post.quoteCard && post.quoteCard.source"
          class="caption py-0 text-truncate text-right"
        >
          {{ post.quoteCard.source }}
        </v-card-text>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { lightOrDark } from '../../utilities/common'

export default {
  props: {
    post: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    }),
    checkColor() {
      let color = 'noColor'
      if (this.post.quoteCard) {
        if (lightOrDark(this.post.quoteCard.color) === 'dark') {
          color = 'dark'
        } else if (lightOrDark(this.post.quoteCard.color) === 'light') {
          color = 'light'
        } else {
          color = 'noColor'
        }
      }
      return color
    },
    checkRepost() {
      if (
        this.$dateFns.differenceInDays(
          new Date(),
          new Date(this.post.modifiedDate)
        ) >= 2
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    repostStory(id) {
      if (this.checkRepost) {
        const articleId = { articleId: id }
        this.$store.dispatch('userProfile/repostStory', articleId)
      }
    }
  }
}
</script>

<style></style>
