import Vue from "vue";
import Vuex from "vuex";
import generate from "./Generate";
import making from "./Making";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    generate,
    making,
  },
});
