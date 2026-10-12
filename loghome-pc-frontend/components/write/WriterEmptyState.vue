<template>
  <div class="tool-empty-state">
    <div class="tool-empty-icon"><i aria-hidden="true" :class="icon" /></div>
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <div v-if="$slots.default" class="tool-empty-actions"><slot /></div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    description: String,
    icon: { type: String, default: "el-icon-document" },
  },
};
</script>
