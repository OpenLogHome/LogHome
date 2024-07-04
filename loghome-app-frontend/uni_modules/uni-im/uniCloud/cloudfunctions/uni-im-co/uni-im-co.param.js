// 本文件中的内容将在云对象【运行】时解析为运行参数
// 配置教程参考：https://uniapp.dcloud.net.cn/uniCloud/rundebug.html#run-obj-param
// const clientInfo = { // 模拟clientInfo
//   uniPlatform: 'web',
//   appId:"__UNI__HelloUniApp",
//   deviceId:"1672732026351278597",
//   source: 'client', // 调用来源，不传时默认为 client
//   clientIP: '127.0.0.1', // 客户端ip，不传时默认为 127.0.0.1
//   userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1", // 客户端ua，不传时默认为 HBuilderX
//   uniIdToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2M2FiZTVhNjkwYjI2ZDAwMDEyYzRkMjkiLCJyb2xlIjpbXSwicGVybWlzc2lvbiI6W10sInVuaUlkVmVyc2lvbiI6IjEuMC4xMyIsImlhdCI6MTY3MjgxOTEzOSwiZXhwIjoxNjcyODI2MzM5fQ.yxHlFOtr31UwUQ9FB56ZB2BoKNV6aJATEJ0xLZAZDUY'
// }
// chooseUserIntoGroup({
// 	user_ids:['63abe5d85125130001302e6b'],
// 	group_id:"63b5361b26b3d800018ace7f"
// }) 

chatCompletion({messages:[
	{
	    "content": "请提供一个关于软件产品宣传文章的大纲",
	    "role": "user"
	}
]})