<template>
  <div>
    <v-overlay v-if="overlayImage" :value="overlayImage">
      <v-img
        v-click-outside="() => (overlayImage = false)"
        :src="transform(overlayImage, 'q_auto:eco')"
        max-height="80vh"
        opacity="0.80"
        max-width="90vw"
        contain
      >
        <v-btn
          fab
          small
          color="error"
          absolute
          class="closeBtn"
          @click="overlayImage = false"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-img>
    </v-overlay>
    <v-card class="pos-r pa-3 pt-5">
      <v-overlay absolute :opacity="0.7" :value="overlay === cardcontent._id">
        <v-btn class="mr-2" @click.stop.prevent="overlay = false">
          Cancel
        </v-btn>
        <v-btn color="error" class="ml-2" @click.stop.prevent="deleteComment">
          Delete!
        </v-btn>
      </v-overlay>
      <v-menu v-if="user" left open-on-hover offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="cardcontent._id"
            class="mx-2 right-menu pos-a zi-1"
            icon
            small
            v-on="on"
          >
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="py-0">
          <div
            v-for="(menu, index) in dropDown"
            :key="index"
            class="py-0 caption"
          >
            <v-list-item
              v-if="menu.permission()"
              class="minh-auto py-1 pos-r"
              @click="onClickdropDownMenu(menu, cardcontent._id)"
            >
              <v-icon>{{ menu.icon }}</v-icon>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item>
          </div>
        </v-list>
      </v-menu>
      <ReplyCard
        v-if="cardcontent.replyComment"
        :replycontent="cardcontent.replyComment"
      />
      <EmbedCard
        v-if="cardcontent.embedUrl && !cardcontent.embedUrl.embedJson"
        :embed-data="cardcontent.embedUrl"
      />
      <div
        v-if="cardcontent && cardcontent.mediaUrl"
        @click="onImageClick(cardcontent.mediaUrl)"
      >
        <v-img
          :src="transform(cardcontent.mediaUrl, 'q_auto:eco')"
          height="200px"
        >
        </v-img>
      </div>
      <div
        v-if="cardcontent.embedUrl && cardcontent.embedUrl.embedJson"
        v-html="htmlContent()"
      ></div>
      <v-card-text
        v-if="cardcontent && cardcontent.textComment && !cardcontent.isMarkdown"
        class="pa-0 para"
        v-html="cardcontent.textComment"
      >
      </v-card-text>
      <div
        v-if="cardcontent && cardcontent.textComment && cardcontent.isMarkdown"
        class="mdStyle"
        v-html="$md.render(cardcontent.textComment)"
      ></div>
      <div v-if="!cardcontent.isMarkdown">
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
            :to="`/search?search=%23${tag}&type=comment`"
            >#{{ tag }}</NLink
          >
        </span>
      </div>
      <v-card-text
        class="pa-0 caption text--disabled"
        :class="
          user &&
          cardcontent.commentor &&
          (cardcontent.commentor._id === user.userDetails._id ||
            cardcontent.commentor === user.userDetails._id)
            ? 'text-right'
            : ''
        "
      >
        {{
          $dateFns.formatDistanceToNow(new Date(cardcontent.createdDate), {
            addSuffix: true
          })
        }}
        <span
          >-
          {{
            (user &&
              (cardcontent.commentor._id === user.userDetails._id ||
                cardcontent.commentor === user.userDetails._id) &&
              'You') ||
              cardcontent.commentor.username ||
              (cardcontent.commentor.facebook &&
                cardcontent.commentor.facebook.displayName) ||
              'You'
          }}</span
        >
      </v-card-text>
      <NLink
        v-if="showArticleLink"
        :to="{
          path: `article/${cardcontent.articleId}`,
          hash: `#${cardcontent._id}`
        }"
        class="caption"
      >
        Read related article
      </NLink>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ReplyCard from './ReplyCard'
import EmbedCard from './embedCard'
import { cloudinarytransformUrl } from '~/utilities/common'

export default {
  components: {
    ReplyCard,
    EmbedCard
  },
  props: {
    cardcontent: {
      type: Object,
      default: null
    },
    showArticleLink: {
      type: Boolean,
      default: false
    },
    commentDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      overlay: '',
      overlayImage: '',
      dropDown: [
        {
          title: 'Reply',
          icon: 'mdi-reply-outline',
          permission: () =>
            this.user &&
            !this.commentDisabled &&
            this.user &&
            !this.showArticleLink
        },
        {
          title: 'Delete',
          icon: 'mdi-delete-outline',
          permission: () =>
            (this.user &&
              this.cardcontent.commentor &&
              (this.cardcontent.commentor === this.user.userDetails._id ||
                this.cardcontent.commentor._id ===
                  this.user.userDetails._id)) ||
            (this.user &&
              this.user.userDetails &&
              this.user.userDetails.role === 'admin')
        },
        {
          title: 'Report',
          icon: 'mdi-comment-alert-outline',
          permission: () => {
            if (this.user && this.cardcontent) {
              if (
                this.cardcontent.reportedBy &&
                this.cardcontent.reportedBy.length > 0 &&
                this.cardcontent.reportedBy.includes(this.user.userDetails._id)
              ) {
                return false
              }
              if (
                this.user.userDetails._id !== this.cardcontent.commentor &&
                this.user.userDetails._id !== this.cardcontent.commentor._id
              ) {
                return true
              } else {
                return false
              }
            }
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'user',
      bookmarks: 'article/bookmarks',
      singleArticle: 'article/singleArticle'
    })
  },
  methods: {
    onImageClick(value) {
      this.overlayImage = value
    },
    htmlContent() {
      let jsonData = ''
      jsonData = JSON.stringify(
        this.cardcontent.embedUrl.embedJson.html
      ).replace('width=\\"500\\"', 'width=\\"100%\\"')
      jsonData = jsonData.replace('width=\\" 500\\"', 'width=\\"100%\\"')
      jsonData = jsonData.replace('min-width:', '')
      return JSON.parse(jsonData)
    },
    transform: cloudinarytransformUrl,
    onClickdropDownMenu(data, id) {
      if (data.title === 'Delete') {
        this.overlay = id
      }
      if (data.title === 'Reply') {
        this.$store.dispatch('commonState/replyComment', this.cardcontent)
        this.$store.dispatch('commonState/autoFocusComment', true)
      }
      if (data.title === 'Report') {
        this.$store
          .dispatch('article/reportComment', this.cardcontent._id)
          .then(() => {
            this.$notifier.showMessage({
              message: 'You reported a comment! We will review it soon',
              color: 'error',
              timeout: 3000
            })
          })
          .catch((err) => {
            if (err.response.data.msg) {
              this.$notifier.showMessage({
                message: err.response.data.msg,
                color: 'error',
                timeout: 3000
              })
            }
          })
      }
    },
    deleteComment() {
      this.$store.dispatch('article/deleteComment', this.cardcontent._id)
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
}
.minh-auto {
  min-height: auto !important;
}
.tt-none {
  text-transform: none;
}
.nlink {
  text-decoration: none;
  font-weight: bold;
}
.para ::v-deep p {
  margin-bottom: 0 !important;
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
.link:hover {
  background-position: 0 1em;
  transition: background-position 2s ease-in-out;
}
.zi-1 {
  z-index: 1;
}
.closeBtn {
  right: 0;
  left: 0;
  margin: auto;
  bottom: 10px;
}
img {
  width: 100% !important;
}
div ::v-deep > iframe {
  min-width: 0 !important;
}
</style>
