declare namespace UserAPI {
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

  type BaseResponseListUserVO = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: UserVO[]
    /** 消息 */
    message?: string
  }

  type BaseResponsePageUser = {
    /** 状态码 */
    code?: number
    data?: PageUser
    /** 消息 */
    message?: string
  }

  type BaseResponsePageUserVO = {
    /** 状态码 */
    code?: number
    data?: PageUserVO
    /** 消息 */
    message?: string
  }

  type BaseResponseString = {
    /** 状态码 */
    code?: number
    /** 数据 */
    data?: string
    /** 消息 */
    message?: string
  }

  type BaseResponseUser = {
    /** 状态码 */
    code?: number
    data?: User
    /** 消息 */
    message?: string
  }

  type BaseResponseUserVO = {
    /** 状态码 */
    code?: number
    data?: UserVO
    /** 消息 */
    message?: string
  }

  type checkWxMpSignatureParams = {
    arg0: WxMpCheckRequest
  }

  type DeleteRequest = {
    /** id */
    id?: number
  }

  type getUserByIdParams = {
    arg0: number
  }

  type getUserVOByIdParams = {
    arg0: number
  }

  type getUserVOByIdsParams = {
    ids: number[]
  }

  type githubLoginGetParams = {
    arg0: string
    arg1: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageUser = {
    records?: User[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUser
    searchCount?: PageUser
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageUserVO = {
    records?: UserVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUserVO
    searchCount?: PageUserVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type User = {
    /** id */
    id?: number
    /** 开放平台id */
    unionId?: string
    /** 公众号openId */
    mpOpenId?: string
    /** 用户昵称 */
    userName?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色：user/admin/ban */
    userRole?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 邮箱是否验证：0-未验证，1-已验证 */
    emailVerified?: number
    /** GitHub用户ID */
    githubId?: string
    /** GitHub用户名 */
    githubLogin?: string
    /** GitHub主页 */
    githubUrl?: string
    /** 微信 UnionID */
    wxUnionId?: string
    /** 微信 OpenID */
    wxOpenId?: string
    /** 用户电话 */
    userPhone?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 是否删除 */
    isDelete?: number
  }

  type UserEmailCodeSendRequest = {
    /** 邮箱 */
    email?: string
  }

  type UserEmailLoginRequest = {
    /** 邮箱 */
    email?: string
    /** 验证码 */
    code?: string
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
    /** 用户昵称 */
    userName?: string
    /** 用户角色：user/admin/ban */
    userRole?: string
  }

  type UserVO = {
    /** id */
    id?: number
    /** 用户昵称 */
    userName?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户角色：user/admin/ban */
    userRole?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户电话 */
    userPhone?: string
    /** 创建时间 */
    createTime?: string
  }

  type WxMpCheckRequest = {
    /** 微信加密签名 */
    signature?: string
    /** 时间戳 */
    timestamp?: string
    /** 随机数 */
    nonce?: string
    /** 随机字符串 */
    echostr?: string
  }

  type WxQrCodeLoginRequest = {
    /** 授权码 */
    code?: string
    /** 防 CSRF 攻击的随机字符串 */
    state?: string
  }
}
