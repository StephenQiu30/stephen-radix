// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 聚合搜索查询 POST /search/all */
export async function doSearchAll(body: SearchAPI.SearchRequest, options?: { [key: string]: any }) {
  return request<SearchAPI.BaseResponseSearchVOObject>('/search/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索 API 访问日志（从 ES 查询） POST /search/api_access_log/page */
export async function searchApiAccessLogByPage(
  body: SearchAPI.ApiAccessLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/api_access_log/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量同步 API 访问日志到 ES POST /search/api/access/log/batch/upsert */
export async function batchUpsertApiAccessLog(
  body: SearchAPI.ApiAccessLogEsDTO[],
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponseBoolean>('/search/api/access/log/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索邮件记录（从 ES 查询） POST /search/email_record/page */
export async function searchEmailRecordByPage(
  body: SearchAPI.EmailRecordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/email_record/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量同步邮件记录到 ES POST /search/email/record/batch/upsert */
export async function batchUpsertEmailRecord(
  body: SearchAPI.EmailRecordEsDTO[],
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponseBoolean>('/search/email/record/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索文件上传记录（从 ES 查询） POST /search/file_upload_record/page */
export async function searchFileUploadRecordByPage(
  body: SearchAPI.FileUploadRecordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/file_upload_record/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量同步文件上传记录到 ES POST /search/file/upload/record/batch/upsert */
export async function batchUpsertFileUploadRecord(
  body: SearchAPI.FileUploadRecordEsDTO[],
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponseBoolean>('/search/file/upload/record/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 手动触发所有日志数据的全量同步 POST /search/log/sync/full */
export async function fullSyncLogs(options?: { [key: string]: any }) {
  return request<SearchAPI.BaseResponseBoolean>('/search/log/sync/full', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 批量同步通知到 ES POST /search/notification/batch/upsert */
export async function batchUpsertNotification(
  body: SearchAPI.NotificationEsDTO[],
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponseBoolean>('/search/notification/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索通知（从 ES 查询） POST /search/notification/page */
export async function searchNotificationByPage(
  body: SearchAPI.NotificationQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/notification/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索操作日志（从 ES 查询） POST /search/operation_log/page */
export async function searchOperationLogByPage(
  body: SearchAPI.OperationLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/operation_log/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量同步操作日志到 ES POST /search/operation/log/batch/upsert */
export async function batchUpsertOperationLog(
  body: SearchAPI.OperationLogEsDTO[],
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponseBoolean>('/search/operation/log/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量同步帖子到 ES POST /search/post/batch/upsert */
export async function batchUpsertPost(
  body: SearchAPI.PostEsDTO[],
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponseBoolean>('/search/post/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索帖子（从 ES 查询） POST /search/post/page */
export async function searchPostByPage(
  body: SearchAPI.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/post/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索用户登录日志（从 ES 查询） POST /search/user_login_log/page */
export async function searchUserLoginLogByPage(
  body: SearchAPI.UserLoginLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/user_login_log/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量同步用户到 ES POST /search/user/batch/upsert */
export async function batchUpsertUser(
  body: SearchAPI.UserEsDTO[],
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponseBoolean>('/search/user/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量同步用户登录日志到 ES POST /search/user/login/log/batch/upsert */
export async function batchUpsertUserLoginLog(
  body: SearchAPI.UserLoginLogEsDTO[],
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponseBoolean>('/search/user/login/log/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页搜索用户（从 ES 查询） POST /search/user/page */
export async function searchUserByPage(
  body: SearchAPI.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<SearchAPI.BaseResponsePage>('/search/user/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
