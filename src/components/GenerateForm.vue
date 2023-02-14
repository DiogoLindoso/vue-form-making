<template>
  <div class="fm-style">
    <el-form ref="generateForm" 
      label-suffix=":"
      :size="data.config.size"
      :model="models" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
      <template v-for="item in data.list">

        <template v-if="item.type == 'grid'">
          <grid
            :kind="'generate'"
            :key="item.key"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align"
            :columns="item.columns"
            v-model="models"
            @input-change="onInputChange"
          />
        </template>

        <template v-else-if="item.type == 'form-steps'">
          <steps
            :kind="'generate'"
            :key="item.key"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align"
            :steps="item.steps"
            :simple="item.options.simple"
            :alignCenter="item.options.alignCenter"
            :space="item.options.space"
            v-model="models"
            @input-change="onInputChange"
            :rules="rules"
            :validateFields="validateFields"
          />
        </template>

        <template v-else-if="item.type == 'blank'">
          <el-form-item :label="item.name" :prop="item.model" :key="item.key">
            <slot :name="item.model" :model="models"></slot>
          </el-form-item>
        </template>

        <template v-else-if="item.type == 'multipleinput'">
          <multiple-input-render
            :key="item.key"
            :widget.sync="item"
            v-model="models[item.model]"
            @input-change="onInputChange"
          />
        </template>

        <template v-else>
          <genetate-form-item 
            :key="item.key" 
            :widget="item" 
            v-model="models[item.model]"
            @input-change="onInputChange"
            :remote="remote">
          </genetate-form-item>
        </template>
        
      </template>
    </el-form>
  </div>
</template>

<script>
import GenetateFormItem from './GenerateFormItem'
import {loadJs} from '../util/index.js'
import Grid from './Layout/Grid'
import Steps from './Layout/Steps'
import MultipleInputRender from './MultipleInput/render'

export default {
  name: 'fm-generate-form',
  components: {
    GenetateFormItem,
    Grid,
    Steps,
    MultipleInputRender
  },
  props: ['data', 'remote', 'value', 'insite'],
  data () {
    return {
      models: {},
      rules: {}
    }
  },
  created () {
    this.generateModle(this.data.list)
  },
  mounted () {
  },
  methods: {
    generateModle (genList) {
      for (let i = 0; i < genList.length; i++) {
        if(genList[i].type === 'form-steps') {
          genList[i].steps.forEach(item => {
            this.generateModle(item.list)
          })
        }
        else if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModle(item.list)
          })
        } else {
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.value[genList[i].model]
          } else {
            if (genList[i].type === 'blank') {
              this.$set(this.models, genList[i].model, genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : []))
            } else {
              this.models[genList[i].model] = genList[i].options.defaultValue
            }      
          }
          
          if (this.rules[genList[i].model]) {
            
            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
              if (item.pattern) {
                return {...item, pattern: new RegExp(item.pattern)}
              } else {
                return {...item}
              }
            })]
          } else {
            
            this.rules[genList[i].model] = [...genList[i].rules.map(item => {
              if (item.pattern) {
                return {...item, pattern: new RegExp(item.pattern)}
              } else {
                return {...item}
              }
            })]
          }      
        }
      }
    },
    getData () {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error(this.$t('fm.message.validError')).message)
          }
        })
      })
    },
    reset () {
      this.$refs.generateForm.resetFields()
    },
    onInputChange (value, field) {
      this.models = {...this.models, [field]: value}
      this.$emit('on-change', field, value, this.models);
    },
    refresh () {
      
    },
    async validateFields(fields) {
      const promiseCallback = (resolve) => {
        this.$refs.generateForm.validateField(fields, errorMessage => {
          resolve(!errorMessage);
        });
      };

      return new Promise(promiseCallback);
    }
  },
  watch: {
    data: {
      deep: true,
      handler (val) {
        this.generateModle(val.list)
      }
    },
    value: {
      deep: true,
      handler (val) {
        console.log(JSON.stringify(val))
        this.models = {...this.models, ...val}
      }
    },
  }
}
</script>

<style lang="scss">
// @import '../styles/cover.scss';
</style>
