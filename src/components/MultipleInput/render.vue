<template>
  <el-table :data="model" style="width: 100%" max-height="250" @header-click="handleSelectWidget">
    <el-table-column :class-name="widget.options.showLabel ? '' : 'hide'" header-align="center" :label="widget.name">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        v-for="(column, index) in widget.columns"
        :key="index"
        :class-name="selectWidget == column.item ? 'active' : ''"
        :label="column.item == null ? $t('fm.config.widget.defaultType') : column.item.name"
        :width="column.width"
        :index="index"
      >
        <template slot-scope="scope">
          <generate-form-item
            v-if="!approvedFields.includes(`${widget.model}.${scope.$index}.${column.item.name}`)"
            v-model="model[scope.$index][column.item.name]"
            :widget="getWidget(column.item, scope.$index)"
            hidden-label="true"
            @input-change="onInputChange"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="right" width="90">
        <template v-slot:header>
          <el-tag effect="plain" type="info" size="small" @click.native="handleAddRow"><i class="el-icon-plus"></i></el-tag>
        </template>
        <template v-slot="{ $index }">

          <div style="display: flex; justify-content: space-between;" >
            <el-tag effect="light" type="primary" size="small" @click="handleCloneRow($index)">
              <i class="el-icon-copy-document"></i>
            </el-tag>
            <el-tag effect="light" type="danger" size="small" @click="handleDeleteRow($index)">
              <i class="el-icon-minus"></i>
            </el-tag>
            </div>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import GenerateFormItem from '../GenerateFormItem.vue';

export default {
  name: 'multiple-input-render',
  components: { GenerateFormItem },
  props: {
    widget: { type: Object },
    select: { type: Object },
    value: { type: Array, default: () => [] },
    approvedFields: Array
  },
  data () {
    return {
      selectWidget: this.select,
      model: this.value,
    }
  },
  methods: {
    handleSelectWidget(column, event) {
      if(column.index == undefined) return;

      event.stopPropagation();
      const item = this.widget.columns[column.index].item;
      if (!item) return;
      this.selectWidget = item;
    },
    handleAddRow () {
      if(this.widget.columns.some(column => column.item == null)) {
        this.$message({
          showClose: true,
          message: 'Selecione o tipo da coluna',
          type: 'error'
        });
        return;
      }
      let data = {};
      this.widget.columns.forEach(column => {
        data[column.item.name] = column.item.options.defaultValue;
      });
      this.$emit('input-change', [...this.model, data], this.widget.model);
    },
    handleDeleteRow (index) {
      delete this.model.splice(index, 1);
    },
    handleCloneRow(index) {
      let clone = {...this.model[index]};
      this.model.splice(index, 0, clone);
    },
    onInputChange(value, field) {
      const [_, index, key] = field.split('.');
      this.model[index][key] = value;
      console.log('OnInputChange Update >> ', value, field);
    },
    getWidget(item, index) {
      let widget = {...item};
      widget.model = `${this.widget.model}.${index}.${widget.name}`;
      return widget;
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget (value) {
      this.$emit('update:select', value)
    },
    model (value) {
      console.log('Updatea Mode >> ', value);
      // this.$emit('input-change', value, this.widget.model);
    },
    value (value) {
      this.model = value
    }
  }
}
</script>