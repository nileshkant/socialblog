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
        <RichtextEditor
          v-if="movieDetails"
          v-model="comment.textComment"
          placeholder="Write a review"
          :limitcharcount="500"
          @richContent="richContent"
          @charCount="charCount"
        />
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
import { required, min, max } from 'vee-validate/dist/rules'
import RichtextEditor from '../FormComponents/RichTextEditor'
import VTextFieldWithValidation from '../FormComponents/Textfield'
// import cloneDeep from 'lodash/cloneDeep'
extend('required', {
  ...required,
  message: '{_field_} is required'
})
extend('min', {
  ...min,
  message: '{_field_} must be minimum {length} characters'
})
extend('max', {
  ...max,
  message: 'Must be less than {length} characters'
})

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    RichtextEditor
  },
  data: () => ({
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
    },
    richContent(content) {
      this.comment.textComment = content
    },
    charCount(count) {
      this.totalCharBody = count
    },
    async searchMovie() {
      const success = await this.$refs.obs.validate()
      if (success) {
        if (this.comment.textComment) {
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
              ...this.formData,
              articleType: 'movieReviewCard',
              isPublished: true
            }
            await this.$store.dispatch('article/postArticle', this.formdata)
            if (this.latestArticle) {
              const sendForm = {
                ...this.comment,
                articleId: this.latestArticle._id
              }
              await this.$store.dispatch('article/postComment', sendForm)
              this.$router.replace({
                path: `/article/${this.latestArticle._id}`
              })
            }
          }
        } else {
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
