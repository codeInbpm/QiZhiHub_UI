<template>
  <el-card class="h-full" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-blue-600">日程安排</h3>
        <div class="flex items-center gap-2">
          <el-button type="text" size="small" @click="prevMonth">上个月</el-button>
          <el-button type="text" size="small" @click="nextMonth">下个月</el-button>
          <el-button type="text" size="small" @click="goToToday">今天</el-button>
        </div>
      </div>
    </template>
    <div class="p-4">
      <!-- 年月 -->
      <div class="text-center mb-4">
        <h4 class="text-lg font-semibold">{{ currentYear }}年{{ currentMonth }}月</h4>
      </div>

      <!-- 周标题 -->
      <div class="grid grid-cols-7 gap-0 text-xs text-gray-500 mb-2 font-medium">
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div class="text-red-500">六</div>
        <div class="text-red-500">日</div>
      </div>

      <!-- 日历网格 -->
      <div class="grid grid-cols-7 gap-1 text-center">
        <div
            v-for="(day, index) in calendarDays"
            :key="index"
            :class="[
            'p-2 text-sm rounded cursor-pointer transition-colors',
            day.isToday ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100',
            day.isWeekend ? 'text-red-500' : 'text-gray-700',
            day.isEmpty ? 'invisible' : ''
          ]"
            @click="handleDayClick(day.date)"
        >
          {{ day.day }}
          <div v-if="day.events && day.events.length" class="text-xs text-gray-500 mt-1">
            {{ day.events.length }}件
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="schedule">
import { ElMessage } from 'element-plus';

const currentDate = ref(new Date('2025-10-09')); // 当前日期 2025-10-09
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth() + 1);

const calendarDays = ref<any[]>([]);

const mockEvents = {
  5: ['会议'],
  9: ['项目截止'],
  15: ['培训'],
};

onMounted(() => {
  generateCalendar();
});

const generateCalendar = () => {
  const year = currentYear.value;
  const month = currentMonth.value - 1;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // 周一开始

  calendarDays.value = [];
  for (let i = 0; i < 42; i++) { // 6周
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const day = date.getDate();
    const isEmpty = date.getMonth() !== month;
    const isToday = date.toDateString() === new Date('2025-10-09').toDateString();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const events = mockEvents[day] ? mockEvents[day] : [];

    calendarDays.value.push({ day, date: date.toISOString().split('T')[0], isEmpty, isToday, isWeekend, events });
  }
};

const prevMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
  generateCalendar();
};

const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
  generateCalendar();
};

const goToToday = () => {
  currentDate.value = new Date('2025-10-09');
  generateCalendar();
};

const handleDayClick = (date: string) => {
  ElMessage.info(`查看 ${date} 日程`);
  // 后续跳转或显示详情
};
</script>

<style scoped>
:deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f8fafc;
}
</style>
