<template>
  <div>
    <span v-if="icon.includes('01')" class="weather weather-sunny icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span><span class="path6"></span
      ><span class="path7"></span><span class="path8"></span
      ><span class="path9"></span><span class="path10"></span
      ><span class="path11"></span><span class="path12"></span>
    </span>
    <span v-if="icon.includes('02')" class="weather weather-cloudy-1 icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span>
    </span>
    <span v-if="icon.includes('03')" class="weather weather-clouds icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span>
    </span>
    <span v-if="icon.includes('04')" class="weather weather-cloudy icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span>
      <span class="path5"></span>
    </span>
    <span v-if="icon.includes('09')" class="weather weather-light-rain icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span><span class="path6"></span
      ><span class="path7"></span><span class="path8"></span
      ><span class="path9"></span><span class="path10"></span
      ><span class="path11"></span><span class="path12"></span>
    </span>
    <span v-if="icon.includes('10')" class="weather weather-hailstorm icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span>
    </span>
    <span v-if="icon.includes('11')" class="weather weather-thunder icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span>
    </span>
    <span v-if="icon.includes('13')" class="weather weather-snowflake-1 icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span><span class="path6"></span
      ><span class="path7"></span><span class="path8"></span>
    </span>
    <span v-if="icon.includes('50')" class="weather weather-foggy icon-fs"
      ><span class="path1"></span><span class="path2"></span
      ><span class="path3"></span><span class="path4"></span
      ><span class="path5"></span><span class="path6"></span
      ><span class="path7"></span><span class="path8"></span
      ><span class="path9"></span><span class="path10"></span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '50d'
    }
  }
}
</script>

<style scoped>
.icon-fs {
  font-size: 50px;
}
</style>
