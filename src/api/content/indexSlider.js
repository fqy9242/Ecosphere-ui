import request from '@/utils/request'

// 查询首页轮播图列表
export function listIndexSlider(query) {
  return request({
    url: '/content/indexSlider/list',
    method: 'get',
    params: query
  })
}

// 查询首页轮播图详细
export function getIndexSlider(id) {
  return request({
    url: '/content/indexSlider/' + id,
    method: 'get'
  })
}

// 新增首页轮播图
export function addIndexSlider(data) {
  return request({
    url: '/content/indexSlider',
    method: 'post',
    data: data
  })
}

// 修改首页轮播图
export function updateIndexSlider(data) {
  return request({
    url: '/content/indexSlider',
    method: 'put',
    data: data
  })
}

// 删除首页轮播图
export function delIndexSlider(id) {
  return request({
    url: '/content/indexSlider/' + id,
    method: 'delete'
  })
}
