<script setup>
import ReviewForm from "../components/Review/ReviewForm.vue";
</script>

<template>
  <div style="width: 100%; height: 100%">
    <ReviewForm ref="reviewForm" :template="template" :data="{ models }" :logged-user="loggedUser" />
    <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 16px;
      ">
      <el-button @click="approveAll" type="success"> Aprovar todos </el-button>
      <el-button @click="reproveAll" type="danger"> reprovar todos </el-button>
      <el-button @click="submit" type="primary"> Enviar </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      template: {
        list: [
          {
            type: "form-steps",
            icon: "icon-tabs",
            steps: [
              {
                title: "step 1",
                list: [
                  {
                    type: "text",
                    icon: "icon-wenzishezhi-",
                    options: {
                      defaultValue: "Lista com todos os produtos",
                      customClass: "",
                      remoteFunc: "func_1677519376000_92137"
                    },
                    name: "Text",
                    key: "1677519376000_92137",
                    model: "text_1677519376000_92137",
                    rules: []
                  },
                  {
                    type: "multipleinput",
                    icon: "icon-icon_clone",
                    columns: [
                      {
                        width: "auto",
                        item: {
                          type: "input",
                          icon: "icon-input",
                          options: {
                            width: "100%",
                            defaultValue: "",
                            required: true,
                            dataType: "string",
                            pattern: "",
                            placeholder: "",
                            disabled: false,
                            maxlength: -1,
                            showWordLimit: false
                          },
                          name: "Produto",
                          rules: [
                            {
                              type: "string",
                              message: "Produto: Invaild format"
                            },
                            {
                              required: true,
                              message: "Produto: Required"
                            }
                          ]
                        }
                      },
                      {
                        width: "200",
                        item: {
                          type: "number",
                          icon: "icon-number",
                          options: {
                            width: "",
                            required: true,
                            defaultValue: 0,
                            min: 0,
                            max: 100,
                            step: 1,
                            disabled: false,
                            controlsPosition: ""
                          },
                          name: "Quantidade",
                          rules: [
                            {
                              required: true,
                              message: "Quantidade: Required"
                            }
                          ]
                        }
                      }
                    ],
                    options: {
                      defaultValue: [],
                      showLabel: true,
                      remoteFunc: "func_1677510647000_63502"
                    },
                    name: "Produtos",
                    key: "1677510647000_63502",
                    model: "multipleinput_1677510647000_63502",
                    rules: []
                  }
                ]
              },
              {
                title: "step 2",
                list: [
                  {
                    type: "grid",
                    icon: "icon-grid-",
                    columns: [
                      {
                        span: 12,
                        list: [
                          {
                            type: "input",
                            icon: "icon-input",
                            options: {
                              width: "100%",
                              defaultValue: "",
                              required: false,
                              dataType: "string",
                              pattern: "",
                              placeholder: "",
                              disabled: false,
                              maxlength: -1,
                              showWordLimit: false,
                              remoteFunc: "func_1677510707000_29019"
                            },
                            name: "First Name",
                            key: "1677510707000_29019",
                            model: "input_1677510707000_29019",
                            rules: [
                              {
                                type: "string",
                                message: "First Name: Invaild format"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        span: 12,
                        list: [
                          {
                            type: "input",
                            icon: "icon-input",
                            options: {
                              width: "100%",
                              defaultValue: "",
                              required: false,
                              dataType: "string",
                              pattern: "",
                              placeholder: "",
                              disabled: false,
                              maxlength: -1,
                              showWordLimit: false,
                              remoteFunc: "func_1677510710000_33939"
                            },
                            name: "Last Name",
                            key: "1677510710000_33939",
                            model: "input_1677510710000_33939",
                            rules: [
                              {
                                type: "string",
                                message: "Last Name: Invaild format"
                              }
                            ]
                          }
                        ]
                      }
                    ],
                    options: {
                      gutter: 0,
                      justify: "start",
                      align: "top",
                      remoteFunc: "func_1677510706000_18378"
                    },
                    name: "Grid",
                    key: "1677510706000_18378",
                    model: "grid_1677510706000_18378",
                    rules: []
                  }
                ]
              }
            ],
            options: {
              gutter: 0,
              justify: "start",
              align: "top",
              alignCenter: true,
              simple: false,
              space: "",
              remoteFunc: "func_1677510640000_72058"
            },
            name: "Form Steps",
            key: "1677510640000_72058",
            model: "form-steps_1677510640000_72058",
            rules: []
          }
        ],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small"
        }
      },
      models: {
        text_1677519376000_92137: "Lista com todos os produtos",
        multipleinput_1677510647000_63502: [
          { Produto: "Computador", Quantidade: 2 },
          { Produto: "Celular", Quantidade: 10 },
          { Produto: "Cadeita Gamert", Quantidade: 2 }
        ],
        input_1677510707000_29019: "Matheus ",
        input_1677510710000_33939: "Souza"
      },
      reviews: {},
      loggedUser: {
        rCode: '5976',
        name: 'Matheus'
      }
    };
  },
  methods: {
    approveAll: function () {
      this.$refs.reviewForm.approveAll();
    },
    reproveAll: function () {
      this.$refs.reviewForm.reproveAll();
    },
    submit: async function () {
      try {
        const data = await this.$refs.reviewForm.submit();
        this.$alert(JSON.stringify(data), "Title", {
          confirmButtonText: "OK",
        });
      } catch (error) {
        this.$message({
          showClose: true,
          message: error,
          type: "error",
        });
      }
    },
  },
};
</script>
