/* ==================== 云存储配置 - 集成指南 ==================== */

/**
 * 本文件提供了多种云存储服务的集成示例
 * 
 * 支持的服务：
 * 1. 阿里云 OSS
 * 2. 腾讯云 COS
 * 3. 七牛云
 * 4. AWS S3（参考）
 * 
 * 选择适合您的服务并按照说明集成
 */

// ==================== 配置 1: 阿里云 OSS ====================

class AliyunOSSStorage {
  constructor(config) {
    this.region = config.region;           // 如: 'oss-cn-hangzhou'
    this.bucket = config.bucket;           // 如: 'wgcr-club'
    this.accessKeyId = config.accessKeyId;
    this.accessKeySecret = config.accessKeySecret;
    this.apiEndpoint = `https://${this.bucket}.${this.region}.aliyuncs.com`;
  }

  /**
   * 上传文件（需要后端签名）
   * @param {File} file - 要上传的文件
   * @param {string} path - 文件路径，如 'images/2024-01-01/'
   * @returns {Promise<string>} - 文件 URL
   */
  async uploadFile(file, path = 'content/') {
    try {
      // 第一步：向后端请求签名
      const signResponse = await fetch('/api/aliyun/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: `${path}${Date.now()}-${file.name}`,
          fileSize: file.size
        })
      });

      const { policy, signature, callback } = await signResponse.json();

      // 第二步：上传文件到阿里云
      const formData = new FormData();
      formData.append('key', `${path}${Date.now()}-${file.name}`);
      formData.append('policy', policy);
      formData.append('signature', signature);
      formData.append('file', file);

      const uploadResponse = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData
      });

      if (uploadResponse.ok) {
        return `${this.apiEndpoint}/${path}${Date.now()}-${file.name}`;
      } else {
        throw new Error('阿里云 OSS 上传失败');
      }
    } catch (error) {
      console.error('Aliyun OSS upload error:', error);
      throw error;
    }
  }

  /**
   * 删除文件
   * @param {string} fileKey - 文件的完整路径
   */
  async deleteFile(fileKey) {
    // 需要后端实现
    const response = await fetch('/api/aliyun/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: fileKey })
    });
    return response.json();
  }
}

// ==================== 配置 2: 腾讯云 COS ====================

class TencentCOSStorage {
  constructor(config) {
    this.bucket = config.bucket;           // 如: 'wgcr-club-1234567890'
    this.region = config.region;           // 如: 'ap-beijing'
    this.secretId = config.secretId;
    this.secretKey = config.secretKey;
    this.appId = config.appId;
    this.endpoint = `https://${this.bucket}.cos.${this.region}.myqcloud.com`;
  }

  /**
   * 上传文件
   * @param {File} file - 文件对象
   * @param {string} path - 文件路径
   * @returns {Promise<string>} - 文件 URL
   */
  async uploadFile(file, path = 'content/') {
    try {
      // 腾讯云建议使用官方 SDK
      // npm install cos-js-sdk-v5

      const Key = `${path}${Date.now()}-${file.name}`;

      // 需要后端生成临时密钥
      const credResponse = await fetch('/api/tencent/credentials', {
        method: 'GET'
      });

      const credentials = await credResponse.json();

      // 使用 SDK 上传
      // const cos = new COS({
      //   getAuthorization: function() {
      //     return credentials;
      //   }
      // });

      // 实际上传应在后端进行
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: this.createFormData(file, Key)
      });

      const result = await uploadResponse.json();
      return result.url;
    } catch (error) {
      console.error('Tencent COS upload error:', error);
      throw error;
    }
  }

  createFormData(file, key) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    return formData;
  }
}

// ==================== 配置 3: 七牛云 ====================

class QiniuStorage {
  constructor(config) {
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
    this.bucket = config.bucket;           // 如: 'wgcr-club'
    this.domain = config.domain;           // 如: 'https://cdn.wgcr.club'
    this.uploadUrl = 'https://upload.qiniup.com';
  }

  /**
   * 上传文件
   * @param {File} file - 文件对象
   * @param {string} path - 文件路径
   * @returns {Promise<string>} - 文件 URL
   */
  async uploadFile(file, path = 'content/') {
    try {
      // 第一步：向后端请求 Token
      const tokenResponse = await fetch('/api/qiniu/token', {
        method: 'GET'
      });

      const { uploadToken } = await tokenResponse.json();

      // 第二步：上传文件
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', uploadToken);
      formData.append('key', `${path}${Date.now()}-${file.name}`);

      const uploadResponse = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData
      });

      const result = await uploadResponse.json();

      if (result.key) {
        return `${this.domain}/${result.key}`;
      } else {
        throw new Error('七牛云上传失败');
      }
    } catch (error) {
      console.error('Qiniu upload error:', error);
      throw error;
    }
  }
}

// ==================== 后端 API 示例 (Node.js + Express) ====================

/**
 * 以下是后端实现的示例代码
 * 需要运行在 Node.js 环境中
 * 
 * 使用方法：
 * 1. npm install express multer ali-oss tencentcloud-sdk-nodejs qiniu dotenv
 * 2. 创建 server.js 文件，复制以下代码
 * 3. 设置环境变量 (.env 文件)
 * 4. 运行 node server.js
 */

/*
// server.js 示例

const express = require('express');
const multer = require('multer');
const OSS = require('ali-oss');
const qiniu = require('qiniu');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// ===== 阿里云 OSS =====
const ossClient = new OSS({
  region: process.env.ALIYUN_OSS_REGION,
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
  bucket: process.env.ALIYUN_BUCKET
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const fileName = `content/${Date.now()}-${req.file.originalname}`;
    const result = await ossClient.put(fileName, req.file.buffer);
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

// ===== 七牛云 =====
const qiniuAuth = new qiniu.auth.Auth(
  process.env.QINIU_ACCESS_KEY,
  process.env.QINIU_SECRET_KEY
);

app.get('/api/qiniu/token', (req, res) => {
  const options = {
    scope: process.env.QINIU_BUCKET
  };
  const uploadToken = qiniuAuth.getUploadToken(options);
  res.json({ uploadToken });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

// ==================== 文件上传处理函数 ====================

/**
 * 统一的文件上传处理函数
 * 支持切换不同的云存储服务
 */
class FileManager {
  constructor(storageProvider) {
    this.storage = storageProvider;
  }

  /**
   * 上传文件
   * @param {File} file - 文件对象
   * @param {string} folder - 文件夹，如 'images', 'documents'
   */
  async upload(file, folder = 'general') {
    try {
      // 验证文件
      const validation = this.validateFile(file);
      if (!validation.success) {
        throw new Error(validation.error);
      }

      // 获取文件 MIME 类型
      const mimeType = file.type;
      const extension = this.getFileExtension(file.name);

      // 构建路径
      const datePath = this.getDatePath();
      const path = `${folder}/${datePath}/`;

      // 上传
      const url = await this.storage.uploadFile(file, path);

      return {
        success: true,
        url: url,
        fileName: file.name,
        size: file.size,
        mimeType: mimeType,
        uploadTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取日期路径
   * 返回格式: 2024/01/15/
   */
  getDatePath() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  /**
   * 获取文件扩展名
   */
  getFileExtension(fileName) {
    return fileName.split('.').pop().toLowerCase();
  }

  /**
   * 验证文件
   */
  validateFile(file) {
    // 检查文件大小（限制 20MB）
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: `文件过大，限制 ${maxSize / 1024 / 1024}MB`
      };
    }

    // 检查文件类型
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: '不支持的文件类型'
      };
    }

    return { success: true };
  }
}

// ==================== 使用示例 ====================

/**
 * 在你的应用中使用：
 * 
 * // 1. 初始化存储提供者（选择一个）
 * const aliyunStorage = new AliyunOSSStorage({
 *   region: 'oss-cn-hangzhou',
 *   bucket: 'wgcr-club',
 *   accessKeyId: 'your_access_key_id',
 *   accessKeySecret: 'your_access_key_secret'
 * });
 *
 * // 2. 创建文件管理器
 * const fileManager = new FileManager(aliyunStorage);
 *
 * // 3. 处理表单提交
 * function handleFileUpload(event) {
 *   const file = event.target.files[0];
 *   fileManager.upload(file, 'images').then(result => {
 *     if (result.success) {
 *       console.log('上传成功:', result.url);
 *       // 保存 URL 到内容
 *     } else {
 *       console.error('上传失败:', result.error);
 *     }
 *   });
 * }
 */

// ==================== 存储服务选择建议 ====================

/*
1. 阿里云 OSS
   优点：
   - 国内一线厂商
   - 速度快
   - 价格便宜
   - 文档完整
   缺点：
   - 需要注册和认证
   
   推荐指数：⭐⭐⭐⭐⭐

2. 腾讯云 COS
   优点：
   - 功能完整
   - 集成其他腾讯云服务方便
   缺点：
   - 价格略高
   
   推荐指数：⭐⭐⭐⭐

3. 七牛云
   优点：
   - 免费额度大
   - 新手友好
   缺点：
   - 免费流量有限
   
   推荐指数：⭐⭐⭐

4. 仅使用 LocalStorage
   优点：
   - 无需配置
   - 适合小规模使用
   缺点：
   - 容量有限（5-10MB）
   - 数据不安全
   
   推荐指数：⭐（仅用于演示）
*/

// 导出存储类供使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AliyunOSSStorage,
    TencentCOSStorage,
    QiniuStorage,
    FileManager
  };
}
