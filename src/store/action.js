/**
 * Vuex-actions
 */
export default {
  saveUserName(context, username) {
    context.commit('saveUserName', username);
  },
  saveIsView(context, isView) {
    context.commit('saveIsView', isView);
  }
}
