import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    schema: {
        "list": [],
        "config": {
          "labelWidth": 100,
          "labelPosition": "right",
          "size": "small"
        }
    },
    review:{},
    data:{},
  },
  mutations: {
    setSchema(state, payload){
      state.schema = {...payload}
    },
    setReview(state, payload){
      state.review = {...payload}
    },
    setData(state, payload){
      state.data = {...payload}
    }
  },
  getters:{},
  actions:{}
})