<template>
  <button 
    class="window-open-btn" 
    :class="buttonClass" 
    @click="openWindow"
  >
    <i v-if="icon" :class="icon"></i>
    <span v-if="label">{{ label }}</span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: '新窗口'
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 600
    },
    icon: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    buttonClass: {
      type: [String, Object, Array],
      default: ''
    }
  },
  methods: {
    openWindow() {
      const id = this.$windowManager.createWindow({
        title: this.title,
        url: this.url,
        width: this.width,
        height: this.height
      })
      this.$emit('window-opened', id)
    }
  }
}
</script>

<style scoped>
.window-open-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #947358;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.window-open-btn:hover {
  background-color: #826347;
}

.window-open-btn i {
  margin-right: 6px;
}
</style> 