<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb val1="商品管理" val2="商品添加"></breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签页 -->
      <el-tabs v-model="activeIndex" :tab-position="'left'" style="height: 200px;">
        <el-tab-pane label="基本信息" name="0">用户管理</el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品信息</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0'
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
