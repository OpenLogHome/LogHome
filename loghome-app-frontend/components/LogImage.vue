<template>
  <img
    v-bind="$attrs"
    v-on="{
      ...$listeners,
      load: handleLoad,
      error: handleError
    }"
    :src="hasError ? src : imageSrc"
	:originalSrc="src"
    :style="{ opacity: isLoaded ? 1 : 0 }"
    alt="Image" />
</template>

<script>
import { imgDB } from '../lib/db'; // 引入imgDB

export default {
  name: 'LogImage',
  data() {
    return {
      isLoaded: false,
      hasError: false,
      imgBlob: null,  // 存储图片的Blob对象
      imageSrc: '',  // 存储最终图片URL
	  dbDone: false
    };
  },
  props: {
    src: {
      required: true,
    },
  },
  watch: {
    // 监听 src 的变化
    src(newSrc) {
		if(newSrc != undefined) {
			// console.log("changed", newSrc)
			this.imageSrc = ''; // 重置 imageSrc
			this.isLoaded = false; // 重置加载状态
			this.hasError = false; // 重置错误状态
			this.checkImageCache(newSrc); // 重新检查缓存或加载新图片
		}
    },
  },
  async created() {
	  // console.log(this.src);
    // 组件初始化时，检查缓存
	if(this.src != undefined) {
		await this.checkImageCache(this.src);
	}
  },
  methods: {
    // 检查IndexedDB中是否有缓存的图片
    async checkImageCache(url) {
      try {
        // 将 http:// 转换为 https://
        const secureUrl = url.replace('http://', 'https://');
        const cachedImg = await imgDB.imgs.get(secureUrl);
        this.dbDone = true;

        if (cachedImg) {
          // 如果找到缓存，则直接使用缓存的图片
          this.imgBlob = cachedImg.img_blob;
          this.imageSrc = URL.createObjectURL(this.imgBlob); // 创建blob URL
          this.isLoaded = true;
          this.updateLastAccessedTime(cachedImg);
          this.hasError = false
        } else {
          // 如果没有缓存，则从网络加载图片
          this.loadImageFromNetwork(secureUrl);
        }
      } catch (error) {
        console.error('Error checking image cache:', error);
        this.loadImageFromNetwork(url.replace('http://', 'https://')); // 使用安全URL
      }
    },

    // 从网络加载图片
    async loadImageFromNetwork(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Image failed to load');
        }

        const imgBlob = await response.blob();
        this.imgBlob = imgBlob;
        this.imageSrc = URL.createObjectURL(imgBlob); // 创建blob URL
        this.isLoaded = true;

        // 存储图片到indexedDB
        await imgDB.imgs.put({
          img_url: url,
          img_hash: this.hashUrl(url),
          img_blob: imgBlob,
          last_accessed_time: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error loading image from network:', error);
        this.hasError = true; // 加载失败时设置错误状态
      }
    },

    // 更新图片的last_accessed_time
    async updateLastAccessedTime(cachedImg) {
      try {
        await imgDB.imgs.put({
          ...cachedImg,
          last_accessed_time: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error updating last accessed time:', error);
      }
    },

    // 生成图片URL的hash值（可根据需要更改hash函数）
    hashUrl(url) {
      let hash = 0;
      for (let i = 0; i < url.length; i++) {
        const char = url.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    },

    handleLoad() {
      // this.isLoaded = true; // 图片加载完成
    },

    handleError() {
	  if(this.dbDone) {
		  this.hasError = true; // 图片加载失败
		  // console.log("hasError");
	  }
    },
  },
};
</script>


<style scoped>
</style>