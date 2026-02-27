// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 删除邮箱验证码 删除指定邮箱的验证码，通常用于重置或安全清理 POST /mail/email/code/delete */
export async function deleteEmailCode(
  body: MailAPI.EmailCodeRequest,
  options?: { [key: string]: any }
) {
  return request<MailAPI.BaseResponseBoolean>('/mail/email/code/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 发送邮箱验证码 生成验证码并通过邮件发送给用户，包含防刷频率限制 POST /mail/email/code/send */
export async function sendEmailCode(
  body: MailAPI.EmailCodeRequest,
  options?: { [key: string]: any }
) {
  return request<MailAPI.BaseResponseEmailCodeVO>('/mail/email/code/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 验证邮箱验证码 验证邮箱验证码是否正确 POST /mail/email/code/verify */
export async function verifyEmailCode(
  body: MailAPI.EmailCodeRequest,
  options?: { [key: string]: any }
) {
  return request<MailAPI.BaseResponseBoolean>('/mail/email/code/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 发送邮件（异步） 将邮件发送任务投递至消息队列，由消费者异步处理，适用于高并发或对响应时间敏感的场景 POST /mail/send/async */
export async function sendMailAsync(
  body: MailAPI.MailSendRequest,
  options?: { [key: string]: any }
) {
  return request<MailAPI.BaseResponseBoolean>('/mail/send/async', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 发送邮件（同步） 立即发送邮件并阻塞等待结果，适用于对发送结果有即时性要求的场景 POST /mail/send/sync */
export async function sendMailSync(
  body: MailAPI.MailSendRequest,
  options?: { [key: string]: any }
) {
  return request<MailAPI.BaseResponseBoolean>('/mail/send/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 发送验证码邮件 发送包含验证码的邮件 POST /mail/send/verification-code */
export async function sendVerificationCode(
  body: MailAPI.MailSendCodeRequest,
  options?: { [key: string]: any }
) {
  return request<MailAPI.BaseResponseBoolean>('/mail/send/verification-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
