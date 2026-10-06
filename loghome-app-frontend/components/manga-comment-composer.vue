<template>
  <view class="manga-composer">
    <view v-if="replyTo" class="reply-banner">
      <text class="reply-banner-text">回复 {{ replyTo.userName }}</text>
      <button v-manga-a11y class="banner-close" type="button" aria-label="取消回复" @click="$emit('cancel-reply')">
        <manga-icon name="close" />
      </button>
    </view>
    <view v-if="images.length" class="composer-images">
      <view class="composer-image" v-for="(image, index) in images" :key="image">
        <log-image :src="image" mode="aspectFill" style="width: 100%; height: 100%;" />
        <button v-manga-a11y class="image-remove" type="button" aria-label="移除图片" @click="removeImage(index)">
          <manga-icon name="close" />
        </button>
      </view>
    </view>
    <view class="composer-row">
      <textarea class="composer-input" v-model="content" :placeholder="placeholder" maxlength="300" auto-height />
      <view class="composer-side">
        <emoji-picker @select="appendEmoji" />
        <button v-manga-a11y class="composer-tool" type="button" aria-label="添加图片"
          :disabled="images.length >= maxImages" @click="chooseImage"><manga-icon name="image" /></button>
        <button v-manga-a11y="submitting" class="composer-send" type="button" :disabled="submitting || !hasContent"
          @click="submit">{{ submitting ? '发布中' : '发布' }}</button>
      </view>
    </view>
    <text v-if="content.length >= 240" class="composer-count">{{ content.length }}/300</text>
  </view>
</template>
<script>
import MangaA11y from '@/common/manga-a11y.js';
import MangaIcon from '@/components/manga-icon.vue';
import EmojiPicker from '@/components/emoji-picker/emoji-picker.vue';
import { uploadMangaCommentImage } from '@/common/manga-comment-api.js';

export default {
  name: 'MangaCommentComposer',
  directives: { mangaA11y: MangaA11y },
  components: { MangaIcon, EmojiPicker },
  props: {
    placeholder: { type: String, default: '发一条友善的评论' },
    replyTo: { type: Object, default: null },
    submitting: { type: Boolean, default: false },
  },
  data() {
    return { content: '', images: [], maxImages: 3 };
  },
  computed: {
    hasContent() { return this.content.trim().length > 0; },
  },
  methods: {
    reset() {
      this.content = '';
      this.images = [];
    },
    appendEmoji(data) {
      if (data.type === 'sticker') {
        if (this.images.length < this.maxImages) this.images.push(data.content);
        return;
      }
      this.content += data.content;
    },
    removeImage(index) { this.images.splice(index, 1); },
    async chooseImage() {
      if (this.images.length >= this.maxImages) return;
      let picked = null;
      try {
        picked = await uni.chooseImage({
          count: this.maxImages - this.images.length,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
        });
      } catch (error) {
        return;
      }
      // uni 的 chooseImage 在 H5 与 App 上返回结构不同，统一取 tempFilePaths
      const paths = (picked && picked.tempFilePaths) || (picked && picked[1] && picked[1].tempFilePaths) || [];
      if (!paths.length) return;
      uni.showLoading({ title: '正在上传图片…', mask: true });
      try {
        for (const path of paths) {
          if (this.images.length >= this.maxImages) break;
          this.images.push(await uploadMangaCommentImage(path));
        }
      } catch (error) {
        uni.showToast({ title: '图片上传失败', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },
    submit() {
      if (!this.hasContent || this.submitting) return;
      this.$emit('submit', { content: this.content.trim(), images: this.images.slice() });
    },
  },
};
</script>
<style scoped lang="scss">
// 按钮样式都挂在根类下：页面级 `.manga-page[data-v] :where(uni-button)` reset 与单类+[data-v] 同优先级，
// 且注入顺序更靠后，会把这里的背景覆盖成透明（uni-app H5 中 button 编译为 uni-button）。
.manga-composer { padding-top: 20rpx; border-top: 1rpx solid var(--manga-line); }
:where(button) { margin: 0; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; line-height: inherit; border-radius: 0; }
:where(button)::after { display: none; }
.manga-composer .reply-banner { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; margin-bottom: 14rpx; padding: 12rpx 18rpx; border-radius: 12rpx; background: var(--manga-bg); }
.manga-composer .reply-banner-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--manga-muted); font-size: 23rpx; }
.manga-composer .banner-close { flex: none; display: grid; place-items: center; width: 56rpx; height: 56rpx; color: var(--manga-muted); }
.manga-composer .composer-images { display: flex; flex-wrap: wrap; gap: 12rpx; margin-bottom: 14rpx; }
.manga-composer .composer-image { position: relative; width: 148rpx; height: 148rpx; overflow: hidden; border-radius: 12rpx; background: var(--manga-bg); }
.manga-composer .composer-image ::v-deep img { width: 100%; height: 100%; display: block; }
.manga-composer .image-remove { position: absolute; top: 4rpx; right: 4rpx; display: grid; place-items: center; width: 48rpx; height: 48rpx; border-radius: 50%; background: rgba(17, 17, 17, .72); color: #fff; font-size: 24rpx; }
.manga-composer .composer-row { display: flex; align-items: flex-end; gap: 12rpx; }
.manga-composer .composer-input { box-sizing: border-box; flex: 1; min-width: 0; min-height: 88rpx; max-height: 240rpx; padding: 18rpx 22rpx; border: 1rpx solid var(--manga-line); border-radius: 16rpx; background: var(--manga-bg); color: var(--manga-text); font-size: 26rpx; line-height: 1.6; }
.manga-composer .composer-side { display: flex; align-items: center; gap: 6rpx; flex: none; }
.manga-composer .composer-tool { display: grid; place-items: center; width: 76rpx; height: 76rpx; color: var(--manga-muted); font-size: 34rpx; }
.manga-composer .composer-send { display: flex; align-items: center; justify-content: center; min-width: 108rpx; height: 76rpx; padding: 0 22rpx; border-radius: 100rpx; background: var(--manga-action); color: #fff; font-size: 25rpx; font-weight: 700; }
.manga-composer .composer-count { display: block; margin-top: 8rpx; text-align: right; color: var(--manga-muted); font-size: 21rpx; }
</style>
