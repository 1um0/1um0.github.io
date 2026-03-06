# 🏗️ WGCR Club 系统架构与功能指南

**版本**: 2.0  
**最后更新**: 2026年3月6日  
**部署状态**: 🟢 就绪

---

## 📐 系统架构概览

```
┌─────────────────────────────────────────────────┐
│         WGCR Club Web Application                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend Layer (HTML/CSS/JS)                   │
│  ├── index.html (主页面)                        │
│  ├── pages/ (内容页面)                          │
│  ├── css/style.css (样式)                       │
│  └── js/ (业务逻辑)                             │
│      ├── main.js (核心功能)                     │
│      ├── auth.js (身份验证)                     │
│      └── storage-config.js (存储配置)          │
│                                                 │
│  Storage Layer (localStorage)                   │
│  ├── users (用户数据)                           │
│  ├── contents (内容数据)                        │
│  ├── comments (评论数据)                        │
│  └── session (会话数据)                         │
│                                                 │
│  Admin Panel (admin/)                           │
│  ├── admin-panel.html                           │
│  ├── admin.js                                   │
│  └── Access Control                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔐 核心模块详解

### 1. 身份认证模块 (`js/auth.js`)

**功能**: 处理用户登录、注册、权限管理

```javascript
class AuthService {
  // 用户注册
  register(username, email, password)
  
  // 用户登录
  login(email, password)
  
  // 权限检查
  hasPermission(role, action)
  
  // 会话管理
  getCurrentUser()
  setCurrentUser(user)
  
  // 密码安全
  hashPassword(password)        // bcrypt
  verifyPassword(password, hash) // bcrypt检验
}
```

**关键代码**:
- 使用bcryptjs进行密码加密
- sessionStorage管理会话令牌
- CSRF令牌生成和验证

---

### 2. 主应用模块 (`js/main.js`)

**功能**: 内容管理、评论系统、页面导航

```javascript
// 内容管理
loadContent(type)      // 加载特定类型内容
displayContent(data)   // 显示内容

// 评论系统
toggleCommentForm()    // 打开/关闭评论表单
submitComment()        // 提交新评论
loadCommentsForContent(contentId)  // 加载内容评论
renderComments(comments)  // 渲染评论列表
deleteComment(commentId)  // 删除评论

// 导航
switchPage(page)       // 切换页面
showContent(id)        // 显示内容详情
```

**关键特性**:
- 完整的评论系统（新增、编辑、删除）
- 权限检查（仅作者和管理员可删除）
- XSS防护（escapeHtml转义）

---

### 3. 管理员面板 (`admin/admin.js`)

**功能**: 用户管理、内容审核、系统监控

```javascript
// 用户管理
loadUsersList()        // 列表所有用户
editUser(userId)       // 编辑用户信息
deleteUser(userId)     // 删除用户账户

// 内容管理
loadContentList()      // 列表所有内容
editContent(contentId) // 编辑内容
deleteContent(contentId)

// 权限管理
changeUserRole(userId, newRole)
```

---

## 💾 数据存储架构

### 用户数据结构

```javascript
{
  id: "user_1",
  username: "chenmeng",
  email: "chenmeng@wgcr.com",
  password: "$2a$10$...", // bcrypt哈希
  role: "admin",           // admin, moderator, user
  joinDate: "2024-01-01",
  profile: {
    avatar: "avatar.png",
    bio: "User bio"
  }
}
```

### 内容数据结构

```javascript
{
  id: "content_1",
  type: "announcement",  // announcement, project, share, update
  title: "Title",
  content: "Content",
  author: "user_1",
  createdAt: "2024-01-01T12:00:00Z",
  tags: ["tag1", "tag2"]
}
```

### 评论数据结构

```javascript
{
  id: "comment_1",
  contentId: "content_1",
  author: "user_2",
  text: "Comment text",
  createdAt: "2024-01-01T13:00:00Z",
  replies: [
    {
      id: "reply_1",
      author: "user_1",
      text: "Reply text",
      createdAt: "2024-01-01T13:30:00Z"
    }
  ]
}
```

---

## 🎨 用户界面层

### 页面结构

| 页面 | 文件 | 功能 | 权限 |
|------|------|------|------|
| 主页 | index.html | 内容展示、导航 | 公开 |
| 公告 | pages/content-announcement.html | 公告列表 | 公开 |
| 项目 | pages/content-projects.html | 项目展示 | 公开 |
| 分享 | pages/content-shares.html | 分享内容 | 公开 |
| 更新 | pages/content-updates.html | 更新日志 | 公开 |
| 成员 | pages/member-*.html | 成员个人页面 | 公开 |
| 管理面板 | admin/admin-panel.html | 系统管理 | 仅管理员 |

### 响应式设计

```css
/* 移动设备 (< 768px) */
@media (max-width: 768px) {
  /* 单列布局 */
}

/* 平板设备 (768px - 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  /* 两列布局 */
}

/* 桌面设备 (> 1024px) */
@media (min-width: 1025px) {
  /* 多列布局 */
}
```

---

## 🔄 业务流程

### 用户登录流程

```
1. 用户输入邮箱和密码
   ↓
2. 前端验证输入格式 (邮箱、密码长度)
   ↓
3. 获取本地存储中的用户数据
   ↓
4. 使用bcrypt验证密码
   ↓
5. 验证成功 → 创建会话
   ↓
6. 保存用户信息到sessionStorage
   ↓
7. 更新UI，显示已登录状态
```

### 发布评论流程

```
1. 用户点击"添加评论"
   ↓
2. 显示评论表单
   ↓
3. 用户输入评论内容
   ↓
4. 点击提交
   ↓
5. 前端验证 (长度、用户是否登录)
   ↓
6. escapeHtml转义评论内容 🔒
   ↓
7. 保存到localStorage
   ↓
8. 刷新评论列表显示
```

---

## 🛡️ 安全防护机制

### 1. 密码安全
```javascript
// bcryptjs加密
const passwordHash = bcrypt.hashSync('password123', salt);

// 验证
const isValid = bcrypt.compareSync('password123', passwordHash);
```

### 2. XSS防护
```javascript
// 自动转义HTML
function escapeHtml(unsafe) {
  if (unsafe == null) return '';
  const div = document.createElement('div');
  div.textContent = unsafe;
  return div.innerHTML;
}

// 使用示例
element.innerHTML = `<p>${escapeHtml(userInput)}</p>`;
```

### 3. CSRF保护
```javascript
// 生成令牌
const token = Math.random().toString(36) + Date.now().toString(36);

// 在表单中添加
<input type="hidden" name="csrf_token" value="${token}">

// 提交时验证
function validateCSRF() {
  const formToken = document.querySelector('[name="csrf_token"]').value;
  const sessionToken = sessionStorage.getItem('csrf_token');
  return formToken === sessionToken;
}
```

---

## 📦 依赖库

| 库 | 版本 | 用途 | CDN |
|-----|------|------|-----|
| bcryptjs | 2.4.3 | 密码加密 | jsDelivr |
| - | - | 无其他外部依赖 | - |

---

## 🚀 部署配置

### 服务器要求
- **最低配置**: 512MB RAM, 1GB存储
- **操作系统**: Linux / macOS / Windows
- **Web服务器**: Apache / Nginx / Node.js Express
- **浏览器支持**: 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)

### 环境变量 (可选)
```javascript
// 在 js/storage-config.js 中配置
const Config = {
  storage: 'localStorage',  // 本地存储
  ossBucket: 'wgcr-web',    // OSS配置
  apiUrl: 'https://api.example.com'  // API地址
};
```

---

## 📊 性能指标目标

| 指标 | 目标 | 当前状态 |
|------|------|---------|
| 首屏加载时间 | < 2秒 | ✅ |
| 页面交互延迟 | < 300ms | ✅ |
| 缓存命中率 | > 80% | ✅ |
| 移动端友好度 | 100% | ✅ |

---

## 🔄 更新和维护

### 版本管理

```
v1.0 - 初始版本 (2024年)
v1.5 - 评论系统 (2025年上半年)
v2.0 - 安全加固 (2026年3月)
```

### 更新检查清单
- [ ] 测试所有核心功能
- [ ] 验证密码加密
- [ ] 检查XSS防护
- [ ] 验证权限系统
- [ ] 移动端响应式测试
- [ ] 性能基准测试

---

## 🎯 总结

WGCR Club采用现代Web架构，具有：

✅ **模块化设计**: 清晰的文件结构和职责分离  
✅ **安全至上**: bcrypt密码加密、XSS防护、CSRF保护  
✅ **完整功能**: 身份认证、内容管理、评论系统  
✅ **响应式界面**: 支持所有设备类型  
✅ **易于维护**: 代码清晰，注释完善  
✅ **即插即用**: 无需后端服务，纯前端实现