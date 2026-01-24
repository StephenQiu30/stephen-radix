// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 聚合搜索查询 POST /es/all */
export async function doSearchAll(body: API.SearchRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseSearchVOObject>('/es/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索帖子（从 ES 查询，封装类） POST /es/search/post/page/vo */
export async function searchPostVoByPage(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostVO>('/es/search/post/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索用户（从 ES 查询，封装类） POST /es/search/user/page/vo */
export async function searchUserVoByPage(
  body: API.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageUserVO>('/es/search/user/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
