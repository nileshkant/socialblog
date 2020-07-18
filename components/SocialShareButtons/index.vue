<template>
  <social-sharing
    :url="`https://theopenstories.com${socialShareData.url}`"
    :title="socialShareData.title"
    :description="socialShareData.description"
    :quote="socialShareData.quote"
    :hashtags="socialShareData.hashtags"
    inline-template
  >
    <span class="text-center">
      <span class="mx-4 display-2" style="cursor: pointer;">
        <network network="facebook">
          <i class="icon icon-icons8-facebook"></i> </network
      ></span>
      <span class="mx-4 display-2" style="cursor: pointer;">
        <network network="linkedin">
          <i class="icon icon-icons8-linkedin"></i>
        </network>
      </span>
      <span class="mx-4 display-2" style="cursor: pointer;">
        <network network="pinterest">
          <i class="icon icon-icons8-pinterest"></i>
        </network>
      </span>
      <span class="mx-4 display-2" style="cursor: pointer;">
        <network network="reddit">
          <i class="icon icon-icons8-reddit"></i>
        </network>
      </span>
      <span class="mx-4 display-2" style="cursor: pointer;">
        <network network="twitter">
          <i class="icon icon-icons8-twitter"></i>
        </network>
      </span>
      <span class="mx-4 display-2" style="cursor: pointer;">
        <network network="whatsapp">
          <i class="icon icon-icons8-whatsapp"></i>
        </network>
      </span>
    </span>
  </social-sharing>
</template>

<script>
import SocialSharing from 'vue-social-sharing'
export default {
  components: {
    'social-sharing': SocialSharing
  },
  props: {
    socialShareData: {
      type: Object,
      default: () => ({
        url: 'https://theopenstories.xyz',
        title: 'Test title',
        description: 'test description',
        quote: 'test quote',
        hashtags: 'test hashtags'
      })
    }
  },
  data() {
    return {
      hover: null
    }
  }
}
</script>

<style scoped>
.cursorPointer {
  cursor: pointer;
}
</style>
