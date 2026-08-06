<template>
	<view class="user-avatar" :class="{ 'user-avatar--framed': Boolean(frame) }">
		<view class="user-avatar__visual" :style="visualStyle">
			<image
				class="user-avatar__photo"
				:src="resolvedSrc"
				:style="photoStyle"
				mode="aspectFill"
				@error="handlePhotoError"
			/>
			<image
				v-if="frameSource"
				class="user-avatar__frame"
				:src="frameSource"
				mode="aspectFit"
			/>
		</view>
	</view>
</template>

<script>
	const DEFAULT_AVATAR = '/static/user/defaultAvatar.jpg';
	const AVATAR_FRAME_ASSET_VERSION = '20260801-2';

	function versionedFrameSource(source) {
		if (!source || !source.startsWith('/static/avatar-frames/')) return source || '';
		const separator = source.includes('?') ? '&' : '?';
		return `${source}${separator}v=${AVATAR_FRAME_ASSET_VERSION}`;
	}

	export default {
		name: 'UserAvatar',
		props: {
			src: { type: String, default: '' },
			frame: { type: Object, default: null },
			animate: { type: Boolean, default: false },
			visualScale: { type: Number, default: 1 },
		},
		data() {
			return { photoFailed: false };
		},
		computed: {
			resolvedSrc() {
				return this.photoFailed || !this.src ? DEFAULT_AVATAR : this.src;
			},
			frameSource() {
				if (!this.frame) return '';
				const source = !this.animate
					? this.frame.thumbnail_url || this.frame.asset_url || ''
					: this.frame.asset_url || this.frame.thumbnail_url || '';
				return versionedFrameSource(source);
			},
			photoStyle() {
				if (!this.frame) {
					return { width: '100%', height: '100%', left: '50%', top: '50%' };
				}
				const scale = Math.max(0.35, Math.min(0.9, Number(this.frame.avatar_scale) || 0.58));
				const offsetX = Number(this.frame.offset_x) || 0;
				const offsetY = Number(this.frame.offset_y) || 0;
				return {
					width: `${scale * 100}%`,
					height: `${scale * 100}%`,
					left: `${50 + offsetX}%`,
					top: `${50 + offsetY}%`,
				};
			},
			visualStyle() {
				const scale = Math.max(0.8, Math.min(2, Number(this.visualScale) || 1));
				return { transform: `translate(-50%, -50%) scale(${scale})` };
			},
		},
		watch: {
			src() {
				this.photoFailed = false;
			},
		},
		methods: {
			handlePhotoError() {
				if (this.resolvedSrc !== DEFAULT_AVATAR) this.photoFailed = true;
				this.$emit('error');
			},
		},
	};
</script>

<style scoped>
	.user-avatar {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.user-avatar__photo {
		position: absolute;
		z-index: 1;
		display: block;
		border-radius: 50%;
		background: #eee;
		transform: translate(-50%, -50%);
	}

	.user-avatar__visual {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 100%;
		height: 100%;
		transform-origin: center;
	}

	.user-avatar__frame {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: block;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
