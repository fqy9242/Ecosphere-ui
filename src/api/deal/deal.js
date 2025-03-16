import request from '@/utils/request'

// 查询用户交易列表
export function listDeal(query) {
  return request({
    url: '/deal/deal/list',
    method: 'get',
    params: query
  })
}

// 查询用户交易详细
export function getDeal(id) {
  return request({
    url: '/deal/deal/' + id,
    method: 'get'
  })
}

// 新增用户交易
export function addDeal(data) {
  return request({
    url: '/deal/deal',
    method: 'post',
    data: data
  })
}

// 修改用户交易
export function updateDeal(data) {
  return request({
    url: '/deal/deal',
    method: 'put',
    data: data
  })
}

// 删除用户交易
export function delDeal(id) {
  return request({
    url: '/deal/deal/' + id,
    method: 'delete'
  })
}
