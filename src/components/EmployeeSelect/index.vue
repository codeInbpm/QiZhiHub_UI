<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder"
    filterable
    clearable
    :disabled="disabled"
    @update:model-value="handleChange"
  >
    <el-option
      v-for="item in employeeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from "/@/hooks/message";
import { fetchEmployeeList } from "/@/api/oa/oaEmployeeList";

// 定义员工选项接口
interface EmployeeOption {
  label: string;
  value: string;
}

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择员工'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

// 定义组件事件
const emit = defineEmits(['update:modelValue', 'change']);

// 员工选项列表
const employeeOptions = ref<EmployeeOption[]>([]);

// 加载员工数据
const loadEmployeeOptions = async () => {
  try {
    // 调用API获取员工列表
    const { data } = await fetchEmployeeList();
    if (data && Array.isArray(data)) {
      employeeOptions.value = data.map((item: any) => ({
        label: `${item.enpName} (${item.id})`,
        value: item.id
      }));
    }
  } catch (error) {
    useMessage().error('获取员工列表失败');
  }
};

// 处理选择变更
const handleChange = (value: string | number) => {
  emit('update:modelValue', value);
  emit('change', value);
};

// 组件挂载时加载员工数据
onMounted(() => {
  loadEmployeeOptions();
});
</script>
