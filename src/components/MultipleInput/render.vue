<template>
  <el-table :data="model" style="width: 100%" max-height="250" @header-click="handleSelectWidget">
    <el-table-column header-align="center" :label="widget.name">
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
            v-if="column.item != null"
            v-model="model[scope.$index][column.item.name]"
            :widget="getWidget(column.item, scope.$index)"
            hidden-label="true"
            @input-change="onInputChange"
          />
        </template>
      </el-table-column>
      <el-table-column align="right" fixed="right" header-align="right" width="120">
        <template v-slot:header>
          <el-button plain size="small" icon="el-icon-plus" @click="handleAddRow"></el-button>
        </template>
        <template v-slot="{ $index }">
          <el-button plain type="primary" size="small" icon="el-icon-copy-document" @click="handleCloneRow($index)"></el-button>
          <el-button plain type="danger" size="small" icon="el-icon-minus" @click="handleDeleteRow($index)"></el-button>
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
    value: { type: Array, default: () => [] }
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