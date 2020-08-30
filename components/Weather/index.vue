<template>
  <v-card v-if="weather" class="pos-r">
    <v-overlay absolute :opacity="0.9" :value="overlay">
      <WeatherInput @closeInput="overlay = false" />
    </v-overlay>
    <v-btn small icon class="pos-a edit-icon" @click="overlay = !overlay">
      <v-icon v-if="!overlay" small>
        mdi-pencil
      </v-icon>
      <v-icon v-else small color="error">
        mdi-close
      </v-icon>
    </v-btn>
    <v-row class="mx-0">
      <v-col>
        <div v-if="weather.list" class="headline ">
          {{ weather.list.main.temp }} °C
        </div>
        <div>{{ weather.city.name }}, {{ weather.city.country }}</div>
        <div v-if="weather.list" class="caption mt-1">
          Humidity: {{ weather.list.main.humidity }}%
        </div>
      </v-col>
      <v-col class="text-center" cols="5">
        <Icons v-if="weather.list" :icon="weather.list.weather[0].icon" />
        <div v-if="weather.list" class="caption mt-2">
          {{ weather.list.weather[0].description | capitalizeFirstLetter }}
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mx-0">
      <v-col>
        <div v-if="weather.city" class="caption">
          <v-icon>mdi-weather-hazy</v-icon>
          Sunrise:
          {{
            $dateFns.format(
              $dateFns.fromUnixTime(weather.city.sunrise),
              'hh:mm a'
            )
          }}
        </div>
      </v-col>
      <v-col>
        <div class="caption text-right">
          <v-icon>mdi-weather-sunset</v-icon>
          Sunset:
          {{
            $dateFns.format(
              $dateFns.fromUnixTime(weather.city.sunset),
              'hh:mm a'
            )
          }}
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import WeatherInput from './weatherInput'
import Icons from './icons'

export default {
  components: {
    Icons,
    WeatherInput
  },
  filters: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  props: {
    weather: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
      overlay: false
    }
  },
  computed: {
    ...mapGetters({
      isDarkMode: 'commonState/isDarkMode'
    })
  }
}
</script>

<style scoped>
.color-black {
  color: black;
}
.color-white {
  color: white;
}
.bg-card {
  background-image: radial-gradient(
    circle 827px at 47.3% 48%,
    rgba(255, 255, 255, 1) 0%,
    rgba(138, 192, 216, 1) 90%
  );
}
.bg-card-dark {
  background-image: linear-gradient(
    230.6deg,
    rgba(163, 217, 207, 1) 0.1%,
    rgba(4, 178, 217, 1) 100.2%
  );
}
.pos-a {
  position: absolute;
}
.pos-r {
  position: relative;
}
.edit-icon {
  right: 0;
  margin: auto;
  z-index: 20;
}
</style>
