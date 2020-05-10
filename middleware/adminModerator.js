export default ({ store, redirect }) => {
  if (!['admin', 'moderator'].includes(store.state.user.userDetails.role)) {
    return redirect('/')
  }
}
