<template>
	<view :class="['store-icon', 'tone-' + tone]" :style="iconStyle" aria-hidden="true" />
</template>

<script>
const names = [
	'grid',
	'cube',
	'pen',
	'orders',
	'pin',
	'chevron',
	'arrow',
	'close',
	'check',
	'check-circle',
	'wallet',
	'log',
	'package',
	'gift',
	'plus',
	'clock',
]
export default {
	name: 'StoreIcon',
	props: {
		name: { type: String, default: 'log' },
		tone: { type: String, default: 'inherit' },
		size: { type: [Number, String], default: 40 },
	},
	computed: {
		iconStyle() {
			const name = names.includes(this.name) ? this.name : 'log'
			// 行内 style 的 url() 不经过 uni 运行时的路径改写，按文档地址相对解析：
			// 统一用 ./static/，dev 服务器、http 生产与 Android file:// 打包环境均可正确解析；
			// /static/ 根绝对路径在 file:// 下会指向 file:///static/... 导致图标全部失效
			const url = `url("./static/store/icons/${name}.svg")`
			const size = typeof this.size === 'number' ? this.size + 'rpx' : this.size
			return { width: size, height: size, maskImage: url, WebkitMaskImage: url }
		},
	},
}
</script>

<style lang="scss" scoped>
.store-icon {
	display: inline-block;
	flex-shrink: 0;
	vertical-align: middle;
	background: currentColor;
	mask-size: contain;
	mask-position: center;
	mask-repeat: no-repeat;
	-webkit-mask-size: contain;
	-webkit-mask-position: center;
	-webkit-mask-repeat: no-repeat;
}
.tone-brand {
	color: var(--store-primary, #264d3c);
}
.tone-muted {
	color: var(--store-muted, #737b74);
}
.tone-warm {
	color: var(--store-accent, #b3633c);
}
.tone-inverse {
	color: #fff;
}
</style>
