<template>
	<div class="outer">
		<div class="button" v-for="button in buttons" @click="onButtonClick(button)" v-show="shownButtons.includes(button.name)">
			<div class="icon">
				<i :class="button.icon"></i>
			</div>
			<div class="name">
				{{button.name}}
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "readerSelectionMenu",
		props: ["shownButtons"],
		data() {
			return {
				buttons: [
					{
						icon: "el-icon-notebook-2",
						name: "想法"
					},
					{
						icon: "el-icon-edit",
						name: "划线"
					},
					{
						icon: "el-icon-delete",
						name: "取消划线"
					},
					{
						icon: "el-icon-scissors",
						name: "复制"
					},
					// {
					// 	icon: "el-icon-share",
					// 	name: "分享"
					// },
					// {
					// 	icon: "el-icon-search",
					// 	name: "查询"
					// }
				]
			};
		},
		methods:{
			onButtonClick(button){
				this.$emit("select", button.name)
			}
		}
	}
</script>

<style lang="scss">
.outer{
	margin: 0 0 0 50rpx;
	padding: 0;
	height: 120rpx;
	background-color: #000a;
	border-radius: 10rpx;
	backdrop-filter: blur(10rpx);
	display:flex;
	.button{
		width: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.icon{
			color: white;
			font-size: 46rpx;
			margin: 6rpx 0;
		}
		.name{
			color: white;
			font-size: 24rpx;
		}
	}
}
</style>