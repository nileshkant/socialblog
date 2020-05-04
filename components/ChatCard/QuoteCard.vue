<template>
  <v-card
    :color="cardcontent.quoteCard && cardcontent.quoteCard.color"
    :dark="checkColor"
  >
    <v-overlay absolute :opacity="0.7" :value="overlay">
      <v-btn class="mr-2" @click.stop.prevent="overlay = false">
        Cancel
      </v-btn>
      <v-btn color="error" class="ml-2" @click.stop.prevent="deleteArticle">
        Delete!
      </v-btn>
    </v-overlay>
    <v-card-text
      v-if="cardcontent.createdDate"
      class="caption pb-0"
      :class="!checkColor && 'black--text'"
    >
      {{
        $dateFns.formatDistanceToNow(new Date(cardcontent.createdDate), {
          addSuffix: true
        })
      }}
    </v-card-text>
    <v-card-title class="pt-0">
      <span
        class="title font-weight-light"
        :class="!checkColor && 'black--text'"
        >{{ cardcontent.quoteCard && cardcontent.quoteCard.title }}</span
      >
    </v-card-title>
    <v-card-text
      v-if="cardcontent.quoteCard && cardcontent.quoteCard.quote"
      class="headline font-weight-bold"
      :class="!checkColor && 'black--text'"
    >
      " {{ cardcontent.quoteCard.quote }} "
    </v-card-text>
    <v-card-actions>
      <v-btn icon color="secondary" @click="likeArticle">
        <v-icon v-if="likes" color="error">mdi-heart</v-icon>
        <v-icon v-else>mdi-heart-outline</v-icon>
      </v-btn>
      <div
        v-if="cardcontent.likes && cardcontent.likes.length > 0"
        class="text--disabled mr-2"
      >
        {{ cardcontent.likes && cardcontent.likes.length }}
      </div>

      <v-btn icon text :color="!checkColor ? 'black' : ''">
        <v-icon>mdi-bookmark-plus-outline</v-icon>
      </v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="cardcontent._id"
            class="mx-2"
            icon
            :color="!checkColor ? 'black' : ''"
            text
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
              @click="onClickdropDownMenu(menu)"
            >
              <v-icon>{{ menu.icon }}</v-icon>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item>
          </div>
        </v-list>
      </v-menu>
      <v-card-text
        v-if="cardcontent.quoteCard && cardcontent.quoteCard.source"
        class="caption py-0 text-truncate text-right"
        :class="!checkColor && 'black--text'"
      >
        {{ cardcontent.quoteCard.source }}
      </v-card-text>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { lightOrDark } from '../../utilities/common'
export default {
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
      overlay: false,
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
    checkColor() {
      if (
        this.cardcontent.quoteCard &&
        lightOrDark(this.cardcontent.quoteCard.color) === 'dark'
      ) {
        return true
      }
      return false
    },
    ...mapGetters({ user: 'user' }),
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
      console.log('this.cardcontent', this.cardcontent)
      const userLiked = this.cardcontent.likes.filter((value) => {
        return value.likedBy === this.user.userDetails._id
      })
      if (userLiked && userLiked.length > 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    deleteArticle() {
      this.$store.dispatch('article/deleteArticle', this.cardcontent._id)
    },
    onClickdropDownMenu(data) {
      if (data.title === 'Delete') {
        this.overlay = true
      }
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
