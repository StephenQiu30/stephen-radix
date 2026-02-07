// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 文件上传 统一样式的文件上传接口 POST /file/upload */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: FileAPI.uploadFileParams,
  body: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()
  formData.append('file', body)

  return request<FileAPI.BaseResponseString>('/file/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    ...(options || {}),
  })
}
