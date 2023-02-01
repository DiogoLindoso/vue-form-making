<template>
  <el-row
    :key="key"
    type="flex"
    :gutter="gutter"
    :justify="justify"
    :align="align"
  >
    <el-col
      v-for="(col, colIndex) in columns"
      :key="colIndex"
      :span="col.span"
    >
      <template v-for="citem in col.list">
        <el-form-item
          v-if="citem.type == 'blank'"
          :label="citem.name"
          :prop="citem.model"
          :key="citem.key"
        >
          <slot :name="citem.model" :model="models"></slot>
        </el-form-item>
        <generate-form-item
          v-else
          :key="citem.key"
          :models.sync="models"
          :remote="remote"
          :rules="rules"
          :widget="citem"
          @input-change="onInputChange"
        >
        </generate-form-item>
      </template>
    </el-col>
  </el-row>
</template>
<script>
import GenerateFormItem from '../GenerateFormItem'
export default {
  name: 'Grid',
  components:{GenerateFormItem},
  props: ['columns', 'key', 'type','gutter', 'justify', 'columns'],
};
</script>

<style>
</style>