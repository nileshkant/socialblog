<template>
  <v-row>
    <v-col class="pa-0">
      <v-toolbar flat>
        <v-toolbar-title class="title">The Open Stories</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-btn icon large class="d-flex d-md-none" @click="trending">
          <v-badge color="green" dot offset-x="5" offset-y="5">
            <v-icon>mdi-trending-up</v-icon>
          </v-badge>
        </v-btn> -->
        <v-btn icon large class="d-flex d-md-none" @click="closeCategory">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
              v-if="!(index !== categories.length - 1)"
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
        <v-fab-transition>
          <v-btn
            color="primary"
            rounded
            dark
            bottom
            left
            class="pos-a fab-button d-flex d-md-none"
            @click="trending"
          >
            <span>Highlights</span>
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-fab-transition>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase()
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
    trending() {
      this.$emit('trending')
    },
    clickedTopic(item) {
      this.$router.push({ path: `/topic-articles/${item._id}` })
      this.closeCategory()
    },
    closeCategory() {
      this.$store.dispatch('commonState/isViewCategory', false)
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
</style>
