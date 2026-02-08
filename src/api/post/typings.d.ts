declare namespace PostAPI {
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

  type BaseResponsePagePostComment = {
    /** 状态码 */
    code?: number
    data?: PagePostComment
    /** 消息 */
    message?: string
  }

  type BaseResponsePagePostCommentVO = {
    /** 状态码 */
    code?: number
    data?: PagePostCommentVO
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

  type BaseResponsePostCommentVO = {
    /** 状态码 */
    code?: number
    data?: PostCommentVO
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

  type DeleteRequest = {
    /** id */
    id?: number
  }

  type getPostCommentVOByIdParams = {
    arg0: number
  }

  type getPostVOByIdParams = {
    arg0: number
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

  type PagePostComment = {
    records?: PostComment[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePostComment
    searchCount?: PagePostComment
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePostCommentVO = {
    records?: PostCommentVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePostCommentVO
    searchCount?: PagePostCommentVO
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

  type PostComment = {
    /** id */
    id?: number
    /** 评论内容 */
    content?: string
    /** 帖子 id */
    postId?: number
    /** 评论用户 id */
    userId?: number
    /** 父评论 id（0表示一级评论） */
    parentId?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 是否删除 */
    isDelete?: number
  }

  type PostCommentAddRequest = {
    /** 评论内容 */
    content?: string
    /** 帖子 id */
    postId?: number
    /** 父评论 id（0表示一级评论） */
    parentId?: number
  }

  type PostCommentEditRequest = {
    /** id */
    id?: number
    /** 评论内容 */
    content?: string
  }

  type PostCommentQueryRequest = {
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
    /** 帖子 id */
    postId?: number
    /** 评论用户 id */
    userId?: number
    /** 父评论 id */
    parentId?: number
    /** 评论内容（模糊搜索） */
    content?: string
  }

  type PostCommentUpdateRequest = {
    /** id */
    id?: number
    /** 评论内容 */
    content?: string
  }

  type PostCommentVO = {
    /** id */
    id?: number
    /** 评论内容 */
    content?: string
    /** 帖子 id */
    postId?: number
    /** 评论用户 id */
    userId?: number
    /** 父评论 id（0表示一级评论） */
    parentId?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    userVO?: UserVO
    /** 子评论列表 */
    children?: PostCommentVO[]
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

  type PostFavourQueryRequest = {
    /** 当前页号 */
    current?: number
    /** 页面大小 */
    pageSize?: number
    /** 排序字段 */
    sortField?: string
    /** 排序顺序（默认升序） */
    sortOrder?: string
    /** 用户 id */
    userId?: number
    postQueryRequest?: PostQueryRequest
  }

  type PostFavourRequest = {
    /** 帖子ID */
    postId?: number
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

  type PostThumbRequest = {
    /** 帖子ID */
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
}
