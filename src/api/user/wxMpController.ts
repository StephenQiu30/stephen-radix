// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 此处后端没有提供注释 GET /user/wx/mp/portal */
export async function check(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.checkParams,
  options?: { [key: string]: any }
) {
  return request<string>('/user/wx/mp/portal', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/wx/mp/portal */
export async function receiveMessage(options?: { [key: string]: any }) {
  return request<any>('/user/wx/mp/portal', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /user/wx/mp/portal/setMenu */
export async function setMenu(options?: { [key: string]: any }) {
  return request<string>('/user/wx/mp/portal/setMenu', {
    method: 'GET',
    ...(options || {}),
  })
}
