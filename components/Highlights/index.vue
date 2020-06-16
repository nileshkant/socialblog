<template>
  <div>
    <Weather v-if="weatherReport" :weather="weatherNow" />
    <Covid19 />
    <div class="caption mt-2 text-center mb-12 mb-md-2">
      <span class="mr-3">
        <NLink class="link text--secondary" to="/terms-of-services">
          Terms
        </NLink>
      </span>
      <span class="mr-3">
        <NLink class="link text--secondary" to="/privacy-policies">
          Privacy policy
        </NLink>
      </span>
      <span class="mr-3">
        <NLink class="link text--secondary" to="/contact-us">
          Contact us
        </NLink>
      </span>
      <div class="text--disabled">© 2020 TheOpenStories</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Weather from '../Weather'
import Covid19 from '../covid19'

export default {
  components: {
    Weather,
    Covid19
  },
  data() {
    return {
      weatherNow: null
    }
  },
  computed: {
    ...mapGetters({
      ipDetails: 'highlights/ipDetails',
      weatherReport: 'highlights/weatherReport'
    })
  },
  watch: {
    weatherReport(newValue, oldValue) {
      const dateArr = this.weatherReport.list.map((date) => {
        return this.$dateFns.fromUnixTime(date.dt)
      })
      const weatherSelected = this.weatherReport.list.filter((value) => {
        return (
          this.$dateFns.getUnixTime(
            this.$dateFns.closestTo(new Date(), dateArr)
          ) === value.dt
        )
      })
      this.weatherNow = {
        ...this.weatherReport,
        list: weatherSelected[0] || ''
      }
    }
  },
  async mounted() {
    if (!this.ipDetails) {
      await this.$store.dispatch('highlights/ipAddressDetails')
    }
    const weatherReport = JSON.parse(localStorage.getItem('weatherReport'))
    const weatherTimeout = JSON.parse(localStorage.getItem('weatherTimeout'))
    const userZipCode = JSON.parse(localStorage.getItem('userZipCode'))
    if (this.$dateFns.isPast(new Date(weatherTimeout))) {
      localStorage.removeItem('weatherReport')
      localStorage.removeItem('weatherTimeout')
    }
    if (!this.$dateFns.isPast(new Date(weatherTimeout))) {
      this.$store.commit('highlights/weatherReport', weatherReport)
    }
    if (this.ipDetails && !this.weatherReport) {
      if (userZipCode) {
        await this.$store.dispatch('highlights/weatherReport', {
          zip: userZipCode
        })
      } else {
        await this.$store.dispatch('highlights/weatherReport', {
          lat: this.ipDetails.latitude,
          lon: this.ipDetails.longitude
        })
      }
    }
  }
}
</script>

<style scoped>
.link {
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>
