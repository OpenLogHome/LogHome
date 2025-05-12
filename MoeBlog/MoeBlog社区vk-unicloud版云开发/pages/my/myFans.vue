<template>
	<z-paging ref="paging" v-model="userData" @query="queryList">
		<view class="myFans">
			<view class="fans">
				<user-item v-for="item in userData" :key="item._id" :item="item"></user-item>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onReachBottom } from "@dcloudio/uni-app"
	import { apiGetUserFans } from "@/api/api.js"
	onLoad((e) => {
	  data.value = e.type;
	  setNavAndType(e.type);
	});
	
	function setNavAndType(typeStr) {
	  if (typeStr === "fans") {
	    uni.setNavigationBarTitle({ title: "我的粉丝" });
	    type.value = "following_id";
	  } else {
	    uni.setNavigationBarTitle({ title: "我的关注" });
	    type.value = "follower_id";
	  }
	}
	onReachBottom(() => {
		

	})
	const following_id=ref(vk.getVuex('$user.userInfo')._id)
	const paging=ref(null)
	const data = ref("")
	const text = ref("")
	const userData = ref([])
	const type = ref("")

	function queryList(pageNo, pageSize){
		  const obj = {
		    type: type.value,
		    pageNo,
		    pageSize,
		    following_id: following_id.value
		  };
		  if (type.value === "follower_id") {
		    obj.follower_id = following_id.value;
		    delete obj.following_id;
		  }
		apiGetUserFans(obj).then(res => {
			paging.value.complete(res.result)
		})
	}
</script>

<style lang="scss">
	.myFans {
		padding: 0 25rpx;
		// min-height: 100vh;

		.title {
			padding: 25rpx 0;
			@include flex-center;
			font-size: 30rpx;
		}

		.fans {}
	}
</style>