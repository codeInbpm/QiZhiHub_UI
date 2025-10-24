<template>
  <el-popover
      ref="popoverRef"
      v-model:visible="popoverVisible"
      trigger="manual"
      placement="bottom-start"
      :virtualized="false"
      width="320"
      :teleported="false"
  >
    <template #reference>
      <el-input
          ref="inputRef"
          v-model="displayValue"
          :placeholder="placeholder"
          clearable
          :disabled="disabled"
          readonly
          @clear="handleClear"
          @focus="handleFocus"
          @click="handleClick"
          suffix-icon="ArrowDown"
      />
    </template>

    <div class="custom-dropdown">
      <!-- 搜索框 -->
      <el-input
          v-model="searchKeyword"
          placeholder="搜索员工"
          clearable
          style="margin-bottom: 10px;"
          autofocus
      />

      <!-- 列表 -->
      <div v-loading="loading" class="list-container">
        <div
            v-for="item in currentPageItems"
            :key="item.id"
            class="option-item"
            @click="selectItem(item)"
        >
          {{ item.enpName }} ({{ item.employeeNo }})
        </div>
        <div v-if="currentPageItems.length === 0 && !loading" class="no-data">
          无匹配数据
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="!loading && total > 0" class="pagination-wrapper">
        <div class="pagination-content">
          <div class="pagination-info">
            共 <span class="highlight">{{ total }}</span> 条数据
          </div>
          <el-pagination
              layout="prev, pager, next"
              :prev-text="'上一页'"
              :next-text="'下一页'"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              @current-change="handlePageChange"
              small
              hide-on-single-page
          />
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useMessage } from '/@/hooks/message';
import { fetchEmployeeList } from '/@/api/oa/oaEmployeeList';

interface Employee {
  id: string;
  enpName: string;
  employeeNo: string;
}

interface QueryParams {
  current: number;
  size: number;
  keyword?: string;
}

const props = defineProps<{
  modelValue: string | number;
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
}>();

const popoverRef = ref();
const inputRef = ref();
const popoverVisible = ref(false);
const searchKeyword = ref('');
const currentPageItems = ref<Employee[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);
const selectedEmployee = ref<Employee | null>(null);
const searchTimer = ref<number | null>(null);

const message = useMessage();

const displayValue = computed({
  get: () => {
    if (selectedEmployee.value) {
      return `${selectedEmployee.value.enpName} (${selectedEmployee.value.employeeNo})`;
    }
    return '';
  },
  set: () => {},
});

const loadEmployeeData = async (page = 1, keyword = '') => {
  if (loading.value) return;
  try {
    loading.value = true;
    const query: QueryParams = { current: page, size: pageSize.value };
    if (keyword.trim()) query.keyword = keyword.trim();
    const res = await fetchEmployeeList(query);
    if (res.code === 0 && res.data?.records) {
      currentPageItems.value = res.data.records;
      total.value = res.data.total || 0;
      currentPage.value = res.data.current || 1;
    } else {
      currentPageItems.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('加载员工数据失败:', error);
    message.error('获取员工列表失败');
    currentPageItems.value = [];
  } finally {
    loading.value = false;
  }
};

watch(searchKeyword, (newVal) => {
  if (searchTimer.value) clearTimeout(searchTimer.value);
  searchTimer.value = setTimeout(() => {
    currentPage.value = 1;
    loadEmployeeData(1, newVal);
  }, 300);
});

const handlePageChange = (page: number) => {
  loadEmployeeData(page, searchKeyword.value);
};

const selectItem = (item: Employee) => {
  selectedEmployee.value = item;
  emit('update:modelValue', item.id);
  emit('change', item.id);
  closePopover();
};

const openPopover = async () => {
  if (props.disabled) return;
  popoverVisible.value = true;
  await nextTick();
  const input = inputRef.value?.$el.querySelector('input');
  if (input) input.blur();
  loadEmployeeData(1, searchKeyword.value);
};

const closePopover = () => {
  popoverVisible.value = false;
  if (searchTimer.value) clearTimeout(searchTimer.value);
  searchKeyword.value = '';
  currentPage.value = 1;
};

const handleFocus = (e: FocusEvent) => {
  e.preventDefault();
  openPopover();
};

const handleClick = () => {
  openPopover();
};

const handleClear = () => {
  selectedEmployee.value = null;
  emit('update:modelValue', '');
  emit('change', '');
};

watch(
    () => props.modelValue,
    (newVal) => {
      if (!newVal) selectedEmployee.value = null;
    },
    { immediate: true },
);
</script>

<style scoped>
.custom-dropdown {
  padding: 8px;
}

.list-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  margin-bottom: 8px;
}

.option-item {
  padding: 0 12px;
  height: 34px;
  line-height: 34px;
  cursor: pointer;
  border-bottom: 1px solid var(--el-border-color-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.option-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.option-item:last-child {
  border-bottom: none;
}

.no-data {
  text-align: center;
  color: var(--el-text-color-placeholder);
  padding: 20px;
  font-size: 14px;
}

/* ✅ 优化分页布局 */
.pagination-wrapper {
  border-top: 1px solid var(--el-border-color-light);
  padding-top: 6px;
}

.pagination-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px; /* 控制“共N条数据”和分页控件间距 */
  flex-wrap: wrap;
}

.pagination-info {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.pagination-info .highlight {
  color: var(--el-color-primary);
  font-weight: 500;
}
</style>
