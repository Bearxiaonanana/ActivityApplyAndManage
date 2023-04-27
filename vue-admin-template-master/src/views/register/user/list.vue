<template>
  <div class="app-container">
    学生列表

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-input v-model="userQuery.name" placeholder="姓名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="userQuery.sno" placeholder="学号" />
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="userQuery.claseId"
          clearable
          placeholder="班级"
        >
          <el-option
            v-for="item in claseList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="fetchData()"
      >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="clase" label="班级" width="100" align="center"/>

      <el-table-column prop="sno" label="学号" width="100" align="center"/>

      <el-table-column prop="name" label="姓名" align="center"/>

      <el-table-column label="性别" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.sex === 1 ? "男" : "女" }}
        </template>
      </el-table-column>

      <el-table-column prop="qq" label="QQ" align="center"/>

      <el-table-column prop="email" label="邮箱" align="center"/>

      <el-table-column prop="tel" label="手机号" width="200" align="center"/>

      <el-table-column label="操作" width="205" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            style="float:left"
            @click="resetPassword(scope.row.id)"
          >重置密码</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            style="float:left"
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

import userApi from '@/api/register/user'
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
      userQuery: {}, // 查询条件
      claseList: null
    }
  },

  async created() {
    // 页面渲染之前执行,一般调用methods定义的方法
    // 当页面加载时获取数据
    await this.fetchData()
    await this.findClase()
  },
  methods: {
    resetPassword(id) {
      this.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定,执行then方法
        // 调用删除方法
        userApi.resetPassword(id)
          .then((res) => {
          // 删除成功
          // 提示信息
            if (res.code === 20000) {
              this.$message({
                type: 'success',
                message: '重置成功!'
              })
            }
          })
      }) // 点击取消,执行catch方法
    },
    async findClase() {
      await userApi.getClaseList()
        .then(res => {
          this.claseList = res.data
        }).catch(error => {
          console.log(error)
        })
    },
    // 创建具体的方法,调用job.js定义的方法
    // 讲师列表方法
    async fetchData(page = 1) {
      // 调用api层获取数据库中的数据
      this.page = page
      this.listLoading = true
      await userApi.getPageList(this.page, this.limit, this.userQuery)
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
    },
    resetData() {
      this.userQuery = {}
      this.fetchData()
    },
    // 删除讲师的方法
    removeDataById(id) {
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定,执行then方法
        // 调用删除方法
        userApi.deleteUserId(id)
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
