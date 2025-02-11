<template>
  <div class="battery-container" :style="{ height: size/2 + 'px' }">
    <div class="battery-icon" :style="{ width: size + 'px', height: size/2 + 'px' }">
      <div class="battery-level" :style="{
        width: `${level}%`
      }"></div>
      <div class="battery-cap"></div>
      <div class="charging-icon" v-if="isCharging">⚡</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BatteryIcon',
  props: {
    level: {
      type: Number,
      default: 100
    },
    isCharging: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 40
    }
  }
}
</script>

<style scoped>
.battery-container {
  display: inline-flex;
  align-items: center;
}

.battery-icon {
  border: 0.1em solid #999;
  border-radius: 0.15em;
  padding: 0.05em;
  position: relative;
}

.battery-level {
  height: 100%;
  background-color: #999;
  transition: width 0.3s ease;
}

.battery-cap {
  width: 7.5%;
  height: 50%;
  background-color: #999;
  position: absolute;
  right: -7.5%;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 0 0.1em 0.1em 0;
}

.charging-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(1.8);
  font-size: 30%;
  color: #fff;
}
</style>