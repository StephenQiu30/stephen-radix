// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 删除用户 删除用户（仅管理员） POST /user/delete */
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

/** 发送邮箱验证码 发送邮箱验证码用于登录 POST /user/email/code/send */
export async function sendEmailCode(
  body: UserAPI.UserEmailCodeSendRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseInteger>('/user/email/code/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据 ID 获取用户 根据 ID 获取用户信息（仅管理员） GET /user/get */
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

/** 获取当前登录用户 获取当前登录用户信息 GET /user/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseUserVO>('/user/get/login', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 根据 ID 获取用户 VO 根据 ID 获取用户脱敏信息 GET /user/get/vo */
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

/** 批量获取用户 VO 批量获取用户脱敏信息 GET /user/get/vo/batch */
export async function getUserVoByIds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.getUserVOByIdsParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseListUserVO>('/user/get/vo/batch', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 分页获取用户列表 分页获取用户列表（仅管理员） POST /user/list/page */
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

/** 分页获取用户 VO 列表 分页获取用户脱敏信息列表 POST /user/list/page/vo */
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

/** 邮箱验证码登录 使用邮箱验证码登录 POST /user/login/email */
export async function emailLogin(
  body: UserAPI.UserEmailLoginRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseUserVO>('/user/login/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取 GitHub 授权 URL 获取 GitHub OAuth2 授权 URL GET /user/login/github */
export async function getGitHubAuthUrl(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseString>('/user/login/github', {
    method: 'GET',
    ...(options || {}),
  })
}

/** GitHub 登录回调 GitHub OAuth2 登录回调接口 GET /user/login/github/callback */
export async function githubLoginGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.githubLoginGetParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseUserVO>('/user/login/github/callback', {
    method: 'GET',
    params: {
      ...params,
      arg0: undefined,
      ...params['arg0'],
    },
    ...(options || {}),
  })
}

/** 获取微信扫码登录 URL 获取微信扫码登录授权 URL GET /user/login/wx/qrcode */
export async function getWxQrCodeAuthUrl(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseString>('/user/login/wx/qrcode', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 微信扫码登录回调 微信扫码登录回调接口 POST /user/login/wx/qrcode/callback */
export async function wxQrCodeLogin(
  body: UserAPI.WxQrCodeLoginRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseUserVO>('/user/login/wx/qrcode/callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户注销 用户注销接口 POST /user/logout */
export async function userLogout(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseBoolean>('/user/logout', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 微信公众平台服务器验证 用于微信公众平台验证服务器有效性 GET /user/wx/mp/receive */
export async function checkWxMpSignature(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.checkWxMpSignatureParams,
  options?: { [key: string]: any }
) {
  return request<string>('/user/wx/mp/receive', {
    method: 'GET',
    params: {
      ...params,
      arg0: undefined,
      ...params['arg0'],
    },
    ...(options || {}),
  })
}
