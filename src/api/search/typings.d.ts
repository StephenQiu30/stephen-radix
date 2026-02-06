declare namespace SearchAPI {
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

  type PostQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序顺序（默认升序） */
    sortOrder?: string
    /** id */
    id?: number
    /** not id */
    notId?: number
    /** 搜索词 */
    searchText?: string
    /** 标题 */
    title?: string
    /** 内容 */
    content?: string
    /** 标签列表（JSON 数组） */
    tags?: string[]
    /** 至少有一个标签 */
    orTags?: string[]
    /** 创建用户 id */
    userId?: number
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
    /** 搜索词 */
    searchText?: string
    /** 分类 */
    type?: string
  }

  type SearchVOObject = {
    /** 数据列表 */
    dataList?: Record<string, any>[]
  }

  type UserQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序顺序（默认升序） */
    sortOrder?: string
    /** id */
    id?: number
    /** 不包含的 id */
    notId?: number
    /** 用户昵称 */
    userName?: string
    /** 用户角色 */
    userRole?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 搜索词 */
    searchText?: string
  }
}
