<template>
  <v-card
    :color="cardcontent.quoteCard && cardcontent.quoteCard.color"
    :class="{
      'black--text': checkColor === 'light',
      'white--text': checkColor === 'dark'
    }"
  >
    <AuthorAndDate :cardcontent="cardcontent" :useTheme="false" />

    <v-card-title class="pt-0">
      <NLink
        :class="!cardcontent._id && 'disable-click'"
        :to="
          `/article/${cardcontent._id}?title=${
            cardcontent.quoteCard && cardcontent.quoteCard.title
              ? cardcontent.quoteCard.title
              : ''
          }`
        "
        class="title font-weight-light link"
        ><span>{{
          cardcontent.quoteCard && cardcontent.quoteCard.title
        }}</span></NLink
      >
    </v-card-title>
    <!-- <v-card-text
      v-if="
        cardcontent.quoteCard &&
          cardcontent.quoteCard.quote &&
          !cardcontent.quoteCard.isMarkdown
      "
      class="font-weight-bold"
      :class="[
        !checkColor && 'black--text',
        cardcontent.quoteCard.quote.length > 300
          ? 'textWrap'
          : 'headline font-weight-bold',
        cardcontent.quoteCard.quote.length > 300 &&
          $route.params.id !== cardcontent._id &&
          'truncate-overflow'
      ]"
    >
      <span v-if="cardcontent.quoteCard.quote.length <= 300">"</span>
      {{ cardcontent.quoteCard.quote.trim() }}
      <span v-if="cardcontent.quoteCard.quote.length <= 300">"</span>
    </v-card-text> -->
    <div
      v-if="cardcontent.quoteCard && cardcontent.quoteCard.quote"
      class="mdStyle px-4"
      :class="[
        cardcontent.quoteCard.quote.length > 300 &&
          $route.params.id !== cardcontent._id &&
          'truncate-overflow'
      ]"
      v-html="$md.render(cardcontent.quoteCard.quote)"
    ></div>
    <div
      v-if="cardcontent.quoteCard && cardcontent.quoteCard.source"
      class="caption py-2 px-4 text-truncate"
    >
      - {{ cardcontent.quoteCard.source }}
    </div>
    <div class="ml-4">
      <span
        v-for="(tag, index) in cardcontent.hashtags"
        :key="index"
        class="pr-2"
      >
        <NLink
          class="tt-none nlink link"
          :to="`/search?search=%23${tag}&type=article`"
          >#{{ tag }}</NLink
        >
      </span>
    </div>
    <CardAction
      :cardcontent="cardcontent"
      :check-color="checkColor"
      :share-data="cardcontent._id && shareData()"
    >
      <v-spacer></v-spacer>
      <div
        v-if="
          cardcontent.quoteCard &&
            cardcontent.quoteCard.quote &&
            cardcontent.quoteCard.quote.length > 300 &&
            $route.params.id !== cardcontent._id
        "
      >
        <NLink
          class="read-more-link"
          :to="
            `/article/${cardcontent._id}?title=${cardcontent.quoteCard.title}`
          "
          >Read more...</NLink
        >
      </div>
    </CardAction>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { lightOrDark } from '../../utilities/common'
import CardAction from './commonAction/cardAction'
import AuthorAndDate from './commonAction/authorAndDate'

export default {
  components: {
    CardAction,
    AuthorAndDate
  },
  props: {
    cardcontent: {
      type: Object,
      default: () => {
        return {
          quoteCard: {
            title: 'Top western road trips',
            quote: '1,000 miles of wonder',
            source: 'Me',
            color: '#cccccc'
          }
        }
      }
    }
  },
  computed: {
    checkColor() {
      let color = 'noColor'
      if (this.cardcontent.quoteCard) {
        if (lightOrDark(this.cardcontent.quoteCard.color) === 'dark') {
          color = 'dark'
        } else if (lightOrDark(this.cardcontent.quoteCard.color) === 'light') {
          color = 'light'
        } else {
          color = 'noColor'
        }
      }
      return color
    },
    ...mapGetters({
      user: 'user',
      bookmarks: 'article/bookmarks'
    })
  },
  methods: {
    shareData() {
      const data = {
        url: '/article/' + this.cardcontent._id,
        title: this.cardcontent.quoteCard.quote,
        description: this.cardcontent.quoteCard.quote,
        quote: this.cardcontent.quoteCard.quote,
        hashtags: ''
      }
      return data
    }
  }
}
</script>

<style scoped>
.l-h4 {
  line-height: 4;
}
.link {
  text-decoration: none;
  background-image: linear-gradient(#37b2b2 50%, #37b2b2 50%);
  background-size: 10000px 1px;
  background-repeat: no-repeat;
  background-position: 0 1.2em;
  background-position: -10000px 1.2em;
  cursor: pointer;
  color: inherit;
}
.link:hover {
  background-position: 0 1.2em;
  transition: background-position 2s ease-in-out;
}
.disable-click {
  pointer-events: none;
}
.textWrap {
  white-space: pre-line;
}
.truncate-overflow {
  max-height: calc(1.375rem * 6) !important;
  overflow: hidden;
}
</style>
