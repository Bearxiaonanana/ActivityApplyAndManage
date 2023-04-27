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

      <el-table-column prop="options" label="选项" width="310" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.options[0]" disabled>院系</el-checkbox>
          <el-checkbox v-model="scope.row.options[1]" disabled>身份证号</el-checkbox>
          <el-checkbox v-model="scope.row.options[2]" disabled>指导老师</el-checkbox>
        </template>
      </el-table-column>

      <el-table-column prop="startTime" label="开始时间" width="95" align="center"/>

      <el-table-column prop="endTime" label="截止时间" width="95" align="center"/>

      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
          <router-link :to="'../competition/enter/'+scope.row.id">
            <el-button type="primary" style="min-width: 97px;float:left" size="mini" icon="el-icon-edit">查看报名</el-button>
          </router-link>
          <router-link :to="'../competition/edit/'+scope.row.id">
            <el-button type="primary" style="min-width: 97px;float:left;margin-left:5px" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            v-if="scope.row.status == '0'"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            style="min-width: 97px;float:left"
            @click="updateCompetitionStatus(scope.row.id)"
          >开放报名</el-button>
          <el-button
            v-if="scope.row.status == '1'"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            style="min-width: 97px;float:left"
            @click="updateCompetitionStatus(scope.row.id)"
          >暂停报名</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            style="min-width: 97px;float:left;margin-left:5px"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
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
    updateCompetitionStatus(id) {
      competitionApi.updateCompetitionStatus(id).then(res => {
        this.fetchData()
      }).error(error => {
        console.log(error)
      })
    },
    // 创建具体的方法,调用job.js定义的方法
    // 讲师列表方法
    async fetchData(page = 1) {
      // 调用api层获取数据库中的数据
      this.page = page
      this.listLoading = true
      await competitionApi.getPageList(this.page, this.limit, this.userQuery)
        .then((res) => {
          // response接口返回的数据
          // debugger 设置断点调试
          if (res.code === 20000) {
            this.list = res.data.rows
            for (var i = 0; i < this.limit && i < this.list.length; i++) {
              var optionss = [false, false, false]
              if (this.list[i].options.charAt(0) === '1') {
                optionss[0] = true
              }
              if (this.list[i].options.charAt(1) === '1') {
                optionss[1] = true
              }
              if (this.list[i].options.charAt(2) === '1') {
                optionss[2] = true
              }
              this.list[i].options = optionss
            }
            this.total = res.data.total
          }
          this.listLoading = false
        }).catch(error => {
          console.log(error)
        })
    },
    resetData() {
      this.userQuery = {}
      this.fetchData()
    },
    // 删除讲师的方法
    removeDataById(id) {
      this.$confirm('此操作将永久删除比赛, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定,执行then方法
        // 调用删除方法
        competitionApi.deleteCompetitionById(id)
          .then((response) => {
          // 删除成功
          // 提示信息
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 回到列表页面
            this.fetchData()
          })
      }) // 点击取消,执行catch方法
    }
  }
}
</script>
