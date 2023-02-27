<template>
  <div style="padding: 1em">
    <template v-if="kind == 'widget'" >
      <!-- steps of the form -->
      <el-steps
        v-if="element && element.key"
        :key="element.key"
        :space="space"
        :active="active"
        finish-status="success"
        :simple="simple"
        :align-center="alignCenter"
      >
        <el-step
          v-for="(step, stepIndex) in steps"
          :title="step.title"
          :key="stepIndex"
          @click.native="active = stepIndex"
          style="cursor: pointer;"
        >
        </el-step>
      </el-steps>
      <!-- step content -->
      <template v-if="element && element.key">
        <div
          v-for="(stepElement, stepIndex) in steps"
          :key="stepIndex"
          v-show="active === stepIndex"
        >
          <template v-if="stepElement.list.length==0">
            <div class="form-empty">{{$t('fm.description.containerEmpty')}}</div>
          </template>
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
            @change="onChange"
          >
            <transition-group name="fade" tag="div" class="widget-form-list">
              <template v-if="stepElement.list.length">
                <template v-for="(el, elStepIndex) in stepElement.list">
                  <template v-if="el.type == 'grid'">
                    <grid
                      v-if="el && el.key"
                      :data="stepElement"
                      :kind="'widget'"
                      :key="el.key"
                      class="widget-col widget-view"
                      :gutter="el.options.gutter ? element.options.gutter : 0"
                      :justify="el.options.justify"
                      :align="el.options.align"
                      :select.sync="selectWidget"
                      :columns="el.columns"
                      :element="el"
                      :index="elStepIndex"
                      @click.native.stop="handleSelectWidget(index, stepIndex, elStepIndex)"
                    />
                  </template>
                  <template v-else>
                    <widget-form-item
                      v-if="el && el.key"
                      :key="el.key"
                      :element="el"
                      :select.sync="selectWidget"
                      :index="elStepIndex"
                      :data="stepElement"
                    ></widget-form-item>
                  </template>
                </template>
              </template>
            </transition-group>
          </draggable>
        </div>
      </template>
      <el-button style="margin-top: 12px" @click="next">Próximo</el-button>
  
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
    </template>
    <template v-if="kind == 'generate'">
      <!-- steps of the form -->
      <el-steps
        :space="space"
        :active="active"
        finish-status="success"
        :simple="simple"
        :align-center="alignCenter"
      >
        <el-step
          v-for="(step, stepIndex) in steps"
          :title="step.title"
          :key="stepIndex"
        >
        </el-step>
      </el-steps>
      <!-- step content -->
      <div
        ref="step"
        v-for="(stepElement, stepIndex) in steps"
        :key="stepIndex"
        v-show="active === stepIndex"
        type="flex"
        style="position: static; padding: 1em; 0"
      >
        <template v-for="el in stepElement.list">
          <template v-if="el.type == 'grid'">
            <grid
              :kind="'generate'"
              :key="el.key"
              :gutter="el.options.gutter ? el.options.gutter : 0"
              :justify="el.options.justify"
              :align="el.options.align"
              :columns="el.columns"
              v-model="models"
              @input-change="onInputChange"
            />
          </template>
          <template v-else-if="el.type == 'multipleinput'">
            <multiple-input-render
              :key="el.key"
              :widget.sync="el"
              v-model="models[el.model]"
              @input-change="onInputChange"
              :approved-fields="approvedFields"
            />
          </template>
          <template v-else>
            <generate-form-item
              :key="el.key"
              v-model="models[el.model]"
              :widget="el"
              :remote="el.remote"
              @input-change="onInputChange"
            />
          </template>
        </template>
      </div>
      <el-button style="margin-top: 12px" @click="next">Próximo</el-button>
    </template>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import WidgetFormItem from "../WidgetFormItem";
import Grid from "./Grid"
import GenerateFormItem from "../GenerateFormItem";
import MultipleInputRender from '../MultipleInput/render'

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
    "alignCenter",
    "simple",
    "space",
    "value",
    "validateFields",
    "approvedFields"
  ],
  components: {
    Draggable,
    WidgetFormItem,
    Grid,
    GenerateFormItem,
    MultipleInputRender
  },
  data() {
    return {
      active: 0,
      selectWidget: this.select,
      step: '',
      stepIndex: 0,
      elStepIndex: null,
      models: this.value,
      rules: {}
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
    },
    active(val){
      this.stepIndex = val;
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
    onChange({added}){
      const {element, newIndex} = added;
      if (element.type == 'form-steps') 
        this.widgetDelete(newIndex);
    },
    handleMoveEnd({ newIndex, oldIndex }) {
      console.log("index", newIndex, oldIndex);
    },
    handleWidgetAdd (evt) {
      console.log('add', evt)
      console.log('end', evt)
      const newIndex = evt.newIndex
      const newElement = {...this.data.list[this.index].steps[this.stepIndex].list[newIndex]};
      const to = evt.to
      console.log(to)

      //为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      this.$set(this.data.list[this.index].steps[this.stepIndex].list, newIndex, {
        ...newElement,
        options: {
          ...newElement.options,
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: newElement.type + '_' + key,
        rules: []
      })

      if (['radio', 'checkbox', 'select'].includes(newElement.type)) {
        this.data.list[this.index].steps[this.stepIndex].list[newIndex].options = {
          ...newElement.options,
          options: newElement.options.options.map(item => ({ ...item }))
        }
      }

      if (newElement.type === 'grid') {
        this.data.list[this.index].steps[this.stepIndex].list[newIndex].columns = newElement.columns.map(item => ({...item}));
      }

      this.selectWidget = this.data.list[this.index].steps[this.stepIndex].list[newIndex];
    },
    handleSelectWidget(index, stepIndex, elStepIndex) {
      console.log({index, stepIndex, elStepIndex}, "#####");
      this.stepIndex = stepIndex;
      this.elStepIndex= elStepIndex;
      this.selectWidget = this.data.list[index].steps[stepIndex].list[elStepIndex];
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
    widgetDelete(elStepIndex) {
      const step = this.data.list[this.index].steps[this.stepIndex]
      if (step.list.length - 1 === elStepIndex) {
        if (elStepIndex === 0) {
          this.selectedWidget = {};
        } else {
          this.selectedWidget = step.list[elStepIndex - 1];
        }
      } else {
        this.selectedWidget = step.list[elStepIndex + 1];
      }

      this.$nextTick(() => {
        step.list.splice(elStepIndex, 1);
      });
    },
    onInputChange (value, field) {
      this.$emit('on-change', field, value, this.models)
      this.$emit('input-change', value, field);
    },
    async next() {
      const fieldsToBeValidated = [];
      const  getFieldsToBeValidated = items => {
        for (const item of items) {
          if (item.type === 'grid') {
            item.columns.forEach(column => getFieldsToBeValidated(column.list))
            continue;
          }
          if (item.type === 'multipleinput') continue
          fieldsToBeValidated.push(item.model);
        }
      };

      const items = this.steps[this.stepIndex].list;
      getFieldsToBeValidated(items);
      if (fieldsToBeValidated.length > 0) {
        const isValid = await this.validateFields(fieldsToBeValidated);
        if (!isValid) {
          return;
        }
      }

      if (this.kind == 'widget') {
        if (this.active++ >= this.data.list[this.index].steps.length -1) this.active = 0;
      }
      else{
        if (this.active++ >= this.steps.length -1) this.active = 0;
      }
    },
  },
};
</script>

<style>
</style>