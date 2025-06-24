//导入模块
const joi = require('@hapi/joi')

// 定义用户注册的验证规则
const username = joi.string().alphanum().min(1).max(15).required()

/* 用户名传入参数为字符串
** 该参数必须是字母或数字
** 该参数长度必须在1到15个字符之间
** 该参数必须传递
*/

const password = joi.string().pattern(/^[\S]{6,20}$/).required()

/* 密码传入参数为字符串
** 该参数必须是6到20位的非空白字符
*/



exports.registerLoginSchema = {
    body: {
        username,
        password
    }
}
