import request from '@/utils/request'

const api_name = '/admin/register/user'
export default {
  getPageList(current, limit, userQuery) {
    return request({
      url: `/register/user/pageUser/${current}/${limit}`,
      method: 'post',
      data: userQuery
    })
  },
  getClaseList() {
    return request({
      url: `/register/clase/findAllClase`,
      method: 'get'
    })
  },
  deleteUserId(id) {
    return request({
      url: `/register/user/deleteById/${id}`,
      method: 'delete',
    })
  },
  resetPassword(id) {
    return request({
      url: `/register/user//${id}`,
      method: 'post'
    })
  },
  logout() {
    return request({
      url: '/register/admin/logout',
      method: 'get'
    })
  }
}
