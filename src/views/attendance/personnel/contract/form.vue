<template>
  <el-dialog :title="form.id ? $t('contract.edit') : $t('contract.add')" v-model="visible"
    :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.employeeId')" prop="employeeId">
            <el-select v-model="form.employeeId" :placeholder="$t('contract.employeeIdPlaceholder')" filterable>
              <el-option v-for="item in employeeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.contractNumber')" prop="contractNumber">
            <el-input v-model="form.contractNumber" :placeholder="$t('contract.contractNumberPlaceholder')"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.contractName')" prop="contractName">
            <el-input v-model="form.contractName" :placeholder="$t('contract.contractNamePlaceholder')"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.contractType')" prop="contractType">
            <el-select v-model="form.contractType" :placeholder="$t('contract.contractTypePlaceholder')">
              <el-option 
                v-for="item in contractTypeOptions" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value" 
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.signingUnit')" prop="signingUnit">
            <el-input v-model="form.signingUnit" :placeholder="$t('contract.signingUnitPlaceholder')"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.signingDate')" prop="signingDate">
            <el-date-picker 
              v-model="form.signingDate" 
              type="date" 
              :placeholder="$t('contract.signingDatePlaceholder')"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.startDate')" prop="startDate">
            <el-date-picker 
              v-model="form.startDate" 
              type="date" 
              :placeholder="$t('contract.startDatePlaceholder')"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.endDate')" prop="endDate">
            <el-date-picker 
              v-model="form.endDate" 
              type="date" 
              :placeholder="$t('contract.endDatePlaceholder')"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.trialStartDate')" prop="trialStartDate">
            <el-date-picker 
              v-model="form.trialStartDate" 
              type="date" 
              :placeholder="$t('contract.trialStartDatePlaceholder')"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.trialEndDate')" prop="trialEndDate">
            <el-date-picker 
              v-model="form.trialEndDate" 
              type="date" 
              :placeholder="$t('contract.trialEndDatePlaceholder')"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.earlyTerminationDate')" prop="earlyTerminationDate">
            <el-date-picker 
              v-model="form.earlyTerminationDate" 
              type="date" 
              :placeholder="$t('contract.earlyTerminationDatePlaceholder')"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.contractStatus')" prop="contractStatus">
            <el-select v-model="form.contractStatus" :placeholder="$t('contract.contractStatusPlaceholder')">
              <el-option 
                v-for="item in contractStatusOptions" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value" 
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.filePath')" prop="filePath">
            <el-input v-model="form.filePath" :placeholder="$t('contract.filePathPlaceholder')"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.partyASigner')" prop="partyASigner">
            <el-input v-model="form.partyASigner" :placeholder="$t('contract.partyASignerPlaceholder')"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.renewalCount')" prop="renewalCount">
            <el-input-number v-model="form.renewalCount" :min="0" :placeholder="$t('contract.renewalCountPlaceholder')"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('contract.department')" prop="department">
            <el-select v-model="form.department" :placeholder="$t('contract.departmentPlaceholder')" filterable>
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="OaEmployeeContractsDialog">
// ========== 1. 导入语句 ==========
import { useDict } from '/@/hooks/dict';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj, validateExist } from '/@/api/oa/oaEmployeeContracts';

// ========== 2. 组件定义 ==========
// 定义组件事件
const emit = defineEmits(['refresh']);

// ========== 3. 响应式数据定义 ==========
// 获取国际化函数
const { t } = useI18n();

// 基础响应式变量
const dataFormRef = ref(); // 表单引用
const visible = ref(false); // 弹窗显示状态
const loading = ref(false); // 加载状态

// 合同类型选项
const contractTypeOptions = [
  { label: t('contract.contractTypeLabor'), value: 'labor' },
  { label: t('contract.contractTypeTrial'), value: 'trial' },
  { label: t('contract.contractTypePartTime'), value: 'part_time' },
  { label: t('contract.contractTypeOther'), value: 'other' }
];

// 合同状态选项
const contractStatusOptions = [
  { label: t('contract.contractStatusPending'), value: 'pending' },
  { label: t('contract.contractStatusActive'), value: 'active' },
  { label: t('contract.contractStatusExpired'), value: 'expired' },
  { label: t('contract.contractStatusTerminated'), value: 'terminated' }
];

// 员工选项 - 实际项目中应该从API获取
const employeeOptions = ref([
  { label: '张三', value: '1001' },
  { label: '李四', value: '1002' },
  { label: '王五', value: '1003' }
]);

// 部门选项 - 实际项目中应该从API获取
const departmentOptions = ref([
  { label: '研发部', value: '研发部' },
  { label: '市场部', value: '市场部' },
  { label: '人事部', value: '人事部' },
  { label: '财务部', value: '财务部' }
]);

// 表单数据对象
const form = reactive({
  id: '', // 主键
  employeeId: '', // 关联员工ID
  contractNumber: '', // 合同编号（如“HT-2021-001”），全局唯一
  contractName: '', // 合同名称（如“正式劳动合同”）
  contractType: '', // 合同类型（labor=劳动, trial=试用, part_time=兼职, other=其他）
  signingUnit: '', // 签署单位（如“信呼开发团队”）
  signingDate: '', // 签订日期（实际签字日）
  startDate: '', // 开始日期
  endDate: '', // 截止日期
  trialStartDate: '', // 试用期开始日期
  trialEndDate: '', // 试用期结束日期
  earlyTerminationDate: '', // 提前终止日期
  contractStatus: '', // 状态（pending=待生效, active=有效, expired=已过期, terminated=终止）
  filePath: '', // 合同文件路径
  partyASigner: '', // 甲方（公司）代表人
  renewalCount: '', // 续签次数
  department: '', // 部门
});

// ========== 4. 字典数据处理 ==========

// ========== 5. 表单校验规则 ==========
const dataRules = ref({
});

// ========== 6. 方法定义 ==========
// 获取详情数据
const getOaEmployeeContractsData = async (id: string) => {
  try {
    loading.value = true;
    const { data } = await getObj({ id: id });
    // 直接将第一条数据赋值给表单
    Object.assign(form, data[0]);
  } catch (error) {
    useMessage().error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

// 打开弹窗方法
const openDialog = (id: string) => {
  visible.value = true;
  form.id = '';

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取OaEmployeeContracts信息
  if (id) {
    form.id = id;
    getOaEmployeeContractsData(id);
  }
};

// 提交表单方法
const onSubmit = async () => {
  loading.value = true; // 防止重复提交
  
  // 表单校验
  const valid = await dataFormRef.value.validate().catch(() => {});
  if (!valid) {
    loading.value = false;
    return false;
  }

  try {
    // 根据是否有ID判断是新增还是修改
    form.id ? await putObj(form) : await addObj(form);
    useMessage().success(form.id ? '修改成功' : '添加成功');
    visible.value = false;
    emit('refresh'); // 通知父组件刷新列表
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

// ========== 7. 对外暴露 ==========
// 暴露方法给父组件
defineExpose({
  openDialog
});
</script>