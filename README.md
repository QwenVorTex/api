# 用户管理系统 API 文档

## 项目概述

这是一个基于 Node.js + Express + MySQL 的用户管理系统后端 API，提供用户注册、登录和用户信息管理功能，支持 JWT 身份验证。

## 技术栈

- **运行环境**: Node.js
- **Web 框架**: Express.js v5.1.0
- **数据库**: MySQL
- **密码加密**: bcryptjs
- **身份验证**: JWT (jsonwebtoken + express-jwt)
- **参数验证**: Joi (@hapi/joi + @escook/express-joi)
- **跨域处理**: CORS

## 环境要求

- Node.js >= 14.x
- MySQL >= 5.7
- npm >= 6.x

## 项目结构

```
api/
├── app.js              # 主应用入口文件
├── config.js           # JWT 配置文件
├── package.json        # 项目依赖配置
├── README.md          # 项目文档
├── database/
│   └── index.js       # 数据库连接配置
├── router/
│   ├── user.js        # 用户基础路由（注册/登录）
│   └── userInfo.js    # 用户信息路由（需要JWT验证）
├── router-handler/
│   └── user.js        # 用户业务逻辑处理
└── schema/
    └── user.js        # 用户数据验证规则
```

## 项目启动

1. **安装依赖**

```bash
npm install
```

2. **配置数据库**

   - 确保 MySQL 服务已启动
   - 修改 `database/index.js` 中的数据库连接信息
   - 创建数据库和数据表（见下方 SQL）

3. **启动服务**

```bash
node app.js
# 或使用 nodemon 开发模式
nodemon app.js
```

4. **服务地址**

```
http://127.0.0.1:8080
```

## 数据库配置

### 数据库连接

修改 `database/index.js` 中的连接信息：

```javascript
const database = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "your_password", // 修改为你的密码
  database: "my_db_01",
});
```

### 数据表结构

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS my_db_01;
USE my_db_01;

-- 创建用户表
CREATE TABLE IF NOT EXISTS ev_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API 接口文档

### 基础信息

- **Base URL**: `http://127.0.0.1:8080`
- **Content-Type**: `application/x-www-form-urlencoded`
- **响应格式**: JSON

### 接口分类

#### 🔓 公开接口（无需认证）

- `/api/register` - 用户注册
- `/api/login` - 用户登录

#### 🔒 受保护接口（需要 JWT 认证）

- `/my/userInfo` - 获取用户信息

---

### 1. 用户注册

**接口地址**: `POST /api/register`

**请求参数**:
| 参数名 | 类型 | 必填 | 验证规则 | 说明 |
|----------|--------|------|----------|--------|
| username | string | 是 | 1-15 位字母数字 | 用户名 |
| password | string | 是 | 6-20 位非空白字符 | 密码 |

**请求示例**:

```javascript
fetch("http://127.0.0.1:8080/api/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "username=testuser&password=123456",
});
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
  "message": "\"username\" must be alphanumeric"
}
```

- 用户名已存在 (400):

```json
{
  "status": 400,
  "message": "用户名已存在"
}
```

---

### 2. 用户登录

**接口地址**: `POST /api/login`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|----------|--------|------|--------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**请求示例**:

```javascript
fetch("http://127.0.0.1:8080/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "username=testuser&password=123456",
});
```

**响应示例**:

✅ **成功响应** (200):

```json
{
  "status": 200,
  "message": "用户登录成功",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "testuser"
  }
}
```

❌ **失败响应**:

- 用户不存在 (404):

```json
{
  "status": 404,
  "message": "用户不存在"
}
```

- 密码错误 (400):

```json
{
  "status": 400,
  "message": "用户名或密码错误"
}
```

---

### 3. 获取用户信息

**接口地址**: `GET /my/userInfo`

**认证方式**: Bearer Token

**请求示例**:

```javascript
const token = localStorage.getItem("token"); // 从登录接口获取的token

fetch("http://127.0.0.1:8080/my/userInfo", {
  method: "GET",
  headers: {
    Authorization: token, // 包含 "Bearer " 前缀
  },
});
```

**响应示例**:

✅ **成功响应** (200):

```json
{
  "status": 200,
  "message": "获取用户信息成功",
  "data": {
    "username": "testuser",
    "email": "未设置邮箱"
  }
}
```

❌ **失败响应**:

- 未提供 token (401):

```json
{
  "status": 401,
  "message": "身份认证失败"
}
```

- token 无效 (401):

```json
{
  "status": 401,
  "message": "用户未登录或token无效"
}
```

## 前端集成指南

### 完整的前端交互流程

```javascript
class UserAPI {
  constructor(baseURL = "http://127.0.0.1:8080") {
    this.baseURL = baseURL;
  }

  // 用户注册
  async register(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { status: 500, message: "网络连接失败" };
    }
  }

  // 用户登录
  async login(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
      });

      const data = await response.json();

      // 保存token到本地存储
      if (data.status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return { status: 500, message: "网络连接失败" };
    }
  }

  // 获取用户信息
  async getUserInfo() {
    const token = localStorage.getItem("token");
    if (!token) {
      return { status: 401, message: "请先登录" };
    }

    try {
      const response = await fetch(`${this.baseURL}/my/userInfo`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { status: 500, message: "网络连接失败" };
    }
  }

  // 登出
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // 检查登录状态
  isLoggedIn() {
    return !!localStorage.getItem("token");
  }
}

// 使用示例
const userAPI = new UserAPI();

// 注册
userAPI.register("testuser", "123456").then((result) => {
  if (result.status === 200) {
    console.log("注册成功");
  } else {
    console.error("注册失败:", result.message);
  }
});

// 登录
userAPI
  .login("testuser", "123456")
  .then((result) => {
    if (result.status === 200) {
      console.log("登录成功");
      // 获取用户信息
      return userAPI.getUserInfo();
    }
  })
  .then((userInfo) => {
    if (userInfo && userInfo.status === 200) {
      console.log("用户信息:", userInfo.data);
    }
  });
```

## JWT 认证说明

### Token 格式

- **类型**: Bearer Token
- **有效期**: 12 小时
- **格式**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 使用方式

1. 登录成功后，服务器返回带有 `Bearer ` 前缀的 token
2. 前端保存完整的 token（包括 `Bearer ` 前缀）
3. 访问受保护的接口时，在请求头中添加：
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Token 包含信息

- 用户 ID
- 用户名
- 其他用户基本信息（不包含密码）

## 测试工具

### cURL 测试命令

```bash
# 1. 用户注册
curl -X POST http://127.0.0.1:8080/api/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=123456"

# 2. 用户登录
curl -X POST http://127.0.0.1:8080/api/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=123456"

# 3. 获取用户信息（替换 YOUR_TOKEN 为实际token）
curl -X GET http://127.0.0.1:8080/my/userInfo \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Postman 测试集合

#### 1. 注册/登录接口

- **Method**: POST
- **URL**: `http://127.0.0.1:8080/api/register` 或 `/api/login`
- **Headers**:
  - `Content-Type: application/x-www-form-urlencoded`
- **Body**: 选择 `x-www-form-urlencoded`
  - `username`: 用户名
  - `password`: 密码

#### 2. 用户信息接口

- **Method**: GET
- **URL**: `http://127.0.0.1:8080/my/userInfo`
- **Headers**:
  - `Authorization: Bearer {{token}}`

## 参数验证规则

### 用户名 (username)

- **类型**: 字符串
- **规则**: 只能包含字母和数字
- **长度**: 1-15 个字符
- **必填**: 是

### 密码 (password)

- **类型**: 字符串
- **规则**: 6-20 位非空白字符
- **格式**: `/^[\S]{6,20}$/`
- **必填**: 是

## 错误码说明

| 状态码 | 说明           | 常见场景               |
| ------ | -------------- | ---------------------- |
| 200    | 请求成功       | 操作成功完成           |
| 400    | 请求参数错误   | 参数验证失败、密码错误 |
| 401    | 身份认证失败   | token 无效、未登录     |
| 404    | 资源不存在     | 用户不存在             |
| 500    | 服务器内部错误 | 数据库错误、系统异常   |

## 安全特性

- ✅ 密码使用 bcrypt 加密存储（salt rounds: 10）
- ✅ JWT Token 身份验证（12 小时有效期）
- ✅ 用户名唯一性验证
- ✅ Joi 参数验证防止注入攻击
- ✅ SQL 参数化查询防止 SQL 注入
- ✅ CORS 跨域支持
- ✅ 敏感信息过滤（密码不会在响应中返回）

## 开发说明

### 中间件说明

1. **请求日志中间件**: 记录所有请求的方法、路径和请求体
2. **CORS 中间件**: 处理跨域请求
3. **Body 解析中间件**: 解析 URL-encoded 格式的请求体
4. **Joi 验证中间件**: 验证请求参数格式
5. **JWT 认证中间件**: 验证受保护路由的访问权限
6. **错误处理中间件**: 统一处理应用中的错误

### 路由结构

- `/api/*` - 公开接口，无需认证
- `/my/*` - 受保护接口，需要 JWT 认证

## 注意事项

1. **数据格式**: 所有 POST 请求必须使用 `application/x-www-form-urlencoded` 格式
2. **字符编码**: 建议使用 `encodeURIComponent` 对参数进行编码
3. **Token 管理**:
   - 登录成功后保存完整 token（包含 Bearer 前缀）
   - Token 过期后需要重新登录
   - 登出时清除本地存储的 token
4. **错误处理**: 前端需要根据 `status` 字段判断请求结果
5. **密码安全**:
   - 前端应添加密码强度验证
   - 不要在控制台或日志中输出明文密码
6. **数据库**: 确保 MySQL 服务运行并且连接配置正确

## 开发环境配置

### 开发依赖版本

```json
{
  "@escook/express-joi": "^1.0.0",
  "@hapi/joi": "^17.1.0",
  "bcryptjs": "^3.0.2",
  "cors": "^2.8.5",
  "express": "^5.1.0",
  "express-jwt": "^8.5.1",
  "jsonwebtoken": "^9.0.2",
  "mysql": "^2.18.1"
}
```

### JWT 配置

```javascript
// config.js
exports.jwtSecret = "ccnuIotApp";
exports.jwtExpire = "12h";
```

## 故障排除

### 常见问题

1. **服务器启动失败**

   - 检查端口 8080 是否被占用
   - 确认所有依赖已正确安装

2. **数据库连接失败**

   - 确认 MySQL 服务已启动
   - 检查数据库连接配置
   - 确认数据库和表已创建

3. **JWT 验证失败**

   - 检查 token 格式是否包含"Bearer "前缀
   - 确认 token 未过期
   - 检查 JWT 密钥配置

4. **参数验证失败**
   - 检查用户名是否只包含字母数字
   - 确认密码长度在 6-20 位之间
   - 验证请求 Content-Type 正确

## 联系方式

如有问题请联系后端开发团队。

---

**版本**: v1.0.0  
**最后更新**: 2025 年 6 月 25 日  
**维护者**: 后端开发团队
