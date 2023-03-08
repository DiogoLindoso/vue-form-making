<template>
  <div class="signature" :style="{ height }">
    <div class="signature-header">
      <el-button
        plain
        type="danger"
        style="float: right;"
        icon="el-icon-delete"
        @click="clear"
      >
        clear
      </el-button>
    </div>
    <div class="signature-body">
      <VueSignaturePad
        ref="signaturePad"
        height="100%"
        :options="{ onEnd }"
        :value="value"
      />
    </div>
    <div class="signature-footer">
      <span>{{ name }}</span>
    </div>
  </div>
</template>
  <script>
import Vue from "vue";
import VueSignaturePad from "vue-signature-pad";

Vue.use(VueSignaturePad);
export default {
  name: "Signature",
  props: {
    value: {
      default: "",
    },
    height: {
      String,
      default: "200px",
    },
    name: String
  },
  watch:{
    value:function(val){
      if(!val) this.$refs.signaturePad.clearSignature();
    }
  },
  mounted: function() {
    if (this.value) {
      this.$refs.signaturePad.fromDataURL(this.value);
    }
  },
  methods: {
    onEnd() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (!isEmpty) {
        this.$emit("input", data);
      }else{
        this.$emit("input", '');

      }
    },
    clear(){
      this.$refs.signaturePad.clearSignature();
      this.$emit("input",'');
    },
  },
};
</script>
<style scoped>
.signature {
  position: relative;
  width: 100%;
}

.signature-header {
  height: 32px;
}
.signature-body {
  border-bottom: 3px solid grey;
  height: calc(100% - 64px);
  padding-bottom: 8px;
  padding-top: 8px;
}

.signature-footer {
  height: 32px;
  margin-top: 8px;
  text-align: center;
  user-select: none;
}
</style>