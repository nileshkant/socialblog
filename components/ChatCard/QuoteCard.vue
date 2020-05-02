<template>
  <v-card
    class="mx-auto"
    :color="cardcontent.quoteCard && cardcontent.quoteCard.color"
    :dark="checkColor"
    max-width="400"
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
      <v-btn icon text :color="!checkColor ? 'black' : ''">
        <v-icon>mdi-heart-outline</v-icon>
      </v-btn>

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
    ...mapGetters({ user: 'user' })
  },
  methods: {
    deleteArticle() {
      this.$store.dispatch('article/deleteArticle', this.cardcontent._id)
    },
    onClickdropDownMenu(data) {
      if (data.title === 'Delete') {
        this.overlay = true
      }
    }
  }
}
</script>

<style></style>
