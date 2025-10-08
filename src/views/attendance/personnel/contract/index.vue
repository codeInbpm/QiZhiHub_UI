<template>
	<div class="layout-padding">
		员工合同
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { delObj, pageList, putObj } from '/src/api/admin/user';
import { deptTree } from '/src/api/admin/dept';
import { BasicTableProps, useTable } from '/src/hooks/table';
import { useMessage, useMessageBox } from '/src/hooks/message';
import { useI18n } from 'vue-i18n';


const { t } = useI18n();

// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();
const queryRef = ref();
const showSearch = ref(true);

// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		deptId: '',
		username: '',
		phone: '',
	},
	pageList: pageList,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 部门树使用的数据
const deptData = reactive({
	queryList: (name: String) => {
		return deptTree({
			deptName: name,
		});
	},
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.deptId = '';
	getDataList();
};

// 点击树
const handleNodeClick = (e: any) => {
	state.queryForm.deptId = e.id;
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/user/export', state.queryForm, 'users.xlsx');
};

// 是否可以多选
const handleSelectable = (row: any) => {
	return row.username !== 'admin';
};

// 多选事件
const handleSelectionChange = (objs: { userId: string }[]) => {
	selectObjs.value = objs.map(({ userId }) => userId);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

//表格内开关 (用户状态)
const changeSwitch = async (row: object) => {
	await putObj(row);
	useMessage().success(t('common.optSuccessText'));
	getDataList();
};
</script>
