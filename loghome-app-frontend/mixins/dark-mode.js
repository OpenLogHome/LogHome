import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isDarkMode: state => state.isDarkMode
    })
  },
  methods: {
    toggleDarkMode() {
      getApp().toggleTheme()
    }
  }
}
