declare namespace MailAPI {
  type BaseResponseBoolean = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: boolean
    /** 消息 */
    message?: string
  }

  type BaseResponseInteger = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: number
    /** 消息 */
    message?: string
  }

  type EmailCodeRequest = {
    email?: string
    code?: string
    clientIp?: string
  }

  type MailSendCodeRequest = {
    to?: string
    code?: string
    minutes?: number
    async?: boolean
  }

  type MailSendRequest = {
    to?: string
    subject?: string
    content?: string
    isHtml?: boolean
    bizType?: string
    bizId?: string
  }
}
