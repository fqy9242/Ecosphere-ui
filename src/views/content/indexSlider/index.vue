<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="photoStatus">
        <el-select v-model="queryParams.photoStatus" placeholder="请选择状态" clearable style="width: 139px;">
          <el-option v-for="dict in silder_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="photoDesc">
        <el-input v-model="queryParams.photoDesc" placeholder="请输入描述" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['content:indexSlider:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['content:indexSlider:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['content:indexSlider:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['content:indexSlider:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="indexSliderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="图片" align="center" prop="photo" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.photo" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="photoStatus">
        <template #default="scope">
          <dict-tag :options="silder_status" :value="scope.row.photoStatus" />
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="photoDesc" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['content:indexSlider:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['content:indexSlider:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改首页轮播图对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="indexSliderRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="轮播图url" prop="photo">
          <image-upload v-model="form.photo" />
        </el-form-item>
        <el-form-item label="描述" prop="photoDesc">
          <el-input v-model="form.photoDesc" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="IndexSlider">
import { listIndexSlider, getIndexSlider, delIndexSlider, addIndexSlider, updateIndexSlider } from "@/api/content/indexSlider";

const { proxy } = getCurrentInstance();
const { silder_status } = proxy.useDict('silder_status');

const indexSliderList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    photo: null,
    photoStatus: null,
    photoDesc: null,
  },
  rules: {
    title: [
      { required: true, message: "标题不能为空", trigger: "blur" }
    ],
    photo: [
      { required: true, message: "轮播图不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询首页轮播图列表 */
function getList() {
  loading.value = true;
  listIndexSlider(queryParams.value).then(response => {
    indexSliderList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    title: null,
    photo: null,
    photoStatus: null,
    photoDesc: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("indexSliderRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加首页轮播图";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getIndexSlider(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改首页轮播图";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["indexSliderRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateIndexSlider(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addIndexSlider(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除首页轮播图编号为"' + _ids + '"的数据项？').then(function() {
    return delIndexSlider(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('content/indexSlider/export', {
    ...queryParams.value
  }, `indexSlider_${new Date().getTime()}.xlsx`)
}

getList();
</script>
