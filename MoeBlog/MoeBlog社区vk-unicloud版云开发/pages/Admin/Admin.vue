<template>
	<view class="admin">
		<u-cell-group>
			<u-cell-item @click="ToRouter('/pages/Admin/banner')" icon="setting-fill" title="轮播图管理"></u-cell-item>
			<u-cell-item @click="ToRouter('/pages/Admin/Art')" icon="setting-fill" title="文章管理"></u-cell-item>
			<u-cell-item @click="ToRouter('/pages/Admin/square')" icon="setting-fill" title="圈子管理"></u-cell-item>
			<u-cell-item @click="ToRouter('/pages/Admin/comments')" icon="setting-fill" title="评论管理"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script setup>
import {ref} from "vue"

function ToRouter(url){
	vk.navigateTo(url);
}

</script>

<style lang="scss">
	.admin{
		
	}

</style>
