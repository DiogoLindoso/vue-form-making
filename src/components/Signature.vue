<template>
  <div>
    <VueSignaturePad
      id="signature"
      :width="width"
      :height="height"
      ref="signaturePad"
      :options="{ onEnd }"
      :value="value"
    />
    <div>
      <button @click.prevent="clear">Apagar</button>
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
    width: {
      String,
      default: "200px",
    },
    height: {
      String,
      default: "200px",
    },
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
#signature {
  border: 3px solid grey;
  border-radius: 5px;
}
</style>