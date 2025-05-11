<script>
import config from "@/app.config.js";
import { version } from './package.json'
export default {
	computed: {},
	methods: {
		// 初始化菜单权限等数据
		init() {
			let that = this;
			let { vk } = that;
			// 如果token失效，直接跳登录页面
			if (!vk.checkToken()) {
				that.navigateToLogin();
				return false;
			}
			if (!that.isAllowLoginBackground()) {
				vk.alert("您的账户无登陆权限", () => {
					that.navigateToLogin();
				});
				return false;
			}
			vk.userCenter.getMenu({
				success: (data) => {
					// 初始化菜单
					let { menus = [] } = data;
					// 合并去重
					menus = vk.pubfn.arr_concat(menus, config.sideBar.staticMenu, "menu_id");
					// 排序
					menus.sort((a, b) => {
						let sortA = a.sort || 0;
						let sortB = b.sort || 0;
						return sortA - sortB;
					});
					if (JSON.stringify(menus) !== JSON.stringify(vk.getVuex("$app.navMenu"))) {
						vk.setVuex("$app.navMenu", menus);
					}
					// 将树形结构转成数组结构
					let menuList = vk.pubfn.treeToArray(menus, {
						id: "menu_id",
						parent_id: "parent_id",
						children: "children"
					});
					if (JSON.stringify(menuList) !== JSON.stringify(vk.getVuex("$app.menuList"))) {
						vk.setVuex("$app.menuList", menuList);
					}
					vk.setVuex("$app.inited", true);
					vk.setVuex("$user.userInfo", data.userInfo);
					vk.setVuex("$user.permission", data.userInfo.permission);
					that.checkCurrentAppId();
				}
			});
		},
		// 初始化系统环境变量
		initApp() {
			uni.getSystemInfo().then(([err, res]) => {
				let isPC = res.model && res.model != "PC" ? false : true;
				vk.setVuex("$app.isPC", isPC);
				vk.setVuex("$app.width", res.windowWidth);
				vk.setVuex("$app.height", res.windowHeight);
			});
			uni.onWindowResize(res => {
				vk.pubfn.debounce(() => {
					vk.setVuex("$app.width", res.size.windowWidth);
					vk.setVuex("$app.height", res.size.windowHeight);
					let isPC = res.size.windowWidth > 768 ? true : false;
					vk.setVuex("$app.isPC", isPC);
				}, 50, false, "app-onresize");
			});
		},
		// 检查是否允许登录admin后台
		isAllowLoginBackground(userInfo) {
			let that = this;
			let { vk } = that;
			if (!userInfo) userInfo = vk.getVuex("$user.userInfo");
			let key = true;
			if (vk.pubfn.isNotNull(userInfo)) {
				let { role = [], allow_login_background = false } = userInfo;
				if (role.indexOf("admin") == -1 && !allow_login_background) {
					key = false;
				}
			}
			return key;
		},
		// 检测当前应用appid是否已添加到应用管理中
		checkCurrentAppId(){
			let that = this;
			let { vk } = that;
			let systemInfo = uni.getSystemInfoSync();
			if (systemInfo.appId) {
				vk.callFunction({
					url: 'admin/system/app/sys/getInfo',
					data: {
						appid: systemInfo.appId,
					},
					success: (data) => {
						if (!data.info || data.info.appid !== systemInfo.appId) {
							vk.confirm(`您当前登录的应用【${systemInfo.appId}】未在已有应用列表中，是否需要去添加？`, '提示', '前往应用管理', '取消', res => {
								if (res.confirm) {
									vk.navigateTo('/pages_plugs/system/app/list');
								}
							});
						}
					}
				});
			}
		},
		navigateToLogin(){
			let { vk, appOptions = {} } = this;
			let params = vk.pubfn.queryParams(appOptions.query);
			let url = `/${appOptions.path}${params}`;
			let uniIdRedirectUrl = encodeURIComponent(url);
			vk.reLaunch(`${config.login.url}?uniIdRedirectUrl=${uniIdRedirectUrl}`);
		}
	},
	// 监听 - 页面404
	onPageNotFound(e) {
		uni.redirectTo({
			url: config.error.url
		});
	},
	// 监听 - 应用启动时
	onLaunch: function(options) {
		this.appOptions = options;
		if (config.debug) {
			console.log(
				`%c vk-admin %c v${version} `,
				'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
				'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;'
			);
			console.log('App Launch');
		}
		let that = this;
		that.vk.pubfn.needInit({
			that,
			config,
			success: () => {
				that.init();
			}
		});
		that.initApp();
	},
	onShow: function() {
		if (config.debug) console.log("App Show");
	},
	onHide: function() {
		if (config.debug) console.log("App Hide");
	}
};
</script>

<style lang="scss">/* 此为uni-admin的样式，如果你不使用uni-admin的官方插件，可以不需要加载这些样式 */@import "@/common/uni-admin/css/uni.css";
@import "@/common/uni-admin/css/uni-icons.css";
/* 此为uni-admin的样式，如果你不使用uni-admin的官方插件，可以不需要加载这些样式 */
</style>
