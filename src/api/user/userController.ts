// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 此处后端没有提供注释 POST /user/add */
export async function addUser(body: UserAPI.UserAddRequest, options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseLong>('/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/delete */
export async function deleteUser(body: UserAPI.DeleteRequest, options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseBoolean>('/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /user/get */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.getUserByIdParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseUser>('/user/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /user/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/get/login', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /user/get/vo */
export async function getUserVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.getUserVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseUserVO>('/user/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/list/page */
export async function listUserByPage(
  body: UserAPI.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponsePageUser>('/user/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/list/page/vo */
export async function listUserVoByPage(
  body: UserAPI.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponsePageUserVO>('/user/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/login/email */
export async function userLoginByEmail(
  body: UserAPI.UserEmailLoginRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/login/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/login/github */
export async function userLoginByGitHub(
  body: UserAPI.GitHubLoginRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/login/github', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /user/login/wx/qrcode */
export async function getWxLoginQrCode(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseWxLoginResponse>('/user/login/wx/qrcode', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /user/login/wx/status */
export async function checkWxLoginStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.checkWxLoginStatusParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/login/wx/status', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/logout */
export async function userLogout(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseBoolean>('/user/logout', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/update */
export async function updateUser(
  body: UserAPI.UserUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseBoolean>('/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/update/my */
export async function updateMyUser(
  body: UserAPI.UserEditRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseBoolean>('/user/update/my', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
