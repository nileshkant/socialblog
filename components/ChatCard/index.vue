<template>
  <v-card>
    <v-overlay absolute :opacity="0.7" :value="overlay">
      <v-btn class="mr-2" @click.stop.prevent="overlay = false">
        Cancel
      </v-btn>
      <v-btn color="error" class="ml-2" @click.stop.prevent="deleteArticle">
        Delete!
      </v-btn>
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
        :to="'/article/' + cardcontent._id"
        class="link"
        @click.native="redirectTo"
      >
        {{ cardcontent.fullDetailsCard && cardcontent.fullDetailsCard.title }}
      </NLink>
    </div>

    <v-card-subtitle>
      {{ cardcontent.fullDetailsCard && cardcontent.fullDetailsCard.subtitle }}
    </v-card-subtitle>
    <v-card-actions>
      <v-btn icon color="secondary" text>
        <v-icon>mdi-heart-outline</v-icon>
      </v-btn>

      <v-btn icon color="secondary" text>
        <v-icon>mdi-bookmark-plus-outline</v-icon>
      </v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="cardcontent._id"
            class="mx-2"
            icon
            color="secondary"
            text
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(menu, index) in dropDown"
            :key="index"
            @click="onClickdropDownMenu(menu)"
          >
            <v-icon>{{ menu.icon }}</v-icon>
            <v-list-item-title>{{ menu.title }}</v-list-item-title>
          </v-list-item>
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
import { cloudinarytransformUrl } from '../../utilities/common'
export default {
  props: {
    left: {
      type: Boolean,
      default: false
    },
    right: {
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
  methods: {
    transform: cloudinarytransformUrl,
    redirectTo() {
      this.$store.commit('article/getSingleArticle', this.cardcontent)
    },
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
  color: inherit;
  cursor: pointer;
}
.link:hover {
  background-position: 0 1em;
  transition: background-position 2s ease-in-out;
}
</style>
