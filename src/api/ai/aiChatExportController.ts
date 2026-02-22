// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 导出对话历史 GET /export/chat */
export async function exportChat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AiAPI.exportChatParams,
  options?: { [key: string]: any }
) {
  return request<any>('/export/chat', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
