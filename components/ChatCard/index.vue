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
    <v-card>
      <v-img
        v-if="
          cardcontent &&
            cardcontent.fullDetailsCard &&
            cardcontent.fullDetailsCard.mediaUrl
        "
        :src="
          cardcontent &&
            cardcontent.fullDetailsCard &&
            cardcontent.fullDetailsCard.mediaUrl &&
            transform(cardcontent.fullDetailsCard.mediaUrl, 'q_auto:eco')
        "
        height="200px"
      >
      </v-img>
      <v-img
        v-if="cardcontent && cardcontent.fileURL"
        :src="cardcontent.fileURL"
        height="200px"
      >
      </v-img>
      {{ cardcontent.file }}

      <AuthorAndDate :cardcontent="cardcontent" />

      <div class="title pt-0 px-4">
        {{ cardcontent.fullDetailsCard && cardcontent.fullDetailsCard.title }}
      </div>

      <v-card-subtitle>
        {{
          cardcontent.fullDetailsCard && cardcontent.fullDetailsCard.subtitle
        }}
      </v-card-subtitle>
      <!-- <div class="pl-4">
      <NLink
        v-if="$route.name !== 'index-article-id' && cardcontent._id"
        class="read-more-link"
        :to="
          `/article/${cardcontent._id}?title=${cardcontent.fullDetailsCard.title}`
        "
      >
        Read More...
      </NLink>
    </div> -->
      <div>
        <v-divider
          v-if="
            cardcontent &&
              cardcontent.hashtags &&
              cardcontent.hashtags.length > 0
          "
        ></v-divider>
        <v-row class="mx-2">
          <v-col v-if="cardcontent && cardcontent.hashtags">
            <span
              v-for="(tag, index) in cardcontent.hashtags"
              :key="index"
              class="pr-2"
            >
              <span
                text
                small
                color="primary"
                class="tt-none nlink link"
                @click.stop="
                  $router.push(`/search?search=%23${tag}&type=article`)
                "
              >
                #{{ tag }}
              </span>
            </span>
          </v-col>
        </v-row>
      </div>

      <CardAction
        :cardcontent="cardcontent"
        :share-data="cardcontent._id && shareData()"
        @socialShare="socialModal"
      >
        <v-spacer></v-spacer>
        <v-btn fab small color="primary" @click.stop="show = !show">
          <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </CardAction>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <v-card-text
            v-if="
              cardcontent.fullDetailsCard &&
                !cardcontent.fullDetailsCard.isMarkdown
            "
            class="pb-0"
            v-html="
              cardcontent.fullDetailsCard &&
                cardcontent.fullDetailsCard.articleBody
            "
          >
          </v-card-text>
          <v-card-text
            v-if="
              cardcontent.fullDetailsCard &&
                cardcontent.fullDetailsCard.articleBody &&
                cardcontent.fullDetailsCard.isMarkdown
            "
            class="mdStyle"
            v-html="$md.render(cardcontent.fullDetailsCard.articleBody)"
          ></v-card-text>
          <v-tooltip bottom content-class="caption">
            <template v-slot:activator="{ on }">
              <v-card-text
                class="caption text-truncate text--disabled pt-0"
                v-on="on"
                >Source:
                {{
                  cardcontent.fullDetailsCard &&
                    cardcontent.fullDetailsCard.source
                }}
              </v-card-text>
            </template>
            <span
              >Source:
              {{
                cardcontent.fullDetailsCard &&
                  cardcontent.fullDetailsCard.source
              }}</span
            >
          </v-tooltip>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { cloudinarytransformUrl } from '../../utilities/common'
import CardAction from './commonAction/cardAction'
import AuthorAndDate from './commonAction/authorAndDate'

export default {
  components: {
    CardAction,
    AuthorAndDate
  },
  props: {
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    showfullcard: {
      type: Boolean,
      default: false
    },
    cardcontent: {
      type: Object,
      default: () => {
        return {
          fullDetailsCard: {
            title: 'Top western road trips',
            subtitle: '1,000 miles of wonder',
            imageUrl: null,
            file: null,
            mainArticle: `I'm a thing. But, like most politicians, he promised more than he
          could deliver. You won't have time for sleeping, soldier, not with all
          the bed making you'll be doing. Then we'll go with that data file!
          Hey, you add a one and two zeros to that or we walk! You're going to
          do his laundry? I've got to find a way to escape.`
          }
        }
      }
    }
  },
  data: () => ({
    show: false,
    hoverDelete: false,
    overlay: false,
    socialOverlay: false,
    socialShare: false
  }),
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  mounted() {
    this.show = this.showfullcard
    this.$meta().refresh()
  },
  methods: {
    transform: cloudinarytransformUrl,
    redirectTo() {
      this.$store.commit('article/getSingleArticle', this.cardcontent)
    },
    shareData() {
      const data = {
        url: '/article/' + this.cardcontent._id,
        title: this.cardcontent.fullDetailsCard.title,
        description: this.cardcontent.fullDetailsCard.subtitle,
        quote: this.cardcontent.fullDetailsCard.title,
        hashtags: 'TheOpenStories'
      }
      return data
    },
    linkToPost() {
      if (
        this.$route.name !== 'index-article-id' &&
        this.cardcontent &&
        this.socialShare !== this.cardcontent._id
      ) {
        this.$router.push(
          `/article/${this.cardcontent._id}?title=${
            this.cardcontent.fullDetailsCard &&
            this.cardcontent.fullDetailsCard.title
              ? this.cardcontent.fullDetailsCard.title
              : ''
          }`
        )
      }
    },
    socialModal(data) {
      this.socialShare = data
    }
  }
}
</script>

<style scoped>
.rounded-card {
  border-radius: 10px !important;
}
.no-bdbl {
  border-bottom-left-radius: 0 !important;
}
.bdbl-10 {
  border-bottom-left-radius: 10px;
}
.bdbr-10 {
  border-bottom-right-radius: 10px;
}
.no-bdbr {
  border-bottom-right-radius: 0 !important;
}
.over-h {
  overflow: hidden !important;
}
.tt-none {
  text-transform: none;
}
.nlink {
  text-decoration: none;
  font-weight: bold;
}
.card-height {
  min-height: 250px;
  max-height: 250px;
}
.backgroudColor {
  background-image: radial-gradient(
    circle farthest-corner at 12.3% 19.3%,
    rgba(85, 88, 218, 1) 0%,
    rgba(95, 209, 249, 1) 100.2%
  );
}

.link {
  text-decoration: none;
  background-image: linear-gradient(#37b2b2 50%, #37b2b2 50%);
  background-size: 10000px 1px;
  background-repeat: no-repeat;
  background-position: 0 1em;
  background-position: -10000px 1em;
  cursor: pointer;
  color: var(--v-accent-base);
}
.in-color {
  color: inherit;
}
.l-h4 {
  line-height: 4;
}
.link:hover {
  background-position: 0 1em;
  transition: background-position 2s ease-in-out;
}
.disable-click {
  pointer-events: none;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
