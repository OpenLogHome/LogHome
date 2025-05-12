import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isDarkMode: state => state.isDarkMode
    })
  },
  methods: {
    toggleDarkMode() {
      this.$store.commit('updateDarkMode', !this.isDarkMode)
    }
  }
} 