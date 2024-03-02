<template>
	<view class="outer">
		<jinEdit placeholder="请输入内容" @editOk="editOk" 
		uploadFileUrl="http://img.codesocean.top/upload/img" fileKeyName="img"></jinEdit> 
	</view>
	
</template>

<script>
	import jinEdit from '../../components/jin-edit/jin-edit.vue';
	export default {
		data() {
			return {

			}
		},
		components: {
			jinEdit
		},
		methods: {
			// 点击发布
			editOk(res) {
				uni.setClipboardData({
					data: res.html,
					success: function () {
					    console.log('success');
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		height:100%;
	}
</style>