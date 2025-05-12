<template>
  <div class="community-page">
    <div class="page-header">
      <h1 class="page-title">作者社区</h1>
    </div>

    <div class="construction-container">
      <div class="construction-content">
        <div class="construction-icon">🚧</div>
        <h2 class="construction-title">社区正在建设中</h2>
        <p class="construction-text">敬请期待</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '作者社区 - 原木社区'
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #947358;
$secondary-color: #704C35;
$text-color: #333;
$text-light: #666;

.community-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 40px;
  
  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: $secondary-color;
    padding-left: 20px;
    border-left: 4px solid $primary-color;
  }
}

.construction-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.construction-content {
  text-align: center;
  padding: 40px;
}

.construction-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.construction-title {
  font-size: 24px;
  color: $secondary-color;
  margin-bottom: 10px;
}

.construction-text {
  font-size: 18px;
  color: $text-light;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .construction-title {
    font-size: 20px;
  }
  
  .construction-text {
    font-size: 16px;
  }
}
</style> 