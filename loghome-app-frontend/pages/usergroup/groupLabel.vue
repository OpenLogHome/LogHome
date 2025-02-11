<template>
	<span class="user_group" :class="group2class[userGroup]">
		{{userGroup}}
	</span>
</template>

<script>
import group2class from "./group2class.json"
export default {
	name: 'groupLabel',
	props: ['userGroup'],
	data() {
		return {group2class};
	}
}
</script>

<style scoped lang="scss">
	.user_group {
		font-size: 25rpx;
		padding: 10rpx;
		line-height: 40rpx;
		margin-left: 15rpx;
		border-radius: 10rpx;
	}
	
	.user_group.founder {
		color: #885b00;
		background: linear-gradient(135deg,
				#ffaa00ee,
				#ffff00ee,
				#ffaa00ee,
				#ffff00ee,
				#ffaa00ee,
			);
		background-size: 200% 100%;
		animation: gradient-move 15s linear infinite;
	}
	
	.user_group.copemate {
		color: #ffffff;
		background: linear-gradient(135deg,
				#aa00ffee,
				#ff00ffee,
				#aa00ffee,
				#ff00ffee,
				#aa00ffee,
			);
		background-size: 200% 100%;
		animation: gradient-move 15s linear infinite;
	}
	
	.user_group.pioneer {
		color: #ffffff;
		background: linear-gradient(135deg,
				#003194ee,
				#00d6d6ee,
				#003194ee,
				#00d6d6ee,
				#003194ee,
			);
		background-size: 200% 100%;
		animation: gradient-move 15s linear infinite;
	}
	
	@keyframes gradient-move {
		0% {
			background-position: 0% 0;
		}
	
		50% {
			background-position: 100% 0;
		}
	
		100% {
			background-position: 0% 0;
		}
	}
</style>