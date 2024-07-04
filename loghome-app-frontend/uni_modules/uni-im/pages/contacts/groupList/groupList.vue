<template>
	<view>
		<uni-search-bar placeholder="搜索群号/群名称" :radius="100" bgColor="#eeeeee" v-model="keyword" 
			@cancel="doClear"
			@clear="doClear"
		></uni-search-bar>
		<uni-list :border="false">
			<uni-list-chat v-for="(item,index) in groupList" :key="index" 
				@click="toChat(item.group_info._id)" link
				:title="item.group_info.name"
				:avatar="item.group_info.avatar_file&&item.group_info.avatar_file.url ? item.group_info.avatar_file.url : '/uni_modules/uni-im/static/avatarUrl.png'">
			</uni-list-chat>
		</uni-list>
		<uni-load-more :status="groupHasMore?'loading':'noMore'"></uni-load-more>
	</view>
</template>

<script>
	import uniIm from '@/uni_modules/uni-im/lib/main.js';
	export default {
		data() {
			return {
				keyword: '',
				groupData:false
			}
		},
		computed: {
			//是否为pc宽屏（width>960px）
			isWidescreen(){
				return uniIm.isWidescreen
			},
			groupList() {
				let groupList = uniIm.group.get()
				if(this.keyword){
					return groupList.filter(item=>{
					  return item.group_info.name.includes(this.keyword) || item.group_info._id.includes(this.keyword)
					})
				}else{
					return groupList
				}
			},
			groupHasMore(){
				return uniIm.group.hasMore
			}
		},
		onLoad() {
			
		},
		methods: {
			doClear(){
				this.keyword = ''
			},
			toChat(group_id) {
				let conversation_id = 'group_' + group_id
				if(this.isWidescreen){
					uni.$emit('uni-im-toChat',conversation_id)
				}else{
					let url = "/uni_modules/uni-im/pages/chat/chat?conversation_id=" + conversation_id
					uni.navigateTo({
						url,
						animationDuration: 300,
						fail: (error1) => {
							uni.switchTab({
								url,
								animationDuration: 300,
								fail: (error2) => {
									console.error(error1,error2);
								}
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
