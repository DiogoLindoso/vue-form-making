<script setup>
import ReviewForm from "../components/Review/ReviewForm.vue";
</script>

<template>
  <div style="width: 100%; height: 100%">
    <ReviewForm ref="reviewForm" :template="template" :data="{ models, reviews }" />
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 16px;
      "
    >
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
                    required: false,
                    dataType: "string",
                    pattern: "",
                    placeholder: "",
                    disabled: false,
                    maxlength: -1,
                    showWordLimit: false,
                  },
                  name: "Input",
                },
              },
              {
                width: "auto",
                item: {
                  type: "number",
                  icon: "icon-number",
                  options: {
                    width: "",
                    required: false,
                    defaultValue: 0,
                    min: 0,
                    max: 1,
                    step: 1,
                    disabled: false,
                    controlsPosition: "",
                  },
                  name: "Number",
                },
              },
            ],
            options: {
              defaultValue: [],
              showLabel: true,
              remoteFunc: "func_1676553432000_42144",
            },
            name: "Multiple Input",
            key: "1676553432000_42144",
            model: "multipleinput_1676553432000_42144",
            rules: [],
          },
        ],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
        },
      },
      models: {
        multipleinput_1676553432000_42144: [
          { Input: "Matheus", Number: 0 },
          { Input: "Lucas", Number: 0 },
        ],
      },
      reviews: {
        multipleinput_1676553432000_42144: [
          {
            Input: {
              state: 'approved',
              approver: {
                name: 'Matheus Lucas',
                rCode: '5976'
              },
              approvalDate: new Date()
            },
            Number: {
              state: 'review'
            }
          },
          { 
            Input: {
              state: 'review'
            },
            Number: {
              state: 'review'
            }
          },
        ],
      },
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
