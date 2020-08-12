<template>
  <div>
    <v-app-bar fixed elevate-on-scroll>
      <v-btn icon large @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title class="title pl-0">Create Story</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon large @click="drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-container>
      <v-slide-x-reverse-transition hide-on-leave>
        <SelectPostType
          v-if="!formdata.articleType"
          @selectedCard="changeCard"
        />
      </v-slide-x-reverse-transition>
      <v-slide-y-transition hide-on-leave>
        <v-row v-if="formdata.articleType">
          <v-col md="6" cols="12" :class="preview ? 'd-none d-md-flex' : ''">
            <v-row class="mt-10">
              <v-col>
                <h3 class="mb-3">
                  Add Story Details
                </h3>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  icon
                  large
                  class="d-flex d-md-none"
                  @click="preview = true"
                >
                  <v-icon>mdi-eye-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-stepper v-model="e1" :vertical="false">
              <v-stepper-header v-if="steps !== 1">
                <template v-for="n in steps">
                  <v-stepper-step
                    v-if="formdata.articleType !== 'movieReviewCard'"
                    :key="`${n}-step`"
                    :complete="e1 > n"
                    :step="n"
                  >
                    <span v-if="n === 1">
                      Describe Story Briefly
                    </span>
                    <span v-if="n === 2">
                      Select Categories
                    </span>
                  </v-stepper-step>
                  <v-divider v-if="n !== steps" :key="n"></v-divider>
                </template>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content
                  v-for="n in steps"
                  :key="`${n}-content`"
                  :step="n"
                  class="pa-0"
                >
                  <v-card v-if="n === 1">
                    <v-col>
                      <article-form
                        v-if="formdata.articleType === 'fullDetailsCard'"
                        @formData="formUpdate"
                        @file="uploadFile"
                        @onSubmit="onSubmit"
                      />
                      <QuoteForm
                        v-if="formdata.articleType === 'quoteCard'"
                        @formData="formUpdate"
                        @onSubmit="onSubmit"
                      />
                      <MovieReviewForm
                        v-if="formdata.articleType === 'movieReviewCard'"
                        @formData="formUpdate"
                        @onSubmit="onSubmit"
                      />
                    </v-col>
                  </v-card>
                  <v-card v-if="n === 2">
                    <v-col>
                      <div class="mb-1">
                        Select Category
                      </div>
                      <v-chip-group
                        multiple
                        column
                        active-class="primary--text"
                        @change="changeCategory"
                      >
                        <v-chip
                          v-for="category in dropdownCategories"
                          :key="category.text"
                          filter
                        >
                          {{ category.text }}
                        </v-chip>
                      </v-chip-group>
                      <v-card-actions class="mt-5">
                        <v-btn @click="prevStep(2)" color="accent" outlined>
                          Change
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          @click="onSubmit('publish')"
                          color="primary"
                          :loading="loading"
                        >
                          Publish
                        </v-btn>
                      </v-card-actions>
                    </v-col>
                  </v-card>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-col>
          <v-col md="5" cols="12" class="ml-auto">
            <v-row :class="!preview ? 'd-none d-md-flex' : ''">
              <v-col cols="12" class="py-0">
                <v-row class="mt-10">
                  <v-col>
                    <h3>
                      Preview Story
                    </h3>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn
                      icon
                      large
                      class="text-right d-flex d-md-none"
                      @click="preview = false"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <ArticleCard
                  v-if="formdata.articleType === 'fullDetailsCard'"
                  :cardcontent="formdata"
                  showfullcard
                />
                <QuoteCard
                  v-if="formdata.articleType === 'quoteCard'"
                  :cardcontent="formdata"
                />
                <MovieCard
                  v-if="formdata.articleType === 'movieReviewCard'"
                  :cardcontent="formdata"
                />
              </v-col>
              <v-col cols="12" class="text-center">
                <v-btn outlined @click="formdata.articleType = null">
                  Change Story Card
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleForm from '../components/ArticleForm'
import ArticleCard from '../components/ChatCard'
import QuoteCard from '../components/ChatCard/QuoteCard'
import QuoteForm from '../components/ArticleForm/quoteForm'
import SelectPostType from '../components/SelectPostType'
import MovieCard from '../components/ChatCard/MovieCard'
import MovieReviewForm from '../components/ArticleForm/movieDetails'
import { toBase64 } from '../utilities/common'
// import SelectBox from '../components/FormComponents/selectBox'
export default {
  middleware: 'authenticated',
  components: {
    ArticleCard,
    'article-form': ArticleForm,
    QuoteCard,
    QuoteForm,
    SelectPostType,
    MovieCard,
    MovieReviewForm
    // SelectBox
  },
  async fetch({ store, params }) {
    await store.dispatch('article/getCategories')
  },
  data() {
    return {
      cardoption: [
        { text: 'Full Article Card', value: 'fullDetailsCard' },
        { text: 'Quote Card', value: 'quoteCard' },
        { text: 'Movie/Series Review Card', value: 'movieReviewCard' }
      ],
      e1: 1,
      steps: 2,
      preview: false,
      formdata: {
        articleType: null,
        categories: [],
        fileURL: ''
      }
    }
  },
  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    },
    // vertical() {
    //   this.e1 = 2
    //   requestAnimationFrame(() => (this.e1 = 1)) // Workarounds
    // },
    formdata: {
      deep: true,
      handler(val) {
        if (val.articleType === 'movieReviewCard') {
          this.steps = 1
        } else {
          this.steps = 2
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      dropdownCategories: 'article/dropdownCategories',
      loading: 'article/loading'
    })
  },
  mounted() {
    this.$meta().refresh()
  },
  methods: {
    changeCard(value) {
      this.formdata.articleType = value
      this.preview = false
      if (value === 'fullDetailsCard') {
        this.formdata.quoteCard = null
      }
      if (value === 'quoteCard') {
        this.formdata.fullDetailsCard = null
      }
      if (value === 'movieReviewCard') {
        this.$store.commit('review/movieDetails', null)
        this.formdata.fullDetailsCard = null
        this.formdata.quoteCard = null
      }
    },
    changeCategory(value) {
      const selectedValue = value.map((val) => {
        return this.dropdownCategories[val].value
      })
      this.formdata.categories = selectedValue
    },
    formUpdate(data) {
      this.formdata = { ...this.formdata, [this.formdata.articleType]: data }
    },
    uploadFile(data) {
      this.formdata.fileURL = data ? URL.createObjectURL(data) : ''
      this.fileData = data || null
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1
      } else {
        this.e1 = n + 1
      }
    },
    prevStep(n) {
      if (n > 1) {
        this.e1 = n - 1
      }
    },
    async onSubmit(data) {
      if (this.e1 === 2) {
        if (this.fileData) {
          this.formdata.file = await toBase64(this.fileData)
        }
        this.formdata.isPublished = data === 'publish'
        if (this.formdata.categories.length > 0) {
          this.$store.dispatch('article/postArticle', this.formdata)
        }
      } else {
        this.nextStep(1)
      }
    },
    drawer() {
      this.$store.dispatch('commonState/isDrawerOpen', true)
    }
  }
}
</script>

<style></style>
