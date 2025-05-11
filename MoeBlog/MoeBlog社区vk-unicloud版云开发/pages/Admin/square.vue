<template>
  <z-paging ref="paging" v-model="squareData" @query="queryList">
    <view class="square">
      <view class="Mysquare-C">
        <u-tabs active-color="#000" font-size="24" :list="tabList" :is-scroll="false" v-model="currentIndex" @change="Tabchange"></u-tabs>
        <Mysquare-item v-for="item in squareData" :key="item._id" :item="item" @refresh="refresh"></Mysquare-item>
      </view>
    </view>
  </z-paging>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { apiGetAdminSquare } from "@/api/api.js";

// 数据初始化
const tabList = ref([
  { name: '已通过' },
  { name: '审核中' },
  { name: '未通过' }
]);
const currentIndex = ref(0);
const paging = ref(null);
const Audit = ref(0);
const squareData = ref([]); // 圈子数据

// 页面加载时获取数据
onLoad(() => {
  
});

// 切换标签页
function Tabchange(e) {
  currentIndex.value = e;
  Audit.value = e;
  paging.value.reload();
}

// 刷新数据
function refresh() {
  paging.value.reload();
}

// 分页查询
function queryList(pageNo, pageSize) {
  const data = {
    pageNo,
    pageSize,
    Audit: Audit.value
  };
  apiGetAdminSquare(data).then(res => {
    paging.value.complete(res.result.rows);
  });
}

</script>

<style lang="scss" scoped>
.square {
  padding: 0 32rpx;
  width: 100vw;

  .Mysquare-C {
    height: 100rpx;

    .empty {
      padding-top: 250rpx;
    }
  }
}
</style>