// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 创建邮件记录 记录邮件发送信息 POST /email/record/create */
export async function createRecord1(
  body: LogAPI.EmailRecordCreateRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>('/email/record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除邮件记录 删除指定邮件记录（仅管理员） POST /email/record/delete */
export async function deleteRecord1(body: LogAPI.DeleteRequest, options?: { [key: string]: any }) {
  return request<LogAPI.BaseResponseBoolean>('/email/record/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取邮件记录列表 分页查询邮件记录（仅管理员） POST /email/record/list/page */
export async function listRecordByPage1(
  body: LogAPI.EmailRecordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponsePageEmailRecord>('/email/record/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
