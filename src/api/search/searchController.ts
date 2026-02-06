// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 聚合搜索查询 POST /search/all */
export async function doSearchAll(body: SearchAPI.SearchRequest, options?: { [key: string]: any }) {
  return request<SearchAPI.BaseResponseSearchVOObject>('/search/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索帖子（从 ES 查询） POST /search/post/page */
export async function searchPostByPage(
  body: SearchAPI.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/post/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索用户（从 ES 查询） POST /search/user/page */
export async function searchUserByPage(
  body: SearchAPI.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/user/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
