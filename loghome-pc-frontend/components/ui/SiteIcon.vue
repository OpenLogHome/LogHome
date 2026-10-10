<template>
  <svg class="site-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
    fill="currentColor" aria-hidden="true" focusable="false">
    <path v-for="(path, index) in paths" :key="index" :d="path" />
  </svg>
</template>

<script>
import glyphs from '~/assets/icons/phosphor-glyphs'

export default {
  name: 'SiteIcon',
  props: {
    name: { type: String, required: true, validator: name => Object.prototype.hasOwnProperty.call(glyphs, name) },
    filled: { type: Boolean, default: false }
  },
  computed: {
    paths() { return glyphs[this.filled && glyphs[`${this.name}Filled`] ? `${this.name}Filled` : this.name] || [] }
  }
}
</script>

<style scoped>
.site-icon { display: inline-block; width: 1.125em; height: 1.125em; flex: none; vertical-align: -0.18em; }
</style>
