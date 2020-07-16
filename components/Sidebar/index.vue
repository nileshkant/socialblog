<template>
  <v-row>
    <v-col class="pa-0">
      <v-toolbar flat>
        <span
          ><v-img
            :src="icon"
            max-height="25"
            max-width="50"
            contain
            class="pointer d-none d-md-flex"
            @click="clickedTopic('home')"
          ></v-img
        ></span>
        <v-toolbar-title class="title ml-md-3">
          The Open Stories
        </v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <div
        :style="{
          'min-height': windowHeight - 66 + 'px',
          'max-height': windowHeight - 66 + 'px'
        }"
        class="overflowY-auto scrollBar"
      >
        <v-list three-line class="py-0">
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
                <v-list-item-title class="title">
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.summary }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
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
</style>
