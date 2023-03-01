<script setup>
import './styles.scss';

import GenerateFormItem from '../GenerateFormItem.vue';
</script>

<template>
	<div v-if="hasAllInputTypes" class="repeatable-wrapper">
		<div class="repeatable-header">
			<el-row type="flex" align="middle">
				<el-col v-for="(column, index) in columns" :key="index" :span="24">
					<span class="title" :class="{ 'required': column.item.options.required }">
						{{ column.item.name }}
					</span>
				</el-col>
				<el-col :span="4">
					<div class="actions">
						<el-tag
							plain
							type="info"
							size="medium"
							@click="newRow"
						>
							<i class="el-icon-plus"></i>
						</el-tag>
					</div>
				</el-col>
			</el-row>
		</div>

		<div class="repeatable-body">
			<div v-if="rows.length > 0" class="rows">
				<el-row 
					v-for="(row, rowIndex) in rows"
					:key="rowIndex"
					type="flex"
					align="middle"
				>
					<el-col v-for="(model, columnIndex) in row" :key="model" :span="24">
						<GenerateFormItem
							v-if="!approvedFields.includes(model)"
							:widget="{...columns[columnIndex].item, model}"
							v-model="value[model]"
							hidden-label="true"
							@input-change="(value, key) => $emit('input-change', value, key)"
						/>
					</el-col>
					<el-col :span="4">
						<div class="actions">
							<el-tag effect="light" type="primary" size="medium" @click="cloneRow(rowIndex)">
								<i class="el-icon-copy-document"></i>
							</el-tag>
							<el-tag effect="light" type="danger" size="medium" @click="deleteRow(rowIndex)">
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
		value: Object,
		approvedFields: { type: Array, default: () => [] }
	},
	data: function() {
		return {
			rows: [],
		}
	},
	methods: {
		createRow: function() {
			const widgetModel = this.widget.model;
			const key = new Date().getTime();
			return this.columns.map(column => {
				const item = column.item;
				const modelKey = `${widgetModel}_${item.name}_${key}`;
				this.value[modelKey] = item.options.defaultValue;
				return modelKey;
			});
		},
		newRow: function() {
			this.rows.push(this.createRow());
		},
		deleteRow: function(index) {
			const [row] = this.rows.splice(index, 1);
			row.forEach(this.deleteModel);
		},
		deleteModel: function(model) {
			delete this.value[model];
		},
		cloneRow: function(index) {
			const clonedRow = this.rows[index];
			const newRow = this.createRow();
			for (let index = 0; index < newRow.length; index++) {
				const model = newRow[index];
				let clonedModel = clonedRow[index];
				const clonedValue = this.value[clonedModel];
				this.$emit('input-change', clonedValue, model);
			}
			this.rows.push(newRow);
		}
	},
	computed: {
		columns: function() {
			return this.widget.columns;
		},
		hasAllInputTypes: function() {
			return this.columns.every(column => column.item !== null);
		}
	}
}
</script>