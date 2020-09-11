<template>
  <div
    :class="
      $route.name === 'index-article-id' ||
      (cardcontent && socialShare === cardcontent._id)
        ? ''
        : 'cursor-pointer'
    "
    @click="linkToPost"
  >
    <v-card
      :color="cardcontent.quoteCard && cardcontent.quoteCard.color"
      :class="{
        'black--text': checkColor === 'light',
        'white--text': checkColor === 'dark'
      }"
    >
      <AuthorAndDate :cardcontent="cardcontent" :use-theme="false" />

      <v-card-title class="pt-0">
        <span class="title">{{
          cardcontent.quoteCard && cardcontent.quoteCard.title
        }}</span>
      </v-card-title>
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
          <span
            class="tt-none nlink link"
            @click.stop="$router.push(`/search?search=%23${tag}&type=article`)"
            >#{{ tag }}
          </span>
        </span>
      </div>
      <CardAction
        :cardcontent="cardcontent"
        :check-color="checkColor"
        :share-data="cardcontent._id && shareData()"
        @socialShare="socialModal"
      >
        <v-spacer></v-spacer>
        <div
          v-if="
            cardcontent.quoteCard &&
              cardcontent.quoteCard.quote &&
              cardcontent.quoteCard.quote.length > 300 &&
              $route.params.id !== cardcontent._id
          "
        ></div>
      </CardAction>
    </v-card>
  </div>
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
  data() {
    return {
      socialShare: false
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
    },
    socialModal(data) {
      this.socialShare = data
    },
    linkToPost() {
      if (
        this.$route.name !== 'index-article-id' &&
        this.cardcontent &&
        this.socialShare !== this.cardcontent._id
      ) {
        this.$router.push(
          `/article/${this.cardcontent._id}?title=${
            this.cardcontent.quoteCard && this.cardcontent.quoteCard.title
              ? this.cardcontent.quoteCard.title
              : ''
          }`
        )
      }
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
.cursor-pointer {
  cursor: pointer;
}
</style>
