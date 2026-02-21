declare namespace AiAPI {
  type AiChatRequest = {
    message?: string
    provider?: string
    sessionId?: number
  }

  type BaseResponseString = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: string
    /** 消息 */
    message?: string
  }

  type SseEmitter = {
    timeout?: number
  }
}
