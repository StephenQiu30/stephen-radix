'use client'

import * as React from 'react'
import { MarkdownEditor } from '@/components/markdown/markdown-editor'
import { MarkdownViewer } from '@/components/markdown/markdown-viewer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Code2, Image as ImageIcon, Upload } from 'lucide-react'

const defaultContent = `# 欢迎使用 Markdown 编辑器

这是一个功能强大的 Markdown 编辑器，支持**实时预览**和**代码高亮**。

## 功能特性

### 文本格式
- **粗体文本**
- *斜体文本*
- ~~删除线~~
- \`行内代码\`

### 代码高亮
我们支持多种编程语言的语法高亮：

#### JavaScript
\`\`\`javascript
function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}
\`\`\`

#### Python
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

#### TypeScript
\`\`\`typescript
interface User {
  id: number;
  name: string;
}
\`\`\`

### 列表
1. 第一项
2. 第二项
3. 第三项

### 引用
> 这是一段引用文本

---

## 开始创作

在左侧编辑器中输入 Markdown 内容，右侧将实时显示预览效果！
`

export default function EditorPage() {
  const [content, setContent] = React.useState(defaultContent)

  return (
    <motion.div
      className="container mx-auto max-w-7xl py-8 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 页面标题 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Markdown 编辑器</h1>
            <p className="text-muted-foreground text-lg">功能强大的 Markdown 编辑和预览工具</p>
          </div>
        </div>
      </div>

      {/* 功能介绍 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              实时预览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>左侧编辑，右侧实时预览，所见即所得</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              代码高亮
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>支持 JS、Python、TS、CSS、SQL 等多种语言语法高亮</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              图片上传
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>支持点击上传和拖拽上传，自动 Base64 编码</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              拖拽编辑
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>支持拖拽图片到编辑器，快速插入</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* 编辑器 */}
      <Card>
        <CardHeader>
          <CardTitle>开始创作</CardTitle>
          <CardDescription>使用工具栏快速插入 Markdown 语法，支持拖拽上传图片</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="开始编写 Markdown 内容..."
              minHeight="500px"
            />
            <MarkdownViewer content={content} minHeight="500px" />
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
          <CardDescription>快速了解 Markdown 编辑器的功能</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <div className="font-semibold mb-2">文本格式</div>
              <div className="text-sm text-muted-foreground">粗体、斜体、删除线、代码</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="font-semibold mb-2">标题</div>
              <div className="text-sm text-muted-foreground">H1-H2 标题</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="font-semibold mb-2">列表</div>
              <div className="text-sm text-muted-foreground">有序/无序列表</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="font-semibold mb-2">媒体</div>
              <div className="text-sm text-muted-foreground">链接、图片上传</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
