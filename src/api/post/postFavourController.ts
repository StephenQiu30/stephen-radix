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
