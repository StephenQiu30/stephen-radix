// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 文件上传 统一样式的文件上传接口 POST /file/upload */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: FileAPI.uploadFileParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<FileAPI.BaseResponseString>('/file/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  })
}
