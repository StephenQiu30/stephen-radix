// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 此处后端没有提供注释 GET /encrypt/rsa/public/key */
export async function getRsaPublicKey(options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/encrypt/rsa/public/key', {
    method: 'GET',
    ...(options || {}),
  })
}
