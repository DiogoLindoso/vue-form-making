<template>
  <div class="widget-form-container">
    <div v-if="widgetForm.list.length == 0" class="form-empty">{{$t('fm.description.containerEmpty')}}</div>
    <el-form :size="widgetForm.config.size" label-suffix=":" :label-position="widgetForm.config.labelPosition" :label-width="widgetForm.config.labelWidth + 'px'">
      
      <draggable class="" 
        v-model="widgetForm.list" 
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >

        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in widgetForm.list">
            <template v-if="element.type == 'grid'">
                <grid 
                  v-if="element && element.key"
                  :data.sync="widgetForm"
                  :kind="'widget'"
                  :key="element.key"
                  class="widget-col widget-view"
                  :gutter="element.options.gutter ? element.options.gutter : 0"
                  :justify="element.options.justify"
                  :align="element.options.align"
                  :select.sync="widgetFormSelect"
                  :columns="element.columns"
                  :element="element"
                  :index="index"
                  @click.native="handleSelectWidget(index)"
                />
            </template>
            <template v-else-if="element.type == 'form-steps'">
              <steps
                v-if="element && element.key"
                :data.sync="widgetForm"
                :kind="'widget'"
                :key="element.key"
                class="widget-col widget-view"
                :gutter="element.options.gutter ? element.options.gutter : 0"
                :justify="element.options.justify"
                :align="element.options.align"
                :select.sync="widgetFormSelect"
                :steps="element.steps"
                :element="element"
                :index="index"
                @click.native="handleSelectWidget(index)"
                :simple="element.options.simple"
                :alignCenter="element.options.alignCenter"
                :space="element.options.space"
              />
            </template>
            <template v-else>
              <widget-form-item v-if="element && element.key"  :key="element.key" :element="element" :select.sync="widgetFormSelect" :index="index" :data="widgetForm"></widget-form-item>
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
import { mapFields } from 'vuex-map-fields';

export default {
  components: {
    Draggable,
    WidgetFormItem,
    Grid,
    Steps,
  },
  props: ['select'],
  computed:{
    ...mapFields('making',[

      'widgetForm',
      'widgetFormSelect',
      'allowMove',
    ]),

  },
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
      this.widgetFormSelect = this.widgetForm.list[index]
    },
    handleWidgetAdd (evt) {
      console.log('add', evt)
      console.log('end', evt)
      const newIndex = evt.newIndex
      const to = evt.to
      console.log(to)
      
      //为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      this.$set(this.widgetForm.list, newIndex, {
        ...this.widgetForm.list[newIndex],
        options: {
          ...this.widgetForm.list[newIndex].options,
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: this.widgetForm.list[newIndex].type + '_' + key,
        rules: []
      })

      if (this.widgetForm.list[newIndex].type === 'radio' || this.widgetForm.list[newIndex].type === 'checkbox' || this.widgetForm.list[newIndex].type === 'select') {
        this.$set(this.widgetForm.list, newIndex, {
          ...this.widgetForm.list[newIndex],
          options: {
            ...this.widgetForm.list[newIndex].options,
            options: this.widgetForm.list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        })
      }

      if (this.widgetForm.list[newIndex].type === 'grid' || this.widgetForm.list[newIndex].type === 'multipleinput') {
        this.$set(this.widgetForm.list, newIndex, {
          ...this.widgetForm.list[newIndex],
          columns: this.widgetForm.list[newIndex].columns.map(item => ({...item}))
        })
      }

      this.widgetFormSelect = this.widgetForm.list[newIndex]
    },
  },
}
</script>
