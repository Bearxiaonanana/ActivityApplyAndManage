<template>
  <div class="app-container">
    比赛详情
    <el-form label-width="120px">
      <el-form-item label="比赛名称">
        <el-input v-model="competition.title"/>
      </el-form-item>
      <el-form-item label="比赛简介">
        <el-input v-model="competition.introduce" :rows="10" type="textarea"/>
      </el-form-item>
      <el-form-item label="选项">
        <el-checkbox v-model="optionss[0]">院系</el-checkbox>
        <el-checkbox v-model="optionss[1]">身份证号</el-checkbox>
        <el-checkbox v-model="optionss[2]">指导老师</el-checkbox>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="competition.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          v-model="competition.endTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item v-if="competition.img != null" label="收款码">
        <el-button type="text" @click="imgcheck = true">已上传收款码</el-button>
        <el-button type="warning" @click="dialogFormVisible = true">重新上传收款码</el-button>
      </el-form-item>
      <el-form-item v-if="competition.img == null" label="收款码">
        <el-button type="warning" @click="dialogFormVisible = true">上传收款码</el-button>
      </el-form-item>

      <el-dialog :visible.sync="imgcheck" title="收款码">
        <el-form>
          <el-form-item label="收款码">
            <img :src="competition.img" width="100%" alt="收款码">
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog :visible.sync="dialogFormVisible" title="收款码">
        <el-form>
          <el-form-item label="上传收款码">
            <el-upload
              :action="'http://localhost:8002/register/fileoss'"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
              :limit="1"
              class="handlee"
              list-type="picture-card">
              <i class="el-icon-plus"/>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import competitionApi from '@/api/register/competition'

export default {
  data() {
    return {
      optionss: [false, false, false],
      competition: {
        title: '',
        introduce: '',
        startTime: '',
        endTime: '',
        options: '',
        img: null
      },
      dialogFormVisible: false,
      imgcheck: false,
      formLabelWidth: '120px',
      pay: false,
      saveBtnDisabled: false // 保存按钮是否禁用,
    }
  },
  watch: {
    // 监听
    $route(to, from) { // 路由变化方式，路由发生变化，方法就会执行
      this.init()
    }
  },
  created() { // 页面渲染之前执行
    this.init()
  },
  methods: {
    handleAvatarSuccess(res) {
      this.competition.img = res.data
    },
    handleRemove(file, fileList) {
      this.competition.img = ''
    },
    Payment() {
      if (this.pay) {
        this.pay = false
        this.competition.img = ''
      } else this.pay = true
    },
    init() {
      this.competition.options = []
      // 判断路径有id值,做修改
      if (this.$route.params && this.$route.params.id) {
        // 从路径获取id值
        const id = this.$route.params.id
        // 调用根据id查询的方法
        this.getInfo(id)
      } else { // 路径没有id值，做添加
        // 清空表单
        this.competition = {}
      }
    },
    getInfo(id) {
      competitionApi.getCompetitionById(id)
        .then(response => {
          this.competition = response.data
          if (this.competition.img != null) this.pay = true
          if (this.competition.options.charAt(0) === '1') this.optionss[0] = true
          if (this.competition.options.charAt(1) === '1') this.optionss[1] = true
          if (this.competition.options.charAt(2) === '1') this.optionss[2] = true
        })
    },
    saveOrUpdate() {
      this.competition.options = ''
      for (var i = 0; i < 3; i++) {
        if (this.optionss[i]) {
          this.competition.options += '1'
        } else {
          this.competition.options += '0'
        }
      }
      var startTime = (new Date(this.competition.startTime)).getTime()
      var endTime = (new Date(this.competition.endTime)).getTime()
      if (startTime > endTime) {
        this.$message({
          message: '开始时间要早于截止时间',
          type: 'error'
        })
        return false
      }
      // 判断修改还是添加
      // 根据teacher是否有id
      if (!this.competition.id) {
        // 添加
        this.enroll()
      } else {
        // 修改
        this.updateCompetition()
      }
    },
    // updateCompetition
    updateCompetition() {
      console.log(this.competition)
      competitionApi.updateCompetition(this.competition)
        .then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 回到列表页面 路由跳转
          this.$router.push({ path: '../../competition/list' })
        })
    },
    // 添加讲师的方法
    enroll() {
      console.log(this.competition)
      competitionApi.enroll(this.competition)
        .then(response => { // 添加成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // 回到列表页面 路由跳转
          this.$router.push({ path: '../competition/list' })
        })
    }

  }
}
</script>
