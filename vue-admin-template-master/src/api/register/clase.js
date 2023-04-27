import request from '@/utils/request'

const api_name = '/admin/register/clase'
export default {
  getPageList() {
    return request({
      url: `/register/clase/findAllClase`,
      method: 'get'
    })
  },
  deleteClaseById(id) {
    return request({
      url: `/register/clase/${id}`,
      method: 'delete'
    })
  },
  addClase(clase) {
    return request({
      url: `/register/clase/addClase`,
      method: 'post',
      data: clase
    })
  }
}
