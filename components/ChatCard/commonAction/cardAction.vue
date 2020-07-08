<template>
  <div>
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
        <SocialShare :social-share-data="shareData" />
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
    <v-card-actions>
      <v-btn icon :disabled="!cardcontent._id" @click="likeArticle">
        <v-icon v-if="likes" color="error">mdi-heart</v-icon>
        <v-icon v-else :color="!checkColor ? 'black' : ''"
          >mdi-heart-outline</v-icon
        >
      </v-btn>
      <div
        v-if="cardcontent.likes && cardcontent.likes.length > 0"
        class="mr-2"
        :class="!checkColor && 'black--text'"
      >
        {{ cardcontent.likes && cardcontent.likes.length }}
      </div>

      <v-btn icon :disabled="!cardcontent._id" @click="bookmarkArticle">
        <v-icon v-if="isBookmarked" :color="!checkColor ? 'black' : ''"
          >mdi-bookmark-check</v-icon
        >
        <v-icon v-else :color="!checkColor ? 'black' : ''"
          >mdi-bookmark-plus-outline</v-icon
        >
      </v-btn>

      <div
        v-if="cardcontent._id && (cardcontent.views || cardcontent.newViews)"
        class="ml-2"
        :class="!checkColor && 'black--text'"
      >
        <span>
          {{ cardcontent.views + cardcontent.newViews }}
        </span>
        <span class="caption">
          Views
        </span>
      </div>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="cardcontent._id"
            class="mx-2"
            icon
            :color="!checkColor ? 'black' : ''"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <div v-for="(menu, index) in dropDown" :key="index" class="py-0">
            <v-list-item
              v-if="
                (menu.title === 'Delete' &&
                  user &&
                  user.userDetails &&
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
      <slot></slot>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SocialShare from '../../SocialShareButtons'

export default {
  components: {
    SocialShare
  },
  props: {
    cardcontent: {
      type: Object,
      required: true
    },
    checkColor: {
      type: Boolean,
      default: true
    },
    shareData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      overlay: null,
      socialOverlay: null,
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
    }
  },
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
  methods: {
    onClickdropDownMenu(data, id) {
      if (data.title === 'Delete') {
        this.overlay = id
      }
      if (data.title === 'Share') {
        this.socialOverlay = id
      }
    },
    deleteArticle() {
      this.$store.dispatch('article/deleteArticle', this.cardcontent._id)
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

<style></style>
