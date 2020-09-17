<template>
  <v-sheet elevation="2" rounded class="px-2">
    <v-row class="ma-0" justify="center" align="center">
      <v-col cols="2" class="pa-0">
        <v-img :src="coin" responsive></v-img>
      </v-col>
      <v-col cols="4" class="pr-0">
        <div class="caption text--disabled">
          Pebbl
        </div>
        <div v-if="userAdditionalDetails">
          {{ userAdditionalDetails.coinBalance }}
        </div>
      </v-col>
      <v-col v-if="value.length > 0" class="px-0">
        <no-ssr>
          <v-sparkline
            :value="value"
            line-width="10"
            :smooth="15"
            auto-draw
            stroke-linecap="round"
            :gradient="[
              '#38a3a5',
              '#57cc99',
              '#80ed99',
              '#b9e769',
              '#c1fba4',
              '#edeec9'
            ]"
          ></v-sparkline>
        </no-ssr>
        <div
          class="caption text-center"
          :class="value.slice(-1)[0] >= 0 ? 'success--text' : 'error--text'"
        >
          {{ value.slice(-1)[0] }}
          <span>
            <v-icon v-if="value.slice(-1)[0] >= 0" color="success" small
              >mdi-arrow-up-thick</v-icon
            >
            <v-icon v-else color="error" small>mdi-arrow-down-thick</v-icon>
          </span>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import { mapGetters } from 'vuex'
import takeRight from 'lodash/takeRight'
import coin from '../../static/images/coin.png'

export default {
  data() {
    return {
      coin,
      value: []
    }
  },
  computed: {
    ...mapGetters({
      userAdditionalDetails: 'userProfile/userAdditionalDetails'
    })
  },
  watch: {
    userAdditionalDetails(newValue, oldValue) {
      if (newValue && newValue.redeemedBalance) {
        this.value = takeRight(newValue.redeemedBalance, 20).map(
          (data) => data.amount
        )
      }
    }
  }
}
</script>

<style></style>
