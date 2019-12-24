<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb val1="商品管理" val2="分类参数"></breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选中分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>

          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" stripe border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>

          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性或者参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改属性或者参数的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   级联双向绑定的数组
      selectCateKeys: [],
      //  被激活页签的名称
      activeName: 'many',
      //  动态参数的数据
      manyTableData: [],
      //   静态参数的数据
      onlyTableData: [],
      addDialogVisible: false,
      // 添加表单域的数据
      addForm: {
        attr_name: ''
      },
      // 校验规则
      addFormRules: { attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }] },
      editDialogVisible: false,
      editForm: {
        attr_name: ''
      },
      editFormRules: { attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }] }
    }
  },
  methods: {
    //   获取商品分类
    async getCateList() {
      const { data } = await this.$http.get('categories')
      if (data.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = data.data
    },
    // 级联选择框发生改变的时候会触发
    handleChange() {
      this.getParamsData()
    },
    // tab栏点击事件的事件触发函数
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数列表
    async getParamsData() {
      const { data } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (data.meta.status !== 200) return false
      if (this.activeName === 'many') {
        this.manyTableData = data.data
      } else {
        this.onlyTableData = data.data
      }
    },
    // 重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确认添加
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (data.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 展示修改框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (data.meta.status !== 200) return this.$message.error('获取参数信息失败')
      this.editForm = data.data
    },
    // 重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确认修改
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (data.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 根据id删除参数
    async removeParams(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (data.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsData()
    }
  },
  computed: {
    //   需要禁用就返回true
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) return true
      return false
    },
    // 用于获取级联选择器三级分类的某个id
    cateId() {
      if (this.selectCateKeys.length === 3) return this.selectCateKeys[2]
      return null
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
