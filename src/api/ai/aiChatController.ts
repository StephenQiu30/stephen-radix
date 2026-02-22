// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 分页获取消息列表 获取指定会话下的所有聊天消息 POST /ai/chat/message/list/page/vo */
export async function listMessageVoByPage(
  body: AiAPI.AiChatMessageQueryRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponsePageAiChatMessageVO>('/ai/chat/message/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除会话 根据 ID 删除指定的 AI 会话 POST /ai/chat/session/delete */
export async function deleteSession(body: AiAPI.DeleteRequest, options?: { [key: string]: any }) {
  return request<AiAPI.BaseResponseBoolean>('/ai/chat/session/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取会话详情 根据 ID 获取指定会话的详细信息 GET /ai/chat/session/get/vo */
export async function getSessionVo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AiAPI.getSessionVOParams,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponseAiChatSessionVO>('/ai/chat/session/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 分页获取我的会话列表 获取当前登录用户创建的 AI 会话列表 POST /ai/chat/session/my/list/page/vo */
export async function listMySessionVoByPage(
  body: AiAPI.AiChatSessionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponsePageAiChatSessionVO>('/ai/chat/session/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 更新会话 修改 AI 会话标题 POST /ai/chat/session/update */
export async function updateSession(
  body: AiAPI.AiChatSessionUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponseBoolean>('/ai/chat/session/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 流式聊天 流式获取 AI 响应内容 (SSE) POST /ai/chat/stream */
export async function streamChat(body: AiAPI.AiChatRequest, options?: { [key: string]: any }) {
  return request<AiAPI.SseEmitter>('/ai/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 同步聊天 发送消息并等待 AI 完整响应 POST /ai/chat/sync */
export async function doChat(body: AiAPI.AiChatRequest, options?: { [key: string]: any }) {
  return request<AiAPI.BaseResponseAiChatResponse>('/ai/chat/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
