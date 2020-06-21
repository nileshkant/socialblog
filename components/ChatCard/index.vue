<template>
  <v-card>
    <v-overlay absolute :opacity="0.7" :value="overlay === cardcontent._id">
      <v-btn class="mr-2" @click.stop.prevent="overlay = false">
        Cancel
      </v-btn>
      <v-btn color="error" class="ml-2" @click.stop.prevent="deleteArticle">
        Delete!
      </v-btn>
    </v-overlay>
    <v-overlay
      v-if="cardcontent._id"
      absolute
      :opacity="0.85"
      :value="socialOverlay === cardcontent._id"
    >
      <div class="text-center l-h4">
        <SocialShare :social-share-data="shareData()" />
      </div>
      <div class="text-center l-h4">
        <v-btn
          fab
          dark
          small
          color="error"
          @click.stop.prevent="socialOverlay = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-overlay>
    <NLink
      :to="'/article/' + cardcontent._id"
      :event="overlay || !cardcontent._id ? '' : 'click'"
      class="link"
    >
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
    </NLink>
    {{ cardcontent.file }}
    <v-card-text
      v-if="cardcontent.createdDate"
      class="caption pb-0 text--secondary text-truncate"
    >
      {{
        $dateFns.formatDistanceToNow(new Date(cardcontent.createdDate), {
          addSuffix: true
        })
      }}
      <span
        >-
        {{
          cardcontent.author.username || cardcontent.author.facebook.displayName
        }}</span
      >
    </v-card-text>
    <div class="title pt-0 px-4">
      <NLink
        :class="!cardcontent._id && 'disable-click'"
        :to="'/article/' + cardcontent._id"
        class="link in-color"
        @click.native="redirectTo"
      >
        {{ cardcontent.fullDetailsCard && cardcontent.fullDetailsCard.title }}
      </NLink>
    </div>

    <v-card-subtitle>
      {{ cardcontent.fullDetailsCard && cardcontent.fullDetailsCard.subtitle }}
    </v-card-subtitle>
    <div class="ml-4">
      <span
        v-for="(tag, index) in cardcontent.hashtags"
        :key="index"
        class="pr-2"
      >
        <NLink
          text
          small
          color="primary"
          class="tt-none nlink link"
          :to="`/search?search=%23${tag}&type=article`"
          >#{{ tag }}</NLink
        >
      </span>
    </div>
    <v-card-actions>
      <v-btn icon :disabled="!cardcontent._id" @click="likeArticle">
        <v-icon v-if="likes" color="error">mdi-heart</v-icon>
        <v-icon v-else>mdi-heart-outline</v-icon>
      </v-btn>
      <div
        v-if="cardcontent.likes && cardcontent.likes.length > 0"
        class="text--disabled mr-2"
      >
        {{ cardcontent.likes && cardcontent.likes.length }}
      </div>

      <v-btn icon :disabled="!cardcontent._id" @click="bookmarkArticle">
        <v-icon v-if="isBookmarked">mdi-bookmark-check</v-icon>
        <v-icon v-else>mdi-bookmark-plus-outline</v-icon>
      </v-btn>

      <div
        v-if="cardcontent._id && (cardcontent.views || cardcontent.newViews)"
        class="ml-2"
      >
        <span>
          {{ cardcontent.views + (cardcontent.newViews || 0) }}
        </span>
        <span class="caption">
          Views
        </span>
      </div>

      <v-menu v-if="cardcontent._id" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-if="cardcontent._id" class="mx-2" icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <div v-for="(menu, index) in dropDown" :key="index" class="py-0">
            <v-list-item
              v-if="
                (menu.title === 'Delete' &&
                  user &&
                  cardcontent.author &&
                  cardcontent.author._id === user.userDetails._id) ||
                  (user &&
                    user.userDetails &&
                    user.userDetails.role === 'admin') ||
                  menu.title !== 'Delete'
              "
              @click="onClickdropDownMenu(menu, cardcontent._id)"
            >
              <v-icon>{{ menu.icon }}</v-icon>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item>
          </div>
        </v-list>
      </v-menu>

      <v-spacer></v-spacer>
      <v-btn fab small color="primary" @click="show = !show">
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text
          class="pb-0"
          v-html="
            cardcontent.fullDetailsCard &&
              cardcontent.fullDetailsCard.articleBody
          "
        >
        </v-card-text>
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
              cardcontent.fullDetailsCard && cardcontent.fullDetailsCard.source
            }}</span
          >
        </v-tooltip>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import SocialShare from '../SocialShareButtons'
import { cloudinarytransformUrl } from '../../utilities/common'
export default {
  components: {
    SocialShare
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
    dropDown: [
      {
        title: 'Share',
        icon: 'mdi-share-outline'
      },
      {
        title: 'Delete',
        icon: 'mdi-delete-outline'
      }
    ]
  }),
  computed: {
    ...mapGetters({
      user: 'user',
      bookmarks: 'article/bookmarks'
    }),
    likes() {
      if (!this.user) {
        return false
      }
      if (
        !this.cardcontent ||
        !this.cardcontent.likes ||
        (this.cardcontent.likes && this.cardcontent.likes.length === 0)
      )
        return false
      const userLiked = this.cardcontent.likes.filter((value) => {
        return value.likedBy === this.user.userDetails._id
      })
      if (userLiked && userLiked.length > 0) {
        return true
      } else {
        return false
      }
    },
    isBookmarked() {
      const bookmarked =
        this.bookmarks &&
        this.bookmarks.length > 0 &&
        this.bookmarks.find((value) => {
          return this.cardcontent._id === value._id
        })
      if (bookmarked) {
        return true
      } else {
        return false
      }
    }
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
    deleteArticle() {
      this.$store.dispatch('article/deleteArticle', this.cardcontent._id)
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
    onClickdropDownMenu(data, id) {
      if (data.title === 'Delete') {
        this.overlay = id
      }
      if (data.title === 'Share') {
        this.socialOverlay = id
      }
    },
    bookmarkArticle() {
      this.$store.dispatch('article/bookmarkArticle', this.cardcontent)
    },
    likeArticle() {
      if (this.user) {
        this.$store.dispatch('article/likeArticle', this.cardcontent._id)
      } else {
        this.$store.dispatch('commonState/loginPopUp')
      }
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
</style>
