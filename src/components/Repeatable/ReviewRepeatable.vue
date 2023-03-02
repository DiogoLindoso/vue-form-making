<script setup>
import './styles.scss';
import ReviewFormItem from '../Review/ReviewFormItem.vue';
</script>

<template>
	<div class="repeatable-wrapper">
		<div class="repeatable-header">
			<el-row type="flex" align="middle" :gutter="element.options.gutter">
				<el-col v-for="(column, index) in element.columns" :key="index" :span="column.span">
					<span class="title">
						{{ column.item.name }}
					</span>
				</el-col>
			</el-row>
		</div>

		<div class="repeatable-body" :style="{ maxHeight }">
			<div v-if="rows.length > 0" class="rows">
				<el-row
					v-for="(row, rowIndex) in rows"
					:key="rowIndex"
					type="flex"
					align="middle"
					:gutter="element.options.gutter"
				>
					<el-col v-for="(model, columnIndex) in row" :key="model" :span="element.columns[columnIndex].span">
						<ReviewFormItem 
							:widget="getWidgetByColumn(columnIndex)"
							:model="models[model]"
							v-model="reviews[model]"
							:logged-user="loggedUser"
						/>
					</el-col>
				</el-row>
			</div>
			<el-empty v-else description="Vazio" />
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		element: Object,
		models: Object,
		reviews: Object,
		loggedUser: Object
	},
	data: function() {
		return {
			rows: []
		}
	},
	created: function() {
		const widgetModel = this.element.model;
		const modelKeys = Object.keys(this.models).filter(key => key.startsWith(widgetModel));
		
		for (const modelKey of modelKeys) {
			const keyParts = modelKey.split('_');
			const endKey = keyParts[keyParts.length - 1];
			const doesNotContainModelInRows = this.rows.every(row => {
				const containModelInRow = row.some(key => key.endsWith(endKey));
				if(containModelInRow) {
					row.push(modelKey);
					return false;
				}
				return true;
			});

			if (doesNotContainModelInRows) {
				this.rows.push([modelKey]);
			}
		}
	},
	methods: {
		getWidgetByColumn(column) {
			const widget = this.element.columns[column].item;
			return {
				...widget,
				options: { ...widget.options, disabled: true }
			};
		}
	},
	computed: {
		maxHeight: function() {
			return `${this.element.options.maxHeight}px`;
		}
	}
}
</script>

<style lang="scss">
.title {
	&.selectable { cursor: pointer; }
	&.selected {
		color: #e6a23c !important;
		transition: all 150ms ease-in;
	}
}
</style>