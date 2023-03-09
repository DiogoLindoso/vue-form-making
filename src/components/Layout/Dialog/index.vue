<template>
	<div class="dialog-wrapper">
		<el-button type="text" @click="visible = true">
			{{ element.buttonText }}
		</el-button>

		<el-dialog :visible.sync="visible" :title="title">
			<code style="white-space: pre-line;">
					{{ content }}
				</code>
		</el-dialog>
	</div>
</template>

<script>
export default {
	props: { element: Object },
	data: function () {
		return {
			visible: false,
			title: this.element.options.title,
			content: this.element.options.content
		}
	},
	watch: {
		'element.options': {
			deep: true,
			handler: function (options) {
				Object.assign(this, options);
			}
		}
	}
}
</script>

<style scoped lang="scss">
.dialog-wrapper {
	.el-dialog__body code {
		background-color: transparent;
		color: #000;
	}
}
</style>