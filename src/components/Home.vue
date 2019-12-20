<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      //  清除sessionStrorage里面的token ，然后重新跳转到login
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="stylus"></style>
