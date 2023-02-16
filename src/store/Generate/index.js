import { getField, updateField } from 'vuex-map-fields';
export default {
  namespaced: true,
  state: {
    models: {},
    rules: {},
  },
  getters: {
    getField
  },
  mutations: {
    updateField
  },
  actions: {},
};
