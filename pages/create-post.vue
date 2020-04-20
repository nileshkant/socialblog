<template>
  <v-row>
    <v-col md="6">
      <article-form @formData="formUpdate" />
    </v-col>
    <v-col md="6">
      <ArticleCard :cardcontent="formdata" />
    </v-col>
  </v-row>
</template>

<script>
import ArticleForm from '../components/ArticleForm'
import ArticleCard from '../components/ChatCard'
import { toBase64 } from '../utilities/common'
export default {
  layout: 'postView',
  components: {
    ArticleCard,
    'article-form': ArticleForm
  },
  data() {
    return {
      formdata: {}
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
    }
  }
}
</script>

<style></style>
