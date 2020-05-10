export default ({ app, store }, inject) => {
  inject('notifier', {
    showMessage({ message = '', color = '', timeout = 0 }) {
      store.dispatch('commonState/toastMessage', { message, color, timeout })
    }
  })
}
