// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 创建帖子 创建新帖子 POST /post/add */
export async function addPost(body: PostAPI.PostAddRequest, options?: { [key: string]: any }) {
  return request<PostAPI.BaseResponseLong>('/post/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除帖子 删除指定帖子，仅本人或管理员可操作 POST /post/delete */
export async function deletePost(body: PostAPI.DeleteRequest, options?: { [key: string]: any }) {
  return request<PostAPI.BaseResponseBoolean>('/post/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 编辑帖子 编辑帖子信息，仅本人可操作 POST /post/edit */
export async function editPost(body: PostAPI.PostEditRequest, options?: { [key: string]: any }) {
  return request<PostAPI.BaseResponseBoolean>('/post/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取帖子详情 根据ID获取帖子详细信息 GET /post/get/vo */
export async function getPostVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PostAPI.getPostVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<PostAPI.BaseResponsePostVO>('/post/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 分页获取帖子列表（用于同步） POST /post/list/page */
export async function listPostByPage(
  body: PostAPI.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<PostAPI.BaseResponsePagePostVO>('/post/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取帖子列表 分页获取帖子脱敏信息列表 POST /post/list/page/vo */
export async function listPostVoByPage(
  body: PostAPI.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<PostAPI.BaseResponsePagePostVO>('/post/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 我的帖子列表 分页获取当前登录用户创建的帖子列表 POST /post/my/list/page/vo */
export async function listMyPostVoByPage(
  body: PostAPI.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<PostAPI.BaseResponsePagePostVO>('/post/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 更新帖子 更新帖子信息（仅管理员可用） POST /post/update */
export async function updatePost(
  body: PostAPI.PostUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<PostAPI.BaseResponseBoolean>('/post/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
