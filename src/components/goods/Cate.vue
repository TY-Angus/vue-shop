<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb val1="商品管理" val2="商品分类"></breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 分配分类区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color:lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color:lightgreen"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.name"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      //   添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      //   父级分类列表
      parentCateList: [],
      //   指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      //   选中的父级id的数组
      selectedKeys: []
    }
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data } = await this.$http.get('categories', { params: this.queryInfo })
      if (data.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = data.data.result
      this.total = data.data.total
    },
    // 监听pagesize-change事件的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加对话框的展示
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级的分类列表
    async getParentCateList() {
      const { data } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (data.meta.status !== 200) return this.$message.error('获取父级分类列表失败')
      this.parentCateList = data.data
    },
    // 选择项被触发了
    parentCateChanged() {
      // 处理添加分类的表单数据
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return false
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 当前分类的等级
        this.addCateForm.cat_level = 0
        return false
      }
    },
    // 点击确认添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加分类的格式不对')
        const { data } = await this.$http.post(`categories`, this.addCateForm)
        if (data.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的消失
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
