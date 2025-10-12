<template>
  <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
    :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="关联系统用户ID（sys_user.user_id）" prop="userId">
            <el-input v-model="form.userId" placeholder="请输入关联系统用户ID（sys_user.user_id）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="员工工号" prop="employeeNo">
            <el-input v-model="form.employeeNo" placeholder="请输入员工工号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="姓名" prop="enpName">
            <el-input v-model="form.enpName" placeholder="请输入姓名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="用户头像" prop="avatar">
            <el-input v-model="form.avatar" placeholder="请输入用户头像"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="性别（男/女/其他）" prop="gender">
            <el-input v-model="form.gender" placeholder="请输入性别（男/女/其他）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="所属部门ID（sys_dept.dept_id）" prop="departmentId">
            <el-input v-model="form.departmentId" placeholder="请输入所属部门ID（sys_dept.dept_id）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="职位" prop="position">
            <el-input v-model="form.position" placeholder="请输入职位"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="岗位ID（sys_post.post_id，如果有岗位表）" prop="postId">
            <el-input v-model="form.postId" placeholder="请输入岗位ID（sys_post.post_id，如果有岗位表）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="人员状态" prop="empStatus">
            <el-input v-model="form.empStatus" placeholder="请输入人员状态"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="密码过期时间" prop="passwordExpireDate">
            <el-input v-model="form.passwordExpireDate" placeholder="请输入密码过期时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="最近登录时间（从sys_user同步）" prop="lastLoginTime">
            <el-input v-model="form.lastLoginTime" placeholder="请输入最近登录时间（从sys_user同步）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="聘用类型（全职/兼职/远程等）" prop="hireType">
            <el-input v-model="form.hireType" placeholder="请输入聘用类型（全职/兼职/远程等）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="员工类型（正式/合同/实习等）" prop="empType">
            <el-input v-model="form.empType" placeholder="请输入员工类型（正式/合同/实习等）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="入职日期" prop="entryDate">
            <el-input v-model="form.entryDate" placeholder="请输入入职日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="试用期到" prop="probationEndDate">
            <el-input v-model="form.probationEndDate" placeholder="请输入试用期到"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="转正日期" prop="regularizationDate">
            <el-input v-model="form.regularizationDate" placeholder="请输入转正日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="离职日期" prop="exitDate">
            <el-input v-model="form.exitDate" placeholder="请输入离职日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="学历" prop="education">
            <el-input v-model="form.education" placeholder="请输入学历"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="民族" prop="ethnicity">
            <el-input v-model="form.ethnicity" placeholder="请输入民族"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="生日类型（阳历/阴历）" prop="birthdayType">
            <el-input v-model="form.birthdayType" placeholder="请输入生日类型（阳历/阴历）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="生日" prop="birthday">
            <el-input v-model="form.birthday" placeholder="请输入生日"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="籍贯" prop="nativePlace">
            <el-input v-model="form.nativePlace" placeholder="请输入籍贯"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="婚姻（已婚/单身/离异等）" prop="maritalStatus">
            <el-input v-model="form.maritalStatus" placeholder="请输入婚姻（已婚/单身/离异等）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard" placeholder="请输入身份证号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="现住址" prop="currentAddress">
            <el-input v-model="form.currentAddress" placeholder="请输入现住址"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="家庭住址" prop="familyAddress">
            <el-input v-model="form.familyAddress" placeholder="请输入家庭住址"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="电话" prop="landlinePhone">
            <el-input v-model="form.landlinePhone" placeholder="请输入电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="手机号" prop="mobilePhone">
            <el-input v-model="form.mobilePhone" placeholder="请输入手机号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="备用联系人" prop="emergencyContact">
            <el-input v-model="form.emergencyContact" placeholder="请输入备用联系人"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="备用联系人电话" prop="emergencyPhone">
            <el-input v-model="form.emergencyPhone" placeholder="请输入备用联系人电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="开户行" prop="bankName">
            <el-input v-model="form.bankName" placeholder="请输入开户行"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="工资卡账号" prop="bankAccount">
            <el-input v-model="form.bankAccount" placeholder="请输入工资卡账号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" placeholder="请输入备注"/>
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

<script setup lang="ts" name="OaEmployeesDialog">
// ========== 1. 导入语句 ==========
import { useDict } from '/@/hooks/dict';
import { rule } from '/@/utils/validate';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj, validateExist } from '/@/api/oa/oaEmployees';

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
  userId: '', // 关联系统用户ID（sys_user.user_id）
  employeeNo: '', // 员工工号
  enpName: '', // 姓名
  avatar: '', // 用户头像
  gender: '', // 性别（男/女/其他）
  departmentId: '', // 所属部门ID（sys_dept.dept_id）
  position: '', // 职位
  postId: '', // 岗位ID（sys_post.post_id，如果有岗位表）
  empStatus: '', // 人员状态
  passwordExpireDate: '', // 密码过期时间
  lastLoginTime: '', // 最近登录时间（从sys_user同步）
  hireType: '', // 聘用类型（全职/兼职/远程等）
  empType: '', // 员工类型（正式/合同/实习等）
  entryDate: '', // 入职日期
  probationEndDate: '', // 试用期到
  regularizationDate: '', // 转正日期
  exitDate: '', // 离职日期
  education: '', // 学历
  ethnicity: '', // 民族
  birthdayType: '', // 生日类型（阳历/阴历）
  birthday: '', // 生日
  nativePlace: '', // 籍贯
  maritalStatus: '', // 婚姻（已婚/单身/离异等）
  idCard: '', // 身份证号
  currentAddress: '', // 现住址
  familyAddress: '', // 家庭住址
  landlinePhone: '', // 电话
  mobilePhone: '', // 手机号
  email: '', // 邮箱
  emergencyContact: '', // 备用联系人
  emergencyPhone: '', // 备用联系人电话
  bankName: '', // 开户行
  bankAccount: '', // 工资卡账号
  remarks: '', // 备注
});

// ========== 4. 字典数据处理 ==========
// 加载字典数据
const { gender } = useDict('gender');

// ========== 5. 表单校验规则 ==========
const dataRules = ref({
});

// ========== 6. 方法定义 ==========
// 获取详情数据
const getOaEmployeesData = async (id: string) => {
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

  // 获取OaEmployees信息
  if (id) {
    form.id = id;
    getOaEmployeesData(id);
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