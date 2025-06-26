# 用户管理系统 API 文档

## 项目概述

这是一个基于 Node.js + Express + MySQL 的用户管理系统后端 API，专为 HarmonyOS ArkTS 应用提供用户注册、登录和用户信息管理功能。采用账号密码验证机制，无需 Token 管理。

## 技术栈

- **运行环境**: Node.js
- **Web 框架**: Express.js v5.1.0
- **数据库**: MySQL
- **密码加密**: bcryptjs
- **身份验证**: 账号密码验证（已移除 JWT）
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
├── config.js           # 配置文件
├── package.json        # 项目依赖配置
├── README.md          # 项目文档
├── 最新验证方式说明.md  # 验证方式变更说明
├── database/
│   └── index.js       # 数据库连接配置
├── router/
│   ├── user.js        # 用户基础路由（注册/登录）
│   └── userInfo.js    # 用户信息路由
├── router-handler/
│   ├── user.js        # 用户业务逻辑处理
│   └── userInfo.js    # 用户信息业务逻辑处理
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

1. 本地创建服务器
   修改 `database/index.js` 中的连接信息：

```javascript
const database = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "your_password", // 修改为你的密码
  database: "my_db_01",
});
```

2. 连接后端人员服务器
   修改 `database/index.js` 中的连接信息：

````javascript
const datavase = mysql.createPool({
  host: "192.168.31.68",
  user: "remote",
  password: "ccnuiotapp",
  database: "my_db_01",
});
```

### 数据表结构

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS my_db_01;
USE my_db_01;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `ev_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` text NOT NULL,
  `age` int DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户信息表'
```

## API 接口文档

### 基础信息

- **Base URL**: `http://127.0.0.1:8080`
- **Content-Type**: `application/x-www-form-urlencoded`
- **响应格式**: JSON
- **验证方式**: 账号密码验证（所有接口通过请求体传递用户名密码）

### 接口列表

#### 🔓 公开接口（无需身份验证）

- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录

#### 🔒 需要身份验证的接口

- `POST /my/userInfo` - 获取用户信息（请求体需包含用户名密码）
- `POST /my/userInfo` - 更新用户信息（请求体需包含用户名密码）

---

### 1. 用户注册

**接口地址**: `POST /api/register`

**请求参数**:
| 参数名 | 类型 | 必填 | 验证规则 | 说明 |
|----------|--------|------|----------|--------|
| username | string | 是 | 1-15 位字母数字 | 用户名 |
| password | string | 是 | 6-20 位非空白字符 | 密码 |

**HarmonyOS ArkTS 请求示例**:

```typescript
import { http } from "@kit.NetworkKit";

interface RegisterResponse {
  status: number;
  message: string;
  user?: {
    username: string;
  };
}

async function registerUser(
  username: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const httpRequest = http.createHttp();

    const requestBody = `username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`;

    const response = await httpRequest.request(
      "http://127.0.0.1:8080/api/register",
      {
        method: http.RequestMethod.POST,
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        extraData: requestBody,
      }
    );

    return JSON.parse(response.result as string) as RegisterResponse;
  } catch (error) {
    console.error("注册请求失败:", error);
    return { status: 500, message: "网络请求失败" };
  }
}

// 使用示例
registerUser("testuser", "123456").then((result) => {
  if (result.status === 200) {
    console.log("注册成功:", result.message);
  } else {
    console.error("注册失败:", result.message);
  }
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

**HarmonyOS ArkTS 请求示例**:

```typescript
import { http } from "@kit.NetworkKit";
import { preferences } from "@kit.ArkData";

interface LoginResponse {
  status: number;
  message: string;
  user?: {
    username: string;
    id: number;
  };
}

async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const httpRequest = http.createHttp();

    const requestBody = `username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`;

    const response = await httpRequest.request(
      "http://127.0.0.1:8080/api/login",
      {
        method: http.RequestMethod.POST,
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        extraData: requestBody,
      }
    );

    const result = JSON.parse(response.result as string) as LoginResponse;

    // 登录成功后保存用户信息到preferences
    if (result.status === 200 && result.user) {
      await saveUserCredentials(username, password);
    }

    return result;
  } catch (error) {
    console.error("登录请求失败:", error);
    return { status: 500, message: "网络请求失败" };
  }
}

// 保存用户凭据到本地
async function saveUserCredentials(username: string, password: string) {
  try {
    const dataPreferences = await preferences.getPreferences(
      getContext(),
      "user_prefs"
    );
    await dataPreferences.put("username", username);
    await dataPreferences.put("password", password);
    await dataPreferences.flush();
  } catch (error) {
    console.error("保存用户信息失败:", error);
  }
}

// 获取保存的用户凭据
async function getUserCredentials(): Promise<{
  username: string;
  password: string;
} | null> {
  try {
    const dataPreferences = await preferences.getPreferences(
      getContext(),
      "user_prefs"
    );
    const username = (await dataPreferences.get("username", "")) as string;
    const password = (await dataPreferences.get("password", "")) as string;

    if (username && password) {
      return { username, password };
    }
    return null;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
}

// 使用示例
loginUser("testuser", "123456").then((result) => {
  if (result.status === 200) {
    console.log("登录成功:", result.user);
  } else {
    console.error("登录失败:", result.message);
  }
});
```

**响应示例**:

✅ **成功响应** (200):

```json
{
  "status": 200,
  "message": "用户登录成功",
  "user": {
    "username": "testuser",
    "id": 1
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

**接口地址**: `POST /my/userInfo`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|----------|--------|------|--------|
| username | string | 是 | 当前用户名（用于身份验证） |
| password | string | 是 | 当前密码（用于身份验证） |

**HarmonyOS ArkTS 请求示例**:

```typescript
import { http } from "@kit.NetworkKit";

interface UserInfoResponse {
  status: number;
  message: string;
  data?: {
    id: number;
    username: string;
    age?: number;
    phone?: string;
    email?: string;
  };
}

async function getUserInfo(): Promise<UserInfoResponse> {
  try {
    // 从本地获取用户凭据
    const credentials = await getUserCredentials();
    if (!credentials) {
      return { status: 401, message: "请先登录" };
    }

    const httpRequest = http.createHttp();
    const requestBody = `username=${encodeURIComponent(
      credentials.username
    )}&password=${encodeURIComponent(credentials.password)}`;

    const response = await httpRequest.request(
      "http://127.0.0.1:8080/my/userInfo",
      {
        method: http.RequestMethod.POST,
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        extraData: requestBody,
      }
    );

    return JSON.parse(response.result as string) as UserInfoResponse;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return { status: 500, message: "网络请求失败" };
  }
}

// 使用示例
getUserInfo().then((result) => {
  if (result.status === 200 && result.data) {
    console.log("用户信息:", result.data);
  } else {
    console.error("获取用户信息失败:", result.message);
  }
});
```

**响应示例**:

✅ **成功响应** (200):

```json
{
  "status": 200,
  "message": "成功获取用户信息",
  "data": {
    "id": 1,
    "username": "testuser",
    "age": 25,
    "phone": "1234567890",
    "email": "test@example.com"
  }
}
```

---

### 4. 更新用户信息

**接口地址**: `POST /my/userInfo`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|----------|--------|------|--------|
| username | string | 是 | 当前用户名（用于身份验证） |
| password | string | 是 | 当前密码（用于身份验证） |
| newUsername | string | 否 | 新用户名（可选） |
| age | number | 否 | 年龄 |
| phone | string | 否 | 电话号码 |
| email | string | 否 | 邮箱地址 |

**HarmonyOS ArkTS 请求示例**:

```typescript
interface UpdateUserInfoParams {
  newUsername?: string;
  age?: number;
  phone?: string;
  email?: string;
}

interface UpdateUserInfoResponse {
  status: number;
  message: string;
  data?: {
    id: number;
    username: string;
    age?: number;
    phone?: string;
    email?: string;
  };
}

async function updateUserInfo(
  params: UpdateUserInfoParams
): Promise<UpdateUserInfoResponse> {
  try {
    // 从本地获取用户凭据
    const credentials = await getUserCredentials();
    if (!credentials) {
      return { status: 401, message: "请先登录" };
    }

    const httpRequest = http.createHttp();

    // 构建请求体
    let requestBody = `username=${encodeURIComponent(
      credentials.username
    )}&password=${encodeURIComponent(credentials.password)}`;

    if (params.newUsername) {
      requestBody += `&newUsername=${encodeURIComponent(params.newUsername)}`;
    }
    if (params.age !== undefined) {
      requestBody += `&age=${params.age}`;
    }
    if (params.phone) {
      requestBody += `&phone=${encodeURIComponent(params.phone)}`;
    }
    if (params.email) {
      requestBody += `&email=${encodeURIComponent(params.email)}`;
    }

    const response = await httpRequest.request(
      "http://127.0.0.1:8080/my/userInfo",
      {
        method: http.RequestMethod.POST,
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        extraData: requestBody,
      }
    );

    const result = JSON.parse(
      response.result as string
    ) as UpdateUserInfoResponse;

    // 如果更新了用户名，需要更新本地保存的凭据
    if (result.status === 200 && params.newUsername) {
      await saveUserCredentials(params.newUsername, credentials.password);
    }

    return result;
  } catch (error) {
    console.error("更新用户信息失败:", error);
    return { status: 500, message: "网络请求失败" };
  }
}

// 使用示例
updateUserInfo({
  newUsername: "newusername",
  age: 30,
  phone: "13800138000",
  email: "newemail@example.com",
}).then((result) => {
  if (result.status === 200) {
    console.log("更新成功:", result.data);
  } else {
    console.error("更新失败:", result.message);
  }
});
```

**响应示例**:

✅ **成功响应** (200):

```json
{
  "status": 200,
  "message": "成功更新用户信息",
  "data": {
    "id": 1,
    "username": "newusername",
    "age": 30,
    "phone": "13800138000",
    "email": "newemail@example.com"
  }
}
```

## HarmonyOS 完整集成示例

### 用户管理服务类

```typescript
import { http } from "@kit.NetworkKit";
import { preferences } from "@kit.ArkData";

export class UserService {
  private baseURL = "http://127.0.0.1:8080";

  // 用户注册
  async register(
    username: string,
    password: string
  ): Promise<RegisterResponse> {
    try {
      const httpRequest = http.createHttp();
      const requestBody = `username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`;

      const response = await httpRequest.request(
        `${this.baseURL}/api/register`,
        {
          method: http.RequestMethod.POST,
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          extraData: requestBody,
        }
      );

      return JSON.parse(response.result as string);
    } catch (error) {
      return { status: 500, message: "网络请求失败" };
    }
  }

  // 用户登录
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const httpRequest = http.createHttp();
      const requestBody = `username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`;

      const response = await httpRequest.request(`${this.baseURL}/api/login`, {
        method: http.RequestMethod.POST,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        extraData: requestBody,
      });

      const result = JSON.parse(response.result as string);

      if (result.status === 200) {
        await this.saveCredentials(username, password);
      }

      return result;
    } catch (error) {
      return { status: 500, message: "网络请求失败" };
    }
  }

  // 获取用户信息
  async getUserInfo(): Promise<UserInfoResponse> {
    const credentials = await this.getCredentials();
    if (!credentials) {
      return { status: 401, message: "请先登录" };
    }

    try {
      const httpRequest = http.createHttp();
      const requestBody = `username=${encodeURIComponent(
        credentials.username
      )}&password=${encodeURIComponent(credentials.password)}`;

      const response = await httpRequest.request(
        `${this.baseURL}/my/userInfo`,
        {
          method: http.RequestMethod.POST,
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          extraData: requestBody,
        }
      );

      return JSON.parse(response.result as string);
    } catch (error) {
      return { status: 500, message: "网络请求失败" };
    }
  }

  // 更新用户信息
  async updateUserInfo(
    params: UpdateUserInfoParams
  ): Promise<UpdateUserInfoResponse> {
    const credentials = await this.getCredentials();
    if (!credentials) {
      return { status: 401, message: "请先登录" };
    }

    try {
      const httpRequest = http.createHttp();
      let requestBody = `username=${encodeURIComponent(
        credentials.username
      )}&password=${encodeURIComponent(credentials.password)}`;

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          requestBody += `&${key}=${encodeURIComponent(value.toString())}`;
        }
      });

      const response = await httpRequest.request(
        `${this.baseURL}/my/userInfo`,
        {
          method: http.RequestMethod.POST,
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          extraData: requestBody,
        }
      );

      const result = JSON.parse(response.result as string);

      if (result.status === 200 && params.newUsername) {
        await this.saveCredentials(params.newUsername, credentials.password);
      }

      return result;
    } catch (error) {
      return { status: 500, message: "网络请求失败" };
    }
  }

  // 保存用户凭据
  private async saveCredentials(username: string, password: string) {
    try {
      const dataPreferences = await preferences.getPreferences(
        getContext(),
        "user_prefs"
      );
      await dataPreferences.put("username", username);
      await dataPreferences.put("password", password);
      await dataPreferences.flush();
    } catch (error) {
      console.error("保存用户凭据失败:", error);
    }
  }

  // 获取用户凭据
  private async getCredentials(): Promise<{
    username: string;
    password: string;
  } | null> {
    try {
      const dataPreferences = await preferences.getPreferences(
        getContext(),
        "user_prefs"
      );
      const username = (await dataPreferences.get("username", "")) as string;
      const password = (await dataPreferences.get("password", "")) as string;

      return username && password ? { username, password } : null;
    } catch (error) {
      console.error("获取用户凭据失败:", error);
      return null;
    }
  }

  // 清除用户凭据（登出）
  async logout() {
    try {
      const dataPreferences = await preferences.getPreferences(
        getContext(),
        "user_prefs"
      );
      await dataPreferences.clear();
      await dataPreferences.flush();
    } catch (error) {
      console.error("清除用户凭据失败:", error);
    }
  }

  // 检查登录状态
  async isLoggedIn(): Promise<boolean> {
    const credentials = await this.getCredentials();
    return credentials !== null;
  }
}

// 接口类型定义
interface RegisterResponse {
  status: number;
  message: string;
  user?: { username: string };
}

interface LoginResponse {
  status: number;
  message: string;
  user?: { username: string; id: number };
}

interface UserInfoResponse {
  status: number;
  message: string;
  data?: {
    id: number;
    username: string;
    age?: number;
    phone?: string;
    email?: string;
  };
}

interface UpdateUserInfoParams {
  newUsername?: string;
  age?: number;
  phone?: string;
  email?: string;
}

interface UpdateUserInfoResponse {
  status: number;
  message: string;
  data?: {
    id: number;
    username: string;
    age?: number;
    phone?: string;
    email?: string;
  };
}
```

### 在页面中使用

```typescript
import { UserService } from '../services/UserService';

@Entry
@Component
struct LoginPage {
  @State username: string = '';
  @State password: string = '';
  @State message: string = '';

  private userService = new UserService();

  async handleLogin() {
    if (!this.username || !this.password) {
      this.message = '请输入用户名和密码';
      return;
    }

    const result = await this.userService.login(this.username, this.password);

    if (result.status === 200) {
      this.message = '登录成功';
      // 跳转到主页面
      router.pushUrl({ url: 'pages/MainPage' });
    } else {
      this.message = result.message;
    }
  }

  build() {
    Column() {
      TextInput({ placeholder: '用户名' })
        .onChange((value) => { this.username = value; })

      TextInput({ placeholder: '密码' })
        .type(InputType.Password)
        .onChange((value) => { this.password = value; })

      Button('登录')
        .onClick(() => this.handleLogin())

      Text(this.message)
        .fontColor(Color.Red)
    }
    .padding(20)
  }
}
```

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
| 401    | 身份认证失败   | 用户名密码错误、未登录 |
| 404    | 资源不存在     | 用户不存在             |
| 500    | 服务器内部错误 | 数据库错误、系统异常   |

## 安全特性

- ✅ 密码使用 bcrypt 加密存储（salt rounds: 10）
- ✅ 账号密码验证机制（移除 JWT Token）
- ✅ 用户名唯一性验证
- ✅ Joi 参数验证防止注入攻击
- ✅ SQL 参数化查询防止 SQL 注入
- ✅ CORS 跨域支持
- ✅ 敏感信息过滤（密码不会在响应中返回）

## HarmonyOS 开发注意事项

1. **网络权限配置**：
   在 `module.json5` 中添加网络权限：

   ```json
   {
     "requestPermissions": [
       {
         "name": "ohos.permission.INTERNET"
       }
     ]
   }
   ```

2. **数据持久化**：
   使用 `preferences` API 保存用户凭据，避免每次启动应用都需要重新登录

3. **网络安全**：

   - 生产环境建议使用 HTTPS
   - 可以考虑对敏感数据进行额外加密

4. **错误处理**：
   前端需要根据 `status` 字段判断请求结果，并给用户友好的提示

5. **性能优化**：
   - 可以缓存用户信息，减少不必要的网络请求
   - 使用连接池优化数据库连接

## 故障排除

### 常见问题

1. **HarmonyOS 网络请求失败**

   - 检查网络权限配置
   - 确认服务器地址可访问
   - 检查防火墙设置

2. **preferences 存储失败**

   - 确认应用有存储权限
   - 检查存储空间是否充足

3. **用户凭据验证失败**
   - 检查用户名密码是否正确
   - 确认数据库中用户数据完整

## 打包部署

### 使用 PKG 打包

由于 PKG 打包时可能遇到 Node.js 版本兼容性问题，建议：

```bash
# 指定 Node.js 版本打包
pkg app.js --targets node18-win-x64 --output api-server.exe

# 或者在 package.json 中配置
{
  "bin": "app.js",
  "pkg": {
    "targets": ["node18-win-x64"],
    "outputPath": "dist"
}

```

---

**版本**: v2.0.0（账号密码验证版）
**最后更新**: 2025 年 6 月 26 日
**适用前端**: HarmonyOS ArkTS 应用
**维护者**: 后端开发
````
