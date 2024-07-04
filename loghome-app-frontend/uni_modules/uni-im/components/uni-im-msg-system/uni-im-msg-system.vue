<template>
	<text class="system-msg">{{friendlyTime}} {{content}}</text>
</template>

<script>
	import uniImUtils from '@/uni_modules/uni-im/common/utils.js';
	export default {
		props: {
			msg: {
				type: Object,
				default(){
					return {
						userList:[]
					}
				}
			},
		},
		computed: {
			friendlyTime(){
				return uniImUtils.toFriendlyTime(this.msg.create_time || this.msg.client_create_time)
			},
			content() {
				// console.error(1212,this.msg)
				switch (this.msg.action){
					case "join-group-notice":
						return ''+ this.msg.body.user_list.map(item=>item.nickname).join(' , ') + ' 加入群聊'
						break;
					default:
						return this.msg.body
						break;
				}
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.system-msg {
		background-color: #f2f2f2;
		color: #9d9e9d;
		font-size: 14px;
		height: 30px;
		line-height: 30px;
		padding: 0 15rpx;
		border-radius: 8px;
	}
</style>