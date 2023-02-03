<template>
  <div style="padding: 1em">
    <el-steps
      v-if="element && element.key"
      :key="element.key"
      :space="200"
      :active="active"
      finish-status="success"
    >
      <el-step
        v-for="(step, stepIndex) in steps"
        :title="step.title"
        :key="stepIndex"
      >
      </el-step>
    </el-steps>
    <template v-if="kind == 'widget' && element && element.key">
      <el-form
        v-for="(stepElement, stepIndex) in steps"
        :key="stepIndex"
        v-show="active === stepIndex"
        type="flex"
        :class="{ active: selectWidget.key == element.key }"
        :gutter="element.options.gutter ? element.options.gutter : 0"
        :justify="element.options.justify"
        :align="element.options.align"
        class="widget-col widget-view"
      >
        <draggable
          v-model="stepElement.list"
          :no-transition-on-drag="true"
          v-bind="{
            group: 'people',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.drag-widget',
          }"
          @end="handleMoveEnd"
          @add="handleWidgetAdd"
        >
          <transition-group name="fade" tag="div" class="widget-col-list">
            <template v-for="(el, i) in stepElement.list">
              <template v-if="el.type == 'grid'">
                <grid
                  v-if="el && el.key"
                  :data.sync="data"
                  :kind="'widget'"
                  :key="el.key"
                  class="widget-col widget-view"
                  :gutter="el.options.gutter ? element.options.gutter : 0"
                  :justify="el.options.justify"
                  :align="el.options.align"
                  :select.sync="selectWidget"
                  :columns="el.columns"
                  :element="el"
                  :index="index"
                  @click.native="handleSelectWidget(i, stepIndex)"
                />
              </template>
              <template v-else>
                <widget-form-item
                  v-if="el && el.key"
                  :key="el.key"
                  :element="el"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="el"
                ></widget-form-item>
              </template>
            </template>
          </transition-group>
        </draggable>
      </el-form>
    </template>
    <el-button style="margin-top: 12px" @click="next">Próximo</el-button>

    <div
      class="widget-view-action widget-col-action"
      v-if="select.key == element.key"
    >
      <i
        class="iconfont icon-trash"
        @click.stop="handleWidgetDelete(index, stepIndex)"
      ></i>
    </div>

    <div
      class="widget-view-drag widget-col-drag"
      v-if="select.key == element.key"
    >
      <i class="iconfont icon-drag drag-widget"></i>
    </div>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import WidgetFormItem from "../WidgetFormItem";
import Grid from "./Grid"
export default {
  props: [
    "steps",
    "gutter",
    "justify",
    "element",
    "index",
    "align",
    "select",
    "data",
    "kind",
  ],
  components: {
    Draggable,
    WidgetFormItem,
    Grid,
  },
  data() {
    return {
      active: 0,
      selectWidget: this.select,
      step: '',
      stepIndex:0,
    };
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true,
    },
    selectStep:{
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true,
    }
  },
  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      console.log("index", newIndex, oldIndex);
    },
    handleWidgetAdd(evt) {
      console.log("add", evt);
      console.log("end", evt);
      const newIndex = evt.newIndex;
      const to = evt.to;
      console.log(to);

      //为拖拽到容器的元素添加唯一 key
      const key =
        Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.$set(this.steps[this.stepIndex], newIndex, {
        ...this.steps[this.stepIndex].list[newIndex],
        options: {
          ...this.steps[this.stepIndex].list[newIndex].options,
          remoteFunc: "func_" + key,
        },
        key,
        // 绑定键值
        model: this.data.list[newIndex].type + "_" + key,
        rules: [],
      });

      if (
        this.steps[this.stepIndex].list[newIndex].type === "radio" ||
        this.steps[this.stepIndex].list[newIndex].type === "checkbox" ||
        this.steps[this.stepIndex].list[newIndex].type === "select"
      ) {
        this.$set(this.steps[this.stepIndex].list, newIndex, {
          ...this.steps[this.stepIndex].list[newIndex],
          options: {
            ...this.steps[this.stepIndex].list[newIndex].options,
            options: this.steps[this.stepIndex].list[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        });
      }

      if (this.steps[this.stepIndex].list[newIndex].type === "grid") {
        this.$set(this.steps[this.stepIndex].list, newIndex, {
          ...this.steps[this.stepIndex].list[newIndex],
          columns: this.steps[this.stepIndex].list[newIndex].columns.map((item) => ({
            ...item,
          })),
        });
      }

      this.selectWidget = this.steps[this.stepIndex].list[newIndex];
    },
    handleSelectWidget(index, stepIndex) {
      console.log({index, stepIndex}, "#####");
      this.stepIndex = stepIndex;
      this.selectWidget = this.steps[stepIndex].list[index];
    },
    handleWidgetDelete(index, stepIndex) {
      if (this.steps[stepIndex].list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.steps[stepIndex].list[index - 1];
        }
      } else {
        this.selectWidget = this.steps[stepIndex].list[index + 1];
      }

      this.$nextTick(() => {
        this.steps[stepIndex].list.splice(index, 1);
      });
    },
    next() {
      if (this.active++ > this.steps.length -1) this.active = 0;
    },
  },
};
</script>

<style>
</style>