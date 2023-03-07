<template>
	<div class="image-wrapper" :style="{ height }" >
		<img
			v-if="element.options.imageURL"
			:src="element.options.imageURL"
			:style="{ objectFit: element.options.objectFit }"
			alt=""
		/>
		<i v-else class="el-icon-picture"></i>
	</div>
</template>
<script>
export default {
	props: { element: Object },
	computed: {
		height: function() {
			return `${this.element.options.height}px`;
		}
	},
}
</script>
<style scoped lang="scss">
.image-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	i {
		font-size: 5em;
	}

	img {
		width: 100%;
		height: 100%;
	}
}
</style>