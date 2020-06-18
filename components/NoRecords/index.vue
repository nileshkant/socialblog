<template>
  <v-row justify="center" align="center" class="mx-0">
    <v-col cols="auto" class="text-center">
      <div>
        <v-icon large class="py-5" color="error"
          >mdi-sticker-alert-outline</v-icon
        >
      </div>
      <div>
        {{ message }}
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'No records found!'
    }
  }
}
</script>

<style></style>
