declare namespace SearchAPI {
  type AiChatMessageEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    sessionId?: number
    userId?: number
    role?: string
    content?: string
  }

  type AiChatSessionEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    userId?: number
    title?: string
  }

  type ApiAccessLogEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    traceId?: string
    userId?: number
    method?: string
    path?: string
    query?: string
    status?: number
    latencyMs?: number
    clientIp?: string
    userAgent?: string
    referer?: string
    requestSize?: number
    responseSize?: number
  }

  type ApiAccessLogQueryRequest = {
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
    /** 用户ID */
    userId?: number
    /** HTTP方法 */
    method?: string
    /** 请求路径 */
    path?: string
    /** 响应状态码 */
    status?: number
    /** 客户端IP */
    clientIp?: string
    /** 追踪ID */
    traceId?: string
    /** 搜索文本 */
    searchText?: string
  }

  type BaseResponseBoolean = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: boolean
    /** 消息 */
    message?: string
  }

  type BaseResponsePage = {
    /** 状态码 */
    code?: number
    data?: Page
    /** 消息 */
    message?: string
  }

  type BaseResponseSearchVOObject = {
    /** 状态码 */
    code?: number
    data?: SearchVOObject
    /** 消息 */
    message?: string
  }

  type EmailRecordEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    msgId?: string
    bizType?: string
    toEmail?: string
    subject?: string
    content?: string
    status?: string
    errorMessage?: string
    sendTime?: string
  }

  type EmailRecordQueryRequest = {
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
    /** 消息ID */
    msgId?: string
    /** 业务幂等ID */
    bizId?: string
    /** 业务类型 */
    bizType?: string
    /** 收件人邮箱 */
    toEmail?: string
    /** 发送状态 */
    status?: string
    /** 搜索文本 */
    searchText?: string
  }

  type FileUploadRecordEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    userId?: number
    bizType?: string
    fileName?: string
    fileSize?: number
    fileSuffix?: string
    contentType?: string
    storageType?: string
    objectKey?: string
    md5?: string
    clientIp?: string
    status?: string
  }

  type FileUploadRecordQueryRequest = {
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
    /** 上传用户ID */
    userId?: number
    /** 业务类型 */
    bizType?: string
    /** 原始文件名 */
    fileName?: string
    /** 上传状态 */
    status?: string
    /** 搜索文本 */
    searchText?: string
  }

  type NotificationEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    userId?: number
    title?: string
    content?: string
    type?: string
    bizId?: string
    relatedId?: number
    relatedType?: string
    isRead?: number
    contentUrl?: string
    status?: number
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
    /** 最小更新时间 */
    minUpdateTime?: string
    /** 最大更新时间 */
    maxUpdateTime?: string
    /** 通知ID */
    id?: number
    /** 通知类型 */
    type?: string
    /** 接收用户ID */
    userId?: number
    /** 是否已读 */
    isRead?: number
    /** 状态 */
    status?: number
    /** 关联对象类型 */
    relatedType?: string
    /** 搜索文本 */
    searchText?: string
  }

  type OperationLogEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    operatorId?: number
    operatorName?: string
    module?: string
    action?: string
    method?: string
    path?: string
    requestParams?: string
    responseStatus?: number
    success?: number
    errorMessage?: string
    clientIp?: string
  }

  type OperationLogQueryRequest = {
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
    /** 操作人ID */
    operatorId?: number
    /** 模块 */
    module?: string
    /** 操作类型 */
    action?: string
    /** 是否成功 */
    success?: number
    /** 客户端IP */
    clientIp?: string
    /** 追踪ID */
    traceId?: string
    /** 操作描述 */
    description?: string
    /** 请求方法 */
    method?: string
    /** 搜索文本 */
    searchText?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type Page = {
    records?: Record<string, any>[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageObject
    searchCount?: PageObject
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageObject = {
    records?: Record<string, any>[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageObject
    searchCount?: PageObject
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PostEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    title?: string
    content?: string
    cover?: string
    tags?: string[]
    thumbNum?: number
    favourNum?: number
    userId?: number
    reviewStatus?: number
  }

  type PostQueryRequest = {
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
    /** 帖子ID */
    id?: number
    /** 排除的帖子ID */
    notId?: number
    /** 搜索词 */
    searchText?: string
    /** 标题 */
    title?: string
    /** 内容 */
    content?: string
    /** 标签列表 */
    tags?: string[]
    /** 至少有一个标签 */
    orTags?: string[]
    /** 创建用户ID */
    userId?: number
    /** 收藏用户ID */
    favourUserId?: number
    /** 审核状态 */
    reviewStatus?: number
  }

  type SearchRequest = {
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
    /** 搜索词 */
    searchText?: string
    /** 分类 */
    type?: string
  }

  type SearchVOObject = {
    /** 数据列表 */
    dataList?: Record<string, any>[]
    /** 总条数 */
    total?: number
    /** 当前页 */
    current?: number
    /** 每页大小 */
    pageSize?: number
  }

  type UserEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    userAccount?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    userEmail?: string
    userPhone?: string
  }

  type UserLoginLogEsDTO = {
    id?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    userId?: number
    account?: string
    loginType?: string
    status?: string
    failReason?: string
    clientIp?: string
    userAgent?: string
  }

  type UserLoginLogQueryRequest = {
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
    /** 用户ID */
    userId?: number
    /** 登录账号 */
    account?: string
    /** 登录类型 */
    loginType?: string
    /** 登录状态 */
    status?: string
    /** 客户端IP */
    clientIp?: string
    /** 搜索文本 */
    searchText?: string
  }

  type UserQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序方式 */
    sortOrder?: string
    /** 最小更新时间 */
    minUpdateTime?: string
    /** 最大更新时间 */
    maxUpdateTime?: string
    /** 用户ID */
    id?: number
    /** 排除的用户ID */
    notId?: number
    /** 微信开放平台UnionID */
    wxUnionId?: string
    /** 公众号OpenID */
    mpOpenId?: string
    /** 用户昵称 */
    userName?: string
    /** 用户角色 */
    userRole?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户电话 */
    userPhone?: string
    /** 搜索文本 */
    searchText?: string
  }
}
