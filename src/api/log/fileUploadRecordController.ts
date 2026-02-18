// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 创建文件上传记录 记录文件上传信息 POST /file/upload/record/create */
export async function createRecord(
  body: LogAPI.FileUploadRecordCreateRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>('/file/upload/record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除文件上传记录 删除指定文件上传记录（仅管理员） POST /file/upload/record/delete */
export async function deleteRecord(body: LogAPI.DeleteRequest, options?: { [key: string]: any }) {
  return request<LogAPI.BaseResponseBoolean>('/file/upload/record/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取文件上传记录列表 分页查询文件上传记录（仅管理员） POST /file/upload/record/list/page */
export async function listRecordByPage(
  body: LogAPI.FileUploadRecordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponsePageFileUploadRecordVO>('/file/upload/record/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
