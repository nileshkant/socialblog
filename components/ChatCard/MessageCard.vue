<template>
  <div>
    <v-card class="pos-r">
      <v-overlay absolute :opacity="0.7" :value="overlay === cardcontent._id">
        <v-btn class="mr-2" @click.stop.prevent="overlay = false">
          Cancel
        </v-btn>
        <v-btn color="error" class="ml-2" @click.stop.prevent="deleteComment">
          Delete!
        </v-btn>
      </v-overlay>
      <v-menu left open-on-hover offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="cardcontent._id"
            class="mx-2 right-menu pos-a"
            icon
            color="secondary"
            text
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
              v-if="
                (menu.title === 'Delete' &&
                  user &&
                  cardcontent.commentor &&
                  cardcontent.commentor._id === user.userDetails._id) ||
                  (user &&
                    user.userDetails &&
                    user.userDetails.role === 'admin') ||
                  menu.title !== 'Delete'
              "
              class="minh-auto py-1 pos-r"
              @click="onClickdropDownMenu(menu, cardcontent._id)"
            >
              <v-icon>{{ menu.icon }}</v-icon>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item>
          </div>
        </v-list>
      </v-menu>
      <v-img
        v-if="cardcontent && cardcontent.mediaUrl"
        :src="transform(cardcontent.mediaUrl, 'q_auto:eco')"
        height="200px"
      >
      </v-img>
      <v-card-text
        v-if="cardcontent && cardcontent.textComment"
        class="pb-0 para"
        v-html="cardcontent.textComment"
      >
      </v-card-text>
      <div class="px-4">
        <span
          v-for="(tag, index) in cardcontent.hashtags"
          :key="index"
          class="pr-2"
        >
          <NLink text small color="primary" class="tt-none nlink" to="#"
            >#{{ tag }}</NLink
          >
        </span>
      </div>
      <v-card-text
        class="py-0 caption text--disabled"
        :class="
          user &&
          cardcontent.commentor &&
          cardcontent.commentor._id === user.userDetails._id
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
            (cardcontent.commentor._id === user &&
              user.userDetails._id &&
              'You') ||
              cardcontent.commentor.username ||
              (cardcontent.commentor.facebook &&
                cardcontent.commentor.facebook.displayName) ||
              'You'
          }}</span
        >
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { cloudinarytransformUrl } from '~/utilities/common'

export default {
  props: {
    cardcontent: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      overlay: '',
      dropDown: [
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
    })
  },
  methods: {
    transform: cloudinarytransformUrl,
    onClickdropDownMenu(data, id) {
      if (data.title === 'Delete') {
        this.overlay = id
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
</style>
