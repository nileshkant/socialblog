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
      <!-- <v-divider /> -->
      <div
        :style="{
          'min-height': windowHeight - 66 + 'px',
          'max-height': windowHeight - 66 + 'px'
        }"
        class="overflowY-auto scrollBar"
      >
        <h3 class="pb-1 pt-5 px-md-1 px-3 ">Categories</h3>
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
              <v-icon class="pos-a card-icon">{{
                categoryCard(item.name).icon
              }}</v-icon>
            </v-sheet>
          </v-col>
        </v-row>
        <!-- <v-list dense class="py-0">
          <template v-for="(item, index) in categories">
            <v-divider
              v-if="index !== categories.length && index !== 0"
              :key="index"
              :inset="true"
            ></v-divider>

            <v-list-item
              v-if="item.name"
              :key="item._id"
              @click="clickedTopic(item)"
            >
              <v-list-item-avatar color="primary" class="color.white">
                <span class="white--text headline">{{
                  item.name | capitalize
                }}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list> -->
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import icon from '~/static/images/TOSIcon.png'

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
      icon
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
.pos-a {
  position: absolute;
}
.pos-r {
  position: relative;
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
  opacity: 0.1;
}
</style>
