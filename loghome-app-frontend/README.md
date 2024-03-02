# loghome-app-frontend

此为原木社区的前端技术代码仓库。

原木社区的前端使用UniApp搭建，我们推荐使用DCloud提供的HBuilder运行此前端项目。

## 修改API的BaseURL

在项目的 `main.js`文件中作如下修改：

```javascript
...
Vue.prototype.$baseUrl = BASE_URL_DEV; // 设置后端API的BaseURL为开发环境，即http://localhost:8081
...
```


