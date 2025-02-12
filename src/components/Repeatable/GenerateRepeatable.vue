<script setup>
import './styles.scss';

import GenerateFormItem from '../GenerateFormItem.vue';
</script>

<template>
	<div v-if="hasAllInputTypes" class="repeatable-wrapper">
		<div class="repeatable-header">
			<el-row type="flex" align="middle" :gutter="widget.options.gutter">
				<el-col v-for="(column, index) in columns" :key="index" :span="column.span">
					<span class="title" :class="{ 'required': column.item.options.required }">
						{{ column.item.name }}
					</span>
				</el-col>
				<el-col :span="-1">
					<div class="actions">
						<el-tag
							plain
							type="info"
							size="medium"
							@click="newRow()"
							:class="{ disabled: disabledAddButton }"
						>
							<i class="el-icon-plus"></i>
						</el-tag>
					</div>
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
					:gutter="widget.options.gutter"
				>
					<el-col v-for="(model, columnIndex) in row" :key="model" :span="columns[columnIndex].span">
						<GenerateFormItem
							v-if="model"
							:widget="{...columns[columnIndex].item, model}"
							v-model="value[model]"
							@input-change="(value, key) => $emit('input-change', value, key)"
						/>
					</el-col>
					<el-col :span="-1">
						<div class="actions">
							<el-tag
								effect="light"
								type="primary"
								size="medium" @click="cloneRow(rowIndex)"
								:class="{ disabled: disabledAddButton }"
							>
								<i class="el-icon-copy-document"></i>
							</el-tag>
							<el-tag
								effect="light"
								type="danger"
								size="medium"
								@click="deleteRow(rowIndex)"
								:class="{ disabled: disabledDeleteButton }"
							>
								<i class="el-icon-minus"></i>
							</el-tag>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-empty v-else description="Vazio" />
		</div>
	</div>
	<el-alert
		v-else
		title="Alerta de error"
		type="error"
		description="Não foi possivel encontrar os tipos das colunas"
		show-icon
		:closable="false"
	/>
</template>

<script>
export default {
	props: {
		widget: Object,
		value: Object
	},
	data: function() {
		return {
			rows: [],
		}
	},
	created: function() {
		const model = this.widget.model;
		console.log(this.value);
		const models = Object.keys(this.value).filter(key => key.startsWith(model));
		console.log('models', models);

		if (models.length == 0) {
			for (let i = 0; i < this.widget.options.min; i++) {
				console.log('i >> ', i);
				setTimeout(this.newRow, i * 25);
			}
		}

		for (const model of models) {
			const keyParts = model.split('_');
			const endKey = keyParts[keyParts.length - 1];
			const name = keyParts[keyParts.length - 2];
			const index = this.columns.findIndex(({ item }) => item.name.toLocaleLowerCase() === name);
			const doesNotContainModelInRows = this.rows.every(row => {
				const containModelInRow = row.some(key => key.endsWith(endKey));
				if(containModelInRow) {
					row.splice(index, 1, model);
					return false;
				}
				return true;
			});
			if (doesNotContainModelInRows) {
				let row = Array(this.columns.length);
				row.splice(index, 1, model);
				this.rows.push(row);
			}
		}
	},
	methods: {
		createRow: function() {
			const widgetModel = this.widget.model;
			const key = new Date().getTime();
			return this.columns.map(column => {
				const item = column.item;
				const modelKey = `${widgetModel}_${item.name.toLocaleLowerCase()}_${key}`;
				this.value[modelKey] = item.options.defaultValue;
				return modelKey;
			});
		},
		newRow: function() {
			if (this.disabledAddButton) return;
			this.rows.push(this.createRow());
		},
		deleteRow: function(index) {
			if (this.disabledDeleteButton) return;
			const [row] = this.rows.splice(index, 1);
			row.forEach(this.deleteModel);
		},
		deleteModel: function(model) {
			delete this.value[model];
		},
		cloneRow: function(index) {
			if (this.disabledAddButton) return;
			const clonedRow = this.rows[index];
			const newRow = this.createRow();
			for (let index = 0; index < newRow.length; index++) {
				const model = newRow[index];
				let clonedModel = clonedRow[index];
				const clonedValue = this.value[clonedModel];
				this.$emit('input-change', clonedValue, model);
			}
			this.rows.splice(index + 1, 0, newRow);
		}
	},
	computed: {
		columns: function() {
			return this.widget.columns;
		},
		hasAllInputTypes: function() {
			return this.columns.every(column => column.item !== null);
		},
		maxHeight: function() {
			return `${this.widget.options.maxHeight}px`;
		},
		disabledDeleteButton: function() {
			return this.rows.length <= this.widget.options.min;
		},
		disabledAddButton: function() {
			const max = this.widget.options.max;
			const min = this.widget.options.min;
			if (max == 0) return false;
			if (max < min) return true;
			return this.rows.length >= max;
		}
	}
}
</script>