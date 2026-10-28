<template>
  <section
    class="statistic-chart"
    :style="{ '--statistic-color': metric.color }"
  >
    <h3>{{ $t('{metric}趋势', { metric: $t(metric.label) }) }}</h3>
    <div class="statistic-readout">
      <span>{{ current ? current.date : $t('暂无数据') }}</span
      ><strong>{{ current ? format(current.value) : "—" }}</strong>
    </div>
    <div
      ref="plot"
      class="statistic-plot"
      @pointermove="hover"
      @pointerleave="activeIndex = null"
      @click="hover"
    >
      <svg
        :viewBox="`0 0 ${width} 174`"
        role="img"
        :aria-label="
          $t('{metric}累计趋势，{value}', { metric: $t(metric.label), value: current ? current.date + '：' + format(current.value) : $t('暂无数据') })
        "
        tabindex="0"
        @keydown="navigate"
        @blur="activeIndex = null"
      >
        <title>{{ $t('{metric}累计趋势；左右方向键查看日期', { metric: $t(metric.label) }) }}</title>
        <g
          v-for="(tick, index) in geometry.ticks"
          :key="'tick-' + index"
          class="statistic-grid"
        >
          <line
            :x1="geometry.left"
            :x2="geometry.right"
            :y1="tick.y"
            :y2="tick.y"
          />
          <text :x="geometry.left - 8" :y="tick.y + 4" text-anchor="end">
            {{ axisNumber(tick.value) }}
          </text>
        </g>
        <path :d="geometry.area" class="statistic-area" />
        <path :d="geometry.path" class="statistic-line" />
        <g v-for="point in geometry.points" :key="'point-' + point.date">
          <circle
            v-if="point.y != null"
            :cx="point.x"
            :cy="point.y"
            r="2"
            class="statistic-point"
          />
        </g>
        <g v-if="current && current.y != null">
          <line
            v-if="activeIndex != null"
            :x1="current.x"
            :x2="current.x"
            :y1="geometry.top"
            :y2="geometry.bottom"
            class="statistic-guide"
          />
          <circle
            :cx="current.x"
            :cy="current.y"
            r="3.5"
            class="statistic-point"
          />
        </g>
        <text
          v-for="(point, index) in labels"
          :key="point.date"
          :x="point.x"
          y="166"
          :text-anchor="
            labels.length === 1
              ? 'middle'
              : index === 0
              ? 'start'
              : index === labels.length - 1
              ? 'end'
              : 'middle'
          "
          class="statistic-date"
        >
          {{ point.date.slice(5).replace("-", "/") }}
        </text>
      </svg>
    </div>
  </section>
</template>
<script>
import { chartGeometry, formatStatistic } from "~/utils/writer/statistics";
export default {
  props: { rows: Array, metric: Object },
  data: () => ({ width: 300, activeIndex: null }),
  computed: {
    geometry() {
      return chartGeometry(this.rows, this.metric.key, this.width);
    },
    current() {
      return this.geometry.points[
        this.activeIndex == null
          ? this.rows.length - 1
          : Math.min(this.activeIndex, this.rows.length - 1)
      ];
    },
    labels() {
      const points = this.geometry.points;
      const indexes =
        points.length > 2 && this.width >= 280
          ? [0, Math.floor((points.length - 1) / 2), points.length - 1]
          : points.length > 1
          ? [0, points.length - 1]
          : [0];
      return indexes.map((index) => points[index]).filter(Boolean);
    },
  },
  mounted() {
    this.measure();
    if (window.ResizeObserver) {
      this._observer = new ResizeObserver(this.measure);
      this._observer.observe(this.$refs.plot);
    }
    window.addEventListener("resize", this.measure);
  },
  beforeDestroy() {
    if (this._observer) this._observer.disconnect();
    window.removeEventListener("resize", this.measure);
  },
  methods: {
    format: formatStatistic,
    axisNumber(value) {
      return value >= 10000
        ? (value / 10000).toFixed(1).replace(/\.0$/, "") + "万"
        : value.toLocaleString("zh-CN", {
            maximumFractionDigits: value < 10 ? 1 : 0,
          });
    },
    measure() {
      if (this.$refs.plot && this.$refs.plot.clientWidth)
        this.width = this.$refs.plot.clientWidth;
    },
    hover(event) {
      const bounds = this.$refs.plot.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * this.width;
      let closest = 0;
      this.geometry.points.forEach((point, index) => {
        if (
          Math.abs(point.x - x) < Math.abs(this.geometry.points[closest].x - x)
        )
          closest = index;
      });
      this.activeIndex = closest;
    },
    navigate(event) {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const current =
        this.activeIndex == null ? this.rows.length - 1 : this.activeIndex;
      this.activeIndex =
        event.key === "Home"
          ? 0
          : event.key === "End"
          ? this.rows.length - 1
          : Math.max(
              0,
              Math.min(
                this.rows.length - 1,
                current + (event.key === "ArrowRight" ? 1 : -1)
              )
            );
    },
  },
};
</script>
