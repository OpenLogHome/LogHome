<template>
  <div class="outer">
    <div class="box" v-for="item in volumes">
		<div class="title">{{item.name}}</div>
		<div class="desc">{{item.desc}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'volumes',
  data() {
    return {
		volumes:[
			{
				name: '默认分卷',
				desc: '分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述'
			},
			{
				name: '默认分卷',
				desc: '分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述分卷描述'
			}
		],
	};
  },
  methods: {}
};
</script>
<style scoped>
.outer {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 750rpx;
}

.box {
  display: flex;
  flex-direction: column;
  justify-content: left;
  border-radius: 15rpx;
  padding: 30rpx;
  box-shadow: 0px 10px 30px rgba(209, 213, 223, 0.5);
  background-color: #ffffff;
  width: 720.78rpx;
  height: 190rpx;
  margin-top: 20rpx;
  .title{
	  font-size: 35rpx;
	  font-weight: bold;
  }
  .desc{
	  font-size: 25rpx;
	  color:rgb(142, 142, 142);
	  margin-top:10rpx;
	  overflow: hidden;
	  display: -webkit-box;
	  -webkit-box-orient: vertical;
	  -webkit-line-clamp: 2;
  }
}

</style>
