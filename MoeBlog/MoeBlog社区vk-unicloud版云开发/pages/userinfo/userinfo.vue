<template>
	<view>
	</view>
</template>

<script setup>
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

onLoad((params) => {
	if (params.id) {
		proxy.$framePostman.send({ type: 'USER_PAGE', id: params.id });
	}
	setTimeout(() => {
		// uni.navigateBack();
	}, 1);
})
</script>

<style lang="scss"></style>