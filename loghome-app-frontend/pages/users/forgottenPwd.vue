<template>
	<view class="outer" v-dark>
		<div class="info">
			<p>{{ $t('auth.forgot.contactUs') }}</p>
			<p>{{ $t('auth.forgot.joinAnyGroup') }}</p>
			<div class="bordered groups">
				<p>{{ $t('auth.forgot.groupListTitle') }}</p>
				<p>{{ $t('auth.forgot.groupExchange') }}644467605</p>
				<p v-show="false">{{ $t('auth.forgot.groupBeta') }}931304998</p>
				<p>{{ $t('auth.forgot.groupWriters') }}464239748</p>
			</div>
			<p>{{ $t('auth.forgot.contactAdminPrefix') }}<span style="font-weight:bold;color:var(--brand-text-color)">{{ $t('auth.forgot.contactAdminVia') }}</span>{{ $t('auth.forgot.contactAdminSuffix') }}</p>
			<p>{{ $t('auth.forgot.qqBoundTip') }}</p>
			<p>{{ $t('auth.forgot.needProof') }}</p>
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
			color: var(--text-color-regular);
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
