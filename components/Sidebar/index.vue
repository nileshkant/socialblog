<template>
  <v-row>
    <v-col class="pa-0">
      <v-row class="mx-0 mt-1">
        <v-col cols="2" class="px-md-0 px-1"
          ><v-img
            :src="icon"
            contain
            class="pointer"
            @click="clickedTopic('home')"
          ></v-img
        ></v-col>
        <v-col class="title ml-md-3 fw-800">
          <h3>The Open Stories</h3>
        </v-col>
      </v-row>
      <div
        :style="{
          'min-height': windowHeight - 66 + 'px',
          'max-height': windowHeight - 66 + 'px'
        }"
        class="overflowY-auto scrollBar"
      >
        <div>
          <h3 class="pb-1 pt-5 px-md-1 px-3 ">Categories</h3>
        </div>
        <v-row class="mx-0">
          <v-col
            v-for="(item, index) in categories"
            :key="index"
            cols="6"
            class="px-3 pt-2 pb-0 pl-md-0"
            align-self="center"
          >
            <v-sheet
              class="categories pa-3 pos-r"
              :style="{
                backgroundImage: `linear-gradient(${120}deg, ${categoryCard(
                  item.name
                ).color.join(', ')})`
              }"
              @click="clickedTopic(item)"
            >
              <h5>{{ item.name }}</h5>
              <v-icon class="card-icon">{{
                categoryCard(item.name).icon
              }}</v-icon>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row v-if="user" class="mx-0 mt-5">
          <v-col cols="12" class="px-md-0 py-0">
            <v-btn color="primary" text to="/profile/me" retain-focus-on-click>
              <v-icon class="pr-3">mdi-account-circle-outline</v-icon>
              Profile
            </v-btn>
          </v-col>
          <v-col cols="12" class="px-md-0">
            <v-btn to="/bookmarks" color="primary" text retain-focus-on-click>
              <v-icon class="pr-3">mdi-bookmark-multiple-outline</v-icon>
              Bookmarks
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="12" class="pl-md-0">
            <v-btn block color="primary" rounded large @click="addStory">
              <span
                ><v-img
                  :src="coinSymbol"
                  height="18px"
                  width="15px"
                  responsive
                  contain
                ></v-img
              ></span>
              <span class="pr-4"> +2</span>
              <!-- <v-icon class="pr-3">mdi-note-plus-outline</v-icon> -->
              Add Story
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import icon from '~/static/images/TOSIcon.png'
import coinSymbol from '~/static/images/p-coin-symbol.svg'

export default {
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase()
    }
  },
  data() {
    return {
      icon,
      coinSymbol
    }
  },
  computed: {
    ...mapGetters({
      isDarkMode: 'commonState/isDarkMode',
      windowHeight: 'commonState/windowHeight',
      categories: 'article/categories',
      user: 'user'
    })
  },
  methods: {
    clickedTopic(item) {
      if (item === 'home') {
        this.$router.push({ path: `/` })
      } else {
        this.$router.push({ path: `/topic-articles/${item._id}` })
      }
      this.$emit('closeCategory')
    },
    addStory() {
      if (this.user) {
        this.$router.push('/create-post')
      } else {
        this.$store.dispatch('commonState/loginPopUp')
      }
    },
    categoryCard(name) {
      let cardObj = {}
      switch (name) {
        case 'Entertainment':
          cardObj = {
            icon: 'mdi-movie-filter-outline',
            color: ['#f6d365', '#fda085']
          }
          break
        case 'Movie/Series Reviews':
          cardObj = {
            icon: 'mdi-movie-edit-outline',
            color: ['#84fab0', '#8fd3f4']
          }
          break
        case 'Nation and Politics':
          cardObj = {
            icon: 'mdi-earth',
            color: ['#c471f5', '#fa71cd']
          }
          break
        case 'Career and Education':
          cardObj = {
            icon: 'mdi-book-check-outline',
            color: ['#00cdac', '#8ddad5']
          }
          break
        case 'Health and Hygiene':
          cardObj = {
            icon: 'mdi-meditation',
            color: ['#209cff', '#68e0cf']
          }
          break
        case 'Memes,Quotes and Hobbies':
          cardObj = {
            icon: 'mdi-comment-quote-outline',
            color: ['#fc6076', '#ff9a44']
          }
          break
        case 'On This Day':
          cardObj = {
            icon: 'mdi-calendar-today',
            color: ['#b224ef', '#7579ff']
          }
          break
        case 'Programming and Softwares':
          cardObj = {
            icon: 'mdi-code-json',
            color: ['#2AFADF', '#4C83FF']
          }
          break
        case 'Science and Technology':
          cardObj = {
            icon: 'mdi-cellphone-link',
            color: ['#97ABFF', '#123597']
          }
          break
        default:
          cardObj = {
            icon: 'mdi-earth',
            color: ['#f6d365', '#fda085']
          }
      }
      return cardObj
    }
  }
}
</script>
<style scoped>
.overflowY-auto {
  overflow-y: auto;
}
.fab-button {
  bottom: 12%;
  right: 30px;
}
.pointer {
  cursor: pointer;
}
.categories {
  min-height: 60px;
  color: #fff;
  cursor: pointer;
}
.card-icon {
  right: 5px;
  bottom: 5px;
  font-size: 40px;
  opacity: 0.2;
  position: absolute;
}
</style>
