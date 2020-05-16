<template>
  <div>
    <span
      v-if="icon.includes('01')"
      :class="
        isDarkMode ? 'weather-dark weather-dark-sunny' : 'weather weather-sunny'
      "
      class="icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span><span class="path6"></span
      ><span class="path7"></span><span class="path8"></span
      ><span class="path9"></span><span class="path10"></span
      ><span class="path11"></span><span class="path12"></span>
    </span>
    <span
      v-if="icon.includes('02')"
      :class="
        isDarkMode
          ? 'weather-dark weather-dark-cloudy-1'
          : 'weather weather-cloudy-1'
      "
      class="icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span>
    </span>
    <span
      v-if="icon.includes('03')"
      :class="
        isDarkMode
          ? 'weather-dark weather-dark-clouds'
          : 'weather weather-clouds'
      "
      class="icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span>
    </span>
    <span
      v-if="icon.includes('04')"
      :class="
        isDarkMode
          ? 'weather-dark weather-dark-cloudy'
          : 'weather weather-cloudy'
      "
      class="icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span>
      <span class="path5"></span>
    </span>
    <span
      v-if="icon.includes('09')"
      :class="
        isDarkMode
          ? 'weather-dark weather-dark-light-rain'
          : 'weather weather-light-rain'
      "
      class="icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span><span class="path6"></span
      ><span class="path7"></span><span class="path8"></span
      ><span class="path9"></span><span class="path10"></span
      ><span class="path11"></span><span class="path12"></span>
    </span>
    <span
      v-if="icon.includes('10')"
      :class="
        isDarkMode
          ? 'weather-dark weather-dark-hailstorm'
          : 'weather weather-hailstorm'
      "
      class="icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span>
    </span>
    <span
      v-if="icon.includes('11')"
      :class="
        isDarkMode
          ? 'weather-dark weather-dark-thunder'
          : 'weather weather-thunder'
      "
      class="icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span>
    </span>
    <span
      v-if="icon.includes('13')"
      :class="
        isDarkMode
          ? 'weather-dark weather-dark-snowflake-1'
          : 'weather weather-snowflake-1'
      "
      class="icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span><span class="path6"></span
      ><span class="path7"></span><span class="path8"></span>
    </span>
    <span
      v-if="icon.includes('50')"
      :class="
        isDarkMode ? 'weather-dark weather-dark-foggy' : 'weather weather-foggy'
      "
      class="icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span><span class="path6"></span
      ><span class="path7"></span><span class="path8"></span
      ><span class="path9"></span><span class="path10"></span>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    icon: {
      type: String,
      default: '50d'
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
.icon-fs {
  font-size: 50px;
}
</style>
