<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item style="max-width:400px;" label="旧密码" prop="password">
        <el-input
          v-model="passwordModel.oldPassword"
          type="password"
          name="password"
          auto-complete="on"
          placeholder="密码"
        />
      </el-form-item>

      <el-form-item style="max-width:400px;" label="新密码" prop="password">
        <el-input
          v-model="passwordModel.newPassword"
          type="password"
          name="password"
          auto-complete="on"
          placeholder="密码"
        />
      </el-form-item>

      <el-form-item style="max-width:400px;" label="确认新密码" prop="password">
        <el-input
          v-model="passwordModel.newPassword2"
          type="password"
          name="password"
          auto-complete="on"
          placeholder="密码"
        />
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
// eslint-disable-next-line no-unused-vars
import { Message, MessageBox } from 'element-ui'
export default {
  // 写核心代码位置
  data() {
    // 定义变量和初始值
    return {
      passwordModel: {
        userId: '',
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      user: {
        id: '',
        claseId: '',
        sno: '',
        name: '',
        sex: '',
        tel: '',
        qq: '',
        email: ''
      }
    }
  },

  async created() {
    await this.fetchData()
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
    async saveOrUpdate() {
      if (this.passwordModel.newPassword === this.passwordModel.newPassword2) {
        if (this.passwordModel.newPassword.length < 8) {
          this.$message({
            message: '密码不能小于8位',
            type: 'error'
          })
          return false
        } else if (this.passwordModel.newPassword.indexOf('') !== -1) {
          this.$message({
            message: '密码不能有空格',
            type: 'error'
          })
          return false
        }
        this.passwordModel.userId = this.user.id
        delete this.passwordModel.newPassword2
        await userApi.updatePassword(this.passwordModel)
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
      } else {
        this.$message({
          message: '两次密码不一样',
          type: 'error'
        })
      }
    }
  }
}
</script>
