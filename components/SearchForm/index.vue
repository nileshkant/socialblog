<template>
  <client-only>
    <v-form @submit.prevent="submitSearch">
      <v-row no-gutters>
        <v-col>
          <v-text-field
            v-model="search"
            :label="`Search ${type}s`"
            rounded
            outlined
            dense
            clearable
            flat
            append-icon="mdi-magnify"
            :loading="loading"
            @click:append="submitSearch"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn text class="px-0 pl-1" @click="onChangeType">
            <v-icon v-if="type === 'article'">mdi-post-outline</v-icon>
            <v-icon v-if="type === 'comment'"
              >mdi-comment-multiple-outline</v-icon
            >
            <v-icon color="primary">mdi-swap-vertical</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex'
// import { ValidationObserver } from 'vee-validate'
// import VTextFieldWithValidation from '../FormComponents/Textfield'

export default {
  components: {
    // ValidationObserver,
    // VTextFieldWithValidation
  },
  data: () => {
    return {
      search: '',
      error: null,
      type: 'article'
    }
  },
  computed: {
    ...mapGetters({
      loading: 'article/loading',
      articleDetails: 'article/articleDetails'
    })
  },
  watch: {
    $route(to, from) {
      if (to) {
        this.searchTerm()
      }
    }
  },
  mounted() {
    this.searchTerm()
  },
  methods: {
    submitSearch() {
      if (
        this.search &&
        (this.$route.query.search === this.search || this.search.length < 30)
      ) {
        this.$emit('searched', { text: this.search, type: this.type })
        this.$store.dispatch('article/search', {
          type: this.type,
          search: this.search,
          pageSize: 30,
          page: 1
        })
      }
    },
    searchTerm() {
      if (this.$route.query && this.$route.query.search) {
        this.search = this.$route.query.search
        this.type = this.$route.query.type || 'article'
      }
    },
    onChangeType() {
      this.$emit('searched', { text: this.search, type: this.type })
      this.type = this.type === 'article' ? 'comment' : 'article'
      this.submitSearch()
    }
  }
}
</script>

<style></style>
