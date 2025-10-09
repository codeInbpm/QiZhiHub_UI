<!-- current-user.vue (已优化为图片样式：用户info + 3小卡片，模拟数据13/15/5) -->
<template>
  <el-card class="h-full shadow-sm hover:shadow-md transition-shadow" shadow="never">
    <template #header>
      <div class="flex items-center">
        <h3 class="text-base font-semibold text-blue-600">当前用户</h3>
      </div>
    </template>
    <div class="p-4">
      <div class="flex items-center justify-between mb-6">
        <!-- 用户信息 -->
        <div class="flex items-center gap-4">
          <el-avatar
              :size="56"
              shape="circle"
              :src="baseURL + userData.avatar"
              class="ring-1 ring-gray-100"
          />
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ userData.name }}</h3>
            <div class="flex items-center gap-2 text-sm">
              <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{{ userData?.dept?.name }}</span>
              <span v-if="userData.postName" class="px-3 py-1 bg-green-50 text-green-600 rounded-full">{{ userData.postName }}</span>
            </div>
          </div>
        </div>

        <!-- 时间 -->
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ parseTime(date) }}</span>
        </div>
      </div>

      <!-- 待办与提醒卡片列表（网格布局，小尺寸，带背景色） -->
      <div class="grid grid-cols-3 gap-3">
        <!-- 待办事项 -->
        <el-card
            v-if="todoCount > 0"
            class="cursor-pointer transition-all text-center p-3 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 hover:shadow-sm"
            @click="handleJumpToTodo"
        >
          <div class="flex items-center justify-center gap-1 mb-1">
            <el-icon class="text-red-500 text-base">
              <Document />
            </el-icon>
            <span class="text-lg font-bold text-red-600">{{ todoCount }}</span>
          </div>
          <p class="text-xs text-gray-600 font-medium">待办/处理项</p>
        </el-card>
        <template v-else>
          <el-card class="text-center p-3 rounded-md border border-gray-200 bg-gray-50 opacity-50">
            <el-icon class="text-gray-400 mx-auto mb-1 text-sm"><Document /></el-icon>
            <p class="text-xs text-gray-400">暂无待办</p>
          </el-card>
        </template>

        <!-- 提醒信息 -->
        <el-card
            v-if="reminderCount > 0"
            class="cursor-pointer transition-all text-center p-3 rounded-md border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300 hover:shadow-sm"
            @click="handleJumpToReminder"
        >
          <div class="flex items-center justify-center gap-1 mb-1">
            <el-icon class="text-yellow-500 text-base">
              <Clock />
            </el-icon>
            <span class="text-lg font-bold text-yellow-600">{{ reminderCount }}</span>
          </div>
          <p class="text-xs text-gray-600 font-medium">提醒信息</p>
        </el-card>
        <template v-else>
          <el-card class="text-center p-3 rounded-md border border-gray-200 bg-gray-50 opacity-50">
            <el-icon class="text-gray-400 mx-auto mb-1 text-sm"><Clock /></el-icon>
            <p class="text-xs text-gray-400">暂无提醒</p>
          </el-card>
        </template>

        <!-- 审批事项 -->
        <el-card
            v-if="approvalCount > 0"
            class="cursor-pointer transition-all text-center p-3 rounded-md border border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 hover:shadow-sm"
            @click="handleJumpToApproval"
        >
          <div class="flex items-center justify-center gap-1 mb-1">
            <el-icon class="text-blue-500 text-base">
              <Edit />
            </el-icon>
            <span class="text-lg font-bold text-blue-600">{{ approvalCount }}</span>
          </div>
          <p class="text-xs text-gray-600 font-medium">待审批</p>
        </el-card>
        <template v-else>
          <el-card class="text-center p-3 rounded-md border border-gray-200 bg-gray-50 opacity-50">
            <el-icon class="text-gray-400 mx-auto mb-1 text-sm"><Edit /></el-icon>
            <p class="text-xs text-gray-400">暂无审批</p>
          </el-card>
        </template>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="currentUser">
import { useUserInfo } from '/@/stores/userInfo';
import { getObj } from '/@/api/admin/user';
import { useRouter } from 'vue-router';
import { Document, Clock, Edit } from '@element-plus/icons-vue';

const router = useRouter();

const date = ref(new Date());
const baseURL = ref('/'); // 调整为实际 baseURL

const userData = ref({
  postName: '',
  name: '张三',
  username: 'admin',
  userId: '1',
  avatar: '',
  dept: { name: '研发部' },
} as any);

const todoCount = ref(13); // 模拟，后续API
const reminderCount = ref(15); // 模拟，后续API
const approvalCount = ref(5); // 模拟，后续API

const loading = ref(false);

setInterval(() => {
  date.value = new Date();
}, 1000);

onMounted(() => {
  const data = useUserInfo().userInfos;
  if (data?.user?.userId) {
    initUserInfo(data.user.userId);
  } else {
    // 模拟用户数据
    userData.value = {
      name: '张三',
      postName: 'CTO',
      dept: { name: '研发部' },
      avatar: '',
    };
  }
  fetchCounts(); // 模拟计数
});

const initUserInfo = async (userId: any): Promise<void> => {
  try {
    loading.value = true;
    const res = await getObj(userId);
    userData.value = res.data;
    userData.value.postName = res.data?.postList?.map((item: any) => item.postName).join(',') || '';
    userData.value.avatar = res.data.avatar || '';
  } finally {
    loading.value = false;
  }
};

const fetchCounts = async (): Promise<void> => {
  // 模拟，后续替换为实际API，如 getTodoCount()
  todoCount.value = 13;
  reminderCount.value = 15;
  approvalCount.value = 5;
};

const handleJumpToTodo = () => router.push({ path: '/todo' });
const handleJumpToReminder = () => router.push({ path: '/reminder' });
const handleJumpToApproval = () => router.push({ path: '/approval' });

const parseTime = (time: Date) => {
  return time.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
</script>

<style scoped>
:deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f8fafc;
}

:deep(.el-card__body) {
  padding: 0;
}

.cursor-pointer:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
  }
}
</style>
