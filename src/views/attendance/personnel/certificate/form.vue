<template>
  <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
    :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="关联员工ID" prop="employeeId">
            <el-input v-model="form.employeeId" placeholder="请输入关联员工ID"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="证书名称（如“身份证”、“学历证书”）" prop="certificateName">
            <el-input v-model="form.certificateName" placeholder="请输入证书名称（如“身份证”、“学历证书”）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="证书编号（如“ID-2025001”）" prop="certificateNumber">
            <el-input v-model="form.certificateNumber" placeholder="请输入证书编号（如“ID-2025001”）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="证书图片路径" prop="certImage">
            <el-input v-model="form.certImage" placeholder="请输入证书图片路径"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="证书文件路径" prop="filePath">
            <el-input v-model="form.filePath" placeholder="请输入证书文件路径"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="颁发日期" prop="issueDate">
            <el-input v-model="form.issueDate" placeholder="请输入颁发日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="有效期（NULL表示无期限）" prop="expiryDate">
            <el-input v-model="form.expiryDate" placeholder="请输入有效期（NULL表示无期限）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="颁发机构（如“教育部”）" prop="issuer">
            <el-input v-model="form.issuer" placeholder="请输入颁发机构（如“教育部”）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="证书状态（valid=有效, expired=过期, invalid=无效）" prop="status">
            <el-input v-model="form.status" placeholder="请输入证书状态（valid=有效, expired=过期, invalid=无效）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="备注（如“复印件”）" prop="remarks">
            <el-input v-model="form.remarks" placeholder="请输入备注（如“复印件”）"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="loading">确 认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="OaEmployeeCertificatesDialog">
// ========== 1. 导入语句 ==========
import { useDict } from '/@/hooks/dict';
import { rule } from '/@/utils/validate';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj, validateExist } from '/@/api/oa/oaEmployeeCertificates';

// ========== 2. 组件定义 ==========
// 定义组件事件
const emit = defineEmits(['refresh']);

// ========== 3. 响应式数据定义 ==========
// 基础响应式变量
const dataFormRef = ref(); // 表单引用
const visible = ref(false); // 弹窗显示状态
const loading = ref(false); // 加载状态

// 表单数据对象
const form = reactive({
  id: '', // 主键
  employeeId: '', // 关联员工ID
  certificateName: '', // 证书名称（如“身份证”、“学历证书”）
  certificateNumber: '', // 证书编号（如“ID-2025001”）
  certImage: '', // 证书图片路径
  filePath: '', // 证书文件路径
  issueDate: '', // 颁发日期
  expiryDate: '', // 有效期（NULL表示无期限）
  issuer: '', // 颁发机构（如“教育部”）
  status: '', // 证书状态（valid=有效, expired=过期, invalid=无效）
  remarks: '', // 备注（如“复印件”）
});

// ========== 4. 字典数据处理 ==========

// ========== 5. 表单校验规则 ==========
const dataRules = ref({
});

// ========== 6. 方法定义 ==========
// 获取详情数据
const getOaEmployeeCertificatesData = async (id: string) => {
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

  // 获取OaEmployeeCertificates信息
  if (id) {
    form.id = id;
    getOaEmployeeCertificatesData(id);
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
