<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb val1="数据统计" val2="数据报表"></breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 导入插件和js库
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  methods: {},
  //   mounted方法执行的时候,页面的的元素已经被渲染完毕了
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data } = await this.$http.get('reports/type/1')

    if (data.meta.status !== 200) return this.$message.arr('获取数据失败')

    // 指定图表的配置项和数据

    // 合并对象
    const result = _.merge(data.data, this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped>
</style>
