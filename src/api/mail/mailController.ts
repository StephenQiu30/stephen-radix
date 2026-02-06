// @ts-ignore
/* eslint-disable */
import request from '@/lib/request'

/** 删除邮箱验证码 删除指定邮箱的验证码 POST /mail/email/code/delete */
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

/** 发送邮箱验证码 发送登录用邮箱验证码 POST /mail/email/code/send */
export async function sendEmailCode(
  body: MailAPI.EmailCodeRequest,
  options?: { [key: string]: any }
) {
  return request<MailAPI.BaseResponseInteger>('/mail/email/code/send', {
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

/** 发送邮件（异步） 异步发送邮件消息 POST /mail/send/async */
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

/** 发送邮件（同步） 同步发送邮件消息 POST /mail/send/sync */
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
