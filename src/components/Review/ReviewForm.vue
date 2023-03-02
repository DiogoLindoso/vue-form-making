<script setup>
import ReviewFormItem from "./ReviewFormItem.vue";
import ReviewFormStep from "./ReviewFormStep.vue";
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

        <ReviewRepeatable 
          v-else-if="element.type === 'repeatable'"
          :element="element"
          :models="models"
          :reviews="reviews"
          :logged-user="loggedUser"
        />

        <ReviewFormStep 
          v-else-if="element.type === 'form-steps'"
          :element="element"
          :models="models"
          :reviews="reviews"
          :logged-user="loggedUser"
        />

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
    loggedUser: Object,
  },
  data: function() {
    return {
      models: this.data.models,
      reviews: {},
    }
  },
  created: function() {
    this.reviews = this.data.reviews || this._generateReviews(this.models);
    console.log(this.reviews);
  },
  methods: {
    _generateReviews: function(inObject) {
      const outObject = {}
      for (const key in inObject) {
        outObject[key] = { state: 'review' }
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
    labelPosition: function () {
      return this.template.config.labelPosition;
    },
    formSize: function () {
      return this.template.config.size;
    },
  }
};
</script>
