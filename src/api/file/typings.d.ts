declare namespace FileAPI {
  type BaseResponseString = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: string
    /** 消息 */
    message?: string
  }

  type uploadFileParams = {
    biz: string
  }
}
