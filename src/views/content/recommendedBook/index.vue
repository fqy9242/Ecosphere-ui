<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="书名" prop="bookName">
        <el-input
          v-model="queryParams.bookName"
          placeholder="请输入书名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="书籍作者" prop="bookAuthor">
        <el-input
          v-model="queryParams.bookAuthor"
          placeholder="请输入书籍作者"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作者国籍" prop="authorNationality">
        <el-input
          v-model="queryParams.authorNationality"
          placeholder="请输入作者国籍"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['content:recommendedBook:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['content:recommendedBook:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['content:recommendedBook:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['content:recommendedBook:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recommendedBookList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="书名" align="center" prop="bookName" />
      <el-table-column label="书的描述,介绍" align="center" prop="bookDescription" />
      <el-table-column label="封面" align="center" prop="bookCover" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.bookCover" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="书籍作者" align="center" prop="bookAuthor" />
      <el-table-column label="作者国籍" align="center" prop="authorNationality" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['content:recommendedBook:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['content:recommendedBook:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改推荐书籍对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="recommendedBookRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="书名" prop="bookName">
          <el-input v-model="form.bookName" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="书的描述,介绍" prop="bookDescription">
          <el-input v-model="form.bookDescription" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="封面" prop="bookCover">
          <image-upload v-model="form.bookCover"/>
        </el-form-item>
        <el-form-item label="书籍作者" prop="bookAuthor">
          <el-input v-model="form.bookAuthor" placeholder="请输入书籍作者" />
        </el-form-item>
        <el-form-item label="作者国籍" prop="authorNationality">
          <el-input v-model="form.authorNationality" placeholder="请输入作者国籍" />
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

<script setup name="RecommendedBook">
import { listRecommendedBook, getRecommendedBook, delRecommendedBook, addRecommendedBook, updateRecommendedBook } from "@/api/content/recommendedBook";

const { proxy } = getCurrentInstance();

const recommendedBookList = ref([]);
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
    bookName: null,
    bookDescription: null,
    bookAuthor: null,
    authorNationality: null,
    createTime: null,
  },
  rules: {
    bookName: [
      { required: true, message: "书名不能为空", trigger: "blur" }
    ],
    bookAuthor: [
      { required: true, message: "书籍作者不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询推荐书籍列表 */
function getList() {
  loading.value = true;
  listRecommendedBook(queryParams.value).then(response => {
    recommendedBookList.value = response.rows;
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
    bookName: null,
    bookDescription: null,
    bookCover: null,
    bookAuthor: null,
    authorNationality: null,
    bookType: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("recommendedBookRef");
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
  title.value = "添加推荐书籍";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getRecommendedBook(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改推荐书籍";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["recommendedBookRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRecommendedBook(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRecommendedBook(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除推荐书籍编号为"' + _ids + '"的数据项？').then(function() {
    return delRecommendedBook(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('content/recommendedBook/export', {
    ...queryParams.value
  }, `recommendedBook_${new Date().getTime()}.xlsx`)
}

getList();
</script>
