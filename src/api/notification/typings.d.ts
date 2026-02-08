declare namespace NotificationAPI {
  type BaseResponseBoolean = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: boolean
    /** 消息 */
    message?: string
  }

  type BaseResponseLong = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: number
    /** 消息 */
    message?: string
  }

  type BaseResponseNotification = {
    /** 状态码 */
    code?: number
    data?: Notification
    /** 消息 */
    message?: string
  }

  type BaseResponseNotificationVO = {
    /** 状态码 */
    code?: number
    data?: NotificationVO
    /** 消息 */
    message?: string
  }

  type BaseResponsePageNotification = {
    /** 状态码 */
    code?: number
    data?: PageNotification
    /** 消息 */
    message?: string
  }

  type BaseResponsePageNotificationVO = {
    /** 状态码 */
    code?: number
    data?: PageNotificationVO
    /** 消息 */
    message?: string
  }

  type DeleteRequest = {
    /** id */
    id?: number
  }

  type getNotificationByIdParams = {
    id: number
  }

  type getNotificationEntityByIdParams = {
    id: number
  }

  type getNotificationVOByIdParams = {
    id: number
  }

  type Notification = {
    id?: number
    title?: string
    content?: string
    type?: string
    bizId?: string
    userId?: number
    relatedId?: number
    relatedType?: string
    isRead?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type NotificationAddRequest = {
    /** 通知标题 */
    title?: string
    /** 通知内容 */
    content?: string
    /** 通知类型 */
    type?: string
    /** 业务幂等 ID */
    bizId?: string
    /** 接收用户 ID */
    userId?: number
    /** 关联对象 ID */
    relatedId?: number
    /** 关联对象类型 */
    relatedType?: string
  }

  type NotificationQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序顺序（默认升序） */
    sortOrder?: string
    /** 通知类型 */
    type?: string
    /** 接收用户 ID */
    userId?: number
    /** 是否已读 */
    isRead?: number
    /** 关联对象类型 */
    relatedType?: string
  }

  type NotificationUpdateRequest = {
    /** 通知 ID */
    id?: number
    /** 通知标题 */
    title?: string
    /** 通知内容 */
    content?: string
    /** 通知类型 */
    type?: string
    /** 接收用户 ID */
    userId?: number
    /** 关联对象 ID */
    relatedId?: number
    /** 关联对象类型 */
    relatedType?: string
  }

  type NotificationVO = {
    /** id */
    id?: number
    /** 通知标题 */
    title?: string
    /** 通知内容 */
    content?: string
    /** 通知类型 */
    type?: string
    /** 接收用户 id */
    userId?: number
    /** 关联对象 id */
    relatedId?: number
    /** 关联对象类型 */
    relatedType?: string
    /** 是否已读 */
    isRead?: number
    /** 创建时间 */
    createTime?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageNotification = {
    records?: Notification[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageNotification
    searchCount?: PageNotification
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageNotificationVO = {
    records?: NotificationVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageNotificationVO
    searchCount?: PageNotificationVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }
}
