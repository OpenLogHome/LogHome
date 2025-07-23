# 表情选择器组件使用说明

## 组件介绍

表情选择器组件（`emoji-picker`）是一个通用的表情选择工具，支持emoji表情和图片表情包，可用于评论区、聊天框等需要插入表情的场景。

## 功能特点

- 支持emoji表情和图片表情包
- 支持上传自定义表情包
- 支持设置表情包为公开或私密
- 支持收藏常用表情包
- 支持长按表情包进行管理（收藏、设置私密、删除）

## 安装与配置

1. 确保已创建数据库表（执行 `sql/stickers_tables.sql` 中的SQL语句）
2. 确保后端路由已注册（在 `routes/community.js` 中注册 `stickers` 子路由）

## 使用方法

### 基本用法

```vue
<template>
  <view class="comment-box">
    <textarea
      v-model="commentContent"
      placeholder="说点什么..."
      class="comment-input"
    />
    <view class="comment-toolbar">
      <emoji-picker @select="onSelectEmoji" />
      <button @tap="submitComment" class="submit-btn">发送</button>
    </view>
  </view>
</template>

<script>
import EmojiPicker from '@/components/emoji-picker/emoji-picker.vue';

export default {
  components: {
    EmojiPicker
  },
  data() {
    return {
      commentContent: ''
    };
  },
  methods: {
    onSelectEmoji(emoji) {
      if (emoji.type === 'emoji') {
        // 直接插入emoji表情
        this.commentContent += emoji.content;
      } else if (emoji.type === 'sticker') {
        // 插入表情包图片链接或标记
        this.commentContent += `[sticker:${emoji.sticker_id}]`;
        // 或者可以直接在评论中显示图片
        // this.commentContent += `<img src="${emoji.content}" class="comment-sticker" />`;
      }
    },
    submitComment() {
      // 提交评论逻辑
      console.log('提交评论:', this.commentContent);
      // 这里可以调用API提交评论
    }
  }
};
</script>
```

### 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| showPicker | Boolean | false | 是否默认显示表情选择器 |

### 事件说明

| 事件名 | 说明 | 回调参数 |
|-------|------|----------|
| select | 选择表情时触发 | `{type, content, sticker_id?}` |
| toggle | 表情选择器显示/隐藏状态变化时触发 | `Boolean` |

## 在评论区中渲染表情包

当评论中包含表情包标记（如 `[sticker:123]`）时，需要将其转换为图片显示：

```vue
<template>
  <view class="comment-content">
    <template v-for="(item, index) in parsedContent" :key="index">
      <image 
        v-if="item.type === 'sticker'" 
        :src="item.url" 
        class="comment-sticker" 
        mode="aspectFill"
      />
      <text v-else>{{ item.text }}</text>
    </template>
  </view>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    parsedContent() {
      const result = [];
      let text = this.content;
      const regex = /\[sticker:(\d+)\]/g;
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        // 添加表情前的文本
        if (match.index > lastIndex) {
          result.push({
            type: 'text',
            text: text.substring(lastIndex, match.index)
          });
        }
        
        // 添加表情
        result.push({
          type: 'sticker',
          id: match[1],
          url: `https://storage.codesocean.top/api/resource/get/${match[1]}` // 根据实际情况构建URL
        });
        
        lastIndex = regex.lastIndex;
      }
      
      // 添加剩余文本
      if (lastIndex < text.length) {
        result.push({
          type: 'text',
          text: text.substring(lastIndex)
        });
      }
      
      return result;
    }
  }
};
</script>

<style>
.comment-sticker {
  width: 100rpx;
  height: 100rpx;
  margin: 0 4rpx;
  vertical-align: middle;
}
</style>
```

## 样式自定义

可以通过覆盖组件的样式类来自定义表情选择器的外观：

```css
/* 自定义表情选择器样式 */
.emoji-panel {
  height: 600rpx; /* 调整面板高度 */
}

.emoji-tab.active {
  color: #007AFF; /* 修改激活标签颜色 */
  border-bottom-color: #007AFF;
}

.submit-btn {
  background-color: #007AFF; /* 修改按钮颜色 */
}
```

## 注意事项

1. 表情包上传使用了与帖子图片相同的上传接口，确保该接口可用
2. 表情包的存储和访问需要相应的权限和配置
3. 在渲染评论内容时，需要正确解析和显示表情包标记