<template>
  <v-row>
    <v-col md="6" cols="12" :class="preview ? 'd-none d-md-flex' : ''">
      <v-row>
        <v-col>
          <h3 class="mb-3">
            Add Post Details
          </h3>
        </v-col>
        <v-col cols="auto">
          <v-btn icon large class="d-flex d-md-none" @click="preview = true">
            <v-icon>mdi-eye-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-card>
        <v-col>
          <SelectBox
            v-model="formdata.articleType"
            :items="cardoption"
            label="Article Type"
            classes="mt-4"
            @change="changeCard"
          />
          <SelectBox
            v-model="formdata.categories"
            :items="dropdownCategories"
            label="Categories"
            classes="mt-4"
            multiple
            chips
          />
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
          />
          <QuoteCard v-else :cardcontent="formdata" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleForm from '../components/ArticleForm'
import ArticleCard from '../components/ChatCard'
import QuoteCard from '../components/ChatCard/QuoteCard'
import QuoteForm from '../components/ArticleForm/quoteForm'
import { toBase64 } from '../utilities/common'
import SelectBox from '../components/FormComponents/selectBox'
export default {
  middleware: 'authenticated',
  layout: 'postView',
  components: {
    ArticleCard,
    'article-form': ArticleForm,
    QuoteCard,
    QuoteForm,
    SelectBox
  },
  async fetch({ store, params }) {
    await store.dispatch('article/getCategories')
  },
  data() {
    return {
      cardoption: [
        { text: 'Full Article Card', value: 'fullDetailsCard' },
        { text: 'Quote Card', value: 'quoteCard' }
      ],
      preview: false,
      formdata: {
        articleType: 'fullDetailsCard',
        categories: null,
        fileURL: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      dropdownCategories: 'article/dropdownCategories'
    })
  },
  mounted() {
    this.$meta().refresh()
  },
  methods: {
    changeCard(value) {
      if (value === 'fullDetailsCard') {
        this.formdata.quoteCard = null
      } else {
        this.formdata.fullDetailsCard = null
      }
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
      if (this.formdata.categories) {
        this.$store.dispatch('article/postArticle', this.formdata)
      }
    }
  }
}
</script>

<style></style>
