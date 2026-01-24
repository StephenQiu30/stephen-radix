// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 此处后端没有提供注释 POST /post_thumb/ */
export async function doThumb(body: API.PostThumbAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseInteger>('/post_thumb/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /post_thumb/list/page */
export async function listFavourPostByPage(
  body: API.PostFavourQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostVO>('/post_thumb/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /post_thumb/my/list/page */
export async function listMyThumbPostByPage(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostVO>('/post_thumb/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
