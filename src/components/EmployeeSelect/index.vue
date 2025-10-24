<template>
  <el-popover ref="popoverRef" v-model:visible="popoverVisible" trigger="manual" placement="bottom-start"
    :virtualized="false" width="380" :teleported="false" @keydown="handleKeydown">
    <template #reference>
      <el-input ref="inputRef" v-model="displayValue" :placeholder="placeholder" clearable :disabled="disabled" readonly
        @clear="handleClear" @focus="handleFocus" @click="handleClick" suffix-icon="ArrowDown" class="select-input" />
    </template>

    <div class="design-dropdown">
      <!-- 搜索框和清除按钮 -->
      <div class="search-wrapper">
        <el-input v-model="searchKeyword" placeholder="搜索姓名或工号" clearable autofocus class="search-input">
          <template #prefix>
            <el-icon class="search-icon">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button v-if="selectedEmployee" type="text" class="clear-button" @click="handleClearSelection">
          <el-icon>
            <Close />
          </el-icon> 清除
        </el-button>
      </div>

      <!-- 列表 + 分页容器（flex 布局） -->
      <div class="content-wrapper">
        <!-- 列表（自适应高度） -->
        <div v-loading="loading" class="list-container">
          <div v-for="(item, index) in currentPageItems" :key="item.id" class="list-item"
            :class="{ selected: highlightedIndex === index }" @click="selectItem(item)">
            <div class="item-avatar">
              <div class="avatar-placeholder">
                {{ item.enpName[0] }}
              </div>
            </div>
            <div class="item-content">
              <div class="item-name" v-html="highlightText(item.enpName, searchKeyword)" />
              <div class="item-no" v-html="highlightText(item.employeeNo, searchKeyword)" />
            </div>
            <el-icon v-if="highlightedIndex === index" class="check-icon">
              <Check />
            </el-icon>
          </div>

          <!-- 空状态 -->
          <div v-if="currentPageItems.length === 0 && !loading" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path d="M20 32h24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <div class="empty-text">未找到匹配员工</div>
          </div>
        </div>

        <!-- 分页栏（固定底部） -->
        <div v-if="!loading && total > 0" class="pagination-bar">
          <div class="pagination-info">
            共 <span class="count">{{ total }}</span> 条
          </div>
          <el-pagination layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total"
            @current-change="handlePageChange" small hide-on-single-page class="compact-pagination" />
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useMessage } from '/@/hooks/message';
import { fetchEmployeeList } from '/@/api/oa/oaEmployeeList';
import { Search, ArrowDown, Check, Close } from '@element-plus/icons-vue';

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
const highlightedIndex = ref(-1);
const message = useMessage();

const displayValue = computed({
  get: () => selectedEmployee.value ? `${selectedEmployee.value.enpName} (${selectedEmployee.value.employeeNo})` : '',
  set: () => { },
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
    console.error('加载失败:', error);
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
    highlightedIndex.value = -1;
    loadEmployeeData(1, newVal);
  }, 300);
});

const handlePageChange = (page: number) => {
  highlightedIndex.value = -1;
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
  highlightedIndex.value = -1;
};

const handleFocus = (e: FocusEvent) => { e.preventDefault(); openPopover(); };
const handleClick = () => openPopover();
const handleClear = () => {
  selectedEmployee.value = null;
  emit('update:modelValue', '');
  emit('change', '');
};

const handleClearSelection = () => {
  selectedEmployee.value = null;
  emit('update:modelValue', '');
  emit('change', '');
  searchKeyword.value = '';
  loadEmployeeData(1, '');
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!popoverVisible.value) return;
  const items = currentPageItems.value;
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    highlightedIndex.value = (highlightedIndex.value + 1) % items.length;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    highlightedIndex.value = highlightedIndex.value <= 0 ? items.length - 1 : highlightedIndex.value - 1;
  } else if (e.key === 'Enter' && highlightedIndex.value >= 0) {
    e.preventDefault();
    selectItem(items[highlightedIndex.value]);
  }
};

const highlightText = (text: string, keyword: string) => {
  if (!keyword.trim()) return text;
  const regex = new RegExp(`(${keyword.trim()})`, 'gi');
  return text.replace(regex, '<mark class="hl">$1</mark>');
};

watch(() => props.modelValue, (newVal) => { if (!newVal) selectedEmployee.value = null; }, { immediate: true });
watch(popoverVisible, (val) => { if (val) highlightedIndex.value = -1; });
</script>

<style scoped>
/* ==================== 整体卡片：双层边框 + 毛玻璃 ==================== */
.design-dropdown {
  padding: 18px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 20px;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
}

html.dark .design-dropdown {
  background: rgba(28, 28, 33, 0.92);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* ==================== 搜索框和清除按钮容器 ==================== */
.search-wrapper {
  margin-bottom: 10px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input :deep(.el-input__wrapper) {
  height: 40px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid var(--el-border-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 0 18px;
  font-size: 15px;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.18), 0 6px 20px rgba(64, 158, 255, 0.15);
}

.search-icon {
  font-size: 19px;
  color: var(--el-color-primary);
}

html.dark .search-input :deep(.el-input__wrapper) {
  background: rgba(45, 45, 50, 0.95);
}

.clear-button {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  padding: 0 8px;
  height: 32px;
}

.clear-button:hover {
  color: var(--el-color-primary);
}

/* ==================== 内容容器：relative 布局 ==================== */
.content-wrapper {
  position: relative;
  height: 340px;
  margin-top: 8px;
}

/* ==================== 列表：自适应高度 + 滚动 ==================== */
.list-container {
  height: calc(100% - 52px);
  overflow-y: auto;
  border-radius: 14px;
  background: transparent;
  padding: 4px 0;
}

/* ==================== 列表项：紧凑设计 ==================== */
.list-item {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  margin: 0 8px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  min-height: 52px;
}

.list-item:hover {
  background: var(--el-color-primary-light-9);
}

.list-item.selected {
  background: var(--el-color-primary-light-8);
  position: relative;
}

.list-item.selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 28px;
  background: var(--el-color-primary);
  border-radius: 2px;
}

.item-avatar {
  margin-right: 12px;
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--el-color-primary-light-7);
  color: var(--el-color-primary);
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-content {
  flex: 1;
  min-width: 0;
  line-height: 1.3;
}

.item-name {
  font-weight: 600;
  font-size: 14.5px;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-no {
  font-size: 12.5px;
  color: var(--el-text-color-secondary);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-icon {
  color: var(--el-color-primary);
  font-size: 17px;
  font-weight: bold;
}

/* 高亮 */
.hl {
  background: #fffbe6;
  color: #d4380d;
  padding: 0 4px;
  border-radius: 3px;
  font-weight: 600;
}

/* ==================== 空状态：极简 ==================== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--el-text-color-placeholder);
}

.empty-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  color: var(--el-text-color-placeholder);
}

.empty-text {
  font-size: 14px;
  font-weight: 500;
}

/* ==================== 分页栏：绝对定位底部 ==================== */
.pagination-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--el-bg-color-overlay);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 10px 18px;
  border-top: 1px dashed var(--el-border-color-lighter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  z-index: 1;
  border-radius: 0 0 18px 18px;
}

html.dark .pagination-bar {
  background: rgba(28, 28, 33, 0.92);
}

.pagination-info {
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.count {
  color: var(--el-color-primary);
  font-weight: 700;
  padding: 0 3px;
}

.compact-pagination :deep(.el-pagination .el-pager li) {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 8px;
  font-weight: 600;
  margin: 0 3px;
  background: transparent;
  border: none;
  color: var(--el-text-color-regular);
}

.compact-pagination :deep(.el-pagination .el-pager li.is-active) {
  color: var(--el-color-primary);
  background: transparent;
  position: relative;
}

.compact-pagination :deep(.el-pagination .el-pager li.is-active)::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 2px;
  background: var(--el-color-primary);
  border-radius: 1px;
}

.compact-pagination :deep(.btn-prev),
.compact-pagination :deep(.btn-next) {
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

/* 滚动条 */
.list-container::-webkit-scrollbar {
  width: 6px;
}

.list-container::-webkit-scrollbar-track {
  background: transparent;
}

.list-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.list-container:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.25);
}

html.dark .list-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

html.dark .list-container:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.35);
}

/* 响应式 */
@media (max-width: 400px) {
  .design-dropdown {
    padding: 16px;
    width: 340px;
  }

  .content-wrapper {
    height: 300px;
  }

  .list-container {
    height: calc(100% - 52px);
  }

  .pagination-bar {
    padding: 8px 12px;
    font-size: 12px;
  }

  .compact-pagination :deep(.el-pagination .el-pager li) {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    margin: 0 2px;
  }
}
</style>