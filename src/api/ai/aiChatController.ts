// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 此处后端没有提供注释 POST /api/ai/inner/chat/stream */
export async function streamChat(body: AiAPI.AiChatRequest, options?: { [key: string]: any }) {
  return request<AiAPI.SseEmitter>('/api/ai/inner/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/ai/inner/chat/sync */
export async function doChat(body: AiAPI.AiChatRequest, options?: { [key: string]: any }) {
  return request<AiAPI.BaseResponseString>('/api/ai/inner/chat/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
