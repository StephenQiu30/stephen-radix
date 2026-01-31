// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 此处后端没有提供注释 POST /postComment/add */
export async function addPostComment(
  body: API.PostCommentAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/postComment/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /postComment/delete */
export async function deletePostComment(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/postComment/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /postComment/edit */
export async function editPostComment(
  body: API.PostCommentEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/postComment/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /postComment/get/vo */
export async function getPostCommentVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostCommentVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePostCommentVO>('/postComment/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /postComment/list/page */
export async function listPostCommentByPage(
  body: API.PostCommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostComment>('/postComment/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /postComment/list/page/vo */
export async function listPostCommentVoByPage(
  body: API.PostCommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostCommentVO>('/postComment/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /postComment/my/list/page/vo */
export async function listMyPostCommentVoByPage(
  body: API.PostCommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostCommentVO>('/postComment/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /postComment/update */
export async function updatePostComment(
  body: API.PostCommentUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/postComment/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
