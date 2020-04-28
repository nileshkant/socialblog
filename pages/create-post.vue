<template>
  <v-row>
    <v-col md="6">
      <h3 class="text-center mb-3">
        Add Post Details
      </h3>
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
    <v-col md="6">
      <h3 class="text-center mb-3">
        Preview Post
      </h3>
      <ArticleCard
        v-if="formdata.articleType === 'fullDetailsCard'"
        :cardcontent="formdata"
      />
      <QuoteCard v-else :cardcontent="formdata" />
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
      formdata: {
        articleType: 'fullDetailsCard',
        categories: null
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
      this.formdata = { ...this.formdata, quoteCard: data }
    },
    async uploadFile(data) {
      this.formdata.file = data && data ? await toBase64(data) : null
    },
    onSubmit(data) {
      this.formdata.isPublished = data === 'publish'
      if (this.formdata.categories) {
        this.$store.dispatch('article/postArticle', this.formdata)
      }
    }
  }
}
</script>

<style></style>
