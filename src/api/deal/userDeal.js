import request from '@/utils/request'

// 查询用户交易列表
export function listUserDeal(query) {
  return request({
    url: '/deal/userDeal/list',
    method: 'get',
    params: query
  })
}

// 查询用户交易详细
export function getUserDeal(id) {
  return request({
    url: '/deal/userDeal/' + id,
    method: 'get'
  })
}

// 新增用户交易
export function addUserDeal(data) {
  return request({
    url: '/deal/userDeal',
    method: 'post',
    data: data
  })
}

// 修改用户交易
export function updateUserDeal(data) {
  return request({
    url: '/deal/userDeal',
    method: 'put',
    data: data
  })
}

// 删除用户交易
export function delUserDeal(id) {
  return request({
    url: '/deal/userDeal/' + id,
    method: 'delete'
  })
}
