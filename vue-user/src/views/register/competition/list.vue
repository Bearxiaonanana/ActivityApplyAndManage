<template>
  <div class="app-container">
    比赛列表

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="比赛名称" width="160" align="center"/>

      <el-table-column :show-overflow-tooltip="true" prop="introduce" label="简介" align="center"/>

      <el-table-column prop="startTime" label="开始时间" width="95" align="center"/>

      <el-table-column prop="endTime" label="截止时间" width="95" align="center"/>

      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <router-link :to="'../competition/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">查看报名</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
// 引入调用job.js文件

import competitionApi from '@/api/register/competition'
export default {
  // 写核心代码位置
  data() {
    // 定义变量和初始值
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      userQuery: {} // 查询条件
    }
  },

  async created() {
    // 页面渲染之前执行,一般调用methods定义的方法
    // 当页面加载时获取数据
    await this.fetchData()
    // await this.findClase();
  },

  methods: {
    // 创建具体的方法,调用job.js定义的方法
    // 讲师列表方法
    async fetchData(page = 1) {
      // 调用api层获取数据库中的数据
      this.page = page
      this.listLoading = true
      await competitionApi.pageListCompetitionIsOk(this.page, this.limit, this.userQuery)
        .then((res) => {
          // response接口返回的数据
          // debugger 设置断点调试
          if (res.code === 20000) {
            this.list = res.data.rows
            this.total = res.data.total
          }
          this.listLoading = false
        }).catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
