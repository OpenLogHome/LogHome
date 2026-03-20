<template>
  <view class="redirect-shell"></view>
</template>

<script>
export default {
  onLoad(params) {
    const query = Object.keys(params || {})
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(
            params[key] == null ? "" : params[key]
          )}`
      )
      .join("&");

    uni.redirectTo({
      url: `/pages/writers/chapterEditorNew${query ? "?" + query : ""}`,
    });
  },
};
</script>

<style scoped>
.redirect-shell {
  width: 100%;
  height: 100%;
}
</style>
