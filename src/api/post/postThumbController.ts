// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 点赞/取消点赞 点赞或取消点赞指定帖子 POST /post/thumb/ */
export async function doThumb(body: PostAPI.PostThumbRequest, options?: { [key: string]: any }) {
  return request<PostAPI.BaseResponseInteger>('/post/thumb/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
