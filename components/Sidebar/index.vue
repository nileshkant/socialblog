<template>
  <v-row>
    <v-col class="pa-0">
      <v-toolbar flat>
        <v-toolbar-title class="title">All Topics</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="!isDarkMode" icon large @click="onThemeChange">
          <v-icon>mdi-weather-night</v-icon>
        </v-btn>
        <v-btn v-else icon large @click="onThemeChange">
          <v-icon>mdi-weather-sunny</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <div
        :style="{ 'max-height': windowHeight - 66 + 'px' }"
        class="overflowY-auto scrollBar"
      >
        <v-list three-line class="py-0">
          <template v-for="(item, index) in items">
            <v-subheader
              v-if="item.header"
              :key="item.header"
              v-text="item.header"
            ></v-subheader>

            <v-divider
              v-if="item.divider"
              :key="index"
              :inset="item.inset"
            ></v-divider>

            <v-list-item v-if="item.title" :key="item.title">
              <v-list-item-avatar color="primary" class="color.white">
                <span class="white--text headline">{{
                  item.title | capitalize
                }}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  class="title"
                  v-html="item.title"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.subtitle"
                ></v-list-item-subtitle>
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
      items: [
        // { header: 'Today' },
        {
          title: 'Politics',
          avatar: 'Politics',
          subtitle:
            "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        { divider: true, inset: true },
        {
          avatar: 'Entertainment',
          title: 'Entertainment',
          subtitle:
            "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        { divider: false, inset: false }
      ],
      content: 'This is line one'
    }
  },
  computed: {
    ...mapGetters({
      isDarkMode: 'commonState/isDarkMode',
      windowHeight: 'commonState/windowHeight'
    })
  },
  methods: {
    onThemeChange() {
      this.$store.dispatch('commonState/changeTheme')
    }
  }
}
</script>
<style scoped>
.overflowY-auto {
  overflow-y: auto;
}
</style>
