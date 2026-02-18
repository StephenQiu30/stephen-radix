// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 创建API访问日志 记录API访问日志 POST /access/log/create */
export async function createLog2(
  body: LogAPI.ApiAccessLogCreateRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>('/access/log/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除API访问日志 删除指定API访问日志（仅管理员） POST /access/log/delete */
export async function deleteLog2(body: LogAPI.DeleteRequest, options?: { [key: string]: any }) {
  return request<LogAPI.BaseResponseBoolean>('/access/log/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取API访问日志列表 分页查询API访问日志（仅管理员） POST /access/log/list/page */
export async function listLogByPage2(
  body: LogAPI.ApiAccessLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponsePageApiAccessLogVO>('/access/log/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
