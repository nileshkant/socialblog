<template>
  <div class="mb-1">
    <v-row class="mx-0 mt-2 pl-2 replymsg">
      <v-col class="pa-0" align-self="center">
        <div class="caption text--disabled">
          Reply on
        </div>
        <div
          v-if="replycontent && replycontent.textComment"
          class="pb-0 para caption"
          v-html="replycontent.textComment"
        />
        <div v-if="replycontent && !replycontent.textComment">
          Photo
        </div>
      </v-col>
      <v-col class="pa-0" v-if="replycontent && replycontent.mediaUrl" cols="3">
        <v-img
          :src="transform(replycontent.mediaUrl, 'q_auto:eco')"
          height="40px"
        >
        </v-img>
      </v-col>
    </v-row>
    <v-divider />
  </div>
</template>

<script>
import { cloudinarytransformUrl } from '~/utilities/common'

export default {
  props: {
    replycontent: {
      type: Object,
      default: null
    }
  },
  methods: {
    transform: cloudinarytransformUrl
  }
}
</script>

<style scoped>
.para ::v-deep p {
  margin-bottom: 0 !important;
}
.replymsg {
  border-left: 2px solid var(--v-accent-base);
}
</style>
