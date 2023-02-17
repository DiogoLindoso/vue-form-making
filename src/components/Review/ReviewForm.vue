<script setup>
import ReviewFormItem from "./ReviewFormItem.vue";
</script>

<template>
  <div class="fm-style fm-style-review">
    <el-form
      label-suffix=":"
      label-width="auto"
      :size="formSize"
      :label-position="labelPosition"
    >
      <template v-for="element in template.list">
        <template v-if="element.type === 'grid'">
          <el-row
            :key="element.key"
            type="flex"
            :gutter="element.options.gutter"
            :justify="element.options.justify"
            :align="element.options.align"
          >
            <el-col
              v-for="(column, index) in element.columns"
              :key="index"
              :span="column.span"
            >
              <ReviewFormItem
                v-for="columnElement in column.list"
                :key="columnElement.key"
                :widget="columnElement"
                :model="models[columnElement.model]"
                v-model="reviews[columnElement.model]"
                :logged-user="loggedUser"
              />
            </el-col>
          </el-row>
        </template>

        <template v-else-if="element.type === 'multipleinput'">
          <el-table  :key="element.key" :data="models[element.model]" style="width: 100%" max-height="300">
            <el-table-column :class-name="element.options.showLabel ? '' : 'hide'" header-align="center" :label="element.name">
              <el-table-column
                v-for="(column, index) in element.columns"
                :key="index"
                :label="column.item.name"
                :width="column.width"
              >
                <template #default="{$index}">
                  <ReviewFormItem
                    :widget="column.item"
                    :model="models[element.model][$index][column.item.name]"
                    v-model="reviews[element.model][$index][column.item.name]"
                    :logged-user="loggedUser"
                    hide-label="true"
                  />
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>

        <template v-else>
          <ReviewFormItem
            :key="element.key"
            :widget="element"
            :model="models[element.model]"
            :value="reviews[element.model]"
            :logged-user="loggedUser"
          />
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'fm-review-form',
  props: {
    template: Object,
    data: Object,
  },
  data: function() {
    return {
      models: this.data.models,
      reviews: {},
    }
  },
  created: function() {
    this.reviews = this.data.reviews || this._generateReviews(this.models)
  },
  methods: {
    _generateReviews: function(inObject) {
      let outObject, value,  key;

      if (typeof inObject !== 'object' || inObject === null) {
        return { state: 'review' };
      }

      outObject = Array.isArray(inObject) ? [] : {};

      for (key in inObject) {
        value = inObject[key]

        outObject[key] = this._generateReviews(value)
      }

      return outObject;
    },
    _updateStates: function(reviews, newState) {
      const currentDate = new Date();
      for (const key in reviews) {
        const review = reviews[key];
        if (review.length != undefined) {
          review.forEach(item => this._updateStates(item, newState));
          continue
        }
        review.state = newState;
        review.approver = { ...this.loggedUser };
        review.approvalDate = currentDate;
      }
    },
    _hasStatesInReview: function() {
      const reviews =  Object.values(this.reviews);
      return reviews.flatMap(review => {
        if (review.length != undefined) {
          return review.flatMap(Object.values);
        }
        return review;
      }).some(review => review.state == 'review');
    },
    approveAll: function() {
      this._updateStates(this.reviews, 'approved');
    },
    reproveAll: function() {
      this._updateStates(this.reviews, 'disapproved');
    },

    submit: async function() {
      const promisseCallback = (resolve, reject) => {
        if(this._hasStatesInReview()) {
          reject('É necessario avaliar todos os campos!');
        }
        resolve(this.reviews);
      }
      return new Promise(promisseCallback);
    }

  },
  computed: {
    loggedUser: function () {
      return {
        name: 'Matheus Lucas',
        rCode: '5976'
      }
    },
    labelPosition: function () {
      return this.template.config.labelPosition;
    },
    formSize: function () {
      return this.template.config.size;
    },
  }
};
</script>
