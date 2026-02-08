// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 收藏/取消收藏 收藏或取消收藏指定帖子 POST /post/favour/ */
export async function doFavour(body: PostAPI.PostFavourRequest, options?: { [key: string]: any }) {
  return request<PostAPI.BaseResponseInteger>('/post/favour/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /post/favour/list/page */
export async function listFavourPostByPage(
  body: PostAPI.PostFavourQueryRequest,
  options?: { [key: string]: any }
) {
  return request<PostAPI.BaseResponsePagePostVO>('/post/favour/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /post/favour/my/list/page */
export async function listMyFavourPostByPage(
  body: PostAPI.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<PostAPI.BaseResponsePagePostVO>('/post/favour/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
