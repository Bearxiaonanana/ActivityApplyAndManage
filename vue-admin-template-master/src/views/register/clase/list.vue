<template>
  <div class="app-container">

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list1"
      element-loading-text="数据加载中"
      style="float:left;width:50%"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="班级" align="center"/>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-loading="listLoading"
      :data="list2"
      element-loading-text="数据加载中"
      style="float:left;width:50%"
      width="450"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="100" align="center">
        <template slot-scope="scope">
          {{ Math.floor((total + 1) / 2) + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="班级" align="center"/>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
// 引入调用job.js文件

import claseApi from '@/api/register/clase'
export default {
  // 写核心代码位置
  data() {
    // 定义变量和初始值
    return {
      listLoading: true, // 是否显示loading信息
      list: null,
      list1: [], // 数据列表
      list2: [],
      total: 0,
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
    async fetchData() {
      this.listLoading = true
      this.list1 = []
      this.list2 = []
      await claseApi.getPageList()
        .then((res) => {
          // response接口返回的数据
          // debugger 设置断点调试
          if (res.code === 20000) {
            this.list = res.data
            this.total = this.list.length
            for (var i = 0; i < Math.floor((this.total + 1) / 2); i++) {
              this.list1.push(this.list[i])
            }
            // eslint-disable-next-line no-redeclare
            for (var i = Math.floor((this.total + 1) / 2); i < this.total; i++) {
              this.list2.push(this.list[i])
            }
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
      this.$confirm('此操作将永久删除班级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定,执行then方法
        // 调用删除方法
        claseApi.deleteClaseById(id)
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
