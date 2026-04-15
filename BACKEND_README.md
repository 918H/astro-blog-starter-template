# 博客后台管理系统使用指南

## 🎯 功能特性

- ✅ 文章管理 - 查看、编辑、删除所有文章
- ✅ 在线写作 - 使用 Markdown 格式在线创建文章
- ✅ 实时预览 - 发布后立即可见
- ✅ 双重存储 - 同时支持本地 Markdown 文件和云端 KV 存储

## 🔐 默认密码

```
admin123
```

**⚠️ 重要：首次使用请修改密码！**

修改以下两个文件：
1. `src/pages/admin/login.astro` - 第 5 行
2. `src/pages/api/admin/login.ts` - 第 7 行

## 📁 文件结构

```
src/
├── pages/
│   ├── admin/           # 后台管理页面
│   │   ├── login.astro  # 登录页面
│   │   ├── dashboard.astro  # 管理面板
│   │   ├── new.astro    # 新建文章
│   │   └── edit.astro   # 编辑文章
│   └── api/             # API 接口
│       ├── articles/    # 文章管理 API
│       │   ├── index.ts   # 获取列表
│       │   ├── create.ts  # 创建/更新/删除
│       │   └── [id].ts    # 获取详情
│       ├── blog/        # 博客 API
│       │   └── [slug].ts # 获取文章内容
│       └── admin/
│           └── login.ts # 登录认证
```

## 🚀 本地使用

### 1. 配置 KV 存储（本地）

```bash
# 创建本地 KV namespace
npx wrangler kv:namespace create "BLOG_STORE" --preview

# 会输出预览 ID，复制到 wrangler.json
```

### 2. 启动开发服务器

```bash
npm install
npm run dev
```

### 3. 访问后台

打开浏览器访问：
```
http://localhost:4321/admin/login
```

登录后即可管理文章。

## ☁️ 部署到 Cloudflare

### 1. 创建 KV Namespace

```bash
# 创建正式的 KV namespace
npx wrangler kv:namespace create "BLOG_STORE"
```

命令会输出一个 ID，复制到 `wrangler.json` 中替换 `blog_store`：

```json
"kv_namespaces": [
  {
    "binding": "BLOG_STORE",
    "id": "实际的_ID_（复制这里的值）"
  }
]
```

### 2. 部署

```bash
npm run deploy
```

### 3. 访问线上后台

```
https://你的域名.workers.dev/admin/login
```

## 📝 文章格式

新建文章时，内容使用 **Markdown 格式**：

```markdown
# 标题

## 小标题

这里是正文内容...

### 代码示例

```javascript
console.log('Hello World');
```

### 列表

- 项目 1
- 项目 2
- 项目 3
```

## 🔧 自定义配置

### 修改主题色

编辑 `src/styles/global.css`：

```css
:root {
	--accent: #ff6b35;  /* 主色调 */
	--accent-dark: #e85d2a;  /* 深色调 */
}
```

### 修改博客名称

编辑 `src/consts.ts`：

```typescript
export const SITE_TITLE = "你的博客名称";
export const SITE_DESCRIPTION = "你的博客标语";
```

## 💡 使用技巧

1. **本地测试**：开发时使用 `npm run dev`，无需配置 KV
2. **文章图片**：图片文件放在 `public/` 目录，路径写 `/图片名.jpg`
3. **文章 ID**：系统自动生成，也可以使用自定义 ID
4. **批量导入**：可以直接把 Markdown 文件复制到 `src/content/blog/` 目录

## ⚠️ 注意事项

1. **密码安全**：务必修改默认密码！
2. **定期备份**：KV 存储的数据建议定期备份
3. **图片存储**：建议将图片上传到图床或 CDN
4. **性能优化**：文章较多时，建议开启缓存

## 🆘 常见问题

### Q: 登录后提示"存储未配置"
A: 确保 `wrangler.json` 中配置了 KV namespace，并且 ID 正确。

### Q: 发布文章失败
A: 检查必填字段（标题、描述、发布日期、内容）是否完整。

### Q: 如何删除文章？
A: 在管理面板点击文章右侧的"删除"按钮。

### Q: 支持富文本编辑器吗？
A: 当前版本使用 Markdown 格式，可以自行集成富文本编辑器。

## 📮 技术支持

如有问题，欢迎交流！

---

**凳子大王的技术博客** - 一切都有无限可能
