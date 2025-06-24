## 项目概述

这是一个基于 Node.js + Express + MySQL 的用户管理系统后端 API，提供用户注册和登录功能。

## 技术栈

- **运行环境**: Node.js
- **Web框架**: Express.js
- **数据库**: MySQL
- **密码加密**: bcryptjs
- **跨域处理**: CORS

## 环境要求

- Node.js >= 14.x
- MySQL >= 5.7
- npm >= 6.x

## 项目启动

1. 安装依赖
```bash
npm install
```

2. 启动服务
```bash
npm start
# 或使用 nodemon 开发模式
npm run dev
```

3. 服务地址
```
http://127.0.0.1:8080
```

## 数据库配置

### 数据表结构

```sql
CREATE TABLE ev_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API 接口文档

### 基础信息

- **Base URL**: `http://127.0.0.1:8080/api`
- **Content-Type**: `application/x-www-form-urlencoded`
- **响应格式**: JSON

### 接口列表

#### 1. 用户注册

**接口地址**: `POST /api/register`

**请求参数**:

| 参数名   | 类型   | 必填 | 说明   |
| -------- | ------ | ---- | ------ |
| username | string | 是   | 用户名 |
| password | string | 是   | 密码   |

**请求示例**:
```javascript
fetch('http://127.0.0.1:8080/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'username=testuser&password=123456'
})
```

**响应示例**:

✅ **成功响应** (200):
```json
{
  "status": 200,
  "message": "用户注册成功",
  "user": {
    "username": "testuser"
  }
}
```

❌ **失败响应**:

- 参数验证失败 (400):
```json
{
  "status": 400,
  "message": "用户名和密码不能为空"
}
```

- 用户名已存在 (400):
```json
{
  "status": 400,
  "message": "用户名已存在"
}
```

- 服务器错误 (500):
```json
{
  "status": 500,
  "message": "注册失败，请稍后再试"
}
```

#### 2. 用户登录

**接口地址**: `POST /api/login`

**请求参数**:

| 参数名   | 类型   | 必填 | 说明   |
| -------- | ------ | ---- | ------ |
| username | string | 是   | 用户名 |
| password | string | 是   | 密码   |

**请求示例**:
```javascript
fetch('http://127.0.0.1:8080/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'username=testuser&password=123456'
})
```

**响应示例**:

✅ **成功响应** (200):
```json
{
  "status": 200,
  "message": "用户登录成功",
  "user": {
    "username": "testuser"
  }
}
```

❌ **失败响应** (400):
```json
{
  "status": 400,
  "message": "用户名或密码错误"
}
```

## 前端集成指南

### JavaScript Fetch 示例

```javascript
// 用户注册
async function register(username, password) {
  try {
    const response = await fetch('http://127.0.0.1:8080/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    });
    
    const data = await response.json();
    
    if (data.status === 200) {
      console.log('注册成功:', data.user);
      return { success: true, data: data.user };
    } else {
      console.error('注册失败:', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('网络错误:', error);
    return { success: false, message: '网络连接失败' };
  }
}

// 用户登录
async function login(username, password) {
  try {
    const response = await fetch('http://127.0.0.1:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    });
    
    const data = await response.json();
    
    if (data.status === 200) {
      console.log('登录成功:', data.user);
      // 保存用户信息到本地存储
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, data: data.user };
    } else {
      console.error('登录失败:', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('网络错误:', error);
    return { success: false, message: '网络连接失败' };
  }
}
```

### jQuery 示例

```javascript
// 用户注册
function register(username, password) {
  $.ajax({
    url: 'http://127.0.0.1:8080/api/register',
    type: 'POST',
    data: {
      username: username,
      password: password
    },
    success: function(data) {
      if (data.status === 200) {
        alert('注册成功!');
      } else {
        alert('注册失败: ' + data.message);
      }
    },
    error: function() {
      alert('网络连接失败');
    }
  });
}

// 用户登录
function login(username, password) {
  $.ajax({
    url: 'http://127.0.0.1:8080/api/login',
    type: 'POST',
    data: {
      username: username,
      password: password
    },
    success: function(data) {
      if (data.status === 200) {
        alert('登录成功!');
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        alert('登录失败: ' + data.message);
      }
    },
    error: function() {
      alert('网络连接失败');
    }
  });
}
```

## 测试工具

### cURL 测试命令

```bash
# 用户注册测试
curl -X POST http://127.0.0.1:8080/api/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=123456"

# 用户登录测试
curl -X POST http://127.0.0.1:8080/api/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=123456"
```

### Postman 配置

1. **Method**: POST
2. **URL**: `http://127.0.0.1:8080/api/register` 或 `http://127.0.0.1:8080/api/login`
3. **Headers**: 
   - Key: `Content-Type`
   - Value: `application/x-www-form-urlencoded`
4. **Body**: 选择 `x-www-form-urlencoded`
   - `username`: 用户名
   - `password`: 密码

## 错误码说明

| 状态码 | 说明           |
| ------ | -------------- |
| 200    | 请求成功       |
| 400    | 请求参数错误   |
| 500    | 服务器内部错误 |

## 安全特性

- ✅ 密码使用 bcrypt 加密存储
- ✅ 用户名唯一性验证
- ✅ 输入参数验证
- ✅ SQL 注入防护
- ✅ CORS 跨域支持

## 注意事项

1. **数据格式**: 请求必须使用 `application/x-www-form-urlencoded` 格式
2. **字符编码**: 建议使用 `encodeURIComponent` 对参数进行编码
3. **错误处理**: 前端需要根据 `status` 字段判断请求结果
4. **用户状态**: 登录成功后建议将用户信息保存到 localStorage 或 sessionStorage
5. **密码要求**: 目前没有密码强度限制，建议前端添加相应验证

## 联系方式

如有问题请联系后端开发团队。

---

**版本**: v1.0.0  
**更新时间**: 2025年6月24日