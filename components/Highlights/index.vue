<template>
  <v-row>
    <v-col>
      Get Weather
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      ipDetails: 'highlights/ipDetails',
      weatherReport: 'highlights/weatherReport'
    })
  },
  async mounted() {
    if (!this.ipDetails) {
      await this.$store.dispatch('highlights/ipAddressDetails')
    }
    const weatherTimeout = JSON.parse(localStorage.getItem('weatherTimeout'))
    if (this.$dateFns.isPast(new Date(weatherTimeout))) {
      localStorage.removeItem('weatherReport')
      localStorage.removeItem('weatherTimeout')
      if (this.ipDetails) {
        await this.$store.dispatch('highlights/weatherReport', {
          lat: this.ipDetails.lat,
          lon: this.ipDetails.lon
        })
      }
    }
  }
}
</script>
