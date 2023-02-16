import { getField, updateField } from 'vuex-map-fields';
import {basicComponents, layoutComponents, advanceComponents} from '../../components/componentsConfig'

export default {
  namespaced: true,
  state: {
    basicComponents,
    layoutComponents,
    advanceComponents,
    resetJson: false,
    widgetForm: {
      list: [],
      config: {
        labelWidth: 100,
        labelPosition: "right",
        size: "small",
      },
    },
    configTab: "widget",
    widgetFormSelect: null,
    previewVisible: false,
    jsonVisible: false,
    codeVisible: false,
    uploadVisible: false,
    remoteFuncs: {
      func_test(resolve) {
        setTimeout(() => {
          const options = [
            { id: "1", name: "1111" },
            { id: "2", name: "2222" },
            { id: "3", name: "3333" },
          ];

          resolve(options);
        }, 2000);
      },
      funcGetToken(resolve) {
        request
          .get("http://tools-server.making.link/api/uptoken")
          .then((res) => {
            resolve(res.uptoken);
          });
      },
      upload_callback(response, file, fileList) {
        console.log("callback", response, file, fileList);
      },
    },
    widgetModels: {},
    blank: "",
    htmlTemplate: "",
    vueTemplate: "",
    jsonTemplate: "",
    uploadEditor: null,
    jsonCopyValue: "",
    jsonClipboard: null,
    jsonEg: `{
      "list": [],
      "config": {
        "labelWidth": 100,
        "labelPosition": "top",
        "size": "small"
      }
    }`,
    codeActiveName: "vue",
  },
  getters: {
    getField,
  },
  mutations: {
    updateField,
  },
  actions: {},
};
