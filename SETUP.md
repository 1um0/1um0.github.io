# 🔧 WGCR Club 项目配置和部署指南

本文档详细说明如何配置、开发和部署 WGCR Club 网站。

---

## 📁 项目结构

```
blog/
├── index.html              # 主页
├── css/
│   └── style.css          # 赛博朋克风格CSS
├── js/
│   ├── auth.js            # 用户认证系统
│   ├── main.js            # 主应用逻辑
│   └── storage-config.js  # 存储配置（预留）
├── pages/
│   ├── member-chenmeng.html    # 陈孟个人页
│   ├── member-fancheng.html    # 范诚昊个人页
│   ├── member-hanhuizhu.html   # 韩蕙竹个人页
│   ├── member-tangshuyun.html  # 唐淑毓个人页
│   └── member-liyimeng.html    # 李祎萌个人页
├── admin/
│   ├── admin-panel.html   # 管理员面板
│   └── admin.js          # 管理员逻辑
├── data/
│   └── members-data.json # 成员数据（预留）
├── README.md             # 使用说明
└── SETUP.md             # 本文件
```

---

## 🚀 本地开发环境设置

### 前置要求

- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 文本编辑器（推荐 VS Code）
- 本地 Web 服务器（Python、Node.js 或 VS Code 插件）

### 步骤 1: 获取项目

```bash
# 如果从 Git 克隆
git clone https://github.com/yourname/wgcr-club.git
cd wgcr-club

# 或若已有文件夹
cd /Users/chenmeng/Desktop/blog
```

### 步骤 2: 启动开发服务器

#### 选项 A: 使用 Python

```bash
# Python 3.x（推荐）
python3 -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

#### 选项 B: 使用 Node.js

```bash
# 全局安装 http-server
npm install -g http-server

# 启动服务器
http-server .
```

#### 选项 C: 使用 VS Code Live Server

1. 安装 "Live Server" 扩展（搜索 "ritwickdey.LiveServer"）
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"
4. 浏览器自动打开 `http://localhost:5500`

### 步骤 3: 验证安装

1. 打开浏览器，访问 `http://localhost:8000`（或对应端口）
2. 应该看到 WGCR 主页
3. 尝试点击 "注册" 或 "登录"

---

## 🎨 自定义和编辑指南

### 修改成员信息

编辑 `js/main.js` 中的 `membersData` 对象：

```javascript
const membersData = {
  'chenmeng': {
    name: '陈孟',
    english: 'Chen Meng',
    role: '项目策划',
    emoji: '🎯',
    color: '#00d4ff',
    description: '擅长战略规划...',
    details: '更详细的介绍...',
    interests: ['策略规划', '数据分析', '团队管理'],
    page: 'pages/member-chenmeng.html'
  },
  // ...其他成员
};
```

### 修改颜色主题

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
  --primary-bg: #0a0e27;        /* 主背景色 */
  --neon-blue: #00d4ff;         /* 霓虹蓝 */
  --neon-purple: #d946ff;       /* 霓虹紫 */
  --neon-pink: #ff006e;         /* 霓虹粉 */
  --neon-cyan: #00ffff;         /* 霓虹青 */
  --accent-green: #00ff41;      /* 强调绿 */
  /* ...更多颜色 */
}
```

### 最小化样式编辑

**添加新的 CSS 类：**

```css
.custom-class {
  background: var(--secondary-bg);
  border: 2px solid var(--neon-blue);
  padding: 1rem;
  border-radius: 4px;
}
```

**在 HTML 中使用：**

```html
<div class="custom-class">
  您的内容
</div>
```

### 修改首页内容

编辑 `index.html` 中的对应部分：

- **Logo 和副标题：** 查找 `.logo-main` 和 `.hero-subtitle`
- **成员介绍：** 修改 `.members-grid` 内的卡片
- **关于部分：** 修改 `#about` 部分的文本

---

## 🔐 变更主管理员

如果要更改主管理员账号，编辑 `js/auth.js`：

```javascript
// 在 getAllUsers() 方法中修改默认用户
const defaultUsers = [
  {
    id: 'admin-001',
    email: 'newemail@wgcr.club',  // 修改此处
    username: 'NewAdmin',           // 修改此处
    password: this.hashPassword('newpassword'),  // 修改此处
    role: 'admin',
    createdAt: new Date().toISOString(),
    avatar: '👨‍💼'
  },
  // ...
];
```

---

## 🌐 部署到线上

### 部署选项

#### 选项 1: GitHub Pages（免费，推荐用于演示）

```bash
# 初始化 git 数据库
git init
git add .
git commit -m "Initial commit"
git branch -M main

# 创建 GitHub 仓库
# 访问 https://github.com/new，创建仓库

# 添加远程仓库
git remote add origin https://github.com/yourname/wgcr-club.git
git push -u origin main

# 启用 GitHub Pages
# 进入仓库 Settings → Pages → Source 选择 "main" 分支
```

部署后可通过 `https://yourname.github.io/wgcr-club/` 访问

#### 选项 2: Vercel（免费，推荐用于生产）

```bash
# 全局安装 Vercel CLI
npm install -g vercel

# 部署
vercel

# 按照提示选择参数，完成部署
```

部署后获得免费域名和 HTTPS

#### 选项 3: Netlify（免费）

1. 访问 [Netlify](https://netlify.com)
2. 点击 "Add new site"
3. 选择 "Deploy manually"
4. 拖放项目文件夹
5. 自动部署

#### 选项 4: 传统虚拟主机

```bash
# 使用 FTP 或 SCP 上传文件到服务器
# 假设使用阿里云虚拟主机

# 连接 FTP
ftp ftp.example.com

# 上传文件
put -r .

# 或使用 SCP
scp -r ./* user@host:/home/www/wgcr-club/
```

---

## 📊 配置云存储（可选）

### 快速开始：使用和阿里云 OSS

```javascript
// js/storage-aliyun.js - 新建此文件

const ALI_REGION = 'oss-cn-hangzhou';
const ALI_BUCKET = 'wgcr-club';
const ALI_KEY_ID = 'YOUR_ACCESS_KEY_ID';    // 替换
const ALI_KEY_SECRET = 'YOUR_ACCESS_KEY_SECRET';  // 替换

async function uploadToAliyun(file) {
  // 需要后端签名，或使用临时令牌
  // 这里仅为示意代码
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
}
```

### 后端 API 示例（Node.js）

创建 `server.js`：

```javascript
const express = require('express');
const multer = require('multer');
const OSS = require('ali-oss');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET
});

// 上传接口
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const fileName = `content/${dateStr}/${Date.now()}-${req.file.originalname}`;
    
    const result = await client.put(fileName, req.file.buffer);
    
    res.json({
      success: true,
      url: result.url,
      fileName: fileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

安装依赖：

```bash
npm install express multer ali-oss dotenv
```

---

## 🐛 调试技巧

### 查看浏览器控制台

```javascript
// 在 console 中可以运行
authManager.isLoggedIn()      // 检查登录状态
authManager.currentUser       // 查看当前用户
localStorage.getItem('users') // 查看所有用户
localStorage.getItem('contents') // 查看所有内容
```

### 清除本地数据

```javascript
// 在 console 中运行以清除所有数据
localStorage.clear();

// 或仅清除特定项
localStorage.removeItem('currentUser');
localStorage.removeItem('users');
localStorage.removeItem('contents');
```

### 生成测试数据

在 `js/main.js` 中的 `addSampleContent()` 函数会自动添加示例内容。

---

## 📱 响应式设计测试

在浏览器中按 F12 打开开发者工具，点击设备工具栏查看：

- **Mobile (375px)** - 小屏幕测试
- **Tablet (768px)** - 平板测试
- **Desktop (1200px+)** - 桌面测试

---

## ⚡ 性能优化（生产环境）

### 1. 压缩 CSS 和 JavaScript

```bash
# 使用 minify 工具
npm install -g minify

minify js/auth.js > js/auth.min.js
minify js/main.js > js/main.min.js
minify css/style.css > css/style.min.css
```

### 2. 启用 GZIP 压缩

在 Web 服务器配置中启用 GZIP 压缩。

### 3. 使用 CDN

对于大型部署，使用 CDN 加速静态资源：

```html
<!-- 使用 CDN -->
<link rel="stylesheet" href="https://cdn.example.com/css/style.css">
<script src="https://cdn.example.com/js/auth.js"></script>
```

---

## 🔒 安全建议

### 1. 前端密码处理

⚠️ 当前实现仅为演示。生产环境应该：
- 使用 HTTPS
- 不在客户端存储明文密码
- 使用安全的身份验证库（如 Firebase Auth）

### 2. 环境变量

创建 `.env.local` 文件存储敏感信息：

```env
# .env.local (不要提交到 Git)
REACT_APP_API_KEY=your_api_key
REACT_APP_SECRET=your_secret
```

添加到 `.gitignore`：

```
.env.local
.env.*.local
node_modules/
.DS_Store
```

### 3. CORS 配置

如果使用云存储，配置 CORS：

```bash
# 阿里云 OSS CORS 配置
来源: https://yourdomain.com
允许方法: GET, PUT, POST, DELETE
允许头: *
```

---

## 📚 学习资源

- [MDN Web 文档](https://developer.mozilla.org/)
- [CSS 参考](https://caniuse.com/)
- [JavaScript 教程](https://javascript.info/)
- [Git 教程](https://git-scm.com/book/zh/v2)

---

## 🆘 故障排除

### 问题 1: 404 错误或页面无法加载

**原因：** 可能未启动 Web 服务器
```bash
# 确保从项目目录运行
cd /Users/chenmeng/Desktop/blog
python3 -m http.server 8000
```

### 问题 2: localStorage 数据丢失

**原因：** 浏览器隐私模式或数据被清除
```javascript
// 检查 localStorage 是否可用
if (typeof(localStorage) !== "undefined") {
  console.log("localStorage 可用");
} else {
  console.log("localStorage 不可用");
}
```

### 问题 3: 样式文件无法加载

**原因：** CSS 路径不正确
```html
<!-- 检查路径 -->
<link rel="stylesheet" href="css/style.css">
```

---

## 📝 版本控制

建议使用 Git 管理项目：

```bash
# 初始化
git init

# 创建 .gitignore
echo "node_modules/
.env.local
.DS_Store
dist/" > .gitignore

# 提交
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin https://github.com/yourname/wgcr-club.git
git push -u origin main
```

---

## ✅ 部署清单

在部署到生产环境前，确保：

- [ ] 所有链接都是相对路径
- [ ] 修改了默认管理员密码
- [ ] 配置了云存储（如相关）
- [ ] 测试了所有页面和功能
- [ ] 检查了响应式设计
- [ ] 清除了调试代码和 console.log
- [ ] 启用了自动备份
- [ ] 配置了 HTTPS（生产环境必需）

---

**祝您部署顺利！** 🎉
