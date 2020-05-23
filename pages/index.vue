<template>
  <v-row>
    <v-col
      sm="12"
      md="4"
      cols="12"
      class="py-0 border-right-grey"
      :class="$route.path !== '/' || isTrending ? 'd-none d-md-flex' : ''"
    >
      <sidebar @trending="isTrending = true" />
    </v-col>
    <v-col class="pa-0 border-right-grey middle-col" sm="12" md="5" cols="12">
      <NuxtChild :key="$route.params.id" keep-alive />
    </v-col>
    <v-col
      sm="12"
      md="3"
      cols="12"
      class="py-0"
      :class="isTrending ? '' : 'd-none d-md-flex'"
    >
      <v-row>
        <v-col cols="12" class="px-0 py-0">
          <v-toolbar flat>
            <v-btn
              icon
              large
              class="d-flex d-md-none"
              @click="isTrending = false"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title class="title pl-0"
              >Highlights Today</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-avatar v-if="user" size="32">
              <v-img
                :src="
                  `https://graph.facebook.com/${user.userDetails.facebook.id}/picture?type=square`
                "
              ></v-img>
            </v-avatar>
          </v-toolbar>
          <v-divider />
        </v-col>
        <v-col
          :style="{
            'min-height': windowHeight - 66 + 'px',
            'max-height': windowHeight - 66 + 'px'
          }"
          class="overflowY-auto scrollBar"
          cols="12"
        >
          <div>
            <Hightlights />
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebar from '../components/Sidebar'
import Hightlights from '../components/Highlights'
export default {
  components: {
    sidebar,
    Hightlights
  },
  async fetch({ store, params }) {
    await store.dispatch('article/getCategories')
    await store.dispatch('covid19/covidSummary')
  },
  data() {
    return {
      isTrending: false
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight',
      isDarkMode: 'commonState/isDarkMode',
      titleSection: 'article/titleSection',
      user: 'user'
    })
  },
  mounted() {
    this.$meta().refresh()
  },
  methods: {
    closeModel() {
      this.overlay = false
    }
  }
}
</script>

<style scoped>
.overflowY-auto {
  overflow-y: auto;
}
.border-right-grey {
  border-right: 1px solid var(--v-greyAccent-base);
}
.editor-pos {
  position: relative;
  bottom: 0;
  background: white;
  width: 100%;
}
.middle-col {
  position: relative;
}
</style>
