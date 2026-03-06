# 🌐 WGCR Club 网站 - 完整使用说明

欢迎使用 WGCR Club 记录网站！这是一个为五个志同道合的伙伴设计的赛博朋克风格社区网站。

## 📋 目录

1. [快速开始](#快速开始)
2. [功能介绍](#功能介绍)
3. [用户管理](#用户管理)
4. [内容管理](#内容管理)
5. [云存储配置](#云存储配置)
6. [常见问题](#常见问题)
7. [技术栈](#技术栈)

---

## 🚀 快速开始

### 本地运行

1. **下载/克隆项目**
   ```bash
   # 如果已有项目文件夹，跳过此步
   cd /Users/chenmeng/Desktop/blog
   ```

2. **启动本地服务器**
   
   由于涉及到本地存储，您需要在 Web 服务器上运行此项目（不能直接打开HTML文件）。

   **方式1：使用Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **方式2：使用Node.js (http-server)**
   ```bash
   npm install -g http-server
   http-server
   ```

   **方式3：使用VS Code Live Server**
   - 安装"Live Server"扩展
   - 右键点击index.html，选择"Open with Live Server"

3. **访问网站**
   ```
   http://localhost:8000
   ```

---

## 📱 功能介绍

### 1. 主页和成员介绍
- **WGCR Logo** - 动态霓虹效果
- **成员卡片** - 5个成员简介
- **内容展示区** - 发布和浏览内容

### 2. 成员子页面
- 每个成员都有独立的个人页面
- 展示个人简介、专长和相关内容
- 可从主页点击成员卡片访问

### 3. 内容管理体系
- 发布公告、项目、分享、动态等多种内容类型
- 内容过滤和搜索功能
- 评论功能（已预留）

### 4. 用户认证系统
- **用户注册和登录**
  - 使用邮箱和密码
  - 前端验证，后端应在生产环境中实现

### 5. 权限管理系统
- **普通用户** - 可查看内容、评论
- **管理员** - 可上传内容、管理用户和权限

---

## 👥 用户管理

### 默认账号

系统预置了以下默认账号用于演示：

| 邮箱 | 密码 | 角色 | 用途 |
|-----|------|------|------|
| `admin@wgcr.club` | `admin123` | 管理员 | 主管理员，可以添加其他管理员 |
| `chenmeng@wgcr.club` | `123456` | 普通用户 | 普通用户示例 |

### 注册新用户

1. 点击首页的 "注册" 按钮
2. 输入邮箱、用户名、密码（至少6个字符）
3. 确认密码
4. 完成注册后自动登录

### 升级管理员

1. 使用管理员账号登录
2. 点击导航栏的 "⚙️ 管理员面板"
3. 选择 "添加管理员" 标签页
4. 输入要升级的用户邮箱
5. 点击"升级为管理员"按钮

### 用户管理

在管理员面板的"用户管理"标签页中，可以：
- 查看所有注册用户
- 升级或降级用户角色
- 删除用户账号（谨慎操作）

---

## 📝 内容管理

### 发布内容

1. 登录管理员账号
2. 进入管理员面板
3. 选择 "发布内容" 标签页
4. 填写内容信息：
   - **标题** - 内容的标题
   - **描述** - 内容的主要文字
   - **内容类型** - 选择公告/项目/分享/动态
5. 点击 "发布内容" 按钮

### 内容类型

- 🎯 **公告** - 重要通知和官方信息
- 📁 **项目** - 展示团队项目和成果
- 🔗 **分享** - 分享有趣的链接和资源
- 📰 **动态** - 日常动态和随笔

### 编辑和删除内容

在"内容管理"标签页中，可以：
- 查看所有已发布的内容
- 删除不需要的内容

### 添加图片

目前系统使用本地存储。如需添加云存储支持（推荐），请参考[云存储配置](#云存储配置)部分。

---

## ☁️ 云存储配置

### 为什么需要云存储？

虽然当前系统使用浏览器本地存储（localStorage），但在生产环境中，建议使用云存储服务：

✅ **优点**：
- 数据更加安全可靠
- 支持大文件上传
- 较快的访问速度（特别是使用国内服务）
- 自动备份和容灾
- 成本低廉（大多数服务超过免费额度才收费）

### 推荐的云存储方案（中国地区）

#### 1. 阿里云 OSS（推荐 ⭐⭐⭐⭐⭐）

**优点：** 国内一线厂商，速度快，文档齐全，价格便宜

**配置步骤：**

1. **注册和开通**
   - 访问 [阿里云OSS](https://www.aliyun.com/product/oss)
   - 注册账号，完成实名认证
   - 开通OSS服务

2. **创建Bucket**
   ```
   Bucket名称: wgcr-club
   地域: 选择离用户最近的地域（如华东1 - 杭州）
   存储类型: 标准存储
   ```

3. **创建RAM账号**（安全建议）
   - 进入 RAM 访问控制
   - 创建新的子账号
   - 仅赋予 OSS 访问权限
   - 获取 AccessKeyID 和 AccessKeySecret

4. **配置跨域访问CORS**
   ```
   Bucket -> 权限管理 -> 跨域设置
   来源: * (或替换为你的域名)
   允许的方法: GET, PUT, POST, DELETE
   ```

5. **在前端代码中集成**
   ```javascript
   // 创建 js/storage-aliyun.js
   class AliyunOSSStorage {
     constructor(region, bucket, accessKeyId, accessKeySecret) {
       this.region = region;
       this.bucket = bucket;
       this.accessKeyId = accessKeyId;
       this.accessKeySecret = accessKeySecret;
     }

     // 上传文件方法
     uploadFile(file) {
       // 使用阿里云 OSS SDK
       // npm install ali-oss
       const OSS = require('ali-oss');
       const client = new OSS({
         region: this.region,
         accessKeyId: this.accessKeyId,
         accessKeySecret: this.accessKeySecret,
         bucket: this.bucket
       });
       
       return client.put(`images/${Date.now()}-${file.name}`, file);
     }
   }
   ```

6. **参考文档**
   - [阿里云OSS文档](https://help.aliyun.com/document_detail/31883.html)
   - [OSS JavaScript SDK](https://help.aliyun.com/document_detail/32068.html)

---

#### 2. 腾讯云 COS

**优点：** 集成腾讯云生态，功能完整，性能稳定

**基本配置：**

1. 访问 [腾讯云COS](https://cloud.tencent.com/product/cos)
2. 创建存储桶 (Bucket)
3. 获取 APPID, SecretId, SecretKey
4. 使用腾讯云 COS SDK

```javascript
// 使用 COS SDK
const cos = new COS({
  SecretId: 'YOUR_SECRET_ID',
  SecretKey: 'YOUR_SECRET_KEY'
});

// 上传文件
cos.putObject({
  Bucket: 'your-bucket',
  Region: 'ap-beijing',
  Key: 'image.jpg',
  Body: file
});
```

**参考文档：** [腾讯云COS](https://cloud.tencent.com/document/product/cos/6046)

---

#### 3. 七牛云

**优点：** 免费额度大，新手友好，文档详细

**基本配置：**

1. 访问 [七牛云](https://www.qiniu.com/)
2. 注册账号，创建存储空间
3. 获取 Access Key 和 Secret Key
4. 使用七牛云 SDK 或 API

```javascript
// 使用七牛云 SDK
const qiniu = require('qiniu');

const auth = new qiniu.auth.digest.Auth(accessKey, secretKey);
const putExtra = new qiniu.form_up.PutExtra();

// 上传文件
qiniu.form_up.putFile(uptoken, key, file, putExtra, (respErr, respBody, respInfo) => {
  // 处理上传结果
});
```

**参考文档：** [七牛云文档](https://developer.qiniu.com/)

---

### 后端服务实现（Node.js例子）

为了更安全地处理云存储，建议创建后端API服务：

```javascript
// server.js - Express 服务器示例
const express = require('express');
const multer = require('multer');
const OSS = require('ali-oss');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET
});

// 上传文件接口
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const fileName = `content/${Date.now()}-${req.file.originalname}`;
    const result = await client.put(fileName, req.file.buffer);
    
    res.json({
      success: true,
      url: result.url
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

### 环境变量配置

创建 `.env` 文件来存储敏感信息：

```env
# .env
OSS_REGION=oss-cn-hangzhou
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET=wgcr-club

# 数据库（如果需要）
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=wgcr_club
```

---

## ❓ 常见问题

### Q1: 注册后如何管理其他管理员？

A: 只有当前的管理员可以升级其他用户为管理员。在管理员面板 → 添加管理员中，输入要升级的用户邮箱即可。

### Q2: 数据存储在哪里？

A: 
- 当前版本：用户数据和内容存储在浏览器的 localStorage 中（仅当前浏览器可用）
- 推荐：使用云存储服务存储文件和内容数据

### Q3: 网站可以部署到线上吗？

A: 可以。您可以：
- 将文件上传到任何支持HTML/CSS/JavaScript的虚拟主机
- 部署到 GitHub Pages（静态网站）
- 部署到 Vercel、Netlify 等免费平台
- 部署到自己的服务器

### Q4: 如何备份数据？

A: 
- localStorage 中的数据可以通过浏览器开发者工具导出
- 建议定期导出和备份
- 使用云存储可以自动备份

### Q5: 与 Firebase 相比，为什么不用 Firebase？

A: 
- 在中国地区，Google 服务速度较慢或不可用
- 阿里云、腾讯云等国内服务速度更快
- 成本更低
- 数据隐私更有保障

---

## 🛠 技术栈

### 前端
- **HTML5** - 网页结构
- **CSS3** - 赛博朋克风格设计
  - 动态霓虫效果
  - 响应式设计
  - 现代布局（Flexbox, Grid）
- **JavaScript (Vanilla)** - 交互逻辑
  - 无框架依赖
  - LocalStorage API
  - 事件处理
  - 异步操作

### 存储
- **浏览器 LocalStorage** - 默认存储
- **阿里云 OSS** - 推荐（文件存储）
- **腾讯云 COS** - 备选（文件存储）
- **七牛云** - 备选（文件存储）

### 后端（可选）
- **Node.js + Express** - API 服务器
- **数据库** - MySQL / PostgreSQL / MongoDB（实际部署时）

---

## 📞 技术支持

遇到问题？检查以下内容：

1. **浏览器兼容性** - 建议使用最新版 Chrome、Firefox、Safari
2. **JavaScript 控制台** - 按 F12 查看错误信息
3. **网络问题** - 检查网络连接和防火墙设置
4. **缓存清除** - 尝试清除浏览器缓存和 localStorage

---

## 📄 许可证

此项目仅供个人和小团队使用。

---

**祝您使用愉快！如有任何问题，请随时反馈。** 🎉
