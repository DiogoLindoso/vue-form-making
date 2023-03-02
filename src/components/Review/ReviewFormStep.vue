<script setup>
import ReviewFormItem from './ReviewFormItem.vue'
import ReviewRepeatable from '../Repeatable/ReviewRepeatable.vue';
</script>

<template>
	<div>
		<el-steps :active="stepActive" finish-status="success">
			<el-step v-for="step in element.steps" :title="step.title" />
		</el-steps>
		<div>
			<div v-if="index === stepActive" v-for="(step, index) in element.steps">
				<template v-for="subElement in step.list">
					<template v-if="subElement.type === 'grid'">
						<el-row
							:key="subElement.key"
							type="flex"
							:gutter="subElement.options.gutter"
							:justify="subElement.options.justify"
							:align="subElement.options.align"
						>
							<el-col
								v-for="(column, index) in subElement.columns"
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
						v-else-if="subElement.type === 'repeatable'"
						:element="subElement"
						:models="models"
						:reviews="reviews"
						:logged-user="loggedUser"
					/>

					<template v-else>
						<ReviewFormItem
							:key="subElement.key"
							:widget="subElement"
							:model="models[subElement.model]"
							:value="reviews[subElement.model]"
							:logged-user="loggedUser"
						/>
					</template>
				</template>
			</div>
			<el-button style="margin-top: 12px;" @click="nextStep">Next step</el-button>
		</div>

	</div>
</template>
<script>
export default {
	props: {
		element: Object,
		loggedUser: Object,
		models: Object,
		reviews: Object
	},
	data: function () {
		return {
			stepActive: 0,
		}
	},
	methods: {
		nextStep: function () {
			if (this.stepActive++ >= this.element.steps.length - 1) this.stepActive = 0;
		}
	}
}
</script>