<script>

// #ifdef H5
var hpa_first_Show = true;
var hpa_animation_time = 400;
function cloneDom(source, target) {
    target.textContent = '';
    const fragment = document.createDocumentFragment();
    const children = source.childNodes;
    for (let i = 0; i < children.length; i++) {
        fragment.appendChild(children[i].cloneNode(true));
    }
    target.appendChild(fragment);
}
function getPage1() {
    return document.querySelector('uni-page');
}
function getPage2() {
    return document.getElementById('page2');
}
function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
function syncWrapperOffset(page2, scrollTop) {
    const wrapper = page2.querySelector('uni-page-wrapper');
    if (wrapper) wrapper.style.marginTop = '-' + scrollTop + 'px';
}
// #endif
import './index.css';
export default {
    // #ifdef H5
    onLaunch: function() {
        const page1 = getPage1();
		if(page1 == undefined){
			return;
		}
        if (hpa_first_Show) {
            const page1_class = page1.classList;
            page1_class.add('hpa-show');
            const existing = getPage2();
            if (!existing) {
                const page2El = document.createElement('uni-page2');
                page2El.id = 'page2';
                document.body.appendChild(page2El);
            }
        }
        this.$router.beforeEach((to, from, next) => {
            // tabBar切换无动画
            if (to.type == 'switchTab' || to.type == 'redirectTo' || to.query.noneAnimation || hpa_first_Show ) {
                next && next();
				hpa_first_Show = false;
                setTimeout(() => {
                    const page1_class = getPage1().classList;
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
            // 填充虚拟页
            const page1 = getPage1();
            const page2 = getPage2();
            cloneDom(page1, page2);
            // 调整虚拟页样式
            const page2_class = page2.classList;
            // 保持滚动高度
            const sh = getScrollTop();
            syncWrapperOffset(page2, sh);
            // 显示
            page2_class.add('hpa-show');

            // 调整真实页样式
            next && next();
            setTimeout(() => {
                // 动画起点
                const page1_class = getPage1().classList;
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
                            page2.textContent = '';
                            
                        }, hpa_animation_time);
                    }, 50);
                }, 50);
            }, 5);
        },
        hide(next) {
            // 填充虚拟页
            const page1 = getPage1();
            const page2 = getPage2();
            cloneDom(page1, page2);
            // 调整虚拟页样式
            const page2_class = page2.classList;
            // 保持滚动高度
            const sh = getScrollTop();
            syncWrapperOffset(page2, sh);
            page2_class.add('hpa-High', 'hpa-show');

            // 调整真实页样式
            next && next();
            setTimeout(() => {
                // 动画起点
                const page1_class = getPage1().classList;
                page1_class.add('hpa-animation-enter', 'hpa-show');
                
                // 动画开始
                setTimeout(() => {
                    page1_class.add('hpa-animation', 'hpa-animation-after');
                    page2_class.add('hpa-animation', 'hpa-animation-before');
                    
                    // 动画结束
                    setTimeout(() => {
                        page1_class.remove('hpa-animation', 'hpa-animation-after', 'hpa-animation-enter');
                        page2_class.remove('hpa-show', 'hpa-High', 'hpa-animation', 'hpa-animation-before');
                        page2.textContent = '';
                        
                    }, hpa_animation_time);
                }, 50);
            }, 5);
        }
    }
    // #endif
};
</script>
