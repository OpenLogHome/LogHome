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
            window.hpa_active = true;
			let animationTime = 400;
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

            // Hero Animation Setup
            const heroData = window.hpa_hero_animation;
            window.hpa_hero_animation = null;
            let heroImg = null;
            if (heroData) {
                heroImg = document.createElement('img');
                heroImg.src = heroData.src;
                heroImg.style.cssText = `
                    position: fixed;
                    top: ${heroData.rect.top}px;
                    left: ${heroData.rect.left}px;
                    width: ${heroData.rect.width}px;
                    height: ${heroData.rect.height}px;
                    z-index: 9999;
                    transition: all ${animationTime}ms cubic-bezier(0.4, 0.0, 0.2, 1);
                    object-fit: cover;
                    border-radius: 4px;
                    pointer-events: none;
                `;
                document.body.appendChild(heroImg);
                console.log(heroData)
            }

            // 调整真实页样式
            next && next();
            setTimeout(() => {
                // 动画起点
                const page1_class = document.querySelector('uni-page').classList;
                page1_class.add('hpa-animation-before');
                setTimeout(() => {
                    page2_class.add('hpa-low');
                    page1_class.add('hpa-show');
                    
                    // Prepare Target for Hero Animation
                    let targetImg = null;
                    if (heroImg) {
                         const newPage = document.querySelector('uni-page');
                         if (newPage) {
                             targetImg = newPage.querySelector('#book-cover-image img') || newPage.querySelector('#book-cover-image');
                             if (targetImg && targetImg.tagName !== 'IMG') {
                                 targetImg = targetImg.querySelector('img');
                             }
                         }
                         if (targetImg) {
                             targetImg.style.opacity = '0';
                         }
                    }

                    // 动画开始
                    setTimeout(() => {
                        page1_class.add('hpa-animation', 'hpa-animation-after');
                        page2_class.add('hpa-animation', 'hpa-animation-enter');

                        // Execute Hero Animation
                        if (heroImg) {
                            // Calculate target position based on CSS rules (since getBoundingClientRect might be affected by page transition transforms)
                            // CSS Rules from bookInfo.vue:
                            // .l-dl { margin-top: 180rpx; padding-left: 32rpx; }
                            // .l-dt { width: 230rpx; height: 320rpx (inherited from l-dl); }
                            // StatusBarHeight is set to 0 in bookInfo.vue style
                            
                            const screenWidth = window.innerWidth;
                            const rpx = screenWidth / 750;
                            
                            const targetTop = 180 * rpx;
                            const targetLeft = 32 * rpx;
                            const targetWidth = 230 * rpx;
                            const targetHeight = 320 * rpx;

                            heroImg.style.top = targetTop + 'px';
                            heroImg.style.left = targetLeft + 'px';
                            heroImg.style.width = targetWidth + 'px';
                            heroImg.style.height = targetHeight + 'px';
                        }

                        // 动画结束
                        setTimeout(() => {
                            page1_class.remove('hpa-animation', 'hpa-animation-before', 'hpa-animation-after');
                            page2_class.remove('hpa-show', 'hpa-low', 'hpa-animation', 'hpa-animation-enter');
                            page2.innerHTML = '';
                            
                            // 定义清理函数
                            const cleanup = () => {
                                if (heroImg) {
                                    heroImg.remove();
                                    heroImg = null;
                                }
                                if (targetImg) {
                                    targetImg.style.opacity = '';
                                    targetImg = null;
                                }
                                window.hpa_finish_hero_animation = null;
                                window.hpa_active = false;
                                if (window.hpa_after_cleanup_callback) {
                                    window.hpa_after_cleanup_callback();
                                    window.hpa_after_cleanup_callback = null;
                                }
                            };

                            // 如果没有 Hero 动画，直接结束
                            if (!heroImg) {
                                cleanup();
                                return;
                            }

                            // 标记动画已完成
                            let isAnimationDone = true;
                            // 检查数据是否已就绪（通过 window 属性通信）
                            if (window.hpa_book_info_ready) {
                                cleanup();
                                window.hpa_book_info_ready = false; // 重置标志
                            } else {
                                // 数据未就绪，注册回调等待页面调用
                                window.hpa_finish_hero_animation = () => {
                                    cleanup();
                                    window.hpa_book_info_ready = false;
                                };
                                
                                // 设置超时兜底（3秒），防止页面一直不加载导致图片卡死
                                setTimeout(() => {
                                    if (window.hpa_finish_hero_animation) {
                                        cleanup();
                                    }
                                }, 3000);
                            }
                        }, animationTime);
                    }, 50);
                }, 50);
            }, 5);
        },
        hide(next) {
            // 填充虚拟页
			let animationTime = 400;
            const page2 = document.getElementById('page2');
            page2.innerHTML = document.querySelector('uni-page').innerHTML;
            // 调整虚拟页样式
            const page2_class = page2.classList;
            // 保持滚动高度
            let sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            page2.querySelector('uni-page-wrapper').style.cssText = 'margin-top:-' + sh + 'px';
            page2_class.add('hpa-High', 'hpa-show');

            // --- Reverse Hero Animation Setup ---
            let heroImg = null;
            let startRect = null;
            const returnTarget = window.hpa_return_target;
            const bookId = returnTarget ? returnTarget.id : null;
            
            if (bookId) {
                // Try to find the cover image in page2 (which is the snapshot of bookInfo)
                // In bookInfo.vue, the cover has id="book-cover-image" and is a LogImage (renders as img)
                const coverImg = page2.querySelector('#book-cover-image');

                if (coverImg) {
                    // Use CSS calculation for the start position (same as target in show())
                    const screenWidth = window.innerWidth;
                    const rpx = screenWidth / 750;
                    
                    const startTop = 180 * rpx;
                    const startLeft = 32 * rpx;
                    const startWidth = 230 * rpx;
                    const startHeight = 320 * rpx;

                    startRect = {
                        top: startTop,
                        left: startLeft,
                        width: startWidth,
                        height: startHeight
                    };
                    
                    heroImg = document.createElement('img');
                    heroImg.src = coverImg.src;
                    heroImg.style.cssText = `
                        position: fixed;
                        top: ${startRect.top}px;
                        left: ${startRect.left}px;
                        width: ${startRect.width}px;
                        height: ${startRect.height}px;
                        z-index: 9999;
                        transition: all ${animationTime}ms cubic-bezier(0.4, 0.0, 0.2, 1);
                        border-radius: 4px;
                        pointer-events: none;
                    `;
                    document.body.appendChild(heroImg);
                    
                    // Hide the source image in page2
                    coverImg.style.opacity = '0';
                }
            }

            // 调整真实页样式
            next && next();
            setTimeout(() => {
                // 动画起点
                const page1_class = document.querySelector('uni-page').classList;
                page1_class.add('hpa-animation-enter', 'hpa-show');
                
                // --- Prepare Target for Reverse Hero ---
                let targetImg = null;
                if (heroImg && bookId) {
                     // Now uni-page is the Library (restored)
                     const newPage = document.querySelector('uni-page');
                     const targetContainer = newPage.querySelector('#book-cover-' + bookId);
                     
                     if (targetContainer) {
                         targetImg = targetContainer.querySelector('img');
                         // If not found directly, look deeper (e.g. inside log-image which might be wrapped)
                         if (!targetImg) targetImg = targetContainer.querySelector('log-image img');
                         
                         if (targetImg) {
                             targetImg.style.opacity = '0';
                         }
                     }
                }

                // 动画开始
                setTimeout(() => {
                    page1_class.add('hpa-animation', 'hpa-animation-after');
                    page2_class.add('hpa-animation', 'hpa-animation-before');
                    
                    // --- Execute Reverse Hero Animation ---
                    if (heroImg) {
                        let rect = null;
                        
                        // Priority 1: Use stored return rect if available
                        if (returnTarget && returnTarget.rect) {
                            rect = returnTarget.rect;
                        } 
                        // Priority 2: Use getBoundingClientRect as fallback
                        else if (targetImg) {
                            rect = targetImg.getBoundingClientRect();
                        }

                        if (rect) {
                            heroImg.style.top = rect.top + 'px';
                            heroImg.style.left = rect.left + 'px';
                            heroImg.style.width = rect.width + 'px';
                            heroImg.style.height = rect.height + 'px';
                        } else {
                            // If target not found, fade out and shrink slightly
                            heroImg.style.opacity = '0';
                            heroImg.style.transform = 'scale(0.8)';
                        }
                    }

                    // 动画结束
                    setTimeout(() => {
                        page1_class.remove('hpa-animation', 'hpa-animation-after', 'hpa-animation-enter');
                        page2_class.remove('hpa-show', 'hpa-High', 'hpa-animation', 'hpa-animation-before');
                        page2.innerHTML = '';
                        
                        // Cleanup
                        if (heroImg) {
                            heroImg.remove();
                            window.hpa_return_target = null;
                        }
                        if (targetImg) targetImg.style.opacity = '';
                        window.hpa_current_book_id = null;
                        
                    }, animationTime);
                }, 50);
            }, 5);
        }
    }
    // #endif
};
</script>
