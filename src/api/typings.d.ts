declare namespace API {
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

  type BaseResponseLoginUserVO = {
    /** 状态码 */
    code?: number
    data?: LoginUserVO
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

  type BaseResponsePagePost = {
    /** 状态码 */
    code?: number
    data?: PagePost
    /** 消息 */
    message?: string
  }

  type BaseResponsePagePostVO = {
    /** 状态码 */
    code?: number
    data?: PagePostVO
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

  type BaseResponsePostVO = {
    /** 状态码 */
    code?: number
    data?: PostVO
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

  type checkParams = {
    timestamp: string
    nonce: string
    signature: string
    echostr: string
  }

  type DeleteRequest = {
    /** id */
    id?: number
  }

  type getPostVOByIdParams = {
    id: number
  }

  type getUserByIdParams = {
    id: number
  }

  type getUserVOByIdParams = {
    id: number
  }

  type LoginUserVO = {
    /** 用户 id */
    id?: number
    /** 用户昵称 */
    userName?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户角色：user/admin/ban */
    userRole?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** token */
    token?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PagePost = {
    records?: Post[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePost
    searchCount?: PagePost
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePostVO = {
    records?: PostVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePostVO
    searchCount?: PagePostVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
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

  type Post = {
    /** id */
    id?: number
    /** 标题 */
    title?: string
    /** 内容 */
    content?: string
    /** 封面 */
    cover?: string
    /** 标签列表 json */
    tags?: string
    /** 点赞数 */
    thumbNum?: number
    /** 收藏数 */
    favourNum?: number
    /** 创建用户 id */
    userId?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 是否删除 */
    isDelete?: number
  }

  type PostAddRequest = {
    /** 标题 */
    title?: string
    /** 内容 */
    content?: string
    /** 封面 */
    cover?: string
    /** 标签列表 */
    tags?: string[]
  }

  type PostEditRequest = {
    /** id */
    id?: number
    /** 标题 */
    title?: string
    /** 内容 */
    content?: string
    /** 封面 */
    cover?: string
    /** 标签列表 */
    tags?: string[]
  }

  type PostFavourAddRequest = {
    /** 帖子 id */
    postId?: number
  }

  type PostFavourQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序顺序（默认升序） */
    sortOrder?: string
    postQueryRequest?: PostQueryRequest
    /** 用户 id */
    userId?: number
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
    /** notId */
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
    /** 创建用户 id */
    userId?: number
    /** 收藏用户 id */
    favourUserId?: number
  }

  type PostThumbAddRequest = {
    /** 帖子 id */
    postId?: number
  }

  type PostUpdateRequest = {
    /** id */
    id?: number
    /** 标题 */
    title?: string
    /** 内容 */
    content?: string
    /** 封面 */
    cover?: string
    /** 标签列表 */
    tags?: string[]
  }

  type PostVO = {
    /** id */
    id?: number
    /** 标题 */
    title?: string
    /** 内容 */
    content?: string
    /** 封面 */
    cover?: string
    /** 点赞数 */
    thumbNum?: number
    /** 收藏数 */
    favourNum?: number
    /** 创建用户 id */
    userId?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 标签列表 */
    tags?: string[]
    userVO?: UserVO
    /** 是否已点赞 */
    hasThumb?: boolean
    /** 是否已收藏 */
    hasFavour?: boolean
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
    dataList?: Record<string, any>[]
  }

  type uploadFileParams = {
    biz: string
  }

  type User = {
    /** id */
    id?: number
    /** 用户账号 */
    userAccount?: string
    /** 用户密码 */
    userPassword?: string
    /** 开放平台id */
    unionId?: string
    /** 公众号openId */
    mpOpenId?: string
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
    /** 更新时间 */
    updateTime?: string
    /** 是否删除 */
    isDelete?: number
  }

  type UserAddRequest = {
    /** 用户昵称 */
    userName?: string
    /** 账号 */
    userAccount?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户角色: user, admin */
    userRole?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户电话 */
    userPhone?: string
  }

  type UserEditRequest = {
    /** 用户昵称 */
    userName?: string
    /** 用户密码 */
    userPassword?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户电话 */
    userPhone?: string
  }

  type userLoginByWxOpenParams = {
    code: string
  }

  type UserLoginRequest = {
    /** 账号 */
    userAccount?: string
    /** 密码 */
    userPassword?: string
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
    /** notId */
    notId?: number
    /** 搜索关键词 */
    searchText?: string
    /** 开放平台id */
    unionId?: string
    /** 公众号openId */
    mpOpenId?: string
    /** 用户昵称 */
    userName?: string
    /** 用户角色：user/admin/ban */
    userRole?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户电话 */
    userPhone?: string
  }

  type UserRegisterRequest = {
    /** 账号 */
    userAccount?: string
    /** 密码 */
    userPassword?: string
    /** 再次输入密码 */
    checkPassword?: string
  }

  type UserUpdateRequest = {
    /** id */
    id?: number
    /** 用户昵称 */
    userName?: string
    /** 用户密码 */
    userPassword?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户角色：user/admin/ban */
    userRole?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户电话 */
    userPhone?: string
  }

  type UserVO = {
    /** id */
    id?: number
    /** 用户昵称 */
    userName?: string
    /** 开放平台id */
    unionId?: string
    /** 公众号openId */
    mpOpenId?: string
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
    /** 更新时间 */
    updateTime?: string
  }
}
