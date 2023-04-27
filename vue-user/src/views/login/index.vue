<template>
  <div class="login-container">
    <el-form v-if="resiter==false" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">登录</h3>
      <el-form-item prop="sno">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.sno" name="sno" type="text" auto-complete="on" placeholder="学号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading2" type="primary" style="width:100%;" @click.native.prevent="register">
          注册
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 注册 -->
    <el-form
      v-if="resiter"
      ref="userModel"
      :model="userModel"
      :rules="UserRules"
      class="login-form"
      auto-complete="on"
      style="top:-150px"
      label-position="left">
      <h3 class="title">注册</h3>

      <el-form-item prop="name">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="userModel.name" name="name" type="text" auto-complete="on" placeholder="姓名" />
      </el-form-item>

      <el-form-item prop="sno">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="userModel.sno" name="sno" type="text" auto-complete="on" placeholder="学号" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="userModel.claseId" style="width:117.6%" clearable filterable placeholder="班级">
          <el-option
            v-for="item in claseList"
            :key="item.id"
            :label="item.name"
            :disabled="item.disabled"
            :value="item.id"
            style="width:260px;"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="userModel.sex"
          clearable
          style="width:117.6%"
          placeholder="性别"
        >
          <el-option :value="1" label="男" />
          <el-option :value="0" label="女" />
        </el-select>
      </el-form-item>

      <el-form-item prop="tel">
        <span class="svg-container">
          <svg-icon icon-class="nested" />
        </span>
        <el-input v-model="userModel.tel" name="tel" type="text" auto-complete="on" placeholder="手机号" />
      </el-form-item>

      <el-form-item prop="qq">
        <span class="svg-container">
          <svg-icon icon-class="qq" />
        </span>
        <el-input v-model="userModel.qq" name="tel" type="text" auto-complete="on" placeholder="QQ" />
      </el-form-item>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input v-model="userModel.email" name="tel" type="text" auto-complete="on" placeholder="email" />
      </el-form-item>

      <el-form-item prop="otp">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="userModel.otp" style="width:50%" name="tel" type="text" auto-complete="on" placeholder="验证码" />
        <el-button :disabled="isDisabled" size="mini" type="primary" @click.native.prevent="getOTP">{{ buttonName }}</el-button>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="userModel.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading2" type="primary" style="width:100%;" @click.native.prevent="Register">
          注册
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="register">
          登录
        </el-button>
      </el-form-item>

      <a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2022013461号-1</a>

    </el-form>
  </div>
</template>

<script>
import claseApi from '@/api/register/clase'
import userApi from '@/api/register/user'
// eslint-disable-next-line no-unused-vars
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'Login',
  data() {
    const validateSno = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('学号不能为空'))
      } else if (value.indexOf(' ') !== -1) {
        callback(new Error('学号不能有空格'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('名字不能为空'))
      } else if (value.indexOf(' ') !== -1) {
        callback(new Error('名字不能有空格'))
      } else {
        callback()
      }
    }
    const validateTel = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('手机号不能为空'))
      } else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
        callback(new Error('手机号码有误'))
      } else {
        callback()
      }
    }
    const validateQQ = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('QQ不能为空'))
      } else if (value.indexOf(' ') !== -1) {
        callback(new Error('QQ不能有空格'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (value.length < 1) {
        callback(new Error('邮箱不能为空'))
      } else if (!myreg.test(value)) {
        callback(new Error('请输入有效的E_mail！'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不能小于8位'))
      } else if (value.indexOf(' ') !== -1) {
        callback(new Error('密码不能有空格'))
      } else {
        callback()
      }
    }
    return {
      claseList: [],
      userModel: {
        claseId: null,
        sno: '',
        name: '',
        sex: null,
        tel: '',
        qq: '',
        email: '',
        otp: '',
        password: '',
        otpCode: ''
      },
      UserRules: {
        sno: [{ required: true, trigger: 'blur', validator: validateSno }],
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        tel: [{ required: true, trigger: 'blur', validator: validateTel }],
        qq: [{ required: true, trigger: 'blur', validator: validateQQ }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      resiter: false,
      loginForm: {
        sno: '',
        password: ''
      },
      loginRules: {
        sno: [{ required: true, trigger: 'blur', validator: validateSno }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      loading2: false,
      pwdType: 'password',
      redirect: undefined,
      buttonName: '获取验证码',
      isDisabled: false,
      time: 60

    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  async created() {
  },
  methods: {
    Register() {
      this.$refs.userModel.validate(valid => {
        if (valid) {
          this.loading2 = true
          this.userModel.encrptPassword = this.userModel.password
          userApi.registerUser(this.userModel).then((res) => {
            console.log(res)
            if (res.code !== 20000) {
              this.$message({
                message: '注册失败',
                type: res.message
              })
              return false
            }
            this.loading2 = false
            this.resiter = false
          }).catch(() => {
            this.loading2 = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOTP() {
      let me = this
      const topBtn = window.setInterval(function() {
        me.buttonName = me.time + '秒后重新发送'
        --me.time
        if (me.time < 0) {
          me.buttonName = '重新发送'
          me.time = 60
          me.isDisabled = false
          window.clearInterval(topBtn)
        }
      }, 1000)
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (this.userModel.email.length < 1) {
        Message({
          message: '邮箱不能为空',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (!myreg.test(this.userModel.email)) {
        Message({
          message: '请输入有效的E_mail！',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        userApi.getOtp(this.userModel.email)
          .then(res => {
            this.isDisabled = true
            this.userModel.otpCode = res.data
          }).catch(error => {
            console.log(error)
          })
      }
    },
    async fetchData() {
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
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginUser', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    register() {
      if (this.resiter) this.resiter = false
      else {
        this.resiter = true
        this.fetchData()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  // position: fixed;
  height: 130%;
  width: 110%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
