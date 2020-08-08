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
        <v-btn
          color="primary"
          text
          outlined
          class="ml-2"
          :to="`/article/${post.id}`"
        >
          View Story
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card
      v-if="post && post.articleType === 'quoteCard'"
      :color="post.quoteCard && post.quoteCard.color"
      :dark="checkColor"
    >
      <v-card-title class="pb-0">
        <span
          class="title font-weight-light"
          :class="!checkColor && 'black--text'"
          >{{ post.quoteCard.title }}</span
        >
      </v-card-title>
      <v-card-text
        class="pt-0 pb-2 caption"
        :class="!checkColor && 'black--text'"
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
        :class="!checkColor && 'black--text'"
        v-html="$md.render(post.quoteCard.quote)"
      ></v-card-text>
      <v-card-actions>
        <v-btn
          v-if="post.isVerified"
          :class="!checkColor && 'black--text'"
          outlined
          text
          :to="`/article/${post.id}`"
        >
          View Story
        </v-btn>
        <v-card-text v-else class="pa-0 caption px-2">
          This Story is blocked!
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-text
          v-if="post.quoteCard && post.quoteCard.source"
          class="caption py-0 text-truncate text-right"
          :class="!checkColor && 'black--text'"
        >
          {{ post.quoteCard.source }}
        </v-card-text>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { lightOrDark } from '../../utilities/common'
export default {
  props: {
    post: {
      type: Object,
      default: null
    }
  },
  computed: {
    checkColor() {
      if (
        this.post.quoteCard &&
        this.post.quoteCard.color &&
        lightOrDark(this.post.quoteCard.color) === 'dark'
      ) {
        return true
      }
      return false
    }
  }
}
</script>

<style></style>
