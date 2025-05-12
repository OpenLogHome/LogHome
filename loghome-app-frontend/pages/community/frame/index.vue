<template>
    <div class="community-frame-container">
        <web-view id="blogIframe" :src="url" frameborder="0" class="pc iframe" scrolling="auto">
        </web-view>
    </div>

</template>

<script>
import { FramePostman } from '../../../lib/framepostman.js';
import axios from 'axios';
export default {
    data() {
        return {
            url: this.$baseUrlCommunity,
            baseUrl: this.$baseUrlCommunity
        }
    },
    onLoad(params) {
        if (params.url) {
            this.url = params.url;
        }
        if (params.title) {
            uni.setNavigationBarTitle({
                title: params.title
            })
        }
        this.login();
    },
    onShow() {
    },
    onHide() {
    },
    mounted() {
        const iframe = document.querySelector('iframe#blogIframe');
        setTimeout(() => {
            const postman = new FramePostman({
                element: iframe,
                info: {
                    app: 'loghome-app',
                    version: '1.0'
                }
            })

            postman.listen((msg, e) => {
                console.log("gotMsg", msg)
                if (!msg.type) return;
                switch (msg.type) {
                    case "LOGIN_NEEDED":
                        setTimeout(() => {
                            this.login();
                        }, 500);
                        break;
                    case "REFRESH_TABBAR":
                        let url = msg.currentUrl.split('#')[1];
                        if (url && url == '/') {
                            uni.showTabBar();
                        } else {
                            uni.hideTabBar();
                        }
                        break;
                    case "USER_PAGE":
                        uni.navigateTo({
                            url: "../../users/personalPage?uni_id=" + msg.id
                        })
                        break;
                }
            })
        })
    },
    beforeDestroy() {
    },
    methods: {
        login() {
            // 获取跨站token
            let tk = JSON.parse(window.localStorage.getItem('token'));
            if (tk) tk = tk.tk;

            uni.request({
                url: this.$baseUrl + '/users/generate_cross_site_token',
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tk
                },
                success: (res) => {
                    if (res.statusCode === 200) {
                        // 将token添加到url中
                        const separator = this.baseUrl.includes('?') ? '&' : '?';
                        this.url = `${this.baseUrl}/#/pages/auth/external_login${separator}token=${res.data.crossSiteToken}`;
                        console.log("this.url", this.url)
                    }
                },
                fail: (error) => {
                    if (error.statusCode === 401) {
                        window.localStorage.removeItem('token');
                        this.$isFromLogin = true;
                        uni.navigateTo({
                            url: './users/login?msg=unAuthorized'
                        });
                    } else {
                        uni.showToast({
                            title: "获取跨站token失败",
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            });
        }
    }

}
</script>

<style scoped lang='scss'>
.community-frame-container {
    width: 100%;
    height: calc(100vh - 133rpx);
    background-color: #fff;
}
</style>