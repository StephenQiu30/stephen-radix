// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 创建通知 POST /notification/add */
export async function addNotification(
  body: NotificationAPI.NotificationAddRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseLong>('/notification/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除通知 删除指定通知，仅本人或管理员可操作 POST /notification/delete */
export async function deleteNotification(
  body: NotificationAPI.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseBoolean>('/notification/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据 ID 获取通知 GET /notification/get */
export async function getNotificationById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: NotificationAPI.getNotificationByIdParams,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseNotificationVO>('/notification/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 分页获取通知列表 分页获取当前用户的通知列表 POST /notification/list/page */
export async function listNotificationByPage(
  body: NotificationAPI.NotificationQueryRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponsePageNotificationVO>('/notification/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 标记为已读 将指定通知标记为已读 POST /notification/read */
export async function markAsRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: NotificationAPI.markAsReadParams,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseBoolean>('/notification/read', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 标记所有为已读 将所有通知标记为已读 POST /notification/read/all */
export async function markAllAsRead(options?: { [key: string]: any }) {
  return request<NotificationAPI.BaseResponseBoolean>('/notification/read/all', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 获取未读数量 获取当前用户未读通知数量 GET /notification/unread/count */
export async function getUnreadCount(options?: { [key: string]: any }) {
  return request<NotificationAPI.BaseResponseLong>('/notification/unread/count', {
    method: 'GET',
    ...(options || {}),
  })
}
