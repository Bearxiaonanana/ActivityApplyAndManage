<template>
  <div class="app-container">
    用户详情
    <el-form label-width="120px">
      <el-form-item label="班级">
        <el-select v-model="user.claseId" style="max-width:400px;" placeholder="班级">
          <el-option
            v-for="item in claseList"
            :key="item.id"
            :label="item.name"
            :disabled="item.disabled"
            :value="item.id"
            style="width:260px;"/>
        </el-select>
      </el-form-item>

      <el-form-item label="姓名">
        <el-input v-model="user.name" style="max-width:400px;" />
      </el-form-item>

      <el-form-item label="性别">
        <el-select
          v-model="user.sex"
          clearable
          style="max-width:400px;"
          placeholder="性别"
        >
          <el-option :value="1" label="男" />
          <el-option :value="0" label="女" />
        </el-select>
      </el-form-item>

      <el-form-item label="手机号">
        <el-input v-model="user.tel" style="max-width:400px;" />
      </el-form-item>

      <el-form-item label="QQ">
        <el-input v-model="user.qq" style="max-width:400px;" />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="user.email" style="max-width:400px;"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入调用job.js文件

import userApi from '@/api/register/user'
import Cookies from 'js-cookie'
import claseApi from '@/api/register/clase'
export default {
  // 写核心代码位置
  data() {
    // 定义变量和初始值
    return {
      user: {
        id: '',
        claseId: '',
        sno: '',
        name: '',
        sex: '',
        tel: '',
        qq: '',
        email: ''
      },
      claseList: []
    }
  },

  async created() {
    await this.fetchData()
    await this.fetchClase()
  },

  methods: {
    async fetchData() {
      await userApi.getInfo(Cookies.get('User-Token'))
        .then(res => {
          this.user = res.data.user
        }).catch(error => {
          console.log(error)
        })
    },
    async fetchClase() {
      await claseApi.getPageList()
        .then((res) => {
          if (res.code === 20000) {
            this.claseList = res.data
            this.claseList.push({ name: '班级信息有误或未找到你的班级', disabled: true })
            this.claseList.push({ name: '请联系IT协会会长,该选项暂时不填', disabled: true })
          }
        }).catch(error => {
          console.log(error)
        })
    },
    async saveOrUpdate() {
      if (this.user.sno.length < 1) {
        this.$message({
          message: '学号不能为空',
          type: 'error'
        })
        return false
      // eslint-disable-next-line eqeqeq
      } else if (this.user.sno.indexOf(' ') != -1) {
        this.$message({
          message: '学号不能有空格',
          type: 'error'
        })
        return false
      }

      if (this.user.name.length < 1) {
        this.$message({
          message: '名字不能为空',
          type: 'error'
        })
        return false
      } else if (this.user.name.indexOf(' ') !== -1) {
        this.$message({
          message: '名字不能有空格',
          type: 'error'
        })
        return false
      }

      if (this.user.tel.length < 1) {
        this.$message({
          message: '手机号不能为空',
          type: 'error'
        })
        return false
      } else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.user.tel))) {
        this.$message({
          message: '手机号码有误',
          type: 'error'
        })
        return false
      }

      if (this.user.qq.length < 1) {
        this.$message({
          message: 'QQ不能为空',
          type: 'error'
        })
        return false
      } else if (this.user.qq.indexOf(' ') !== -1) {
        this.$message({
          message: 'QQ不能有空格',
          type: 'error'
        })
        return false
      }

      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (this.user.email.length < 1) {
        this.$message({
          message: '邮箱不能为空',
          type: 'error'
        })
        return false
      } else if (!myreg.test(this.user.email)) {
        this.$message({
          message: '请输入有效的E_mail！',
          type: 'error'
        })
        return false
      }

      await userApi.updateUser(this.user)
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
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
