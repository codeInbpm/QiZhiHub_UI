<template>
  <el-dialog :title="'新增员工'" v-model="visible" :close-on-click-modal="false" draggable width="60%">
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="140px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="员工工号" prop="employeeNo">
            <el-input v-model="form.employeeNo" placeholder="请输入员工工号" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="姓名" prop="enpName">
            <el-input v-model="form.enpName" placeholder="请输入姓名" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="用户头像" prop="avatar">
            <el-input v-model="form.avatar" placeholder="请输入用户头像URL" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择性别" clearable>
              <el-option v-for="dict in gender" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="所属部门" prop="departmentId">
            <el-cascader
                v-model="form.departmentId"
                :options="deptOptions"
                :props="cascaderProps"
                placeholder="请选择部门"
                clearable
                :show-all-levels="true"
                filterable
                :loading="deptLoading"
                change-on-select
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="职位" prop="position">
            <el-input v-model="form.position" placeholder="请输入职位" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="岗位ID" prop="postId">
            <el-input v-model="form.postId" placeholder="请输入岗位ID" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="聘用类型" prop="hireType">
            <el-select v-model="form.hireType" placeholder="请选择聘用类型" clearable>
              <el-option v-for="dict in hire_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="员工类型" prop="empType">
            <el-select v-model="form.empType" placeholder="请选择员工类型" clearable>
              <el-option v-for="dict in emp_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="入职日期" prop="entryDate">
            <el-date-picker v-model="form.entryDate" type="date" placeholder="请选择入职日期" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="试用期到" prop="probationEndDate">
            <el-date-picker v-model="form.probationEndDate" type="date" placeholder="请选择试用期结束日期" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="转正日期" prop="regularizationDate">
            <el-date-picker v-model="form.regularizationDate" type="date" placeholder="请选择转正日期" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="离职日期" prop="exitDate">
            <el-date-picker v-model="form.exitDate" type="date" placeholder="请选择离职日期" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="学历" prop="education">
            <el-select v-model="form.education" placeholder="请选择学历" clearable>
              <el-option v-for="dict in education_level" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="民族" prop="ethnicity">
            <el-input v-model="form.ethnicity" placeholder="请输入民族" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="生日类型" prop="birthdayType">
            <el-select v-model="form.birthdayType" placeholder="请选择生日类型" clearable>
              <el-option label="阳历" value="solar" />
              <el-option label="阴历" value="lunar" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="form.birthday" type="date" placeholder="请选择生日" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="籍贯" prop="nativePlace">
            <el-input v-model="form.nativePlace" placeholder="请输入籍贯" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="婚姻" prop="maritalStatus">
            <el-select v-model="form.maritalStatus" placeholder="请选择婚姻状态" clearable>
              <el-option v-for="dict in marital_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard" placeholder="请输入身份证号" maxlength="18" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="现住址" prop="currentAddress">
            <el-input v-model="form.currentAddress" placeholder="请输入现住址" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="家庭住址" prop="familyAddress">
            <el-input v-model="form.familyAddress" placeholder="请输入家庭住址" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="电话" prop="landlinePhone">
            <el-input v-model="form.landlinePhone" placeholder="请输入固定电话" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="手机号" prop="mobilePhone">
            <el-input v-model="form.mobilePhone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="备用联系人" prop="emergencyContact">
            <el-input v-model="form.emergencyContact" placeholder="请输入备用联系人" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="备用联系人电话" prop="emergencyPhone">
            <el-input v-model="form.emergencyPhone" placeholder="请输入备用联系人电话" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="开户行" prop="bankName">
            <el-input v-model="form.bankName" placeholder="请输入开户行" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="工资卡账号" prop="bankAccount">
            <el-input v-model="form.bankAccount" placeholder="请输入工资卡账号" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" placeholder="请输入备注" type="textarea" :rows="3" maxlength="500" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="OaEmployeesAddDialog">
import { ref, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useDict } from '/@/hooks/dict';
import { addObj } from '/@/api/oa/oaEmployees';
import { deptTree } from '/@/api/admin/dept';

// 字典
const { gender } = useDict('gender');
const { emp_type } = useDict('emp_type');
const { hire_type } = useDict('hire_type');
const { marital_status } = useDict('marital_status');
const { education_level } = useDict('education_level');

// 响应式
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const deptLoading = ref(false);  // 部门加载状态

const form = reactive({
  employeeNo: '',
  enpName: '',
  avatar: '',
  gender: '',
  departmentId: null,  // el-cascader 的值会是数组 [id1, id2, ...]，但这里我们取最后一个叶子节点 id
  position: '',
  postId: null,
  hireType: '',
  empType: '',
  entryDate: '',
  probationEndDate: '',
  regularizationDate: '',
  exitDate: '',
  education: '',
  ethnicity: '',
  birthdayType: '',
  birthday: '',
  nativePlace: '',
  maritalStatus: '',
  idCard: '',
  currentAddress: '',
  familyAddress: '',
  landlinePhone: '',
  mobilePhone: '',
  email: '',
  emergencyContact: '',
  emergencyPhone: '',
  bankName: '',
  bankAccount: '',
  remarks: '',
});

// 部门选项（树形数据）
const deptOptions = ref([]);

// el-cascader 配置
const cascaderProps = {
  value: 'id',
  label: 'name',
  children: 'children'
};

// 加载部门树（传递空参数以获取全树）
const loadDepts = async () => {
  deptLoading.value = true;
  try {
    // 根据接口，传递 { name: '' } 以加载全部门树（对应后端 deptName = ''）
    const res = await deptTree({ name: '' });
    deptOptions.value = res.data || [];
  } catch (err) {
    ElMessage.error('加载部门失败');
    deptOptions.value = [];
  } finally {
    deptLoading.value = false;
  }
};

// 校验规则
const dataRules = {
  employeeNo: [{ required: true, message: '员工工号不能为空', trigger: 'blur' }],
  enpName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  gender: [{ required: true, message: '性别不能为空', trigger: 'change' }],
  departmentId: [{
    required: true,
    message: '部门不能为空',
    trigger: 'change',
    validator: (rule, value, callback) => {
      if (!value || !value.length) {
        callback(new Error('部门不能为空'));
      } else {
        // el-cascader 返回数组，取最后一个 id 作为 departmentId
        form.departmentId = value[value.length - 1];
        callback();
      }
    }
  }],
};

// 打开弹窗
const openDialog = async () => {
  visible.value = true;
  // 加载部门数据（全树）
  await loadDepts();
  nextTick(() => dataFormRef.value?.resetFields());
};

// 提交（处理 departmentId 为叶子节点 id）
const onSubmit = async () => {
  loading.value = true;
  try {
    await dataFormRef.value.validate();
    // 确保 departmentId 是叶子节点 id（如果需要全路径，可调整）
    if (Array.isArray(form.departmentId) && form.departmentId.length > 0) {
      form.departmentId = form.departmentId[form.departmentId.length - 1];
    }
    await addObj(form);
    ElMessage.success('新增成功');
    visible.value = false;
    emit('refresh');
  } catch (err) {
    ElMessage.error(err.msg || '新增失败');
  } finally {
    loading.value = false;
  }
};

const emit = defineEmits(['refresh']);
defineExpose({ openDialog });
</script>
