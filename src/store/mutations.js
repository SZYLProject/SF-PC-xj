/**
 * Vuex-mutations
 */
export default {
  saveUserName(state, username) {
    state.username = username;
  },
  saveIsView(state, isView) {
    state.isView = isView;
  }
}
