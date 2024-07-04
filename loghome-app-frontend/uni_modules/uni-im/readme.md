# 简介
uni-im是云端一体的、全平台的、免费的、开源即时通讯系统。
- 基于uni-app，App、小程序、web全端兼容
- 基于uniCloud，前后端都使用js开发
- 基于[uni-push2](https://uniapp.dcloud.net.cn/unipush-v2.html)，专业稳定的全端推送系统
- 基于[uni-id](https://uniapp.dcloud.net.cn/uniCloud/uni-id-summary.html)，完善的账户体系
- 支持服务端为非uniCloud（比如：应用服务端的开发语言是php、java、go、.net、python、c#等）或 不基于uni-id-pages 开发的项目接入

案例：

<img width="600px" src="https://dcloud-chjh-web.oss-cn-hangzhou.aliyuncs.com/ext/uni-im/20230228110007.jpg"></img>

如图：在插件市场任意插件详情页面，点击咨询作者按钮，即可看到基于uni-im搭建的客服系统。

下载地址：[https://ext.dcloud.net.cn/plugin?name=uni-im](https://ext.dcloud.net.cn/plugin?name=uni-im)

## 特点优势  
- 性价比高；前后端代码均免费开源，相比竞品使用uni-im仅需花费极少的托管在uniCloud（serverless服务器）产生的费用[详情查看](#cost)
- 全端可用
- App端支持nvue，更好的长列表性能。list组件性能优势[详情参考](https://uniapp.dcloud.net.cn/component/list.html)
- 智能本地缓存（app端sqlite，web端indexDB，小程序端storage），更快的历史消息加载速度，更小的网络请求压力
- 中心化响应式数据管理，切换会话无需重新加载数据，更流畅的体验
- App端聚合多个手机厂商推送通道，app不在线也可以收到消息

## 版本计划  
### 已上线
- 应用内嵌入uni-im，使用户方便、实时的与App运营者互动，咨询问题、反馈意见、进行投诉。
- 可发送文字、图片、音频、视频、代码、任意文件
- im交友场景：群聊、好友关系
- 会话细节：消息删除、撤回、消息回复

### 后续计划
1. 通信方式扩展：音频通话、视频通话
2. 细节完善：聊天记录识别电话邮件、消息转发和批转、勿扰设置、会话置顶、留言转文字、图片提取文字
3. 客服场景：管理端支持座席（暂时可先用通过：给每个用户创建一个群，隐藏群信息查看入口，成员进出群实现转坐席）

优先开发哪些，取决于开发者的反馈。同时也欢迎开发者共建这个开源项目。

> uni-im相关功能建议或问题，可以加入由uni-im（本插件）搭建的交流群，[点此加入](https://im.dcloud.net.cn/#/?joinUniImGroup=1)，备用QQ群（当系统处于维护中使用）群号:[854520009](https://qm.qq.com/cgi-bin/qm/qr?k=DJNSajXAYHnYcr9pouOfxF9Rwwl1AJHc&jump_from=webapi&authKey=HZ1fG58Eudp3o0GCoyx1/UPMY9Fv1sGT5jdqYqPJlTGT0XVUip3Bk8E+UyToQOMo)


## 使用uniCloud产生的费用说明@cost

uni-im本身并不收费，实际使用中需要依赖uniCloud云服务，会产生费用；而uniCloud的价格很实惠：  
- 调用10000次云函数仅需0.0133元
- 调用10000次数据库查询仅需0.015元
> 更多计费参考：[阿里云版uniCloud按量计费文档](https://uniapp.dcloud.net.cn/uniCloud/price.html#aliyun-postpay)

### 举例说明：

- 单聊场景，向用户发送一条消息的过程：
1. 调用uni-im-co云对象的sendMsg方法（产生1次云函数请求）
2. 查询当前对话的会话记录（产生1次云数据库读操作）
3. 根据步骤2的查询结果，如果已经有会话记录，就更新会话，否则就创建一条会话记录（产生1次云数据库写操作）
4. 查询发送消息的用户信息，用于接收消息时在通知栏显示发送者昵称和头像（产生1次云数据库读操作）
5. 记录发送的消息内容到数据库，用于保存消息历史记录（产生1次云数据库写操作）
6. 以`user_id`为标识通过`uni-push2`向用户发送消息会产生0.00000283元uniCloud使用费用[详情查看](https://uniapp.dcloud.net.cn/unipush-v2.html#cost)

合计：1次云函数请求、2次数据库读操作、2次数据库写操作、1次uni-push2推送操作，即 (1 * 0.0133 + 2 * 0.015 + 2 * 0.05 + 1 * 0.0283)/10000 ≈ 0.000017元

- 群聊场景，向用户发送一条消息的过程：
1. 调用uni-im-co云对象的sendMsg方法（产生1次云函数请求）
2. 查询当前用户是否为群成员，防止非群成员发送消息（产生1次云数据库读操作）
3. 查询当前对话的会话记录（产生1次云数据库读操作）
4. 根据步骤3的查询结果，如果已经有会话记录，就更新会话，否则就创建一条会话记录（产生1次云数据库写操作）
5. 查询发送消息的用户信息，用于接收消息时在通知栏显示发送者昵称和头像（产生1次云数据库读操作）
6. 记录发送的消息内容到数据库，用于保存消息历史记录（产生1次云数据库写操作）
7. 以群id为参数，调用uni-im-co云对象的sendMsgToGroup方法，这是一个递归方法每次向500名群成员推送消息（如果群成员数量为0-500只需执行1次，500-1000需执行2次，以此类推），（会产生最少1次数据库读操作，和1次以`user_id`为标识通过`uni-push2`向用户发送消息会产生0.00000283元uniCloud使用费用[详情查看](https://uniapp.dcloud.net.cn/unipush-v2.html#cost)）

合计：向500人群发送消息，会产生：1次云函数请求、4次数据库读操作、2次数据库写操作、1次uni-push2推送操作，即 (1 * 0.0133 + 4 * 0.015 + 2 * 0.05 + 1 * 0.0283)/10000 ≈ 0.000020元

相比市面上同类型产品，使用uni-im仅需花费如此便宜的uniCloud（serverless服务器）费用；在价格这块uni-im性价比极高。

## 开发文档[详情查看](https://uniapp.dcloud.net.cn/uniCloud/uni-im.html)
