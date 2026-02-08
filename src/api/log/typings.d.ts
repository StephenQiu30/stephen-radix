declare namespace LogAPI {
  type ApiAccessLog = {
    /** ID */
    id?: number
    /** 链路追踪ID */
    traceId?: string
    /** 用户ID */
    userId?: number
    /** HTTP方法 */
    method?: string
    /** 请求路径 */
    path?: string
    /** 查询参数 */
    query?: string
    /** 响应状态码 */
    status?: number
    /** 耗时毫秒 */
    latencyMs?: number
    /** 客户端IP */
    clientIp?: string
    /** User-Agent */
    userAgent?: string
    /** Referer */
    referer?: string
    /** 请求大小 */
    requestSize?: number
    /** 响应大小 */
    responseSize?: number
    /** 创建时间 */
    createTime?: string
  }

  type ApiAccessLogCreateRequest = {
    /** 链路追踪ID */
    traceId?: string
    /** 用户ID */
    userId?: number
    /** HTTP方法 */
    method?: string
    /** 请求路径 */
    path?: string
    /** 查询参数 */
    query?: string
    /** 响应状态码 */
    status?: number
    /** 耗时毫秒 */
    latencyMs?: number
    /** 客户端IP */
    clientIp?: string
    /** User-Agent */
    userAgent?: string
    /** Referer */
    referer?: string
    /** 请求大小 */
    requestSize?: number
    /** 响应大小 */
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
  }

  type BaseResponseBoolean = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: boolean
    /** 消息 */
    message?: string
  }

  type BaseResponsePageApiAccessLog = {
    /** 状态码 */
    code?: number
    data?: PageApiAccessLog
    /** 消息 */
    message?: string
  }

  type BaseResponsePageOperationLog = {
    /** 状态码 */
    code?: number
    data?: PageOperationLog
    /** 消息 */
    message?: string
  }

  type BaseResponsePageUserLoginLog = {
    /** 状态码 */
    code?: number
    data?: PageUserLoginLog
    /** 消息 */
    message?: string
  }

  type DeleteRequest = {
    /** id */
    id?: number
  }

  type OperationLog = {
    /** ID */
    id?: number
    /** 操作人ID */
    operatorId?: number
    /** 操作人名称 */
    operatorName?: string
    /** 模块 */
    module?: string
    /** 操作类型 */
    action?: string
    /** HTTP方法 */
    method?: string
    /** 请求路径 */
    path?: string
    /** 请求参数 */
    requestParams?: string
    /** 响应状态码 */
    responseStatus?: number
    /** 是否成功 */
    success?: number
    /** 错误信息 */
    errorMessage?: string
    /** 客户端IP */
    clientIp?: string
    /** 创建时间 */
    createTime?: string
  }

  type OperationLogCreateRequest = {
    /** 操作人ID */
    operatorId?: number
    /** 操作人名称 */
    operatorName?: string
    /** 模块 */
    module?: string
    /** 操作类型 */
    action?: string
    /** HTTP方法 */
    method?: string
    /** 请求路径 */
    path?: string
    /** 请求参数 */
    requestParams?: string
    /** 响应状态码 */
    responseStatus?: number
    /** 是否成功 */
    success?: number
    /** 错误信息 */
    errorMessage?: string
    /** 客户端IP */
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
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageApiAccessLog = {
    records?: ApiAccessLog[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageApiAccessLog
    searchCount?: PageApiAccessLog
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageOperationLog = {
    records?: OperationLog[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageOperationLog
    searchCount?: PageOperationLog
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageUserLoginLog = {
    records?: UserLoginLog[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUserLoginLog
    searchCount?: PageUserLoginLog
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type UserLoginLog = {
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
    /** 失败原因 */
    failReason?: string
    /** 客户端IP */
    clientIp?: string
    /** User-Agent */
    userAgent?: string
    /** 创建时间 */
    createTime?: string
  }

  type UserLoginLogCreateRequest = {
    /** 用户ID */
    userId?: number
    /** 登录账号 */
    account?: string
    /** 登录类型 */
    loginType?: string
    /** 登录状态 */
    status?: string
    /** 失败原因 */
    failReason?: string
    /** 客户端IP */
    clientIp?: string
    /** User-Agent */
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
  }
}
