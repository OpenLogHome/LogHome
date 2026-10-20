<template>
  <div class="social-comment-composer">
    <div class="reply-hint" v-if="replyTo">
      {{ $t("回复 @{p0}", { p0: replyTo.targetUserName || "" })
      }}<button class="cancel-reply" @click="$emit('cancel-reply')">
        {{ $t("取消") }}
      </button>
    </div>
    <div class="composer-row">
      <textarea
        ref="input"
        class="composer-input"
        v-model="content"
        :placeholder="replyTo ? $t('写下你的回复…') : $t('发条友善的评论…')"
        maxlength="500"
        rows="3"
      ></textarea>
    </div>
    <div class="composer-images" v-if="images.length">
      <div class="upload-item" v-for="(img, i) in images" :key="i">
        <img :src="img" class="upload-preview" />
        <button class="remove-image" @click="removeImage(i)">&times;</button>
      </div>
    </div>
    <div class="composer-actions">
      <ReaderEmojiPicker :disabled="submitting || uploading" @select="appendEmoji" />
      <label class="upload-btn" :class="{ disabled: uploading }">
        <input
          type="file"
          accept="image/*"
          hidden
          @change="onPickFiles"
          :disabled="uploading || images.length >= 1"
        />
        <SiteIcon name="image" />
        <span>{{ uploading ? $t("上传中…") : $t("图片") }}</span>
      </label>
      <span class="counter">{{ content.length }}/500</span>
      <button
        class="submit-btn"
        :disabled="submitting || (!content.trim() && !images.length) || uploading"
        @click="submit"
      >
        {{ submitting ? $t("发送中…") : $t("发送") }}
      </button>
    </div>
  </div>
</template>

<script>
import SiteIcon from "~/components/ui/SiteIcon.vue";
import { uploadMangaCommentImage } from "~/common/manga-comment-api.js";
import { readingToken } from "~/plugins/api/reading";
import ReaderEmojiPicker from "~/components/read/ReaderEmojiPicker.vue";
import { stickerUrl } from "~/utils/reader-stickers";

export default {
  name: "SocialCommentComposer",
  components: { SiteIcon, ReaderEmojiPicker },
  props: {
    replyTo: { type: Object, default: null },
    submitting: { type: Boolean, default: false },
  },
  data() {
    return { content: "", images: [], uploading: false, uploadVersion: 0 };
  },
  beforeDestroy() {
    this.uploadVersion++;
  },
  methods: {
    appendEmoji(data) {
      if (this.submitting || this.uploading || !data) return;
      if (data.type === "sticker") {
        const url = stickerUrl(data.content);
        if (!readingToken()) {
          this.$message.info(this.$t("请先登录后使用表情包"));
          return;
        }
        if (this.images.length >= 1) {
          this.$message.info(this.$t("最多添加 1 张配图或表情包"));
          return;
        }
        if (url) this.images.push(url);
        return;
      }
      const input = this.$refs.input,
        start = input ? input.selectionStart : this.content.length,
        end = input ? input.selectionEnd : start;
      const text = String(data.content || ""),
        value = this.content.slice(0, start) + text + this.content.slice(end);
      if (value.length > 500) {
        this.$message.info(this.$t("评论最多 500 字"));
        return;
      }
      this.content = value;
      this.$nextTick(() => {
        if (input) {
          input.focus();
          input.setSelectionRange(start + text.length, start + text.length);
        }
      });
    },
    async onPickFiles(e) {
      const files = Array.from(e.target.files || []);
      e.target.value = "";
      if (!files.length || this.uploading || this.submitting) return;
      if (!readingToken()) {
        this.$message.info(this.$t("请先登录后再上传评论配图"));
        return;
      }
      const version = ++this.uploadVersion,
        account = readingToken();
      this.uploading = true;
      try {
        for (const file of files) {
          if (
            this.images.length >= 1 ||
            version !== this.uploadVersion ||
            account !== readingToken()
          )
            break;
          const url = await uploadMangaCommentImage(file);
          if (version !== this.uploadVersion || account !== readingToken()) return;
          this.images.push(url);
        }
      } catch (err) {
        if (version === this.uploadVersion && account === readingToken())
          this.$message.error(this.$t("图片上传失败，请稍后重试"));
      } finally {
        if (version === this.uploadVersion) this.uploading = false;
      }
    },
    removeImage(i) {
      this.images.splice(i, 1);
    },
    submit() {
      if (
        (!this.content.trim() && !this.images.length) ||
        this.content.length > 500 ||
        this.submitting ||
        this.uploading
      )
        return;
      this.$emit("submit", {
        content: this.content.trim(),
        images: this.images.slice(),
      });
    },
    reset() {
      this.uploadVersion++;
      this.uploading = false;
      this.content = "";
      this.images = [];
    },
    focus() {
      this.$nextTick(() => {
        if (this.$refs.input) this.$refs.input.focus();
      });
    },
  },
};
</script>

<style scoped>
.social-comment-composer {
  border-top: 1px solid var(--line, #e2e6eb);
  padding-top: 12px;
}
.reply-hint {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--wood, #c65320);
  margin-bottom: 8px;
}
.cancel-reply {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 12px;
}
.cancel-reply:hover {
  color: #e0524d;
}
.composer-input {
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  border: 1px solid var(--line, #e2e6eb);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--ink, #30343b);
  background: var(--surface, #ffffff);
  font-family: inherit;
  outline: none;
}
.composer-input:focus {
  border-color: var(--wood, #c65320);
}
.composer-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.upload-item {
  position: relative;
}
.upload-preview {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
}
.remove-image {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  cursor: pointer;
  line-height: 1;
}
.composer-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 10px;
}
.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--wood, #c65320);
  cursor: pointer;
  user-select: none;
}
.upload-btn.disabled {
  color: #ccc;
  cursor: not-allowed;
}
.counter {
  font-size: 12px;
  color: var(--muted, #5b626d);
  margin-left: auto;
}
.submit-btn {
  background: var(--wood, #c65320);
  border: none;
  color: var(--ui-primary-text, #fff);
  border-radius: 18px;
  padding: 8px 24px;
  font-size: 14px;
  cursor: pointer;
}
.submit-btn:hover:not(:disabled) {
  background: #ac4319;
}
.submit-btn:disabled {
  background: var(--soft, #f1f3f5);
  color: var(--muted, #5b626d);
  opacity: 1;
  cursor: not-allowed;
}
</style>
