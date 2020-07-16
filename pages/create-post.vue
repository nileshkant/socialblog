<template>
  <div>
    <v-slide-x-reverse-transition hide-on-leave>
      <SelectPostType v-if="!formdata.articleType" @selectedCard="changeCard" />
    </v-slide-x-reverse-transition>
    <v-slide-y-transition hide-on-leave>
      <v-row v-if="formdata.articleType">
        <v-col md="6" cols="12" :class="preview ? 'd-none d-md-flex' : ''">
          <v-row>
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
          <v-card>
            <v-col>
              <div class="mb-1">
                Select Category
              </div>
              <v-chip-group
                v-if="formdata.articleType !== 'movieReviewCard'"
                multiple
                mandatory
                active-class="primary--text"
                @change="changeCategory"
              >
                <v-chip
                  v-for="category in categoriesToDisplay"
                  :key="category.text"
                >
                  {{ category.text }}
                </v-chip>
              </v-chip-group>
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
        </v-col>
        <v-col md="5" cols="12" class="ml-auto">
          <v-row :class="!preview ? 'd-none d-md-flex' : ''">
            <v-col cols="12" class="py-0">
              <v-row>
                <v-col>
                  <h3>
                    Preview Post
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
  layout: 'postView',
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
      preview: false,
      formdata: {
        articleType: null,
        categories: [],
        fileURL: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      dropdownCategories: 'article/dropdownCategories'
    }),
    categoriesToDisplay() {
      return this.dropdownCategories.filter((val) => {
        return val.text !== 'Movie/Series Reviews'
      })
    }
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
    async onSubmit(data) {
      if (this.fileData) {
        this.formdata.file = await toBase64(this.fileData)
      }
      this.formdata.isPublished = data === 'publish'
      if (this.formdata.categories.length > 0) {
        this.$store.dispatch('article/postArticle', this.formdata)
      }
    }
  }
}
</script>

<style></style>
