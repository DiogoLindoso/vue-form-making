<template>
  <div>
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
    <el-row
      class="widget-col widget-view" 
      v-if="kind == 'generate' && element && element.key"
      :key="element.key"
      type="flex"
      :class="{ active: selectedWidget.key == element.key }"
      :gutter="element.options.gutter ? element.options.gutter : 0"
      :justify="element.options.justify"
      :align="element.options.align"
      @click.native="handleSelectWidget(index)"
    >
    <template name="columns">

    </template>
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
    "align",
    "select",
    "data",
    "kind",
  ],
  data: function () {
    return {
      selectedWidget: this.select,
    };
  },
  watch: {
    select(val) {
      this.selectedWidget = val;
    },
    selectedWidget: {
      handler(val) {
        console.log({val});
        this.$emit("update:select", val);
      },
      deep: true,
    },
  },
  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      console.log("index", newIndex, oldIndex);
    },
    handleselectedWidget(index) {
      console.log(index, "#####");
      this.selectedWidget = this.data.list[index];
    },
    handleWidgetAdd(evt) {
      console.log("add", evt);
      console.log("end", evt);
      const newIndex = evt.newIndex;
      const to = evt.to;
      console.log(to);

      //Adiciona uma chave única ao elemento arrastado para o container
      const key =
        Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: "func_" + key,
        },
        key,
        // bind key
        model: this.data.list[newIndex].type + "_" + key,
        rules: [],
      });

      if (
        this.data.list[newIndex].type === "radio" ||
        this.data.list[newIndex].type === "checkbox" ||
        this.data.list[newIndex].type === "select"
      ) {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            options: this.data.list[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        });
      }

      if (this.data.list[newIndex].type === "grid") {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          columns: this.data.list[newIndex].columns.map((item) => ({
            ...item,
          })),
        });
      }

      this.selectedWidget = this.data.list[newIndex];
    },
    handleWidgetColAdd($event, row, colIndex) {
      console.log("coladd", $event, row, colIndex);
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;

      // Impede arrastar aninhado de elementos de layout
      if (item.className.indexOf("data-grid") >= 0) {
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
  },
};
</script>

<style>
</style>