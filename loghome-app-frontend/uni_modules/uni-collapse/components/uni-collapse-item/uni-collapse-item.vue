<template>
	<view class="uni-collapse-item" v-dark>
		<!-- onClick(!isOpen) -->
		<view class="uni-collapse-item__title"
			:class="{ 'is-open': isOpen && titleBorder === 'auto', 'uni-collapse-item-border': titleBorder !== 'none' }">
			<view class="uni-collapse-item__title-wrap" @click="mainClick(clickInfo)">
				<slot name="title">
					<view class="uni-collapse-item__title-box" :class="{ 'is-disabled': disabled }">
						<log-image v-if="thumb" :src="thumb" class="uni-collapse-item__title-img" />
						<text class="uni-collapse-item__title-text">{{ title }}</text>
					</view>
				</slot>
			</view>
			<view v-if="showArrow" @click="onClick(!isOpen)"
				:class="{ 'uni-collapse-item__title-arrow-active': isOpen, 'uni-collapse-item--animation': showAnimation === true }"
				class="uni-collapse-item__title-arrow">
				<uni-icons :color="$store.state.isDarkMode ? '#999' : (disabled ? '#ddd' : '#bbb')" size="14"
					type="bottom" />
			</view>
		</view>
		<view class="uni-collapse-item__wrap" :class="{ 'is--transition': showAnimation }"
			:style="{ height: (isOpen ? height : 0) + 'px' }" v-if="isOpen">
			<view :id="elId" ref="collapse--hook" class="uni-collapse-item__wrap-content"
				:class="{ open: isheight, 'uni-collapse-item--border': border && isOpen }">
				<slot></slot>
			</view>
		</view>

	</view>
</template>

<script>
// #ifdef APP-NVUE
const dom = uni.requireNativePlugin('dom');
// #endif

import darkModeMixin from '@/mixins/dark-mode.js'

/**
 * CollapseItem 折叠面板子组件
 * @description 折叠面板子组件
 * @property {String} title 标题文字
 * @property {String} thumb 标题左侧缩略图
 * @property {String} name 唯一标志符
 * @property {Boolean} open = [true|false] 是否展开组件
 * @property {Boolean} titleBorder = [true|false] 是否显示标题分隔线
 * @property {Boolean} border = [true|false] 是否显示分隔线
 * @property {Boolean} disabled = [true|false] 是否展开面板
 * @property {Boolean} showAnimation = [true|false] 开启动画
 * @property {Boolean} showArrow = [true|false] 是否显示右侧箭头
 */
export default {
	mixins: [darkModeMixin],
	name: 'uniCollapseItem',
	props: {
		// 列表标题
		title: {
			type: String,
			default: ''
		},
		name: {
			type: [Number, String],
			default: ''
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		// #ifdef APP-PLUS
		// 是否显示动画,app 端默认不开启动画，卡顿严重
		showAnimation: {
			type: Boolean,
			default: false
		},
		// #endif
		// #ifndef APP-PLUS
		// 是否显示动画
		showAnimation: {
			type: Boolean,
			default: true
		},
		// #endif
		// 是否展开
		open: {
			type: Boolean,
			default: false
		},
		// 缩略图
		thumb: {
			type: String,
			default: ''
		},
		// 标题分隔线显示类型
		titleBorder: {
			type: String,
			default: 'auto'
		},
		border: {
			type: Boolean,
			default: true
		},
		showArrow: {
			type: Boolean,
			default: true
		},
		mainClick: {
			type: Function
		},
		clickInfo: {

		}
	},
	data() {
		// TODO 随机生生元素ID，解决百度小程序获取同一个元素位置信息的bug
		const elId = `Uni_${Math.ceil(Math.random() * 10e5).toString(36)}`
		return {
			isOpen: false,
			isheight: null,
			height: 0,
			elId,
			nameSync: 0
		}
	},
	watch: {
		open(val) {
			this.isOpen = val
			this.onClick(val, 'init')
		}
	},
	updated(e) {
		this.$nextTick(() => {
			this.init(true)
		})
	},
	created() {
		this.collapse = this.getCollapse()
		this.oldHeight = 0
	},
	// #ifndef VUE3
	// TODO vue2
	destroyed() {
		if (this.__isUnmounted) return
		this.uninstall()
	},
	// #endif
	// #ifdef VUE3
	// TODO vue3
	unmounted() {
		this.__isUnmounted = true
		this.uninstall()
	},
	// #endif
	mounted() {
		if (!this.collapse) return
		if (this.name !== '') {
			this.nameSync = this.name
		} else {
			this.nameSync = this.collapse.childrens.length + ''
		}
		if (this.collapse.names.indexOf(this.nameSync) === -1) {
			this.collapse.names.push(this.nameSync)
		} else {
			console.warn(`name 值 ${this.nameSync} 重复`);
		}
		if (this.collapse.childrens.indexOf(this) === -1) {
			this.collapse.childrens.push(this)
		}
		this.init()
	},
	methods: {
		init(type) {
			// #ifndef APP-NVUE
			this.getCollapseHeight(type)
			// #endif
			// #ifdef APP-NVUE
			this.getNvueHwight(type)
			// #endif
		},
		uninstall() {
			if (this.collapse) {
				this.collapse.childrens.forEach((item, index) => {
					if (item === this) {
						this.collapse.childrens.splice(index, 1)
					}
				})
				this.collapse.names.forEach((item, index) => {
					if (item === this.nameSync) {
						this.collapse.names.splice(index, 1)
					}
				})
			}
		},
		onClick(isOpen, type) {
			if (this.disabled) return
			this.isOpen = isOpen
			if (this.isOpen && this.collapse) {
				this.collapse.setAccordion(this)
			}
			if (type !== 'init') {
				this.collapse.onChange(isOpen, this)
			}
		},
		getCollapseHeight(type, index = 0) {
			const views = uni.createSelectorQuery().in(this)
			views
				.select(`#${this.elId}`)
				.fields({
					size: true
				}, data => {
					// TODO 百度中可能获取不到节点信息 ，需要循环获取
					if (index >= 10) return
					if (!data) {
						index++
						this.getCollapseHeight(false, index)
						return
					}
					// #ifdef APP-NVUE
					this.height = data.height + 1
					// #endif
					// #ifndef APP-NVUE
					this.height = data.height
					// #endif
					this.isheight = true
					if (type) return
					this.onClick(this.open, 'init')
				})
				.exec()
		},
		getNvueHwight(type) {
			const result = dom.getComponentRect(this.$refs['collapse--hook'], option => {
				if (option && option.result && option.size) {
					// #ifdef APP-NVUE
					this.height = option.size.height + 1
					// #endif
					// #ifndef APP-NVUE
					this.height = option.size.height
					// #endif
					this.isheight = true
					if (type) return
					this.onClick(this.open, 'init')
				}
			})
		},
		/**
		 * 获取父元素实例
		 */
		getCollapse(name = 'uniCollapse') {
			let parent = this.$parent;
			let parentName = parent.$options.name;
			while (parentName !== name) {
				parent = parent.$parent;
				if (!parent) return false;
				parentName = parent.$options.name;
			}
			return parent;
		}
	}
}
</script>

<style lang="scss" scoped>
.uni-collapse-item {
	/* #ifndef APP-NVUE */
	box-sizing: border-box;

	/* #endif */
	&__title {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		transition: border-bottom-color .3s;

		.dark-mode & {
			background-color: var(--card-background);
		}

		// transition-property: border-bottom-color;
		// transition-duration: 5s;
		&-wrap {
			width: 100%;
			flex: 1;

		}

		&-box {
			padding: 0 15px;
			/* #ifndef APP-NVUE */
			display: flex;
			width: 100%;
			box-sizing: border-box;
			/* #endif */
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			height: 48px;
			line-height: 48px;
			background-color: #fff;
			color: #303133;
			font-size: 13px;
			font-weight: 500;
			/* #ifdef H5 */
			cursor: pointer;
			outline: none;

			/* #endif */
			&.is-disabled {
				.uni-collapse-item__title-text {
					color: $uni-text-color-disable;
				}
			}

		}

		&.uni-collapse-item-border {
			border-bottom: 1px solid #e5e5e5;
		}

		&.is-open {
			border-bottom-color: transparent;
		}

		&-img {
			height: $uni-img-size-base;
			width: $uni-img-size-base;
			margin-right: 10px;
		}

		&-text {
			flex: 1;
			font-size: $uni-font-size-base;
			/* #ifndef APP-NVUE */
			white-space: nowrap;
			color: inherit;
			/* #endif */
			/* #ifdef APP-NVUE */
			lines: 1;
			/* #endif */
			overflow: hidden;
			text-overflow: ellipsis;

			.dark-mode & {
				color: var(--text-color-primary);
			}
		}

		&-arrow {
			/* #ifndef APP-NVUE */
			display: flex;
			box-sizing: border-box;
			/* #endif */
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
			margin-right: 10px;
			transform: rotate(0deg);

			&-active {
				transform: rotate(-180deg);
			}
		}


	}

	.uni-collapse-item__wrap {
		/* #ifndef APP-NVUE */
		will-change: height;
		box-sizing: border-box;
		/* #endif */
		background-color: #fff;
		overflow: hidden;
		position: relative;
		height: 0;

		.dark-mode & {
			background-color: var(--card-background);
		}

		&.is--transition {
			// transition: all 0.3s;
			transition-property: height, border-bottom-width;
			transition-duration: 0.3s;
			/* #ifndef APP-NVUE */
			will-change: height;
			/* #endif */
		}
	}



	&-content {
		position: absolute;
		font-size: 13px;
		color: #303133;
		// transition: height 0.3s;
		border-bottom-color: transparent;
		border-bottom-style: solid;
		border-bottom-width: 0;

		.dark-mode & {
			color: var(--text-color-regular);
		}

		&.uni-collapse-item--border {
			border-bottom-width: 1px;
			border-bottom-color: red;
			border-bottom-color: #e5e5e5;
		}

		&.open {
			position: relative;
		}
	}
	&--animation {
		transition-property: transform;
		transition-duration: 0.3s;
		transition-timing-function: ease;
	}
}
</style>
