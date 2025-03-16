<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物品名" prop="goodName">
        <el-input
          v-model="queryParams.goodName"
          placeholder="请输入物品名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交换条件" prop="exchangeCondition">
        <el-input
          v-model="queryParams.exchangeCondition"
          placeholder="请输入交换条件"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物品类型" prop="goodTag">
        <el-input
          v-model="queryParams.goodTag"
          placeholder="请输入物品类型"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布人id" prop="creatorId">
        <el-input
          v-model="queryParams.creatorId"
          placeholder="请输入发布人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="dealStatus">
        <el-select v-model="queryParams.dealStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in user_deal_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['deal:deal:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['deal:deal:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['deal:deal:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['deal:deal:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dealList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" align="center" prop="id" />
      <el-table-column label="物品名" align="center" prop="goodName" />
      <el-table-column label="商品描述" align="center" prop="dealDescription" />
      <el-table-column label="交换条件" align="center" prop="exchangeCondition" />
      <el-table-column label="物品类型,标签" align="center" prop="goodTag" />
      <el-table-column label="发布人id" align="center" prop="creatorId" />
      <el-table-column label="状态" align="center" prop="dealStatus">
        <template #default="scope">
          <dict-tag :options="user_deal_status" :value="scope.row.dealStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['deal:deal:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['deal:deal:remove']">删除</el-button>
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

    <!-- 添加或修改用户交易对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dealRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物品名" prop="goodName">
          <el-input v-model="form.goodName" placeholder="请输入物品名" />
        </el-form-item>
        <el-form-item label="商品描述" prop="dealDescription">
          <el-input v-model="form.dealDescription" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="交换条件" prop="exchangeCondition">
          <el-input v-model="form.exchangeCondition" placeholder="请输入交换条件" />
        </el-form-item>
        <el-form-item label="物品类型" prop="goodTag">
          <el-input v-model="form.goodTag" placeholder="请输入物品类型" />
        </el-form-item>
        <el-form-item label="发布人id" prop="creatorId">
          <el-input v-model="form.creatorId" placeholder="请输入发布人id" />
        </el-form-item>
        <el-form-item label="状态" prop="dealStatus">
          <el-select v-model="form.dealStatus" placeholder="请选择状态">
            <el-option
              v-for="dict in user_deal_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="center">用户交易物品图片信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddUserDealGoodImg">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteUserDealGoodImg">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="userDealGoodImgList" :row-class-name="rowUserDealGoodImgIndex" @selection-change="handleUserDealGoodImgSelectionChange" ref="userDealGoodImg">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="0未删除 1已删除" prop="isDelete" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.isDelete" placeholder="请输入0未删除 1已删除" />
            </template>
          </el-table-column>
        </el-table>
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

<script setup name="Deal">
import { listDeal, getDeal, delDeal, addDeal, updateDeal } from "@/api/deal/deal";

const { proxy } = getCurrentInstance();
const { user_deal_status } = proxy.useDict('user_deal_status');

const dealList = ref([]);
const userDealGoodImgList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedUserDealGoodImg = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    goodName: null,
    dealDescription: null,
    exchangeCondition: null,
    goodTag: null,
    creatorId: null,
    dealStatus: null,
  },
  rules: {
    goodName: [
      { required: true, message: "物品名不能为空", trigger: "blur" }
    ],
    creatorId: [
      { required: true, message: "发布人id不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户交易列表 */
function getList() {
  loading.value = true;
  listDeal(queryParams.value).then(response => {
    dealList.value = response.rows;
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
    goodName: null,
    dealDescription: null,
    exchangeCondition: null,
    goodTag: null,
    creatorId: null,
    dealStatus: null,
    createTime: null,
    updateTime: null
  };
  userDealGoodImgList.value = [];
  proxy.resetForm("dealRef");
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
  title.value = "添加用户交易";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getDeal(_id).then(response => {
    form.value = response.data;
    userDealGoodImgList.value = response.data.userDealGoodImgList;
    open.value = true;
    title.value = "修改用户交易";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["dealRef"].validate(valid => {
    if (valid) {
      form.value.userDealGoodImgList = userDealGoodImgList.value;
      if (form.value.id != null) {
        updateDeal(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDeal(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户交易编号为"' + _ids + '"的数据项？').then(function() {
    return delDeal(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 用户交易物品图片序号 */
function rowUserDealGoodImgIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 用户交易物品图片添加按钮操作 */
function handleAddUserDealGoodImg() {
  let obj = {};
  obj.imgUrl = "";
  obj.isDelete = "";
  userDealGoodImgList.value.push(obj);
}

/** 用户交易物品图片删除按钮操作 */
function handleDeleteUserDealGoodImg() {
  if (checkedUserDealGoodImg.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的用户交易物品图片数据");
  } else {
    const userDealGoodImgs = userDealGoodImgList.value;
    const checkedUserDealGoodImgs = checkedUserDealGoodImg.value;
    userDealGoodImgList.value = userDealGoodImgs.filter(function(item) {
      return checkedUserDealGoodImgs.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleUserDealGoodImgSelectionChange(selection) {
  checkedUserDealGoodImg.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('deal/deal/export', {
    ...queryParams.value
  }, `deal_${new Date().getTime()}.xlsx`)
}

getList();
</script>
