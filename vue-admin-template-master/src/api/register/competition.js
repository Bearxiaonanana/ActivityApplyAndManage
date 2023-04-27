import request from '@/utils/request'

const api_name = '/admin/register/competition'
export default {
  getPageList(current, limit) {
    return request({
      url: `/register/competition/pageCompetition/${current}/${limit}`,
      method: 'get'
    })
  },
  getApplyPageList(id,current, limit) {
    return request({
      url: `/register/apply/getApply/${id}/${current}/${limit}`,
      method: 'post'
    })
  },
  deleteCompetitionById(id) {
    return request({
      url: `/register/competition/${id}`,
      method: 'delete'
    })
  },
  deleteApplyById(id) {
    return request({
      url: `/register/apply/${id}`,
      method: 'delete'
    })
  },
  enroll(competition) {
    return request({
      url: `/register/competition/enroll`,
      method: 'post',
      data: competition
    })
  },
  updateCompetition(competition) {
    return request({
      url: `/register/competition/updateCompetition`,
      method: 'post',
      data: competition
    })
  },
  updateCompetitionStatus(id) {
    return request({
      url: `/register/competition/updateCompetitionStatus/${id}`,
      method: 'post'
    })
  },
  getCompetitionById(id) {
    return request({
      url: `/register/competition/getCompetition/${id}`,
      method: 'get'
    })
  }

}
