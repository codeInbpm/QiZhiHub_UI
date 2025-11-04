<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">

      <!-- 搜索区域 -->
      <el-row v-show="showSearch" class="ml10">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item :label="$t('profile.employeeNo')" prop="employeeNo">
            <el-input v-model="state.queryForm.employeeNo" :placeholder="$t('profile.inputUsernameTip')" clearable @keyup.enter="getDataList" />
          </el-form-item>
          <el-form-item :label="$t('profile.name')" prop="enpName">
            <el-input v-model="state.queryForm.enpName" :placeholder="$t('profile.inputNameTip')" clearable @keyup.enter="getDataList" />
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
            @click="addDialogRef.openDialog()"
            v-auth="'oa_oaEmployees_add'"
          >
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button
            plain
            icon="upload-filled"
            type="primary"
            class="ml10"
            @click="excelUploadRef.show()"
            v-auth="'oa_oaEmployees_add'"
          >
            {{ $t('common.importBtn') }}
          </el-button>
          <el-button
            plain
            :disabled="multiple"
            icon="Delete"
            type="primary"
            v-auth="'oa_oaEmployees_del'"
            @click="handleDelete(selectObjs)"
          >
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar
            v-model:showSearch="showSearch"
            :export="'oa_oaEmployees_export'"
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
        <el-table-column type="index" :label="$t('profile.index')" width="40" />
        <el-table-column
          prop="employeeNo"
          :label="$t('profile.employeeNo')"
          show-overflow-tooltip
        />
        <el-table-column
          prop="enpName"
          :label="$t('profile.name')"
          show-overflow-tooltip
        />
        <el-table-column prop="gender" label="性别" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="gender" :value="scope.row.gender" />
          </template>
        </el-table-column>
        <el-table-column
          prop="deptName"
          :label="$t('profile.deptId')"
          show-overflow-tooltip
        />
        <el-table-column
          prop="position"
          :label="$t('profile.post')"
          show-overflow-tooltip
        />
<!--        <el-table-column-->
<!--          prop="empStatus"-->
<!--          label="人员状态"-->
<!--          show-overflow-tooltip-->
<!--        />-->
        <el-table-column prop="empType" label="员工类型" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="emp_type" :value="scope.row.empType" />
          </template>
        </el-table-column>

<!--        <el-table-column-->
<!--          prop="probationEndDate"-->
<!--          label="试用期到"-->
<!--          show-overflow-tooltip-->
<!--        />-->
        <el-table-column
          prop="regularizationDate"
          label="转正日期"
          show-overflow-tooltip
        />
        <el-table-column
          prop="education"
          label="学历"
          show-overflow-tooltip
        />
        <el-table-column prop="maritalStatus" label="婚姻" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="marital_status" :value="scope.row.maritalStatus" />
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="idCard"-->
<!--          label="身份证号"-->
<!--          show-overflow-tooltip-->
<!--        />-->
<!--        <el-table-column-->
<!--          prop="bankName"-->
<!--          label="开户行"-->
<!--          show-overflow-tooltip-->
<!--        />-->
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button
              icon="edit-pen"
              text
              type="primary"
              v-auth="'oa_oaEmployees_edit'"
              @click="editDialogRef.openDialog(scope.row.id)"
            >
              {{ $t('common.editBtn') }}
            </el-button>
            <el-button
              icon="delete"
              text
              type="primary"
              v-auth="'oa_oaEmployees_del'"
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
    <add-dialog ref="addDialogRef" @refresh="getDataList(false)" />
    <edit-dialog ref="editDialogRef" @refresh="getDataList(false)" />

    <!-- 导入excel弹窗 (需要在 upms-biz/resources/file 下维护模板) -->
    <upload-excel
      ref="excelUploadRef"
      :title="$t('profile.importProfileTip')"
      url="/oa/oaEmployees/import"
      temp-url="/admin/sys-file/local/file/oaEmployees.xlsx"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script setup lang="ts" name="systemOaEmployees">
// ========== 导入声明 ==========
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObjs } from "/@/api/oa/oaEmployees";
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

// ========== 字典数据 ==========
// 加载字典数据
const { gender } = useDict('gender');
const { emp_type } = useDict('emp_type');
const { marital_status } = useDict('marital_status');

// ========== 组件引用 ==========
// 异步组件
const AddDialog = defineAsyncComponent(() => import('./add-form.vue'));
const EditDialog = defineAsyncComponent(() => import('./edit-form.vue'));
// Excel上传弹窗引用
const excelUploadRef = ref();
// 查询表单引用
const queryRef = ref();

// ========== 响应式数据 ==========
const showSearch = ref(true);         // 是否显示搜索区域
const selectObjs = ref([]) as any;    // 表格多选数据
const multiple = ref(true);           // 是否多选
const addDialogRef = ref();
const editDialogRef = ref();

// ========== 表格状态 ==========
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},    // 查询参数
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
    '/oa/oaEmployees/export',
    Object.assign(state.queryForm, { ids: selectObjs }),
    'oaEmployees.xlsx'
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
    await useMessageBox().confirm(t('common.delConfirmText'));
  } catch {
    return;
  }

  try {
    await delObjs(ids);
    getDataList();
    useMessage().success(t('common.delSuccessText'));
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
</script>
