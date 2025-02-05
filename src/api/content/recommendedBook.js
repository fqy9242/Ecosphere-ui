import request from '@/utils/request'

// 查询推荐书籍列表
export function listRecommendedBook(query) {
  return request({
    url: '/content/recommendedBook/list',
    method: 'get',
    params: query
  })
}

// 查询推荐书籍详细
export function getRecommendedBook(id) {
  return request({
    url: '/content/recommendedBook/' + id,
    method: 'get'
  })
}

// 新增推荐书籍
export function addRecommendedBook(data) {
  return request({
    url: '/content/recommendedBook',
    method: 'post',
    data: data
  })
}

// 修改推荐书籍
export function updateRecommendedBook(data) {
  return request({
    url: '/content/recommendedBook',
    method: 'put',
    data: data
  })
}

// 删除推荐书籍
export function delRecommendedBook(id) {
  return request({
    url: '/content/recommendedBook/' + id,
    method: 'delete'
  })
}
