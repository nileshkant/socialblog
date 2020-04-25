<template>
  <div>
    <v-card>
      <v-card-text
        v-if="cardcontent && cardcontent.textComment"
        class="pb-0"
        v-html="cardcontent.textComment"
      >
      </v-card-text>
      <v-img
        v-if="cardcontent && cardcontent.mediaUrl"
        :src="transform(cardcontent.mediaUrl, 'q_auto:eco')"
        height="200px"
      >
      </v-img>
      <v-card-text class="py-0 caption text--disabled text-right">
        {{
          $dateFns.formatDistanceToNow(new Date(cardcontent.createdDate), {
            addSuffix: true
          })
        }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { cloudinarytransformUrl } from '~/utilities/common'

export default {
  props: {
    cardcontent: {
      type: Object,
      default: null
    }
  },
  methods: {
    transform: cloudinarytransformUrl
  }
}
</script>

<style></style>
