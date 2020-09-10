<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="timeout"
    multi-line
    right
    bottom
  >
    {{ message }}
    <v-btn text @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: '',
      color: '',
      timeout: 0
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'commonState/toastMessage') {
        this.message = state.commonState.toastMessage.message
        this.color = state.commonState.toastMessage.color
        this.timeout = state.commonState.toastMessage.timeout
        this.show = true
      }
    })
  }
}
</script>
