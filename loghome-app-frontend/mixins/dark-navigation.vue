<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isDarkMode: state => state.isDarkMode
    })
  },
  onReady() {
    // 检测当前是否为深色模式
    if (this.isDarkMode) {
      // 设置导航栏为深色模式
      uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#252525'
      })
    } else {
      // 设置导航栏为亮色模式
      uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      })
    }
  },
  watch: {
    // 监听深色模式变化
    isDarkMode: {
      handler(newVal) {
        if (newVal) {
          // 切换到深色模式
          uni.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#252525'
          })
        } else {
          // 切换到亮色模式
          uni.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
          })
        }
      },
      immediate: false
    }
  }
}
</script>