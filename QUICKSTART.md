# ⚡ WGCR Club 快速启动指南

欢迎！这是一份5分钟快速入门指南。更详细的文档请查看 `README.md` 和 `SETUP.md`。

---

## 📦 项目包含内容

✅ **已开发完成：**
- 赛博朋克风格网站（动态霓虹效果）
- 成员管理系统（5个成员个人页面）
- 用户认证系统（注册/登录）
- 权限管理系统（普通用户/管理员）
- 内容发布系统（多种内容类型）
- 完整的CSS和JavaScript（无框架依赖）
- 响应式设计（支持手机/平板/桌面）

✅ **文档：**
- README.md - 完整用户手册
- SETUP.md - 详细配置和部署指南
- 本文件 - 快速开始指南

✅ **云存储支持：**
- 阿里云 OSS 集成示例
- 腾讯云 COS 集成示例
- 七牛云集成示例
- 后端 Node.js 示例代码

---

## 🚀 5分钟快速开始

### 1️⃣ 启动本地服务器（选择一个）

```bash
# 方法A: Python 3（最简单）
cd /Users/chenmeng/Desktop/blog
python3 -m http.server 8000

# 方法B: Python 2
python -m SimpleHTTPServer 8000

# 方法C: Node.js
npm install -g http-server
http-server
```

### 2️⃣ 打开浏览器

```
http://localhost:8000
```

### 3️⃣ 测试功能

- 📝 **注册新用户**：点击"注册"按钮
- 🔐 **使用演示账号登录**：
  - 邮箱：`admin@wgcr.club`
  - 密码：`admin123`
  
- 👤 **查看成员页面**：点击成员卡片
- 📤 **发布内容**：登录后进入管理员面板

---

## 🎮 演示账号

| 用途 | 邮箱 | 密码 | 权限 |
|------|------|------|------|
| 管理员 | `admin@wgcr.club` | `admin123` | 可发布内容、管理用户 |
| 普通用户 | `chenmeng@wgcr.club` | `123456` | 可查看内容、评论 |

---

## 🎨 常见的编辑操作

### 修改成员信息

**文件：** `js/main.js`

```javascript
// 约在第25行，可以修改成员数据
const membersData = {
  'chenmeng': {
    name: '陈孟',              // ← 修改名字
    english: 'Chen Meng',       // ← 修改英文名
    role: '项目策划',           // ← 修改角色
    emoji: '🎯',                // ← 修改表情符号
    color: '#00d4ff',           // ← 修改颜色
    description: '...',         // ← 修改描述
    // ...
  }
}
```

### 修改颜色主题

**文件：** `css/style.css`（第 7-17 行）

```css
:root {
  --neon-blue: #00d4ff;      /* 修改霓虹蓝 */
  --neon-purple: #d946ff;    /* 修改霓虹紫 */
  --neon-pink: #ff006e;      /* 修改霓虹粉 */
  /* ... 其他颜色 ... */
}
```

### 修改首页内容

**文件：** `index.html`

- 修改 logo 和副标题：搜索 `.logo-main` 和 `.hero-subtitle`
- 修改关于部分：搜索 `#about` 部分
- 修改成员卡片：搜索 `.members-grid`

### 修改管理员密码

**文件：** `js/auth.js`（约在第 185 行）

```javascript
// 在 getAllUsers() 方法中找到此代码
const defaultUsers = [
  {
    email: 'admin@wgcr.club',
    password: this.hashPassword('admin123'),  // ← 修改密码
    // ...
  }
];
```

---

## 🔧 问题快速排查

### ❌ 打开页面是空白的

**原因：** 未启动 Web 服务器

**解决：** 运行上面提到的启动命令

### ❌ 登录失败

**解决步骤：**
1. 打开浏览器开发者工具（F12）
2. 在 Console 标签页运行：
   ```javascript
   authManager.getAllUsers()
   ```
3. 查看是否有注册用户

### ❌ 样式不显示

**原因：** CSS 文件路径错误

**解决：** 检查路径是否为相对路径（`css/style.css` 而不是 `/css/style.css`）

### ❌ 发布的内容看不到

**原因：** 浏览器缓存

**解决：** 按 Ctrl+Shift+Delete（或 Cmd+Shift+Delete）清除缓存并刷新

---

## 💾 如何使用云存储（可选）

### 最简单的方案：使用不同的云服务商

1. **选择云服务**
   - 推荐：阿里云 OSS（国内最快）
   - 也可选：腾讯云 COS、七牛云

2. **获取配置信息**
   - 登录云服务后台
   - 创建 Bucket
   - 获取 Access Key 和 Secret

3. **在项目中配置**
   ```javascript
   // 编辑 js/main.js
   const storage = new AliyunOSSStorage({
     region: 'oss-cn-hangzhou',
     bucket: 'your-bucket',
     accessKeyId: 'YOUR_KEY',
     accessKeySecret: 'YOUR_SECRET'
   });
   ```

详细步骤见 `README.md` 的"云存储配置"部分。

---

## 📁 项目文件结构速查

```
blog/
├── index.html                    # 主页面 ← 从这里开始
├── pages/
│   ├── member-chenmeng.html     # 成员页面（5个）
│   ├── member-fancheng.html
│   ├── member-hanhuizhu.html
│   ├── member-tangshuyun.html
│   └── member-liyimeng.html
├── admin/
│   ├── admin-panel.html         # 管理员面板
│   └── admin.js                 # 管理员逻辑
├── css/
│   └── style.css                # 所有样式（编辑这里改外观）
├── js/
│   ├── auth.js                  # 用户认证（编辑这里改账号）
│   ├── main.js                  # 主逻辑（编辑这里改成员信息）
│   └── storage-config.js        # 云存储配置示例
├── README.md                     # 📖 完整用户手册
├── SETUP.md                      # 🔧 详细配置指南
└── QUICKSTART.md                # 📋 本文件
```

---

## ✅ 3个快速配置

### 配置1：更改主管理员

```javascript
// 打开 js/auth.js，找到 getAllUsers() 方法
// 修改第一个用户的邮箱和密码
const defaultUsers = [
  {
    email: 'your-email@example.com',  // ← 改这里
    password: this.hashPassword('your-password'),  // ← 改这里
    // ...
  }
];
```

### 配置2：自定义成员

```javascript
// 打开 js/main.js，找到 membersData 对象
const membersData = {
  'yourname': {
    name: '你的名字',
    english: 'Your Name',
    role: '你的角色',
    emoji: '🎯',            // 可以改成任何表情符号
    color: '#00d4ff',
    description: '简短描述',
    // ...
  }
};
```

### 配置3：改网站颜色

```css
/* 打开 css/style.css，修改 :root 中的变量 */
:root {
  --neon-blue: #00d4ff;     /* 改这些颜色 */
  --neon-purple: #d946ff;
  --neon-pink: #ff006e;
  --primary-bg: #0a0e27;
  --text-primary: #ffffff;
  /* ... 更多变量 ... */
}
```

---

## 🚢 部署到线上（5分钟）

### 最简单：GitHub Pages（免费）

```bash
# 1. 在 GitHub 创建仓库 "wgcr-club"

# 2. 本地初始化 Git
git init
git add .
git commit -m "Initial commit"
git branch -M main

# 3. 推送到 GitHub
git remote add origin https://github.com/YOUR_USERNAME/wgcr-club.git
git push -u origin main

# 4. 启用 GitHub Pages
# Settings → Pages → Source 选择 "main" 分支

# 网址：https://YOUR_USERNAME.github.io/wgcr-club/
```

### 快速备选方案

- **Vercel**：`vercel` 命令一键部署
- **Netlify**：拖放文件夹即可部署
- **Cloudflare Pages**：连接 GitHub 自动部署

---

## 🎯 常见需求的解决方案

| 需求 | 如何做 | 文件 |
|------|-------|------|
| 修改网站标题 | 编辑 HTML 中的 `<title>` | index.html 第 4 行 |
| 添加新成员 | 复制成员卡片代码 | index.html 第 70+ 行 |
| 修改成员信息 | 编辑 membersData | js/main.js 第 25+ 行 |
| 改变颜色配色 | 修改 CSS :root 变量 | css/style.css 第 7-17 行 |
| 更改菜单项 | 编辑导航栏 | index.html 第 13+ 行 |
| 禁用用户注册 | 隐藏注册按钮 | index.html 第 18 行 |
| 修改登录验证 | 编辑认证函数 | js/auth.js 第 45+ 行 |

---

## 📞 需要帮助？

### 常见问题

**Q: 如何让朋友们看到网站？**
- 部署到线上（见上面的部署部分）
- 或在本地启动后分享 IP 地址

**Q: 如何添加新功能？**
- 联系开发者
- 或参考 `js/main.js` 学习如何扩展

**Q: 数据会丢失吗？**
- 目前数据存在浏览器，刷新不会丢失
- 建议配置云存储确保数据安全
- 参考 `README.md` 的云存储配置部分

---

## 🎓 学习资源

如果你想自己修改代码：

- 📚 [MDN Web Docs](https://developer.mozilla.org/) - Web 开发标准
- 🎨 [CSS 教程](https://www.w3schools.com/css/) - CSS 学习
- 💻 [JavaScript 教程](https://javascript.info/) - JavaScript 学习
- 🚀 [部署指南](https://vercel.com/docs) - 如何部署网站

---

## ✨ 下一步

1. ✅ 启动本地服务器 - 现在就试试吧！
2. 📝 修改成员信息 - 添加你自己的内容
3. 🎨 自定义颜色和样式 - 让网站独一无二
4. 🚢 部署到线上 - 让全世界看到
5. ☁️ 配置云存储 - 确保数据安全（可选）

---

## 📝 备忘单

### 快速命令

```bash
# 启动本地服务器
python3 -m http.server 8000

# 清除浏览器缓存（在浏览器 Console 中运行）
localStorage.clear()

# 查看所有用户
authManager.getAllUsers()

# 查看当前用户
authManager.currentUser
```

### 重要路径

```
修改样式 → css/style.css
修改成员 → js/main.js (membersData)
修改账号 → js/auth.js (getAllUsers)
修改首页 → index.html
```

---

**祝你使用愉快！有问题就是学习的机会。加油！** 🚀

更多详细信息请查看完整文档：
- 📖 [README.md](README.md) - 功能详解和使用说明
- 🔧 [SETUP.md](SETUP.md) - 配置和部署指南
