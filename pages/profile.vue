<template>
  <div>
    <v-row>
      <v-col>
        <v-app-bar fixed elevate-on-scroll>
          <v-btn icon large @click="$router.back()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title class="title pl-0">My Profile</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon large @click="drawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-app-bar>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-container class="mt-10">
      <v-row>
        <v-col md="8" cols="12" order-md="1" order="2">
          <NoRecords
            v-if="
              userPosts && userPosts.articles && userPosts.articles.length === 0
            "
            message="You haven't posted any story yet."
          />
          <client-only>
            <div
              v-masonry
              transition-duration=".3s"
              item-selector=".item"
              class="masonry-container"
            >
              <div class="row">
                <div
                  v-for="(post, index) in userPosts.articles"
                  :key="index"
                  v-masonry-tile
                  class="col-sm-6 item"
                >
                  <ProfilePost :post="post" />
                </div>
              </div>
            </div>
          </client-only>
        </v-col>
        <v-col v-if="user" md="4" cols="12" order-md="2" order="1">
          <div class="pos-s">
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <v-avatar
                  size="80"
                  :class="!isDarkMode ? 'profilePic' : 'profilePic-dark'"
                >
                  <img
                    :src="
                      `https://graph.facebook.com/${user.userDetails.facebook.id}/picture?type=large`
                    "
                    alt="John"
                  />
                </v-avatar>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-center title" cols="12">
                {{ user.userDetails.facebook.displayName }}
              </v-col>
              <v-col cols="12">
                <v-row justify="space-around">
                  <v-col cols="auto">
                    <div class="caption">
                      Total Stories
                    </div>
                    <div class="text-center title">
                      {{ userPosts.articles.length }}
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <div class="caption">
                      Detail Stories
                    </div>
                    <div class="text-center title">
                      {{ userPosts.articles | filterPosts('fullDetailsCard') }}
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <div class="caption">
                      Quote Stories
                    </div>
                    <div class="text-center title">
                      {{ userPosts.articles | filterPosts('quoteCard') }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <v-btn color="warning" outlined to="/create-post">
                  + Create Story
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfilePost from '../components/ProfilePost'
import NoRecords from '~/components/NoRecords'

export default {
  middleware: 'authenticated',
  components: {
    ProfilePost,
    NoRecords
  },
  filters: {
    filterPosts: (value, type) => {
      let returnVal = 0
      if (value && value.length > 0) {
        const allVal = value.filter((val) => {
          return val.articleType === type
        })
        returnVal = allVal.length
      }
      return returnVal
    }
  },
  async fetch({ store, params }) {
    await store.dispatch('userProfile/userPosts')
  },
  fetchOnServer: false,
  computed: {
    ...mapGetters({
      userPosts: 'userProfile/userPosts',
      isDarkMode: 'commonState/isDarkMode',
      user: 'user'
    })
  },
  methods: {
    drawer(item) {
      this.$store.dispatch('commonState/isDrawerOpen', true)
    }
  }
}
</script>

<style scoped>
.profilePic {
  box-shadow: 5px 5px 35px #c7c7c7, -5px -5px 35px #ffffff;
}
.profilePic-dark {
  box-shadow: 5px 5px 17px #101010, -5px -5px 17px #424242;
}
@media (min-width: 960px) {
  .pos-s {
    position: sticky;
    position: -webkit-sticky;
    top: 70px;
    display: block;
  }
}
</style>
