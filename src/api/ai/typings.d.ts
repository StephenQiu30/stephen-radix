declare namespace AiAPI {
  type AiChatMessageQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序顺序（默认升序） */
    sortOrder?: string
    /** 最小更新时间 */
    minUpdateTime?: string
    /** 最大更新时间 */
    maxUpdateTime?: string
    /** 会话 ID */
    sessionId?: number
  }

  type AiChatMessageVO = {
    /** ID */
    id?: number
    /** 会话 ID */
    sessionId?: number
    /** 用户 ID */
    userId?: number
    /** 角色 (user, assistant) */
    role?: string
    /** 消息内容 */
    content?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  }

  type AiChatRequest = {
    /** 用户发送的消息内容 */
    message?: string
    /** 会话 ID，如果为空则创建新会话 */
    sessionId?: number
  }

  type AiChatResponse = {
    /** 会话 ID */
    sessionId?: number
    /** 会话标题 */
    sessionTitle?: string
    /** AI 回复内容 */
    content?: string
  }

  type AiChatSessionQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序顺序（默认升序） */
    sortOrder?: string
    /** 最小更新时间 */
    minUpdateTime?: string
    /** 最大更新时间 */
    maxUpdateTime?: string
    /** ID */
    id?: number
    /** 会话标题（模糊搜索） */
    title?: string
  }

  type AiChatSessionUpdateRequest = {
    /** 会话 ID */
    id: number
    /** 会话标题 */
    title?: string
  }

  type AiChatSessionVO = {
    /** ID */
    id?: number
    /** 会话标题 */
    title?: string
    /** 用户 ID */
    userId?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 消息数量 */
    messageCount?: number
    /** 最后消息时间 */
    lastMessageTime?: string
  }

  type BaseResponseAiChatResponse = {
    /** 状态码 */
    code?: number
    data?: AiChatResponse
    /** 消息 */
    message?: string
  }

  type BaseResponseAiChatSessionVO = {
    /** 状态码 */
    code?: number
    data?: AiChatSessionVO
    /** 消息 */
    message?: string
  }

  type BaseResponseBoolean = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: boolean
    /** 消息 */
    message?: string
  }

  type BaseResponsePageAiChatMessageVO = {
    /** 状态码 */
    code?: number
    data?: PageAiChatMessageVO
    /** 消息 */
    message?: string
  }

  type BaseResponsePageAiChatSessionVO = {
    /** 状态码 */
    code?: number
    data?: PageAiChatSessionVO
    /** 消息 */
    message?: string
  }

  type DeleteRequest = {
    /** id */
    id: number
  }

  type getSessionVOParams = {
    sessionId: number
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageAiChatMessageVO = {
    records?: AiChatMessageVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageAiChatMessageVO
    searchCount?: PageAiChatMessageVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageAiChatSessionVO = {
    records?: AiChatSessionVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageAiChatSessionVO
    searchCount?: PageAiChatSessionVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type SseEmitter = {
    timeout?: number
  }
}
