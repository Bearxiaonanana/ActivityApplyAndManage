import request from '@/utils/request'

const api_name = '/admin/register/competition'
export default {
  pageListCompetitionIsOk(current, limit) {
    return request({
      url: `/register/competition/pageListCompetitionIsOk/${current}/${limit}`,
      method: 'get'
    })
  },
  getCompetitionById(id) {
    return request({
      url: `/register/competition/getCompetition/${id}`,
      method: 'get'
    })
  },
  findAllDe() {
    return request({
      url: `/register/department/findAll`,
      method: 'get'
    })
  },
  findAllTeacher() {
    return request({
      url: `/register/teacher/findAll`,
      method: 'get'
    })
  },
  getApplyBySno(id, sno) {
    return request({
      url: `/register/apply/getApplyBySno/${id}/${sno}`,
      method: 'post',
    })
  },
  applyByUserId(apply) {
    return request({
      url: `/register/apply/applyByUserId`,
      method: 'post',
      data:apply
    })
  },
  deleteApplyBySno(id, sno) {
    return request({
      url: `/register/apply/deleteApply/${id}/${sno}`,
      method: 'delete'
    })
  },

}
