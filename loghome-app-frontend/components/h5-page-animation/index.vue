<script>

// #ifdef H5
var hpa_first_Show = true;
// #endif
import './index.css';
export default {
    // #ifdef H5
    onLaunch: function() {
		if(document.querySelector('uni-page') == undefined){
			return;
		}
        if (hpa_first_Show) {
            const page1_class = document.querySelector('uni-page').classList;
            page1_class.add('hpa-show');
            // 预创建虚拟页
            document.write('<uni-page2 id="page2"></uni-page2>');
        }
		let _this = this;
        this.$router.beforeEach((to, from, next) => {
			
            // tabBar切换无动画
            if (to.type == 'switchTab' || to.type == 'redirectTo' || to.query.noneAnimation || hpa_first_Show ) {
                next && next();
				hpa_first_Show = false;
                setTimeout(() => {
                    const page1_class = document.querySelector('uni-page').classList;
                    page1_class.add('hpa-show');
                }, 10);
                return;
            }

            // 页面回退动画
            if (!to.type || to.type == 'navigateBack') {
                this.hide(next);
                return;
            }

            // 页面跳转动画
            this.show(next);
        });
    },
    methods: {
        show(next) {
			let animationTime = 300;
            // 填充虚拟页
            const page2 = document.getElementById('page2');
            page2.innerHTML = document.querySelector('uni-page').innerHTML;
            // 调整虚拟页样式
            const page2_class = page2.classList;
            // 保持滚动高度
            let sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            page2.querySelector('uni-page-wrapper').style.cssText = 'margin-top:-' + sh + 'px';
            // 显示
            page2_class.add('hpa-show');
            // 调整真实页样式
            next && next();
            setTimeout(() => {
                // 动画起点
                const page1_class = document.querySelector('uni-page').classList;
                page1_class.add('hpa-animation-before');
                setTimeout(() => {
                    page2_class.add('hpa-low');
                    page1_class.add('hpa-show');
                    // 动画开始
                    setTimeout(() => {
                        page1_class.add('hpa-animation', 'hpa-animation-after');
                        page2_class.add('hpa-animation', 'hpa-animation-enter');
                        // 动画结束
                        setTimeout(() => {
                            page1_class.remove('hpa-animation', 'hpa-animation-before', 'hpa-animation-after');
                            page2_class.remove('hpa-show', 'hpa-low', 'hpa-animation', 'hpa-animation-enter');
                            page2.innerHTML = '';
                        }, animationTime);
                    }, 50);
                }, 50);
            }, 5);
        },
        hide(next) {
            // 填充虚拟页
			let animationTime = 300;
            const page2 = document.getElementById('page2');
            page2.innerHTML = document.querySelector('uni-page').innerHTML;
            // 调整虚拟页样式
            const page2_class = page2.classList;
            // 保持滚动高度
            let sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            page2.querySelector('uni-page-wrapper').style.cssText = 'margin-top:-' + sh + 'px';
            page2_class.add('hpa-High', 'hpa-show');
            // 调整真实页样式
            next && next();
            setTimeout(() => {
                // 动画起点
                const page1_class = document.querySelector('uni-page').classList;
                page1_class.add('hpa-animation-enter', 'hpa-show');
                // 动画开始
                setTimeout(() => {
                    page1_class.add('hpa-animation', 'hpa-animation-after');
                    page2_class.add('hpa-animation', 'hpa-animation-before');
                    // 动画结束
                    setTimeout(() => {
                        page1_class.remove('hpa-animation', 'hpa-animation-after', 'hpa-animation-enter');
                        page2_class.remove('hpa-show', 'hpa-High', 'hpa-animation', 'hpa-animation-before');
                        page2.innerHTML = '';
                    }, animationTime);
                }, 50);
            }, 5);
        }
    }
    // #endif
};
</script>
