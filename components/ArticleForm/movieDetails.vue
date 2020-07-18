<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-form @submit.prevent="searchMovie">
        <VTextFieldWithValidation
          v-model="name"
          rules="required"
          clearable
          label="Enter Movie/Series Name*"
          append-icon="mdi-magnify"
          :disabled="movieDetails && true"
          @click:append="searchMovie"
        />
        <div
          v-if="movieDetails"
          class="text-right caption"
          :class="
            totalCharBody > 500 || totalCharBody < 200
              ? 'error--text'
              : 'success--text'
          "
        >
          {{ totalCharBody }}/500
        </div>
        <RichtextEditor
          v-if="movieDetails"
          v-model="comment.textComment"
          placeholder="Write a review"
          error-text-class="ml-11 mt-2"
          :limitcharcount="500"
          @richContent="richContent"
          @charCount="charCount"
        />
        <div class="caption error--text ml-11 mt-2">
          {{ charError }}
        </div>
        <v-card-actions class="mt-4">
          <v-btn
            v-if="movieDetails"
            type="button"
            color="accent"
            outlined
            @click.prevent="resetReview"
            >Reset</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            v-if="movieDetails"
            color="primary"
            @click.prevent="searchMovie"
            >Publish</v-btn
          >
        </v-card-actions>
      </v-form>
    </ValidationObserver>
  </client-only>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
import { mapGetters } from 'vuex'
import { required } from 'vee-validate/dist/rules'
import RichtextEditor from '../FormComponents/RichTextEditor'
import VTextFieldWithValidation from '../FormComponents/Textfield'
// import cloneDeep from 'lodash/cloneDeep'
extend('required', {
  ...required,
  message: '{_field_} is required'
})

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    RichtextEditor
  },
  data: () => ({
    charError: '',
    name: '',
    formData: {},
    comment: {
      textComment: null
    },
    totalCharBody: 0
  }),
  computed: {
    ...mapGetters({
      movieDetails: 'review/movieDetails',
      latestArticle: 'article/latestArticle'
    })
  },
  watch: {
    formData: {
      handler(newValue) {
        this.$emit('formData', newValue)
      },
      deep: true
    },
    movieDetails: {
      handler(newVal) {
        this.formData = newVal
      }
    }
  },
  methods: {
    resetReview() {
      this.$nextTick(() => {
        this.$refs.obs.reset()
      })
      this.$store.commit('review/movieDetails', null)
      this.comment.textComment = null
      this.charError = ''
    },
    richContent(content) {
      this.comment.textComment = content
    },
    charCount(count) {
      this.totalCharBody = count
      if (this.totalCharBody < 199) {
        this.charError = 'Mininum 200 characters required'
      } else {
        this.charError = ''
      }
    },
    async searchMovie() {
      const success = await this.$refs.obs.validate()
      if (success) {
        if (
          this.comment.textComment &&
          this.totalCharBody >= 200 &&
          this.totalCharBody <= 500
        ) {
          if (this.movieDetails._id) {
            const sendForm = {
              ...this.comment,
              articleId: this.movieDetails._id
            }
            await this.$store.dispatch('article/postComment', sendForm)
            this.$router.replace({
              path: `/article/${this.movieDetails._id}`
            })
          } else {
            this.formData = {
              movieReviewCard: { ...this.formData },
              articleType: 'movieReviewCard',
              isPublished: true,
              categories: ['5f1282aa75eec853576e2257']
            }
            await this.$store.dispatch('article/postArticle', this.formData)
            if (
              this.latestArticle &&
              this.latestArticle.savedArticle &&
              this.latestArticle.savedArticle._id
            ) {
              const sendForm = {
                ...this.comment,
                articleId: this.latestArticle.savedArticle._id
              }
              await this.$store.dispatch('article/postComment', sendForm)
              this.$router.replace({
                path: `/article/${this.latestArticle.savedArticle._id}`
              })
            }
          }
        }
        if (!this.comment.textComment) {
          try {
            await this.$store.dispatch('review/movieDetails', {
              name: this.name
            })
          } catch (err) {
            this.$store.commit('review/movieDetails', null)
          }
        }
      }
    }
  }
}
</script>
