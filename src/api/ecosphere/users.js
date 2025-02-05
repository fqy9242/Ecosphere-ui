import request from '@/utils/request'

// 查询注册用户列表
export function listUsers(query) {
  return request({
    url: '/ecosphere/users/list',
    method: 'get',
    params: query
  })
}

// 查询注册用户详细
export function getUsers(id) {
  return request({
    url: '/ecosphere/users/' + id,
    method: 'get'
  })
}

// 新增注册用户
export function addUsers(data) {
  return request({
    url: '/ecosphere/users',
    method: 'post',
    data: data
  })
}

// 修改注册用户
export function updateUsers(data) {
  return request({
    url: '/ecosphere/users',
    method: 'put',
    data: data
  })
}

// 删除注册用户
export function delUsers(id) {
  return request({
    url: '/ecosphere/users/' + id,
    method: 'delete'
  })
}
