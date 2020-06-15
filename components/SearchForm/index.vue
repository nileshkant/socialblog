<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-form @submit.prevent="submitSearch">
        <v-row no-gutters>
          <v-col>
            <VTextFieldWithValidation
              v-model="search"
              :label="`Search ${type}s`"
              rounded
              outlined
              dense
              solo
              clearable
              flat
              append-icon="mdi-magnify"
              :loading="loading"
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
    </ValidationObserver>
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver } from 'vee-validate'
import VTextFieldWithValidation from '../FormComponents/Textfield'

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation
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
  mounted() {
    if (this.$route.query && this.$route.query.search) {
      this.search = this.$route.query.search
      this.type = this.$route.query.type || 'article'
    }
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
    onChangeType() {
      this.$emit('searched', { text: this.search, type: this.type })
      this.type = this.type === 'article' ? 'comment' : 'article'
      this.submitSearch()
    }
  }
}
</script>

<style></style>
