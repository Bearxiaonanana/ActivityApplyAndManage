import request from '@/utils/request'

const api_name = '/admin/register/user'
export default {
  registerUser(userModel) {
    return request({
      url: `/register/user/register`,
      method: 'post',
      data: userModel
    })
  },
  login(sno, password) {
    return request({
      url: `/register/user/login`,
      method: 'post',
      data: {
        sno,
        password
      }
    })
  },
  getInfo(token) {
    return request({
      url: '/register/user/info',
      method: 'get',
      params: { token }
    })
  },

  getOtp(email) {
    return request({
      url: '/register/user/getotp',
      method: 'post',
      params: { email }
    })
  },
  updateUser(user) {
    return request({
      url: '/register/user/updateUser',
      method: 'post',
      data: user
    })
  },
  updatePassword(passwordModel) {
    return request({
      url: '/register/user/updatePassword',
      method: 'post',
      data: passwordModel
    })
  },
  logout() {
    return request({
      url: '/register/user/logout',
      method: 'get',
    })
  }
}