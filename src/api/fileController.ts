// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 文件上传 文件上传(使用COS对象存储) POST /file/upload */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadFileParams,
  file: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()
  formData.append('file', file)

  return request<API.BaseResponseString>('/file/upload', {
    method: 'POST',
    headers: {
      // 让浏览器自动设置 Content-Type 为 multipart/form-data 并添加 boundary
    },
    params: {
      ...params,
    },
    data: formData,
    ...(options || {}),
  })
}
