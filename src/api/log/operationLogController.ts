// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 创建操作日志 记录用户操作日志 POST /operation/log/create */
export async function createLog1(
  body: LogAPI.OperationLogCreateRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>('/operation/log/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除操作日志 删除指定操作日志（仅管理员） POST /operation/log/delete */
export async function deleteLog1(body: LogAPI.DeleteRequest, options?: { [key: string]: any }) {
  return request<LogAPI.BaseResponseBoolean>('/operation/log/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取操作日志列表 分页查询操作日志（仅管理员） POST /operation/log/list/page */
export async function listLogByPage1(
  body: LogAPI.OperationLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponsePageOperationLogVO>('/operation/log/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
