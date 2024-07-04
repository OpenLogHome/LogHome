<template>
	<view class="outer">
		<div class="info">
			<p>如果你忘记了密码，请通过以下渠道联系我们：</p>
			<p>1.加入原木社区任意用户QQ群</p>
			<div class="bordered groups">
				<p>原木社区用户群列表：</p>
				<p>原木社区开源计划交流群：701928273</p>
			</div>
			<p>2.联系群内管理员<span style="font-weight:bold;color:rgb(180, 111, 88)">通过私聊</span>发送恢复账号的请求。</p>
			<p>如果你的账号此前绑定过QQ号，请使用绑定的QQ号进行账号恢复，将更有可能成功恢复你的账号。</p>
			<p>否则，我们需要你提供账号的其他信息，来证明你确实是账号的主人。</p>
		</div>
		<!-- <div class="button" @click="goAnyWay">以游客身份继续使用</div> -->
	</view>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				code:""
			}
		},
		methods:{
			copyCode(){
			},
			goAnyWay(){
			}
		},
		mounted(){
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		padding:30rpx;
		.info{
			font-size:30rpx;
			line-height:60rpx;
			color: #606063;
			div.bordered{
				border: 2px solid #606063;;
			}
			div.verifyCode{
				line-height:120rpx;
				text-align: center;
				font-size: 80rpx;
				height:120rpx;
			}
			div.groups{
				padding:20rpx;
			}
		}
		.button{
			height: 40px;
			width: 80%;
			margin-top: 30px;
			margin-left: 10%;
			font-size: 16px;
			
			font-weight: bold;
			line-height: 38px;
			border-radius: 5px;
			text-align:center;
			color: #ffffff;
			background-color: rgb(180, 111, 88);
			
		}
		 
		.button:active {  
			background-color:rgb(225, 139, 110);
		}
	}
</style>
