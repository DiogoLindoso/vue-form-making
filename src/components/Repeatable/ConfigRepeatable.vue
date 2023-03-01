<template>
  <div>
    <el-form-item :label="$t('fm.config.widget.gutter')">
      <el-input type="number" v-model.number="data.options.gutter"></el-input>
    </el-form-item>
    <el-form-item :label="$t('fm.config.widget.maxHeight')">
      <el-input type="number" v-model.number="data.options.maxHeight"></el-input>
    </el-form-item>
    <el-form-item :label="$t('fm.config.widget.columnOption')">
      <draggable tag="ul" :list="data.columns"
        v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
        handle=".drag-item"
      >
        <li v-for="(column, index) in data.columns" :key="index" >
          <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars"></i></i>
          <el-button
            v-if="data.columns.length > 1"
            plain
            type="danger"
            size="mini"
            icon="el-icon-delete"
            style="padding: 4px;margin-left: 5px;"
            @click="handleOptionsRemove(index)"
          ></el-button>
          <div style="display: flex; justify-content: center; align-items: center;">
            {{ $t('fm.config.widget.width') }}: 
            <el-slider
              size="mini"
              :min="1"
              :max="24"
              v-model="column.span"
              style="flex: 1; margin-left: 8px;"
            />
          </div>
          <div style="width: 160px; display:flex; justify-content: space-between;">
            {{ $t('fm.config.widget.type') }}:
            <el-select
              size="mini"
              style="width: 110px"
              :value="getSelectValue(column)"
              :placeholder="$t('fm.config.widget.defaultType')"
              @change="value => handleSelectTypeColumn(column, value)"
            >
              <el-option
                :key="index"
                v-if="component.type != 'textarea' && component.type != 'text'"
                v-for="(component, index) in basicComponents"
                :label="$t(`fm.components.fields.${component.type}`)"
                :value="index"
              />
            </el-select>
          </div>
        </li>
      </draggable>
      <div style="margin-top: 22px;">
        <el-button type="primary" @click="handleAddColumn">{{$t('fm.actions.addColumn')}}</el-button>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { basicComponents } from '../componentsConfig.js'

export default {
  name: 'multiple-input-config',
  components: { Draggable },
  props: {
    data: { type: Object }
  },
  data: function () {
    return {
      basicComponents,
    }
  },
  methods: {
    _loadComponents () {
      this.basicComponents = this.basicComponents.map(item => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`)
        }
      })
    },
    getSelectValue(column) {
      if(!column.item) return null;
      return this.basicComponents.findIndex(item => item.type == column.item.type);
    },
    handleAddColumn () {
      this.data.columns.push({ width: 'auto', item: null });
    },
    handleOptionsRemove (index) {
      this.data.columns.splice(index, 1);
    },
    handleSelectTypeColumn (column, index) {
      const item = this.basicComponents[index];
      column.item = {...item, options: { ...item.options }};
      if (column.item.type == 'number') {
        column.item.options.min = 0;
        column.item.options.max = 1;
      }
    },
  },
  mounted: function () {
    this._loadComponents();
  }
}
</script>