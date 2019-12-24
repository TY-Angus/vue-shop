<template>
  <div>
    <!-- 面包屑导航区域
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>-->
    <breadcrumb val1="用户管理" val2="用户列表"></breadcrumb>
    <!-- 卡边区域 -->
    <el-card>
      <!-- 用户搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改用户按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogCliosed">
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRoles"
        ref="addFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogCliosed"
    >
      <!-- 修改用户主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRoles"
        ref="editFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色名：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    }
    // 验证手机号的规则
    let checkMobile = (rule, value, callback) => {
      let regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      //  添加用户表单的对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //  表单规则的验证规则对象
      addFormRoles: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }]
      },
      // 修改用户的对法框是否显示
      editDialogVisible: false,
      // 表单数据
      editForm: {},
      // 修改用户的验证规则
      editFormRoles: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }]
      },
      // 分配角色的对话框是否显示
      setRoleDialogVisible: false,
      // 需要被分配角色的用户
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选择的角色id
      selectedRoleId: ''
    }
  },
  methods: {
    // 用户列表数据获取
    async getUserList() {
      const { data } = await this.$http.get('users', { params: this.queryInfo })
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.userList = data.data.users
      // total总的数据量
      this.total = data.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码发生变化的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 用户状态修改功能
    async userStateChange(userInfo) {
      const { data } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (data.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('用户状态修改失败')
      }
      this.$message.success('用户状态修改成功')
    },
    // 重置添加用户表单
    addDialogCliosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户功能
    addUser() {
      // 预校验
      this.$refs.addFormRef.validate(async valid => {
        // 如果验证通过为true
        if (valid) {
          const { data } = await this.$http.post('users', this.addForm)
          if (data.meta.status !== 201) return this.$message.error('用户添加失败')
          this.$message.success('添加用户成功')
          // 对话框消失
          this.addDialogVisible = false
          // 重新渲染
          this.getUserList()
        } else {
          return false
        }
      })
    },
    // 获取当前用户的信息
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data } = await this.$http.get(`users/${id}`)
      if (data.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editForm = data.data
    },
    // 重置修改用户表单
    editDialogCliosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        // 如果验证通过为true
        if (valid) {
          const { data } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
          // 如果请求失败
          if (data.meta.status !== 200) return this.$message.error('用户修改失败')
          this.$message.success('修改用户成功')
          // 对话框消失
          this.editDialogVisible = false
          // 重新渲染
          this.getUserList()
        } else {
          return false
        }
      })
    },
    // 删除用户
    async removeUser(id) {
      const confirmReslut = await this.$confirm('此操作将永久删除该用户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmReslut === 'confirm') {
        const { data } = await this.$http.delete('users/' + id)
        if (data.meta.status === 200) {
          this.$message.success('删除用户成功！')
          // 重新渲染
          // 判断当前页是否是最后一条数据
          if (this.userList.length < 2) {
            this.queryInfo.pagenum--
            this.getUserList()
          }
        } else {
          this.$message.error('删除用户失败！')
        }
      } else {
        return this.$message.info('已经取消了删除')
      }
    },
    // 获取所有角色数据
    async showRoleDialog(userInfo) {
      this.userInfo = userInfo
      const { data } = await this.$http.get('roles')
      if (data.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = data.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) return this.$message.info('请分配角色')
      const { data } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (data.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 分配角色对话框关闭
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>
