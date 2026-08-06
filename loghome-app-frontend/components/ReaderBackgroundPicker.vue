<template>
	<div class="reader-background-picker" @click.stop @tap.stop>
		<button type="default" class="background-trigger" @click.stop="openPicker">
			<img v-if="currentSkin" class="trigger-preview" :src="currentSkin.image_url" :alt="currentName" />
			<span v-else class="trigger-preview" :style="{ backgroundColor: currentThemeColor }"></span>
			<span class="trigger-name">{{ currentName }}</span>
			<span class="trigger-action">选择 <i class="el-icon-arrow-right"></i></span>
		</button>

		<el-drawer
			:with-header="false"
			:visible.sync="drawerVisible"
			direction="btt"
			size="68%"
			:append-to-body="true"
			custom-class="reader-background-drawer">
			<div class="picker-panel" @click.stop @tap.stop>
				<div class="picker-header">
					<div>
						<div class="picker-title">阅读背景</div>
						<div class="picker-subtitle">选择后立即预览</div>
					</div>
					<button type="default" class="close-button" aria-label="关闭" @click="drawerVisible = false">
						<i class="el-icon-close"></i>
					</button>
				</div>

				<div v-if="hasSkins" class="picker-tabs" role="tablist" aria-label="背景类型">
					<button type="default" class="picker-tab" :class="{ active: activeTab === 'theme' }"
						role="tab" :aria-selected="activeTab === 'theme'" @click="activeTab = 'theme'">
						纯色主题
					</button>
					<button type="default" class="picker-tab" :class="{ active: activeTab === 'skin' }"
						role="tab" :aria-selected="activeTab === 'skin'" @click="activeTab = 'skin'">
						背景皮肤
					</button>
				</div>

				<div ref="optionsScroller" class="options-scroller">
					<div v-show="activeTab === 'theme'" class="options-grid" role="list">
						<button v-for="theme in themeOptions" :key="theme.key" ref="themeOptionElements" type="default"
							class="background-option" :class="{ selected: isThemeSelected(theme.key), locked: theme.is_locked }"
							role="listitem" @click="selectTheme(theme.key)">
							<span class="option-preview" :style="{ backgroundColor: theme.backgroundColor }"></span>
							<span v-if="theme.required_membership !== 'none'" class="membership-badge"
								:class="{ super: theme.required_membership === 'super' }">
								{{ theme.required_membership === 'super' ? '超级' : '通行证' }}
							</span>
							<span class="option-name">{{ theme.name }}</span>
							<span v-if="isThemeSelected(theme.key)" class="selected-indicator">
								<i class="el-icon-check"></i>
							</span>
							<span v-else-if="theme.is_locked" class="locked-indicator">
								<i class="el-icon-lock"></i>
							</span>
						</button>
					</div>

					<div v-show="activeTab === 'skin'" class="options-grid" role="list">
						<button v-for="skin in skins" :key="skin.skin_key" ref="skinOptionElements" type="default"
							class="background-option" :class="{ selected: skinKey === skin.skin_key, locked: skin.is_locked }"
							role="listitem" @click="selectSkin(skin.skin_key)">
							<img class="option-preview" :src="skin.image_url" :alt="skin.skin_name" />
							<span v-if="skin.required_membership !== 'none'" class="membership-badge"
								:class="{ super: skin.required_membership === 'super' }">
								{{ skin.required_membership === 'super' ? '超级' : '典藏' }}
							</span>
							<span class="option-name">{{ skin.skin_name }}</span>
							<span v-if="skinKey === skin.skin_key" class="selected-indicator">
								<i class="el-icon-check"></i>
							</span>
							<span v-else-if="skin.is_locked" class="locked-indicator">
								<i class="el-icon-lock"></i>
							</span>
						</button>
					</div>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script>
export default {
	name: 'ReaderBackgroundPicker',
	props: {
		themeOptions: {
			type: Array,
			default: () => []
		},
		skins: {
			type: Array,
			default: () => []
		},
		themeKey: {
			type: String,
			default: ''
		},
		skinKey: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			drawerVisible: false,
			activeTab: 'theme'
		};
	},
	computed: {
		hasSkins() {
			return this.skins.length > 0;
		},
		currentSkin() {
			return this.skins.find(item => item.skin_key === this.skinKey) || null;
		},
		currentTheme() {
			return this.themeOptions.find(item => item.key === this.themeKey) || this.themeOptions[0] || null;
		},
		currentName() {
			if (this.currentSkin) return this.currentSkin.skin_name;
			return this.currentTheme ? this.currentTheme.name : '选择背景';
		},
		currentThemeColor() {
			return this.currentTheme ? this.currentTheme.backgroundColor : '#f5f5f5';
		}
	},
	watch: {
		skins() {
			if (!this.hasSkins && this.activeTab === 'skin') this.activeTab = 'theme';
		}
	},
	mounted() {
		window.addEventListener('loghomeNativeBack', this.handleNativeBack);
	},
	beforeDestroy() {
		window.removeEventListener('loghomeNativeBack', this.handleNativeBack);
	},
	methods: {
		openPicker() {
			this.activeTab = this.currentSkin ? 'skin' : 'theme';
			this.drawerVisible = true;
			this.$nextTick(() => {
				if (this.$refs.optionsScroller) this.$refs.optionsScroller.scrollTop = 0;
				setTimeout(this.scrollCurrentOptionIntoView, 320);
			});
		},
		scrollCurrentOptionIntoView() {
			if (!this.drawerVisible) return;
			const optionElements = this.activeTab === 'skin'
				? this.$refs.skinOptionElements
				: this.$refs.themeOptionElements;
			const selectedIndex = this.activeTab === 'skin'
				? this.skins.findIndex(item => item.skin_key === this.skinKey)
				: this.themeOptions.findIndex(item => this.isThemeSelected(item.key));
			const selectedElement = Array.isArray(optionElements) ? optionElements[selectedIndex] : optionElements;
			if (selectedElement && typeof selectedElement.scrollIntoView === 'function') {
				selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		},
		isThemeSelected(themeKey) {
			return !this.skinKey && this.themeKey === themeKey;
		},
		selectTheme(themeKey) {
			const theme = this.themeOptions.find(item => item.key === themeKey);
			if (theme && theme.is_locked) {
				this.$emit('select-locked-theme', theme);
				return;
			}
			this.$emit('select-theme', themeKey);
		},
		selectSkin(skinKey) {
			const skin = this.skins.find(item => item.skin_key === skinKey);
			if (skin && skin.is_locked) {
				this.$emit('select-locked-skin', skin);
				return;
			}
			this.$emit('select-skin', skinKey);
		},
		handleNativeBack(event) {
			if (!this.drawerVisible) return;
			event.preventDefault();
			this.drawerVisible = false;
		}
	}
};
</script>

<style scoped lang="less">
.reader-background-picker {
	width: 100%;
}

.background-trigger {
	display: flex;
	align-items: center;
	width: 100%;
	height: 72rpx;
	margin: 0;
	padding: 7rpx 18rpx 7rpx 8rpx;
	color: inherit;
	background: rgba(127, 127, 127, 0.12);
	border: 2rpx solid rgba(127, 127, 127, 0.18);
	border-radius: 14rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	line-height: 1;
}

.background-trigger::after,
.close-button::after,
.picker-tab::after,
.background-option::after {
	border: 0;
}

.trigger-preview {
	flex: 0 0 auto;
	display: block;
	width: 76rpx;
	height: 54rpx;
	border: 1rpx solid rgba(127, 127, 127, 0.24);
	border-radius: 9rpx;
	box-sizing: border-box;
	object-fit: cover;
}

.trigger-name {
	min-width: 0;
	margin-left: 16rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.trigger-action {
	flex: 0 0 auto;
	margin-left: auto;
	padding-left: 12rpx;
	font-size: 24rpx;
	opacity: 0.72;
}

.picker-panel {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 34rpx 30rpx max(30rpx, var(--loghome-safe-bottom, 0px));
	background: #f8f8f6;
	box-sizing: border-box;
	color: #292927;
}

.picker-header {
	display: flex;
	flex: 0 0 auto;
	align-items: center;
	justify-content: space-between;
}

.picker-title {
	font-size: 38rpx;
	font-weight: 600;
	line-height: 48rpx;
}

.picker-subtitle {
	margin-top: 4rpx;
	color: #858580;
	font-size: 23rpx;
	line-height: 32rpx;
}

.close-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64rpx;
	height: 64rpx;
	margin: 0;
	padding: 0;
	background: #ebebe7;
	border: 0;
	border-radius: 50%;
	color: #555550;
	font-size: 30rpx;
	line-height: 64rpx;
}

.picker-tabs {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	flex: 0 0 auto;
	margin-top: 28rpx;
	padding: 6rpx;
	background: #e9e9e5;
	border-radius: 14rpx;
}

.picker-tab {
	height: 62rpx;
	margin: 0;
	padding: 0;
	background: transparent;
	border: 0;
	border-radius: 10rpx;
	color: #73736e;
	font-size: 27rpx;
	line-height: 62rpx;
}

.picker-tab.active {
	background: #fff;
	box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.08);
	color: #292927;
	font-weight: 600;
}

.options-scroller {
	flex: 1 1 auto;
	min-height: 0;
	margin-top: 28rpx;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.options-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 18rpx;
	padding-bottom: 12rpx;
}

.background-option {
	position: relative;
	min-width: 0;
	margin: 0;
	padding: 8rpx 8rpx 12rpx;
	background: #fff;
	border: 3rpx solid transparent;
	border-radius: 14rpx;
	box-sizing: border-box;
	color: #44443f;
	font-size: 24rpx;
	line-height: 32rpx;
}

.background-option.selected {
	border-color: #6d7f58;
	box-shadow: 0 5rpx 18rpx rgba(70, 85, 55, 0.12);
}

.background-option.locked .option-preview {
	filter: saturate(0.72) brightness(0.78);
}

.membership-badge {
	position: absolute;
	top: 15rpx;
	left: 15rpx;
	padding: 3rpx 9rpx;
	background: linear-gradient(135deg, #8b6a36, #c49a55);
	border-radius: 7rpx;
	color: #fff8e8;
	font-size: 18rpx;
	font-weight: 600;
	line-height: 28rpx;
}

.membership-badge.super {
	background: linear-gradient(135deg, #5d3c91, #a55ec4 55%, #e0ad65);
	box-shadow: 0 3rpx 10rpx rgba(91, 50, 137, 0.3);
}

.option-preview {
	display: block;
	width: 100%;
	height: 112rpx;
	border: 1rpx solid rgba(80, 80, 75, 0.12);
	border-radius: 9rpx;
	box-sizing: border-box;
	object-fit: cover;
}

.option-name {
	display: block;
	margin-top: 9rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.selected-indicator {
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 38rpx;
	height: 38rpx;
	background: #6d7f58;
	border: 3rpx solid #fff;
	border-radius: 50%;
	box-sizing: border-box;
	color: #fff;
	font-size: 22rpx;
}

.locked-indicator {
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 38rpx;
	height: 38rpx;
	background: rgba(25, 25, 23, 0.72);
	border: 3rpx solid rgba(255, 255, 255, 0.88);
	border-radius: 50%;
	box-sizing: border-box;
	color: #fff;
	font-size: 20rpx;
}
</style>
