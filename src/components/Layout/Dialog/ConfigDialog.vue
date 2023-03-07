<template>
	<div class="dialog config">
		<el-form-item :label="$t('fm.config.widget.buttonText')">
			<el-input type="text" v-model="data.buttonText" />
		</el-form-item>

		<el-form-item :label="$t('fm.config.widget.modalTitle')">
			<el-input type="text" v-model="data.options.title" />
		</el-form-item>

		<el-form-item :label="$t('fm.config.widget.modalContent')">
			<el-input type="textarea" v-model="data.options.content" />
		</el-form-item>

	</div>
</template>

<script>
export default {
	props: {
		data: Object
	}
}
</script>