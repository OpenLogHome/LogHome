<p align="center">
  <img src="static/applogo.png" alt="LogHome" width="200"/>
</p>

<h1 align="center">LogHome 原木社区</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Uniapp-Vue2-green" alt="Uniapp">
  <img src="https://img.shields.io/badge/Nuxt.js-3-green" alt="Nuxt">
  <img src="https://img.shields.io/badge/Express.js-4.17.1-purple" alt="Express">
  <img src="https://img.shields.io/badge/Android-Kotlin-blue" alt="Android Kotlin">
  <img src="https://img.shields.io/badge/License-GPL-pink" alt="License">
  <img src="https://img.shields.io/badge/Version-2.6.3-orange" alt="Version">
</p>

## 📖 项目介绍

LogHome (原木社区)是一个集成了多端技术栈的完整小说读写社区项目，包含移动端、Web端和后端服务等多个模块。

## 🗂️ 项目结构

```text
loghome
├── loghome-android        # 当前移动端客户端（Android / Kotlin）
├── loghome-app-frontend   # 移动端 WebView 前端项目（uni-app）
├── loghome-pc-frontend    # PC 端前端项目
├── loghome-backend        # 后端服务（Express.js）
└── legacy
    └── loghome-flutter    # 已归档的旧 Flutter 客户端
```

此为原木社区完整技术代码仓库，其中包含了原木社区的前端、后端、Android 客户端和 PC 端运行环境。当前移动端客户端使用 `loghome-android`；旧 Flutter 客户端保留在 `legacy/loghome-flutter`，不再作为当前移动端开发入口。

进入到对应的文件夹下，查看对应项目的README.md可以获取更详细的运行指南。

## ✨ 主要功能

- 📱 Android 移动端客户端
- 💻 PC端完整功能支持
- 🔄 Android 原生能力与 WebView 前端集成
- 🌐 统一的后端服务支持

## 🚀 快速开始

请参考各子项目目录下的 README.md 获取详细的开发和部署指南：

- [Android 客户端源码](loghome-android/)
- [移动端 WebView 前端开发指南](loghome-app-frontend/README.md)
- [后端服务开发指南](loghome-backend/README.md)
- [历史客户端归档](legacy/README.md)

## 🛠️ 技术栈

- 前端: uni-app, Vue.js
- 移动端客户端: Android, Kotlin
- 后端: Node.js
- 数据库: MySQL
- 混合开发: Android WebView

## 📄 许可证

本项目采用 GPL 许可证，详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request 来帮助改进项目。

## 📞 联系我们

- 项目主页：[https://openloghome.github.io/homepage/](https://openloghome.github.io/homepage/)
- 原木社区网页端：[https://loghome.ink](https://loghome.ink)
