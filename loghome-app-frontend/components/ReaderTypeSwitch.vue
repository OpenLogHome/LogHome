<template>
	<div class="reader-type-switch" role="radiogroup" aria-label="阅读器类型">
		<button type="default" class="type-option" :class="{ selected: value === 'page' }"
			role="radio" :aria-checked="value === 'page'" @click="$emit('change', 'page')">
			<i class="el-icon-reading"></i>
			<span>翻页</span>
		</button>
		<button type="default" class="type-option" :class="{ selected: value === 'text' }"
			role="radio" :aria-checked="value === 'text'" @click="$emit('change', 'text')">
			<i class="el-icon-document"></i>
			<span>滚动</span>
		</button>
	</div>
</template>

<script>
export default {
	name: 'ReaderTypeSwitch',
	props: {
		value: {
			type: String,
			required: true
		}
	}
};
</script>

<style scoped lang="less">
.reader-type-switch {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	width: 100%;
	padding: 5rpx;
	background: rgba(127, 127, 127, 0.14);
	border-radius: 14rpx;
	box-sizing: border-box;
}

.type-option {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 62rpx;
	margin: 0;
	padding: 0 14rpx;
	background: transparent;
	border: 2rpx solid transparent;
	border-radius: 10rpx;
	box-sizing: border-box;
	color: inherit;
	font-size: 27rpx;
	line-height: 62rpx;
	opacity: 0.7;
}

.type-option::after {
	border: 0;
}

.type-option i {
	margin-right: 10rpx;
}

.type-option.selected {
	background: rgba(255, 255, 255, 0.2);
	border-color: currentColor;
	font-weight: 600;
	opacity: 1;
}
</style>
