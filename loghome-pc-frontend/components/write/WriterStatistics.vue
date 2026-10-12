<template>
  <div v-if="snapshots.length" class="writer-statistics">
    <div class="statistics-summary-heading">
      <h3>核心数据</h3>
      <span>截至 {{ latest.date }}</span>
    </div>
    <div class="statistics-summary">
      <div
        v-for="metric in metrics"
        :key="metric.key"
        class="statistics-metric"
      >
        <span>{{ metric.label }}</span
        ><strong>{{ format(latest[metric.key]) }}</strong>
        <small
          v-if="changes[metric.key]"
          :class="{
            positive: changes[metric.key].value > 0,
            negative: changes[metric.key].value < 0,
          }"
          >{{ changes[metric.key].label }}
          {{
            changes[metric.key].value === 0
              ? "持平"
              : (changes[metric.key].value > 0 ? "+" : "") +
                format(changes[metric.key].value)
          }}</small
        >
        <small v-else>暂无对比数据</small>
      </div>
    </div>
    <h3 class="statistics-trends-heading">近30天累计趋势</h3>
    <div class="statistics-charts">
      <writer-statistic-chart
        v-for="metric in metrics"
        :key="metric.key"
        :rows="snapshots"
        :metric="metric"
      />
    </div>
  </div>
  <writer-empty-state
    v-else
    icon="el-icon-data-analysis"
    title="暂无阅读统计"
    description="作品产生阅读活动后，这里会显示阅读、收藏和互动数据。"
  />
</template>
<script>
import WriterStatisticChart from "./WriterStatisticChart.vue";
import WriterEmptyState from "./WriterEmptyState.vue";
import {
  STATISTIC_METRICS,
  normalizeStatistics,
  metricChange,
  formatStatistic,
} from "~/utils/writer/statistics";
export default {
  components: { WriterStatisticChart, WriterEmptyState },
  props: { rows: { type: Array, default: () => [] } },
  data: () => ({ metrics: STATISTIC_METRICS }),
  computed: {
    snapshots() {
      return normalizeStatistics(this.rows);
    },
    latest() {
      return this.snapshots[this.snapshots.length - 1] || {};
    },
    changes() {
      return Object.fromEntries(
        this.metrics.map((metric) => [
          metric.key,
          metricChange(this.snapshots, metric.key),
        ])
      );
    },
  },
  methods: { format: formatStatistic },
};
</script>
