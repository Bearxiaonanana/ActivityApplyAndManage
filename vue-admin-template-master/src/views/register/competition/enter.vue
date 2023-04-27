<template>
  <div class="app-container">
    报名列表&nbsp;&nbsp;&nbsp;
    <el-button
      :disabled="saveBtnDisabled"
      type="primary"
      round
      icon="el-icon-download"
      @click="downloadd()">下载</el-button>
    <el-button
      v-if="saveBtnPay == false"
      :disabled="saveBtnPay"
      type="primary"
      round
      icon="el-icon-download"
      @click="downloaddd()">下载缴费截图</el-button>

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

      <el-table-column prop="clase" label="班级" width="100" align="center"/>

      <el-table-column prop="user.sno" label="学号" width="90" align="center"/>

      <el-table-column prop="user.name" label="姓名" width="100" align="center"/>

      <el-table-column prop="user.tel" label="电话" align="center"/>

      <el-table-column prop="user.qq" label="QQ" align="center"/>
      <el-table-column v-if="options[0]" key="1" prop="department" label="院系" width="160" align="center"/>

      <el-table-column v-if="options[1]" key="2" prop="card" label="身份证号" align="center"/>

      <el-table-column v-if="options[2]" key="3" prop="teacher" label="指导老师" width="160" align="center"/>

      <el-table-column v-if="competition.img != null" label="缴费截图" align="center">
        <template slot-scope="scope">
          {{ scope.row.pay ? "已上传" : "未上传" }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
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
      options: [false, false, false],
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      userQuery: {}, // 查询条件
      saveBtnDisabled: false, // 下载按钮是否禁用,
      saveBtnPay: false,
      competition: {
        title: '',
        introduce: '',
        startTime: '',
        endTime: '',
        options: '',
        img: null
      },
      id: 0
    }
  },

  async created() {
    // 页面渲染之前执行,一般调用methods定义的方法
    // 当页面加载时获取数据
    await this.init()
    // await this.findClase();
  },

  methods: {
    downloadd() {
      var a = document.createElement('a')
      a.href = 'http://localhost:8002/register/apply/down/' + this.id
      // a.href = "http://localhost:8002/register/apply/down/"+this.id;
      // a.download = this.list[0].competition.title;
      a.click()
    },
    downloaddd() {
      var a = document.createElement('a')
      // a.href = "http://cliia.cn:8002/register/fileoss/down/"+this.id;
      a.href = 'http://localhost:8002/register/fileoss/down/' + this.id
      a.click()
    },
    async init() {
      // 判断路径有id值,做修改
      if (this.$route.params && this.$route.params.id) {
        // 从路径获取id值
        const id = this.$route.params.id
        this.id = id
        await this.fetchData()
      }
    },
    // 创建具体的方法,调用job.js定义的方法
    // 讲师列表方法
    async fetchData(page = 1) {
      // 调用api层获取数据库中的数据
      this.page = page
      this.listLoading = true
      await competitionApi.getApplyPageList(this.id, this.page, this.limit, this.userQuery)
        .then((res) => {
          // response接口返回的数据
          // debugger 设置断点调试
          if (res.code === 20000) {
            this.list = res.data.rows
            for (var i = 0; i < this.list.length; i++) {
              this.list[i].pay = res.data.pays[i]
            }
            console.log(this.list)
            if (this.list[0] != null) {
              this.competition = this.list[0].competition
              if (this.list[0].competition.options.charAt(0) === '1') this.options[0] = true
              if (this.list[0].competition.options.charAt(1) === '1') this.options[1] = true
              if (this.list[0].competition.options.charAt(2) === '1') this.options[2] = true
              if (this.list[0].competition.img == null) {
                this.saveBtnPay = true
              }
            } else {
              this.saveBtnDisabled = true
              this.saveBtnPay = true
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
      this.$confirm('此操作将永久删除该学生报名, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定,执行then方法
        // 调用删除方法
        competitionApi.deleteApplyById(id)
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
