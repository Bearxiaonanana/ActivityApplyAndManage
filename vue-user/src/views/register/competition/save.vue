<template>
  <div class="app-container">
    比赛详情
    <el-form label-width="120px">
      <el-form-item><h1>{{ competition.title }}</h1></el-form-item>
      <el-form-item label="简介">{{ competition.introduce }}</el-form-item>

      <el-form-item label="开始时间">
        <el-date-picker
          :disabled="true"
          v-model="competition.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="截止时间" >
        <el-date-picker
          :disabled="true"
          v-model="competition.endTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item v-if="optionss[0]" label="院系">
        <el-select v-model="apply.departmentId" style="width:50%" clearable filterable placeholder="院系">
          <el-option
            v-for="item in deparList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="optionss[1]" label="身份证号">
        <el-input v-model="apply.card" style="width:50%;min-width:200px;" placeholder="身份证号"/>
      </el-form-item>
      <el-form-item v-if="optionss[2]" label="指导老师">
        <el-select v-model="apply.teacherId" style="width:50%" clearable filterable placeholder="指导老师">
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="payImgUrl != null && competition.img != null" label="缴费截图">
        <el-button type="text" @click="imgcheck = true">已上传缴费截图</el-button>
        <el-button type="warning" @click="dialogFormVisible = true">重新上传缴费截图</el-button>
      </el-form-item>
      <el-form-item v-if="payImgUrl == null && competition.img != null" label="缴费">
        <el-button :disabled="saveBtnDisabled" type="warning" @click="dialogFormVisible = true">缴费</el-button>
      </el-form-item>

      <el-dialog :visible.sync="imgcheck" title="缴费截图">
        <el-form>
          <el-form-item label="缴费截图">
            <img :src="payImgUrl" width="100%" alt="缴费截图">
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog :visible.sync="dialogFormVisible" title="缴费">
        <el-form>
          <el-form-item label="收款码">
            <img :src="competition.img" width="100%" alt="收款码">
          </el-form-item>
          <el-form-item label="上传缴费截图">
            <el-upload
              :limit="1"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
              // eslint-disable-next-line :action="'http://cliia.cn:8002/register/fileoss/'+this.apply.sno+'/'+this.apply.competitionId"/vue
              // this-in-template eslint-disable-next-line/vue
              this-in-template
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
        <el-button v-if="apply.userId == null" :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
        <el-button v-if="apply.userId != null" :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存修改</el-button>
        <el-button v-if="apply.userId != null" :disabled="saveBtnDisabled" type="danger" @click="deleteApply">取消报名</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import competitionApi from '@/api/register/competition'
import Cookies from 'js-cookie'

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
        status: '',
        img: ''
      },
      user: {
        id: '',
        sno: '',
        name: ''
      },
      apply: {
        competitionId: '',
        sno: '',
        userId: null,
        departmentId: '',
        card: '',
        teacherId: '',
        url: ''
      },
      payImgUrl: null,
      deparList: [],
      teacherList: [],
      saveBtnDisabled: false, // 保存按钮是否禁用,
      dialogFormVisible: false,
      imgcheck: false,
      formLabelWidth: '120px',
      saveBtn: ''
    }
  },
  created() { // 页面渲染之前执行
    this.init()
    this.List()
  },
  mounted() {
    this.saveBtn = setInterval(this.Btn, 1000)
  },
  methods: {
    handleAvatarSuccess(res) {
      this.payImgUrl = res.data
      this.apply.url = res.data
    },
    handleRemove(file, fileList) {
      this.payImgUrl = null
      this.apply.url = ''
    },
    deleteApply() {
      this.$confirm('此操作将取消报名, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定,执行then方法
        // 调用删除方法
        competitionApi.deleteApplyBySno(this.apply.competitionId, this.apply.sno)
          .then(res => {
            if (res.code === 20000) {
              this.$message({
                message: '取消报名成功',
                type: 'success'
              })
              this.$router.push({ path: '../../competition/list' })
            } else {
              this.$message({
                message: '取消报名失败',
                type: 'error'
              })
            }
          })
      })
    },
    Btn() {
      var startTime = (new Date(this.competition.startTime)).getTime()
      var endTime = (new Date(this.competition.endTime)).getTime()
      var nowTime = Date.parse(new Date())
      if (nowTime < startTime || nowTime > endTime) this.saveBtnDisabled = true
      else this.saveBtnDisabled = false
    },
    List() {
      competitionApi.findAllDe().then(res => {
        this.deparList = res.data
      })
      competitionApi.findAllTeacher().then(res => {
        this.teacherList = res.data
      })
    },
    init() {
      this.competition.options = []
      // 判断路径有id值,做修改
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.apply.competitionId = id
        this.apply.sno = Cookies.get('User-Token')
        this.getInfo(id)
      }
    },
    getInfo(id) {
      competitionApi.getApplyBySno(id, Cookies.get('User-Token'))
        .then(res => {
          this.competition = res.data.competition
          var startTime = (new Date(this.competition.startTime)).getTime()
          var endTime = (new Date(this.competition.endTime)).getTime()
          var nowTime = Date.parse(new Date())
          if (nowTime < startTime || nowTime > endTime) this.saveBtnDisabled = true

          this.user = res.data.user
          if (this.competition.options.charAt(0) === '1') this.optionss[0] = true
          if (this.competition.options.charAt(1) === '1') this.optionss[1] = true
          if (this.competition.options.charAt(2) === '1') this.optionss[2] = true

          if (res.data.pay != null) {
            this.payImgUrl = res.data.pay.imgUrl
          }

          if (res.data.apply != null) {
            this.apply.userId = this.user.id
            this.apply.departmentId = res.data.apply.departmentId
            this.apply.teacherId = res.data.apply.teacherId
            if (res.data.card != null) {
              this.apply.card = res.data.card.number
            }
          }
        })
    },

    saveOrUpdate() {
      if (this.optionss[0]) {
        if (this.apply.departmentId === '') {
          this.$message({
            message: '院系未选',
            type: 'error'
          })
          return false
        }
      }
      if (this.optionss[1]) {
        if (this.apply.card === '') {
          this.$message({
            message: '身份证号未填',
            type: 'error'
          })
          return false
        }
      }
      if (this.optionss[2]) {
        if (this.apply.teacherId === '') {
          this.$message({
            message: '指导老师未选',
            type: 'error'
          })
          return false
        }
      }
      var mess = ''
      if (this.apply.userId == null) mess = '报名成功'
      else mess = '修改成功'
      competitionApi.applyByUserId(this.apply)
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: mess,
              type: 'success'
            })
            this.$router.push({ path: '../../competition/list' })
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
    }
  }
}
</script>
