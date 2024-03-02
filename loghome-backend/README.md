# loghome-backend

此为原木社区的后端技术代码仓库。

原木社区的后端采用Node.js技术，主要使用的库框架为Express，使用的数据库为MySQL。

想要在本地完成后端的运行，你需要完成以下几步：

## 部署数据库

从 `LogHome-TestDb` 仓库拉取最新的数据库，并在自己的MySQL8.0+数据库上完成部署。

## 创建并修改Config.js文件

在本项目下的 `config.js`文件（如果没有则手动创建）中作如下配置：

```javascript
module.exports={
    "developerMode": true, // 将此字段设为true
    "database":{ // 在此对象内完成数据库连接信息的配置
        host: 'localhost',
        user: 'loghome-testdb',
        password: 'loghome-testdb',
        database: 'loghome-testdb',
    }
}
```

## 创建并修改SECRET.js文件

在项目文件夹`bin`下的`SECRET.js`文件（如果没有则手动创建）中作如下配置：

```javascript
module.exports = {
	SECRET: '<jwt密钥>', //jwt密钥，用于加密用户密码信息，可自行随意设置
	TencentSecretId: '<腾讯云短信服务Id>', // **可选**，在developerMode为true的情况下，不会发送短信验证码。
	TencentSecretKey: '<腾讯云短信服务Key>' // 因此只有在修改短信验证码相关逻辑时才有必要设置此字段。
};
```


