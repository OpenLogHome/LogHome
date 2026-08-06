<template>
  <view class="writing-calendar-section">
    <view class="calendar-head">
      <view>
        <view class="calendar-title">创作日历</view>
        <view class="calendar-summary" v-if="calendarData && calendarData.summary">
          过去一年活跃 {{ calendarData.summary.active_days || 0 }} 天
          <text class="summary-separator">·</text>
          连续 {{ calendarData.summary.current_streak || 0 }} 天
        </view>
        <view class="calendar-summary" v-else>记录你在这部作品中的创作足迹</view>
      </view>
      <!-- <view class="calendar-goal">30 分钟或 3000 字满活跃</view> -->
    </view>

    <view class="calendar-state" v-if="loading">正在加载创作日历...</view>
    <view class="calendar-state error" v-else-if="calendarData && calendarData.error">
      创作日历加载失败，请稍后重试
    </view>
    <view class="calendar-state" v-else-if="!calendarData">暂无创作日历数据</view>

    <template v-else>
      <view class="calendar-layout">
        <view class="weekday-labels">
          <view v-for="(label, index) in weekdayLabels" :key="index" class="weekday-label">
            {{ label }}
          </view>
        </view>
        <scroll-view
          class="calendar-scroll"
          scroll-x
          :scroll-left="scrollLeft"
          :show-scrollbar="false"
        >
          <view class="calendar-canvas" :style="calendarCanvasStyle">
            <view class="month-row">
              <view v-for="week in weeks" :key="'month-' + week.key" class="month-cell">
                <text v-if="week.monthLabel">{{ week.monthLabel }}</text>
              </view>
            </view>
            <view class="weeks-row">
              <view v-for="week in weeks" :key="week.key" class="week-column">
                <view
                  v-for="day in week.days"
                  :key="day.key"
                  class="activity-day"
                  :class="[day.className, { selected: day.date === selectedDateKey }]"
                  :title="day.ariaLabel"
                  :aria-label="day.ariaLabel"
                  :role="day.placeholder ? undefined : 'button'"
                  :tabindex="day.placeholder ? -1 : 0"
                  @click="selectDay(day)"
                  @keyup.enter="selectDay(day)"
                ></view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="calendar-footer">
        <view class="tracking-note" v-if="trackingStartedOn">
          {{ formatShortDate(trackingStartedOn) }} 起开始统计
        </view>
        <view class="legend" aria-label="活跃程度图例">
          <text>少</text>
          <view v-for="level in [0, 1, 2, 3]" :key="level" class="legend-day" :class="'level-' + level"></view>
          <text>多</text>
        </view>
      </view>

      <view class="selected-day" v-if="selectedDay">
        <view class="selected-date">{{ formatLongDate(selectedDay.date) }}</view>
        <view class="selected-metrics" v-if="selectedDay.tracked">
          <text>{{ formatDuration(selectedDay.active_seconds) }}</text>
          <text>{{ selectedDay.written_chars || 0 }} 字</text>
          <text class="selected-level">{{ levelText(selectedDay.level) }}</text>
        </view>
        <view class="selected-metrics" v-else>
          <text>该日期尚未开始统计</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_COLUMN_WIDTH = 20;

function parseDateKey(dateKey) {
  const normalized = String(dateKey || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return null;
  const date = new Date(`${normalized}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDateKey(dateKey, days) {
  const date = parseDateKey(dateKey);
  if (!date) return "";
  date.setUTCDate(date.getUTCDate() + Number(days || 0));
  return toDateKey(date);
}

function getShanghaiTodayKey() {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const values = {};
    parts.forEach((part) => {
      if (part.type !== "literal") values[part.type] = part.value;
    });
    return `${values.year}-${values.month}-${values.day}`;
  } catch (error) {
    return new Date(Date.now() + 8 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
  }
}

function formatShortDateValue(dateKey) {
  const date = parseDateKey(dateKey);
  if (!date) return dateKey;
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
}

function formatLongDateValue(dateKey) {
  const date = parseDateKey(dateKey);
  if (!date) return dateKey;
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return `${formatShortDateValue(dateKey)} ${weekdays[date.getUTCDay()]}`;
}

function formatDurationValue(seconds) {
  const totalSeconds = Math.max(0, Number(seconds || 0));
  if (totalSeconds > 0 && totalSeconds < 60) return "不足 1 分钟";
  return `${Math.floor(totalSeconds / 60)} 分钟`;
}

function levelTextValue(level) {
  return ["无活跃", "低活跃", "较活跃", "满活跃"][Number(level || 0)];
}

export default {
  name: "WritingActivityCalendar",
  props: {
    calendarData: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrollLeft: 99999,
      selectedDateKey: "",
      weekdayLabels: ["", "一", "", "三", "", "五", ""],
    };
  },
  computed: {
    toDateKey() {
      return (this.calendarData && this.calendarData.to) || getShanghaiTodayKey();
    },
    fromDateKey() {
      return (
        (this.calendarData && this.calendarData.from) ||
        shiftDateKey(this.toDateKey, -364)
      );
    },
    trackingStartedOn() {
      return (
        (this.calendarData && this.calendarData.tracking_started_on) || ""
      );
    },
    activityMap() {
      const map = {};
      const days =
        this.calendarData && Array.isArray(this.calendarData.days)
          ? this.calendarData.days
          : [];
      days.forEach((day) => {
        if (day && day.date) map[day.date] = day;
      });
      return map;
    },
    todayDateKey() {
      return getShanghaiTodayKey();
    },
    weeks() {
      const rangeFromDateKey = this.fromDateKey;
      const rangeToDateKey = this.toDateKey;
      const trackingStartedOn = this.trackingStartedOn;
      const activityMap = this.activityMap;
      const todayDateKey = this.todayDateKey;
      const rangeStart = parseDateKey(rangeFromDateKey);
      const rangeEnd = parseDateKey(rangeToDateKey);
      if (!rangeStart || !rangeEnd) return [];

      const gridStart = new Date(rangeStart.getTime());
      gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());
      const gridEnd = new Date(rangeEnd.getTime());
      gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - gridEnd.getUTCDay()));

      const weeks = [];
      let cursor = new Date(gridStart.getTime());
      let weekIndex = 0;
      while (cursor <= gridEnd) {
        const days = [];
        let monthLabel = "";
        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
          const dateKey = toDateKey(cursor);
          const inRange = dateKey >= rangeFromDateKey && dateKey <= rangeToDateKey;
          const record = activityMap[dateKey] || {};
          const tracked =
            !trackingStartedOn || dateKey >= trackingStartedOn;
          const level = Number(record.level || 0);
          const activeSeconds = Number(record.active_seconds || 0);
          const writtenChars = Number(record.written_chars || 0);
          const classNames = [];
          if (!inRange) classNames.push("placeholder");
          if (inRange && !tracked) classNames.push("untracked");
          if (dateKey === todayDateKey) classNames.push("today");
          if (inRange) classNames.push(`level-${tracked ? level : 0}`);

          let ariaLabel = "";
          if (inRange) {
            const longDate = formatLongDateValue(dateKey);
            ariaLabel = tracked
              ? `${longDate}，${levelTextValue(level)}，${formatDurationValue(activeSeconds)}，${writtenChars} 字`
              : `${longDate}，尚未开始统计`;
          }
          days.push({
            key: `${weekIndex}-${dayIndex}-${dateKey}`,
            date: dateKey,
            placeholder: !inRange,
            tracked,
            active_seconds: activeSeconds,
            written_chars: writtenChars,
            level,
            className: classNames.join(" "),
            ariaLabel,
          });

          if (inRange && (!monthLabel || dateKey.slice(8, 10) === "01")) {
            if (weekIndex === 0 || dateKey.slice(8, 10) === "01") {
              const month = Number(dateKey.slice(5, 7));
              monthLabel = month === 1 ? `${dateKey.slice(0, 4)}年1月` : `${month}月`;
            }
          }
          cursor = new Date(cursor.getTime() + DAY_MS);
        }
        weeks.push({ key: `week-${weekIndex}`, monthLabel, days });
        weekIndex += 1;
      }
      return weeks;
    },
    calendarCanvasStyle() {
      return { width: `${Math.max(1, this.weeks.length) * WEEK_COLUMN_WIDTH}px` };
    },
    selectedDay() {
      if (!this.selectedDateKey) return null;
      for (const week of this.weeks) {
        const matched = week.days.find((day) => day.date === this.selectedDateKey);
        if (matched) return matched;
      }
      return null;
    },
  },
  watch: {
    calendarData: {
      immediate: true,
      handler() {
        this.selectedDateKey = "";
        this.scrollLeft = 0;
        this.$nextTick(() => {
          this.scrollLeft = 99999;
        });
      },
    },
  },
  methods: {
    selectDay(day) {
      if (!day || day.placeholder) return;
      this.selectedDateKey = day.date;
    },
    levelText(level) {
      return levelTextValue(level);
    },
    formatDuration(seconds) {
      return formatDurationValue(seconds);
    },
    formatShortDate(dateKey) {
      return formatShortDateValue(dateKey);
    },
    formatLongDate(dateKey) {
      return formatLongDateValue(dateKey);
    },
  },
};
</script>

<style lang="scss" scoped>
.writing-calendar-section {
  --calendar-empty: #ebedf0;
  --calendar-level-1: #9be9a8;
  --calendar-level-2: #40c463;
  --calendar-level-3: #216e39;
  margin-top: var(--section-gap, 28rpx);
  padding: 30rpx var(--page-x, 40rpx) 24rpx;
  color: var(--text-primary, #2d2d2d);
  background: var(--surface-base, #ffffff);
  content-visibility: auto;
  contain-intrinsic-size: auto 520rpx;

  .dark-mode & {
    --calendar-empty: rgba(255, 255, 255, 0.1);
    --calendar-level-1: #0e4429;
    --calendar-level-2: #26a641;
    --calendar-level-3: #39d353;
  }
}

.calendar-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 22rpx;
}

.calendar-title {
  font-size: 34rpx;
  line-height: 1.25;
  font-weight: bold;
}

.calendar-summary,
.calendar-goal,
.tracking-note {
  color: var(--text-secondary, #666666);
  font-size: 23rpx;
  line-height: 1.5;
}

.calendar-summary {
  margin-top: 7rpx;
}

.summary-separator {
  margin: 0 6rpx;
}

.calendar-goal {
  max-width: 230rpx;
  text-align: right;
}

.calendar-state {
  padding: 32rpx 20rpx;
  border-radius: 14rpx;
  color: var(--text-secondary, #666666);
  background: var(--surface-muted, #f8f9fa);
  font-size: 25rpx;
  text-align: center;

  &.error {
    color: #b42318;
  }
}

.calendar-layout {
  display: flex;
  align-items: flex-start;
}

.weekday-labels {
  width: 28rpx;
  flex-shrink: 0;
  padding-top: 22px;
  margin-right: 8rpx;
}

.weekday-label {
  height: 16px;
  margin-bottom: 4px;
  color: var(--text-tertiary, #95a1a6);
  font-size: 18rpx;
  line-height: 16px;
}

.calendar-scroll {
  width: calc(100% - 36rpx);
  white-space: nowrap;
}

.calendar-canvas {
  min-width: 100%;
  padding-bottom: 4rpx;
}

.month-row,
.weeks-row {
  display: flex;
}

.month-row {
  height: 22px;
}

.month-cell,
.week-column {
  width: 20px;
  flex: 0 0 20px;
}

.month-cell {
  position: relative;
  color: var(--text-tertiary, #95a1a6);
  font-size: 19rpx;
  line-height: 18px;

  text {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
}

.activity-day,
.legend-day {
  width: 16px;
  height: 16px;
  border: 1px solid rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  box-sizing: border-box;
  background: var(--calendar-empty);
}

.activity-day {
  margin-bottom: 4px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:active {
    transform: scale(0.9);
  }

  &.placeholder {
    visibility: hidden;
    pointer-events: none;
  }

  &.untracked {
    opacity: 0.38;
    background-image: linear-gradient(
      135deg,
      transparent 42%,
      rgba(127, 127, 127, 0.38) 43%,
      rgba(127, 127, 127, 0.38) 57%,
      transparent 58%
    );
  }

  &.today {
    box-shadow: 0 0 0 2px var(--accent, #b46f58);
  }

  &.selected {
    box-shadow: 0 0 0 2px var(--text-primary, #2d2d2d);
  }
}

.level-0 {
  background-color: var(--calendar-empty);
}

.level-1 {
  background-color: var(--calendar-level-1);
}

.level-2 {
  background-color: var(--calendar-level-2);
}

.level-3 {
  background-color: var(--calendar-level-3);
}

.calendar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 15rpx;
}

.legend {
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: var(--text-tertiary, #95a1a6);
  font-size: 20rpx;
}

.legend-day {
  width: 14px;
  height: 14px;
}

.selected-day {
  margin-top: 20rpx;
  padding: 20rpx 22rpx;
  border-radius: 14rpx;
  background: var(--surface-muted, #f8f9fa);
}

.selected-date {
  font-size: 26rpx;
  font-weight: 600;
}

.selected-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
  margin-top: 8rpx;
  color: var(--text-secondary, #666666);
  font-size: 23rpx;
}

.selected-level {
  color: var(--calendar-level-3);
  font-weight: 600;
}
</style>
