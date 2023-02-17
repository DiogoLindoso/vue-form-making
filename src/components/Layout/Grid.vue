<template>
  <div class="grid">
    <el-row
      v-if="kind == 'generate'"
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
            v-model="models[citem.model]"
            :widget.sync="citem"
            :remote="citem.remote"
            @input-change="onInputChange"
          >
          </generate-form-item>
        </template>
      </el-col>
    </el-row>
    <el-row
      class="widget-col widget-view" 
      v-if="kind == 'widget' && element && element.key"
      :key="element.key"
      type="flex"
      :class="{ active: selectedWidget.key == element.key }"
      :gutter="element.options.gutter ? element.options.gutter : 0"
      :justify="element.options.justify"
      :align="element.options.align"
    >
    <el-col
        v-for="(col, colIndex) in columns"
        :key="colIndex"
        :span="col.span ? col.span : 0"
      >
        <draggable
          v-model="col.list"
          :no-transition-on-drag="true"
          v-bind="{
            group: 'people',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.drag-widget',
          }"
          @end="handleMoveEnd"
          @add="handleWidgetColAdd($event, element, colIndex)"
        >
          <transition-group name="fade" tag="div" class="widget-col-list">
            <template v-for="(el, i) in col.list">
              <widget-form-item
                :key="el.key"
                v-if="el.key"
                :element="el"
                :select.sync="selectedWidget"
                :index="i"
                :data="col"
              >
              </widget-form-item>
            </template>
          </transition-group>
        </draggable>
      </el-col>
      <div
        class="widget-view-action widget-col-action"
        v-if="select.key == element.key"
      >
        <i
          class="iconfont icon-trash"
          @click.stop="handleWidgetDelete(index)"
        ></i>
      </div>

      <div
        class="widget-view-drag widget-col-drag"
        v-if="select.key == element.key"
      >
        <i class="iconfont icon-drag drag-widget"></i>
      </div>
    </el-row>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import GenerateFormItem from "../GenerateFormItem";
import WidgetFormItem from "../WidgetFormItem.vue";
export default {
  name: "Grid",
  components: {
    Draggable,
    GenerateFormItem,
    WidgetFormItem,
  },
  props: [
    "columns",
    "gutter",
    "justify",
    "element",
    "index",
    "align",
    "select",
    "data",
    "kind",
    "value"
  ],
  data: function () {
    return {
      selectedWidget: this.select,
      models: this.value,
    };
  },
  watch: {
    select(val) {
      this.selectedWidget = val;
    },
    selectedWidget: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true,
    },
    value: {
      handler: function (value) {
        this.models = value;
      }
    },
    models: {
      handler: function (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      console.log("index", newIndex, oldIndex);
    },
    handleWidgetColAdd($event, row, colIndex) {
      console.log("coladd", {$event, row, colIndex});
      console.log({draggedContext: $event});
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;
      // Impede arrastar aninhado de elementos de layout
      if (
          item.className.indexOf("data-grid") >= 0 ||
          item.className.indexOf('_type_grid') >= 0 ||
          item.className.indexOf('_type_form-steps') >= 0
        ) {
        // Se o elemento arrastado na lista precisar ser restaurado para sua posição original
        item.tagName === "DIV" &&
          this.data.list.splice(
            oldIndex,
            0,
            row.columns[colIndex].list[newIndex]
          );

        row.columns[colIndex].list.splice(newIndex, 1);

        return false;
      }

      console.log("from", item);

      const key =
        Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);

      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options,
          remoteFunc: "func_" + key,
        },
        key,
        // bind key
        model: row.columns[colIndex].list[newIndex].type + "_" + key,
        rules: [],
      });

      if (
        row.columns[colIndex].list[newIndex].type === "radio" ||
        row.columns[colIndex].list[newIndex].type === "checkbox" ||
        row.columns[colIndex].list[newIndex].type === "select"
      ) {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            options: row.columns[colIndex].list[newIndex].options.options.map(
              (item) => ({
                ...item,
              })
            ),
          },
        });
      }

      this.selectedWidget = row.columns[colIndex].list[newIndex];
    },
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectedWidget = {};
        } else {
          this.selectedWidget = this.data.list[index - 1];
        }
      } else {
        this.selectedWidget = this.data.list[index + 1];
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1);
      });
    },
    onInputChange (value, field) {
      this.$emit('on-change', field, value, this.models)
      console.log('Updata >> ', value);
      this.$emit('input-change', value, field);
    },
  },
};
</script>

<style>
</style>