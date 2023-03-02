<script setup>
  import './styles.scss';
  import { format } from 'date-fns';
  import GenerateFormItem from '../GenerateFormItem.vue';
</script>

<template>
  <el-popover
    placement="top"
    v-model="popoverVisible"
    @show="tooltipDisable = true"
    @hide="tooltipDisable = false"
  >
    <div style="text-align: center;">
      <el-button v-if="review.state != 'disapproved'" type="danger" size="mini" @click="_updateState('disapproved')">reprovar</el-button>
      <el-button v-if="review.state != 'approved'" type="success" size="mini" @click="_updateState('approved')">aprovar</el-button>
    </div>
    <template #reference>
      <el-tooltip
        placement="top"
        transition="'el-fade-in'"
        effect="light"
        :disabled="!showTooltip || tooltipDisable"
      >
        <div v-if="showTooltip" slot="content">
          <strong>
            {{ formattedState }} por: 
          </strong>
          {{ formattedName }}<br>
          <i>no dia {{ formattedApprovalDate }}</i>
        </div>
          <GenerateFormItem
            :class="review.state"
            :widget="{...widget, options: {
              ...widget.options,
              disabled: true
            }}"
            :value="model"
            :rules="{}"
            :remote="{}"
            :hiddenLabel="hideLabel"
            @click="_togglePopover"
            readonly
          >
            <div :style="{
              fontSize: fontSizeIcon
            }" class="icon" >
              <i v-if="review.state === 'approved'" class="el-icon-success"></i>
              <i v-else-if="review.state === 'disapproved'" class="el-icon-error"></i>
              <i v-else class="el-icon-question"></i>
            </div>
          </GenerateFormItem>
      </el-tooltip>
    
    </template>
  </el-popover>
</template>


<script>
 export default {
  props: {
    widget: Object,
    model: String | Number | Array,
    hideLabel: false,
    loggedUser: Object,
    value: Object,
  },
  data: function() {
    return {
      review: this.value,
      popoverVisible: false,
      tooltipDisable: false
    }
  },
  methods: {
    _togglePopover() {
      this.popoverVisible = !this.popoverVisible;

      this.tooltipDisable = true;
      console.log(this.tooltipDisable);
    },
    _updateState(newState) {
      this.review.state = newState;
      this.review.approver = { ...this.loggedUser };
      this.review.approvalDate = new Date().toISOString();
      this.popoverVisible = false;
    }
  },
  computed: {
    label: function() {
      return !this.hideLabel ? this.widget.name : null;
    },
    labelWidth: function() {
      return this.hideLabel ? '0': null;
    },
    showTooltip: function () {
      return this.review.state != 'review';
    },
    formattedApprovalDate() {
      const date = new Date(this.review.approvalDate);
      return format(date, "dd 'de' MMMM 'de' Y 'às' HH:mm");
    },
    fontSizeIcon() {
      if (this.widget.type === 'textarea' || this.widget.options.inline === false) {
        return '4.5em';
      }

      return null;
    },
    formattedState() {
      switch (this.review.state) {
        case 'approved':
          return 'Aprovado'
      
        case 'disapproved':
          return 'Reprovado';

        default:
          break;
      }
    },
    formattedName() {
      const { name, rCode } = this.review.approver;
      return `(${rCode}) ${name}`;
    }
  }
 }
</script>