// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 导出帖子 将帖子内容导出为 PDF 或 Word (仅管理员) GET /post/export */
export async function exportPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PostAPI.exportPostParams,
  options?: { [key: string]: any }
) {
  return request<any>('/post/export', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
