<template>
  <div class="oa-layout">
    <!-- 固定顶部菜单栏 -->
    <el-menu
        :default-active="activeIndex"
        class="oa-nav-menu"
        mode="horizontal"
        @select="handleSelect"
        router
    >
      <el-menu-item index="info">
        <el-icon><House /></el-icon>
        <span>信息发布</span>
      </el-menu-item>
      <el-menu-item index="file">
        <el-icon><Document /></el-icon>
        <span>文件管理</span>
      </el-menu-item>
      <el-sub-menu index="approval">
        <template #title>
          <el-icon><Edit /></el-icon>
          <span>审批流程</span>
        </template>
        <el-sub-menu index="approval-asset">
          <template #title>资产管理</template>
          <el-menu-item index="asset-manage">资产管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="approval-hr">
          <template #title>人力</template>
          <el-menu-item index="leave">请假申请</el-menu-item>
          <el-menu-item index="onboard">员工入职</el-menu-item>
          <el-menu-item index="archive">员工档案</el-menu-item>
          <el-menu-item index="promotion">晋升审批</el-menu-item>
          <el-menu-item index="dimission">离职审批</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-sub-menu index="work">
        <template #title>
          <el-icon><View /></el-icon>
          <span>工作管理</span>
        </template>
        <el-menu-item index="leader-schedule">领导工作安排</el-menu-item>
        <el-menu-item index="personal-schedule">个人工作安排</el-menu-item>
        <el-menu-item index="team-task">团队任务分配</el-menu-item>
        <el-menu-item index="progress-report">进度汇报</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="system">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </template>
        <el-menu-item index="user">用户管理</el-menu-item>
        <el-menu-item index="role">角色管理</el-menu-item>
        <el-menu-item index="permission">权限管理</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="help">
        <el-icon></el-icon>
        <span>帮助</span>
      </el-menu-item>
    </el-menu>

    <!-- 主体内容 -->
    <div class="oa-main">
      <!-- 左侧待办事项面板 -->
      <el-row :gutter="20" class="todo-section">
        <el-col :span="18">
          <el-card class="todo-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>待办事项</span>
                <el-button type="text" @click="toggleTodoCollapse">收起</el-button>
              </div>
            </template>
            <el-collapse v-model="activeTodoNames" accordion>
              <el-collapse-item title="待办 (62)" name="todo">
                <div class="todo-item">
                  <el-checkbox-group v-model="state.checkedTodos">
                    <el-checkbox
                        v-for="item in state.todoList"
                        :key="item.id"
                        :label="item.id"
                        @change="handleTodoChange(item)"
                    >
                      {{ item.title }} - {{ item.date }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
              <el-collapse-item title="一般 (24)" name="general">
                <div class="todo-item">
                  <el-checkbox-group v-model="state.checkedGeneral">
                    <el-checkbox
                        v-for="item in state.generalList"
                        :key="item.id"
                        :label="item.id"
                    >
                      {{ item.title }} - {{ item.date }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
              <el-collapse-item title="待阅 (0)" name="pending">
                <p class="empty-text">暂无待阅事项</p>
              </el-collapse-item>
              <el-collapse-item title="已阅 (0)" name="read">
                <p class="empty-text">暂无已阅记录</p>
              </el-collapse-item>
              <el-collapse-item title="草稿 (0)" name="draft">
                <p class="empty-text">暂无草稿</p>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
        <el-col :span="6">
          <!-- 右侧常用应用 -->
          <el-card class="app-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>常用应用</span>
              </div>
            </template>
            <div class="app-grid">
              <div v-for="app in state.apps" :key="app.id" class="app-item" @click="openApp(app)">
                <el-icon :class="app.icon" :style="{ color: app.color, fontSize: '24px' }"></el-icon>
                <span>{{ app.name }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 下方内容：报表、日程、会议等 -->
      <el-row :gutter="20" class="bottom-section">
        <el-col :span="8">
          <el-card class="report-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>报表</span>
                <el-button type="text">更多</el-button>
              </div>
            </template>
            <div id="pie-chart" style="width: 100%; height: 200px;"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="schedule-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>日程</span>
                <el-button type="text">添加</el-button>
              </div>
            </template>
            <el-calendar v-model="state.currentDate">
              <template #dateCell="{ data }">
                <div class="calendar-cell">
                  <span class="date-text">{{ data.day.split('-')[2] }}</span>
                  <div v-if="data.day.split('-')[2] === '15'" class="event-marker">会议</div>
                </div>
              </template>
            </el-calendar>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="meeting-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>会议</span>
                <el-button type="text">新建</el-button>
              </div>
            </template>
            <el-table :data="state.meetings" stripe style="width: 100%;">
              <el-table-column prop="title" label="会议主题" />
              <el-table-column prop="time" label="时间" />
              <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                  <el-tag :type="row.status === '进行中' ? 'warning' : 'success'">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <!-- 其他链接 -->
      <el-row :gutter="20" class="links-section">
        <el-col :span="24">
          <el-card class="links-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>其他链接</span>
              </div>
            </template>
            <el-link v-for="link in state.links" :key="link.id" :href="link.url" target="_blank" style="margin-right: 20px;">
              {{ link.text }}
            </el-link>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { House, Setting, Bell, ArrowDown, Document, Edit, View } from '@element-plus/icons-vue';

// 模拟数据
const mockTodos = [
  { id: 1, title: '审批合同', date: '2025-11-04', completed: false },
  { id: 2, title: '回复邮件', date: '2025-11-04', completed: false },
  // ... 更多数据
];
const mockGeneral = [
  { id: 1, title: '日常巡检', date: '2025-11-05', completed: false },
  // ...
];
const mockApps = [
  { id: 1, name: '公文箱', icon: 'Document', color: '#409EFF' },
  { id: 2, name: '流程中心', icon: 'Cpu', color: '#67C23A' },
  { id: 3, name: '通知公告', icon: 'Message', color: '#E6A23C' },
  { id: 4, name: '日程安排', icon: 'Date', color: '#F56C6C' },
  { id: 5, name: '通讯录', icon: 'Phone', color: '#909399' },
  { id: 6, name: '外出申请', icon: 'Location', color: '#7356F1' },
];
const mockMeetings = [
  { title: '周会讨论', time: '2025-11-05 10:00', status: '进行中' },
  { title: '项目回顾', time: '2025-11-06 14:00', status: '已结束' },
];
const mockLinks = [
  { id: 1, text: '内部OA系统', url: 'https://oa.example.com' },
  { id: 2, text: '企业门户', url: 'https://portal.example.com' },
  { id: 3, text: '知识库', url: 'https://wiki.example.com' },
];

// 状态定义
const activeIndex = ref('info');
const activeTodoNames = ref(['todo']);
const state = reactive({
  searchKeyword: '',
  currentUser: '张三',
  userAvatar: 'https://cube.elemecdn.com/0/04/06a29d14a363bc42788cf8b14dd860png.png',
  checkedTodos: [] as number[],
  checkedGeneral: [] as number[],
  todoList: mockTodos.slice(0, 5),
  generalList: mockGeneral.slice(0, 3),
  apps: mockApps,
  currentDate: ref(new Date('2025-11-04')),
  meetings: mockMeetings,
  links: mockLinks,
});

// 方法
const handleSelect = (key: string, keyPath: string[]) => {
  console.log('导航到:', key, keyPath);
  activeIndex.value = key;
};

const handleSearch = () => {
  ElMessage.success('搜索: ' + state.searchKeyword);
};

const toggleTodoCollapse = () => {
  // 逻辑：切换展开/收起
  activeTodoNames.value = activeTodoNames.value.length ? [] : ['todo'];
};

const handleTodoChange = (item: any) => {
  ElMessage.success(item.title + ' 已处理');
};

const openApp = (app: any) => {
  ElMessage.info('打开应用: ' + app.name);
};

const logout = () => {
  ElMessage.confirm('确认退出?').then(() => {
    // 退出逻辑
  });
};

// 初始化饼图
onMounted(() => {
  const chartDom = document.getElementById('pie-chart');
  if (chartDom) {
    const myChart = echarts.init(chartDom);
    const option = {
      tooltip: { trigger: 'item' },
      series: [
        {
          name: '报表',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '待办' },
            { value: 735, name: '已办' },
            { value: 580, name: '一般' },
            { value: 484, name: '待阅' },
          ],
        },
      ],
    };
    myChart.setOption(option);
  }
});
</script>

<style scoped>
.oa-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.oa-nav-menu {
  border-bottom: 1px solid #e4e7ed;
  height: 60px;
  display: flex;
  align-items: center;
}

.oa-nav-menu :deep(.el-menu-item),
.oa-nav-menu :deep(.el-sub-menu__title) {
  height: 60px;
  line-height: 60px;
}

.oa-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
}

.search-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.user-section {
  display: flex;
  gap: 15px;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.notification-badge {
  margin-left: 10px;
}

.oa-main {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.todo-section {
  margin-bottom: 20px;
}

.todo-card, .app-card, .report-card, .schedule-card, .meeting-card, .links-card {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-item {
  max-height: 200px;
  overflow-y: auto;
}

.empty-text {
  color: #999;
  text-align: center;
  padding: 20px;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 10px 0;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background 0.3s;
}

.app-item:hover {
  background: #f5f7fa;
}

.bottom-section {
  margin-bottom: 20px;
}

.schedule-card :deep(.el-calendar) {
  height: 250px;
}

.calendar-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2px;
}

.date-text {
  font-size: 12px;
}

.event-marker {
  background: #409EFF;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 2px;
  margin-top: 2px;
}

.links-section {
  margin-bottom: 20px;
}

.links-card {
  height: auto;
}

.links-card :deep(.el-link) {
  margin-right: 20px;
}
</style>
