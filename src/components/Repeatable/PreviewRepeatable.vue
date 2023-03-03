<script setup>
import './styles.scss';
import GenerateFormItem from '../GenerateFormItem.vue';
</script>

<template>
	<div v-if="hasAllInputTypes" class="repeatable-wrapper">
		<div class="repeatable-header">
			<el-row type="flex" align="middle" :gutter="element.options.gutter">
				<el-col v-for="(column, index) in element.columns" :key="index" :span="column.span">
					<span
						class="title selectable"
						:class="{
							required: column.item.options.required,
							selected: selectedWidget == column.item
						}"
						@click.stop="selectWidgetByColumn(column)"
					>
						{{ column.item.name }}
					</span>
				</el-col>
				<el-col :span="-1">
					<div class="actions">
						<el-tag
							plain
							type="info"
							size="medium"
							@click.stop="addRow"
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
					:gutter="element.options.gutter"
				>
					<el-col v-for="(model, columnIndex) in row" :key="model" :span="element.columns[columnIndex].span">
						<GenerateFormItem 
							:widget="getWidgetByColumn(columnIndex)"
							hidden-label="true"
						/>
					</el-col>
					<el-col :span="-1">
						<div class="actions">
							<el-tag effect="light" type="primary" size="medium" @click="addRow">
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
			<slot></slot>
		</div>
	</div>
	<div v-else>
		<el-alert
			title="Atenção!"
			type="warning"
			description="Selecione o(s) tipo(s) da(s) coluna(s)"
			show-icon
			:closable="false"
		/>
		<slot></slot>
	</div>
</template>

<script>
export default {
	props: {
		element: Object,
		selectedWidget: Object
	},
	data: function() {
		return {
			rows: []
		}
	},
	methods: {
		selectWidgetByColumn: function(column) {
			this.$emit('update:selectedWidget', column.item)
		},
		addRow: function() {
			const row = this.element.columns.map((_, i) => {
				return `${i}_${new Date().getTime()}`;
			});
			this.rows.push(row);
		},
		deleteRow: function(index) {
			delete this.rows.splice(index, 1);
		},
		getWidgetByColumn(column) {
			const widget = this.element.columns[column].item;
			return {
				...widget,
				options: { ...widget.options, disabled: true }
			};
		}
	},
	computed: {
		hasAllInputTypes: function() {
			return this.element.columns.every(column => column.item !== null);
		},
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