<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">

      <!-- 搜索区域 -->
      <el-row v-show="showSearch" class="ml10">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item :label="$t('contract.contractNumber')" prop="contractNumber">
            <el-input v-model="state.queryForm.contractNumber" :placeholder="$t('contract.inputContractNumberTip')" clearable @keyup.enter="getDataList" />
          </el-form-item>
          <el-form-item :label="$t('contract.contractName')" prop="contractName">
            <el-input v-model="state.queryForm.contractName" :placeholder="$t('contract.inputContractNameTip')" clearable @keyup.enter="getDataList" />
          </el-form-item>
          <el-form-item :label="$t('contract.contractType')" prop="contractType">
            <el-select v-model="state.queryForm.contractType" clearable :placeholder="$t('contract.contractType')">
              <el-option v-for="item in contractTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('contract.contractStatus')" prop="contractStatus">
            <el-select v-model="state.queryForm.contractStatus" clearable :placeholder="$t('contract.contractStatus')">
              <el-option v-for="item in contractStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!-- 操作按钮区域 -->
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button
            icon="folder-add"
            type="primary"
            class="ml10"
            @click="formDialogRef.openDialog()"
            v-auth="'oa_oaEmployeeContracts_add'"
          >
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button
            plain
            icon="upload-filled"
            type="primary"
            class="ml10"
            @click="excelUploadRef.show()"
            v-auth="'oa_oaEmployeeContracts_add'"
          >
            {{ $t('common.importBtn') }}
          </el-button>
          <el-button
            plain
            :disabled="multiple"
            icon="Delete"
            type="primary"
            v-auth="'oa_oaEmployeeContracts_del'"
            @click="handleDelete(selectObjs)"
          >
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar
            v-model:showSearch="showSearch"
            :export="'oa_oaEmployeeContracts_export'"
            @exportExcel="exportExcel"
            class="ml10 mr20"
            style="float: right;"
            @queryTable="getDataList"
          />
        </div>
      </el-row>

      <!-- 数据表格区域 -->
      <el-table
        :data="state.dataList"
        v-loading="state.loading"
        border
        :cell-style="tableStyle.cellStyle"
        :header-cell-style="tableStyle.headerCellStyle"
        @selection-change="selectionChangHandle"
        @sort-change="sortChangeHandle"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column type="index" :label="$t('contract.index')" width="40" />
        <el-table-column
          prop="employeeName"
          :label="$t('contract.employeeName')"
          show-overflow-tooltip
        />
        <el-table-column
          prop="contractNumber"
          :label="$t('contract.contractNumber')"
          show-overflow-tooltip
        />
        <el-table-column
          prop="contractName"
          :label="$t('contract.contractName')"
          show-overflow-tooltip
        />
        <el-table-column
          prop="contractType"
          :label="$t('contract.contractType')"
          show-overflow-tooltip
        >
          <template #default="scope">
            <dict-tag :options="contractTypeOptions" :value="scope.row.contractType" />
          </template>
        </el-table-column>
        <el-table-column
          prop="startDate"
          :label="$t('contract.startDate')"
          show-overflow-tooltip
        />
        <el-table-column
          prop="endDate"
          :label="$t('contract.endDate')"
          show-overflow-tooltip
        />
        <el-table-column
          prop="contractStatus"
          :label="$t('contract.contractStatus')"
          show-overflow-tooltip
        >
          <template #default="scope">
            <dict-tag :options="contractStatusOptions" :value="scope.row.contractStatus" />
          </template>
        </el-table-column>
        <el-table-column
          prop="department"
          :label="$t('contract.department')"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button
              icon="edit-pen"
              text
              type="primary"
              v-auth="'oa_oaEmployeeContracts_edit'"
              @click="formDialogRef.openDialog(scope.row.id)"
            >
              {{ $t('common.editBtn') }}
            </el-button>
            <el-button
              icon="delete"
              text
              type="primary"
              v-auth="'oa_oaEmployeeContracts_del'"
              @click="handleDelete([scope.row.id])"
            >
              {{ $t('common.delBtn') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        v-bind="state.pagination"
      />
    </div>

    <!-- 编辑、新增弹窗 -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)" />

    <!-- 导入excel弹窗 (需要在 upms-biz/resources/file 下维护模板) -->
    <upload-excel
      ref="excelUploadRef"
      :title="$t('contract.importContractTip')"
      url="/oa/oaEmployeeContracts/import"
      temp-url="/admin/sys-file/local/file/oaEmployeeContracts.xlsx"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script setup lang="ts" name="systemOaEmployeeContracts">
// ========== 导入声明 ==========
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObjs } from "/@/api/oa/oaEmployeeContracts";
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

// 导入i18n语言包
import zhCn from './i18n/zh-cn';
import en from './i18n/en';

// 注册i18n语言包
const { t, mergeLocaleMessage } = useI18n();
mergeLocaleMessage('zh-cn', zhCn);
mergeLocaleMessage('en', en);

// ========== 组件声明 ==========
// 异步加载表单弹窗组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

// ========== 字典数据 ==========
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

// ========== 组件引用 ==========
const formDialogRef = ref();          // 表单弹窗引用
const excelUploadRef = ref();         // Excel上传弹窗引用
const queryRef = ref();               // 查询表单引用

// ========== 响应式数据 ==========
const showSearch = ref(true);         // 是否显示搜索区域
const selectObjs = ref([]) as any;    // 表格多选数据
const multiple = ref(true);           // 是否多选

// ========== 表格状态 ==========
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    contractNumber: '',
    contractName: '',
    contractType: '',
    contractStatus: ''
  },    // 查询参数
  pageList: fetchList // 分页查询方法
});

// ========== Hook引用 ==========
// 表格相关Hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile,
  tableStyle
} = useTable(state);

// ========== 方法定义 ==========
/**
 * 重置查询条件
 */
const resetQuery = () => {
  // 清空搜索条件
  queryRef.value?.resetFields();
  // 清空多选
  selectObjs.value = [];
  // 重新查询
  getDataList();
};

/**
 * 导出Excel文件
 */
const exportExcel = () => {
  downBlobFile(
    '/oa/oaEmployeeContracts/export',
    Object.assign(state.queryForm, { ids: selectObjs }),
    'oaEmployeeContracts.xlsx'
  );
};

/**
 * 表格多选事件处理
 * @param objs 选中的数据行
 */
const selectionChangHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({ id }) => id);
  multiple.value = !objs.length;
};

/**
 * 删除数据处理
 * @param ids 要删除的数据ID数组
 */
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除');
  } catch {
    return;
  }

  try {
    await delObjs(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
</script>
