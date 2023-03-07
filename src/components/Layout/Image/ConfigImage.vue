<template>
	<div style="margin-bottom: 16px;">
		<el-form-item :label="$t('fm.config.widget.objectFit')">
			<el-select v-model="data.options.objectFit">
				<el-option
					v-for="(item, index) in ['none', 'fill', 'contain', 'cover', 'scale-down']"
					:key="index"
					:label="item"
					:value="item"
				/>
			</el-select>
		</el-form-item>

		<section>
			<el-button class="upload-button" size="small" type="primary">
				{{ $t('fm.config.widget.uploadButton') }}
				<input
					ref="uploadInput"
					class="upload-input"
					type="file"
					@change="handleChange"
				/>
			</el-button>
			<div slot="tip" class="el-upload__tip">{{ $t('fm.config.widget.uploadDescription') }}</div>

			<ul class="el-upload-list el-upload-list--text">
				<li class="el-upload-list__item is-ready" v-for="(file, index) in data.files" :key="index">
					<a class="el-upload-list__item-name">
						<i class="el-icon-document"></i>
						{{ file.name }}
     			</a>
					<label class="el-upload-list__item-status-label">
						<i class="el-icon-upload-success el-icon-circle-check"></i>
					</label>
					<i class="el-icon-close" @click="handleRemove(file)"></i>
				</li>
			</ul>
		</section>
	</div>
</template>

<script>
export default {
	props: {
		data: Object
	},
	methods: {
		handleChange: async function(event) {
			const [file] = this.$refs.uploadInput.files
			const maximumLimitOf5MB = 5 * 1024 * 1024;
			const exceededMaximumLimit = file.size > maximumLimitOf5MB;
			if(exceededMaximumLimit) {
				this.$message.warning('Arquivo muito grande, seu arquivo deverá ter no máximo 5MB.');
				return;
			}
			if (!file) return;
			this.data.files = [file];
			this.data.options.imageURL = await this._fileToDataURL(file);
		},
		_fileToDataURL: function(file) {
			const promiseCallback = (success, error) => {
				const reader = new FileReader(file);
				reader.readAsDataURL(file);
				reader.onload = () => success(reader.result);
				reader.onerror = () => error(reader.error.message);
			}
			return new Promise(promiseCallback);
		},
		handleRemove: function(file) {
			this.$confirm(`Cancel the transfert of ${ file.name } ?`).then(_ => {
				const index = this.data.files.indexOf(file);
				if (index >= 0) {
					this.data.files.splice(index, 1);
					this.data.options.imageURL = null;
				}
			});
		},
	},
	watch: {
		data: {
			deep: true,
			handler: function(value) {
				console.log(value.files);
			}
		}
	}
}
</script>
<style scoped lang="scss">
.upload-button {
	position: relative;
	.upload-input {
		opacity: 0;
		position: absolute;
		inset: 0;
	}
}
</style>