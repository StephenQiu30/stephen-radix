// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** AI 对话 (标准) 发送消息并等待 AI 返回完整回答 POST /ai/chat */
export async function chat(body: AiAPI.AiChatRequest, options?: { [key: string]: any }) {
  return request<AiAPI.BaseResponseAiChatResponse>('/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** AI 对话 (流式) 发送消息并通过 SSE 获取 AI 逐字返回的内容 POST /ai/chat/stream */
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

/** 获取支持的模型列表 获取系统当前支持的所有 AI 模型及其描述 GET /ai/models */
export async function listModels(options?: { [key: string]: any }) {
  return request<AiAPI.BaseResponseListAiModelVO>('/ai/models', {
    method: 'GET',
    ...(options || {}),
  })
}

/** AI 内容总结 提供文本内容，返回 AI 提炼的摘要 POST /ai/summarize */
export async function summarize(body: AiAPI.AiChatRequest, options?: { [key: string]: any }) {
  return request<AiAPI.BaseResponseAiChatResponse>('/ai/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
