<template>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{val1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{val2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ['val1', 'val2']
}
</script>
