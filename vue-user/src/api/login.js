import request from '@/utils/request'

export function login(username, password) {
  return request({

    url: '/register/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/register/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/rectservice/admin/logout',
    method: 'post'
  })
}
