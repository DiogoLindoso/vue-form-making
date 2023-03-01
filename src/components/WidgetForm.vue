<script setup>
import PreviewRepeatable from './Repeatable/PreviewRepeatable.vue';
</script>

<template>
  <div class="widget-form-container">
    <div v-if="data.list.length == 0" class="form-empty">{{$t('fm.description.containerEmpty')}}</div>
    <el-form :size="data.config.size" label-suffix=":" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
      
      <draggable class="" 
        v-model="data.list" 
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >

        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list">
            <template v-if="element.type == 'grid'">
                <grid 
                  v-if="element && element.key"
                  :data.sync="data"
                  :kind="'widget'"
                  :key="element.key"
                  class="widget-col widget-view"
                  :gutter="element.options.gutter ? element.options.gutter : 0"
                  :justify="element.options.justify"
                  :align="element.options.align"
                  :select.sync="selectWidget"
                  :columns="element.columns"
                  :element="element"
                  :index="index"
                  @click.native="handleSelectWidget(index)"
                />
            </template>
            <template v-else-if="element.type == 'form-steps'">
              <steps
                v-if="element && element.key"
                :data.sync="data"
                :kind="'widget'"
                :key="element.key"
                class="widget-col widget-view"
                :gutter="element.options.gutter ? element.options.gutter : 0"
                :justify="element.options.justify"
                :align="element.options.align"
                :select.sync="selectWidget"
                :steps="element.steps"
                :element="element"
                :index="index"
                @click.native="handleSelectWidget(index)"
                :simple="element.options.simple"
                :alignCenter="element.options.alignCenter"
                :space="element.options.space"
              />
            </template>

            <template v-else-if="element.type == 'multipleinput'">
              <PreviewRepeatable
                v-if="element && element.key"
                class="widget-col widget-view"
                :class="{ active: selectWidget.key == element.key }"
                :key="element.key"
                :element="element"
                :selected-widget.sync="selectWidget"
                @click.native="handleSelectWidget(index)"
              >
                <div v-if="select.key == element.key" class="widget-view-action widget-col-action">
                  <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
                </div>

                <div v-if="select.key == element.key" class="widget-view-drag widget-col-drag">
                  <i class="iconfont icon-drag drag-widget"></i>
                </div>
              </PreviewRepeatable>
            </template>

            <template v-else>
              <widget-form-item v-if="element && element.key"  :key="element.key" :element="element" :select.sync="selectWidget" :index="index" :data="data"></widget-form-item>
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'
import Grid from './Layout/Grid'
import Steps from './Layout/Steps'
export default {
  components: {
    Draggable,
    WidgetFormItem,
    Grid,
    Steps,
  },
  props: ['data', 'select'],
  data () {
    return {
      selectWidget: this.select
    }
  },
  mounted () {
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    handleMoveEnd ({newIndex, oldIndex}) {
      console.log('index', newIndex, oldIndex)
    },
    handleSelectWidget (index) {
      console.log(index, '#####')
      this.selectWidget = this.data.list[index]
    },
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.list[index - 1];
        }
      } else {
        this.selectWidget = this.data.list[index + 1];
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1);
      });
    },
    handleWidgetAdd (evt) {
      console.log('add', evt)
      console.log('end', evt)
      const newIndex = evt.newIndex
      const to = evt.to
      console.log(to)
      
      //为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: this.data.list[newIndex].type + '_' + key,
        rules: []
      })

      if (this.data.list[newIndex].type === 'radio' || this.data.list[newIndex].type === 'checkbox' || this.data.list[newIndex].type === 'select') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            options: this.data.list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        })
      }

      if (this.data.list[newIndex].type === 'grid' || this.data.list[newIndex].type === 'multipleinput') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          columns: this.data.list[newIndex].columns.map(item => ({...item}))
        })
      }

      this.selectWidget = this.data.list[newIndex]
    },
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>
