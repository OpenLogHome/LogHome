<template>
  <el-upload
    class="social-image-upload"
    :class="{ wide }"
    action="https://storage.codesocean.top/api/resource/upload?container=172018735018984"
    :headers="headers"
    :show-file-list="false"
    :before-upload="before"
    :on-success="success"
    :on-error="failure"
    :disabled="busy"
    ><img v-if="value" :src="value" :alt="$t('已上传图片')" /><span v-else
      ><i class="el-icon-plus" /><br />{{ $t("上传图片") }}</span
    >
    <div v-if="busy" class="upload-progress">{{ $t("上传中…") }}</div></el-upload
  >
</template>
<script>
export default {
  props: { value: String, wide: Boolean },
  data: () => ({
    busy: false,
    headers: { ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd" },
  }),
  methods: {
    before(file) {
      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) ||
        file.size > 5 * 1024 * 1024
      ) {
        this.$message.error(this.$t("请选择 5MB 以内的 JPG、PNG、WebP 或 GIF 图片"));
        return false;
      }
      this.busy = true;
      return true;
    },
    success(result) {
      this.busy = false;
      if (result.data && result.data.resource_id)
        this.$emit(
          "input",
          `https://storage.codesocean.top/api/resource/get/${result.data.resource_id}`
        );
      else this.$message.error(this.$t("图片上传失败，请重试"));
    },
    failure() {
      this.busy = false;
      this.$message.error(this.$t("图片上传失败，请重试"));
    },
  },
};
</script>
<style>
.social-image-upload .el-upload {
  position: relative;
  width: 112px;
  height: 112px;
  border: 1px dashed var(--line, #e2e6eb);
  border-radius: 12px;
  overflow: hidden;
  background: var(--soft, #f1f3f5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--wood, #c65320);
  font-size: 13px;
}
.social-image-upload.wide .el-upload {
  width: 260px;
}
.social-image-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.social-image-upload i {
  font-size: 24px;
  margin-bottom: 8px;
}
.upload-progress {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--surface, #ffffff);
}
</style>
