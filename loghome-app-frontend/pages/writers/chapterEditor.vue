<template>
  <view class="redirect-shell"></view>
</template>

<script>
export default {
  onLoad(params) {
    const redirectParams = {
      ...(params || {}),
      noneAnimation: 1,
    };
    const query = Object.keys(redirectParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(
            redirectParams[key] == null ? "" : redirectParams[key]
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
