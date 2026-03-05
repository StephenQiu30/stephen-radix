// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 文件上传 统一样式的文件上传接口，支持按业务类型进行校验 POST /file/upload */
export async function addFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: FileAPI.addFileParams,
  body: File | any,
  options?: { [key: string]: any }
) {
  const formData = new FormData()
  if (body) {
    formData.append('file', body)
  }

  return request<FileAPI.BaseResponseFileUploadVO>('/file/upload', {
    method: 'POST',
    params: {
      ...params,
      fileUploadRequest: undefined,
      ...params['fileUploadRequest'],
    },
    data: formData,
    ...(options || {}),
  })
}
