<template>
  <v-row>
    <v-col md="6">
      <h3 class="text-center mb-3">
        Add Post Details
      </h3>
      <article-form @formData="formUpdate" @onSubmit="onSubmit" />
    </v-col>
    <v-col md="6">
      <h3 class="text-center mb-3">
        Preview Post
      </h3>
      <ArticleCard
        v-if="formdata.cardselect === 'Image Card'"
        :cardcontent="formdata"
      />
      <QuoteCard v-else :cardcontent="formdata" />
    </v-col>
  </v-row>
</template>

<script>
import ArticleForm from '../components/ArticleForm'
import ArticleCard from '../components/ChatCard'
import QuoteCard from '../components/ChatCard/QuoteCard'
import { toBase64 } from '../utilities/common'
export default {
  middleware: 'authenticated',
  layout: 'postView',
  components: {
    ArticleCard,
    'article-form': ArticleForm,
    QuoteCard
  },
  data() {
    return {
      formdata: { ...this.formdata, cardselect: 'Image Card' }
    }
  },
  mounted() {
    this.$meta().refresh()
  },
  methods: {
    async formUpdate(data) {
      this.formdata = {
        ...data,
        file: data && data.file ? await toBase64(data.file) : null
      }
    },
    onSubmit() {
      console.log('formDataaaaaa', this.formdata)
    }
  }
}
</script>

<style></style>
