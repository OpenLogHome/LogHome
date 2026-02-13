<template>
	<view class="outer" :style="{'--statusBarHeight': 0 + 'px'}">
		<!-- 背景图片/颜色 -->
		<view class="bg-gradient"></view>
		
		<!-- 后台按钮组件 -->
		<zetank-backBar textcolor="#fff" :showLeft="true" :showTitle="false" navTitle='原木树场'></zetank-backBar>
		
        <!-- 资源栏 -->
        <view class="balance-bar" :style="{top: 'calc(20rpx + var(--statusBarHeight))'}">
			<view class="res-item">
				<image src="../../static/resources/log.png" mode="aspectFit"></image>
				<text>{{resources.log}}</text>
			</view>
			<view class="res-item">
				<image src="../../static/resources/apple.png" mode="aspectFit"></image>
				<text>{{resources.apple}}</text>
			</view>
			<view class="res-item">
				<image src="../../static/resources/cropped_log.webp" mode="aspectFit"></image>
				<text>{{resources.cropped_log}}</text>
			</view>
		</view>

        <!-- 树木展示区域 -->
		<view class="screen" :style="{height: 'calc(100vh - ' + (panelHeight - 5) + 'px)'}">
			<view v-bind:is="treeType" :state="state"></view>
		</view>

		<view class="btns" :style="{bottom: (panelHeight + 20) + 'px'}">
            <!-- 主按钮 (仅在未种植或可收获时显示) -->
			<button v-if="btnText" type="default" class="mainBtn" @click="handleMainBtnClick" :class="{harvest: state.tree_status == '结果'}">
				{{btnText}}
			</button>
		</view>

        <!-- 底部任务面板 (常态显示，可拖拽) -->
        <view class="bottom-sheet" :class="{dragging: isDragging}" :style="{height: panelHeight + 'px'}">
            <!-- 拖拽手柄 -->
            <view class="drag-handle-area" @touchstart="handleDragStart" @touchmove="handleDragMove" @touchend="handleDragEnd">
                <view class="drag-handle"></view>
            </view>
            
            <view class="sheet-content">
                <!-- 成长进度条 (移动到此处) -->
                <view class="growth-card" v-if="state.tree_status != '未种植' && state.tree_status != '结果'">
                    <view class="growth-header">
                        <view class="growth-title">
                            <text class="icon">🌲</text>
                            <text class="label">成长值</text>
                        </view>
                        <text class="val">{{Math.floor(growth_val)}}/{{max_growth}}</text>
                    </view>
                    <view class="progress-track">
                        <view class="progress-bar" :style="{width: (Math.min(growth_val, max_growth) / max_growth * 100) + '%'}">
                            <view class="glare"></view>
                        </view>
                    </view>
                </view>

                <view class="sheet-header">
                    <text class="title">📋 每日任务</text>
                    <view class="task-summary" v-if="tasks.length > 0">
                        {{completedTaskCount}}/{{tasks.length}}
                    </view>
                </view>
                <view scroll-y="true" class="task-list">
                    <view class="task-item" v-for="task in tasks" :key="task.task_code">
                        <view class="task-icon">
                            <image v-if="task.icon" :src="task.icon" mode="aspectFit"></image>
                            <text v-else>🌱</text>
                        </view>
                        <view class="task-content">
                            <view class="task-name">{{task.task_name}}</view>
                            <view class="task-desc">{{task.task_desc}}</view>
                        </view>
                        <view class="task-action">
                            <view class="reward-tag">+{{task.growth_reward}} XP</view>
                            <button
                                v-if="task.task_name.includes('签到')"
                                class="do-btn"
                                size="mini"
                                :disabled="task.status == 'completed'"
                                @click="doTask(task)"
                            >
                                {{task.status == 'completed' ? '已完成' : '领取'}}
                            </button>
                            <button
                                v-else-if="task.status == 'completed'"
                                class="do-btn"
                                size="mini"
                                disabled
                            >
                                已完成
                            </button>
                        </view>
                    </view>
                    <view class="empty-tip" v-if="tasks.length === 0">
                        <text>💤 暂无任务，休息一下吧~</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 收获结果弹窗 -->
        <view class="result-modal-mask" v-if="showResultModal" @click="closeResultModal">
            <view class="result-modal" @click.stop>
                <view class="result-header">
                    <text>🎉 收获颇丰 🎉</text>
                </view>
                <view class="result-body">
                    <view class="reward-item" v-if="harvestResult.log > 0">
                        <image src="../../static/resources/log.png" mode="aspectFit"></image>
                        <text>原木 x {{harvestResult.log}}</text>
                    </view>
                    <view class="reward-item" v-if="harvestResult.apple > 0">
                        <image src="../../static/resources/apple.png" mode="aspectFit"></image>
                        <text>苹果 x {{harvestResult.apple}}</text>
                    </view>
                </view>
                <button class="confirm-btn" @click="closeResultModal">开心收下</button>
            </view>
        </view>
        
        <task-reward-modal 
            ref="taskRewardModal"
            @harvest="handleHarvestFromModal">
        </task-reward-modal>

	</view>
</template>

<script>
	import axios from 'axios'
	import defaultTree from "../../components/plantTrees/defaultTree/defaultTree.vue"
    import TaskRewardModal from "../../components/TaskRewardModal.vue"

    export default {
		components:{
			defaultTree,
            TaskRewardModal
		},
		data() {
			return{
				treeType:"defaultTree",
				plant_time:Date.now(),
				is_gotten:0,
				state:{},
				btnText:"", // 默认为空，不显示
				selectedTreeType:"defaultTree",
				resources:{
					log:0,
					apple:0,
                    cropped_log: 0
				},
                // New Data
                tasks: [],
                growth_val: 0,
                max_growth: 100,
                showResultModal: false,
                harvestResult: {
                    log: 0,
                    apple: 0
                },
                isDragging: false,
                panelHeight: 0,
                screenHeight: 0,
                startY: 0,
                startHeight: 0
			}
		},
        computed: {
            completedTaskCount() {
                return this.tasks.filter(t => t.status === 'completed').length;
            },
            heightLevels() {
                if (!this.screenHeight) return [0, 0, 0];
                return [
                    this.screenHeight * 0.2, // 1/5 屏
                    this.screenHeight * 0.4, // 调整为 40% 以容纳进度条
                    this.screenHeight * 0.6  // 60%
                ];
            }
        },
		methods:{
			refreshPage(){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/treePlant/get_treePlant_of', 
					{
						headers: {
							 'Content-Type': 'application/json',//设置请求头请求格式为JSON
							 'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					}
				).then((res) => {
					if(res.data.length > 0){
                        let data = res.data[0];
						this.treeType = data.treeType;
						this.plant_time = data.plant_time;
						this.is_gotten = data.is_gotten;
						this.state = data;
                        this.tasks = data.tasks || [];
                        this.growth_val = data.growth_val || 0;
                        this.max_growth = data.max_growth || 100;
					} else {
						this.treeType = "defaultTree";
						this.plant_time = Date.now();
						this.is_gotten = 0;
						this.state = {
							tree_status:"未种植"
						};
                        this.tasks = [];
                        this.growth_val = 0;
					}
					console.log(this.state);
					this.handleData();
					this.$forceUpdate();
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
			handleData(){
				let _this = this;
				if(this.treeType == "defaultTree"){
					if(this.state.tree_status == "未种植"){
						_this.btnText = "🌱 种下树苗";
					} else if(this.state.tree_status == "结果"){
                         _this.btnText = "🪓 收获";
                    } else {
						// 种植 or 开花 (成长中)
                        // 隐藏主按钮
                        _this.btnText = "";
					}
				}
			},
			handleMainBtnClick(){
                if (!this.btnText) return;

				if (this.btnText.includes("种下树苗")) {
                    this.plantTree();
                } else if (this.btnText.includes("收获")) {
                    this.gotTree();
                }
			},
            doTask(task) {
                if (task.status == 'completed') return;
                
                // 仅允许签到任务在此页面领取
                if (!task.task_name.includes('签到')) {
                    uni.showToast({
                        title: '请前往对应功能区完成任务',
                        icon: 'none'
                    });
                    return;
                }
                
                uni.showLoading({ title: '领取中' });
                let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
                
                axios.post(this.$baseUrl + '/treePlant/do_task', 
                    { task_code: task.task_code },
                    {
                        headers: {
                             'Content-Type': 'application/json',
                             'Authorization': 'Bearer ' + tk
                        }
                    }
                ).then((res) => {
                    const reward = res.data && res.data.reward ? res.data.reward : 0
                    const growth = res.data && typeof res.data.growth_val === 'number' ? res.data.growth_val : this.growth_val
                    const status = res.data && res.data.tree_status ? res.data.tree_status : this.state.tree_status
                    if (this.$refs.taskRewardModal) {
                        this.$refs.taskRewardModal.show({
                            reward: reward,
                            taskName: task.task_name,
                            icon: task.icon,
                            currentGrowth: growth,
                            maxGrowth: this.max_growth || 100,
                            canHarvest: status === '结果'
                        })
                    }
                    this.refreshPage() 
                }).catch((error) => {
                    let msg = error.response ? error.response.data.msg : error.toString();
                    uni.showToast({ title: msg, icon: 'none' });
                }).then(() => {
                    uni.hideLoading();
                });
            },
            handleHarvestFromModal() {
                this.gotTree()
            },
			plantTree(){
				uni.showLoading({
					title: '播种中'
				});
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/treePlant/plant_tree?tree_type=' + this.selectedTreeType, 
				{
					headers: {
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
				).then((res) => {
					this.refreshPage();
					uni.showToast({
						title: "已种下树苗",
						icon:'none',
						duration: 2000
					});
				}).catch(function (error) {
					uni.showToast({
						title: "系统繁忙",
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
			gotTree(){
				uni.showLoading({
					title: '收获中'
				});
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/treePlant/got_tree', 
				{
					headers: {
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
				).then((res) => {
                    // 解析返回的字符串，提取数字
                    // 假设返回格式: '已收获，获得原木 × 5 苹果 × 2'
                    let msg = res.data;
                    let logMatch = msg.match(/原木\s*×\s*(\d+)/);
                    let appleMatch = msg.match(/苹果\s*×\s*(\d+)/);
                    
                    this.harvestResult.log = logMatch ? parseInt(logMatch[1]) : 0;
                    this.harvestResult.apple = appleMatch ? parseInt(appleMatch[1]) : 0;
                    
                    this.showResultModal = true;
                    
					this.refreshPage();
					this.refreshResources();
				}).catch(function (error) {
					uni.showToast({
						title: "收获失败",
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
            closeResultModal() {
                this.showResultModal = false;
            },
			refreshResources(){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/resource/get_resources', 
					{
						headers: {
							 'Content-Type': 'application/json',//设置请求头请求格式为JSON
							 'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					}
				).then((res) => {
					this.resources = res.data[0];
					this.$forceUpdate();
				}).catch(function (error) {
					console.error(error);
				})
			},
            
            // Drag Handling
            handleDragStart(e) {
                this.isDragging = true;
                this.startY = e.touches[0].clientY;
                this.startHeight = this.panelHeight;
            },
            handleDragMove(e) {
                if (!this.isDragging) return;
                let deltaY = this.startY - e.touches[0].clientY; 
                let newHeight = this.startHeight + deltaY;
                
                // 限制在三档范围内，稍微超出一点点没关系，end 时会吸附
                const minH = this.heightLevels[0];
                const maxH = this.heightLevels[2];
                if (newHeight < minH - 50) newHeight = minH - 50;
                if (newHeight > maxH + 50) newHeight = maxH + 50;
                
                this.panelHeight = newHeight;
            },
            handleDragEnd() {
                this.isDragging = false;
                // 吸附到最近的档位
                const current = this.panelHeight;
                let closest = this.heightLevels[0];
                let minDiff = Math.abs(current - closest);
                
                this.heightLevels.forEach(level => {
                    let diff = Math.abs(current - level);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closest = level;
                    }
                });
                
                this.panelHeight = closest;
            }
		},
		onShow(){
			uni.showLoading({
				title: '加载中'
			});
            
            // 获取屏幕高度并初始化面板高度
            const res = uni.getSystemInfoSync();
            this.screenHeight = res.windowHeight;
            this.panelHeight = this.screenHeight * 0.4; // 初始为 40%
            
			this.refreshPage();
			this.refreshResources();
		}
	}
</script>

<style scoped lang="scss">
    // 游戏风格变量
    $game-border: 4rpx solid #333;
    $game-shadow: 6rpx 6rpx 0 #333;
    $game-radius: 20rpx;
    $game-text-color: #333;
    $game-bg-color: #fcfcfc;
    
	.outer{
        position: relative;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        
        .bg-gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, #81d4fa 0%, #a5d6a7 100%); // 更鲜艳的天空和草地
            z-index: -1;
        }

        // 资源栏优化
        .balance-bar {
            position: absolute;
            right: 20rpx;
            display: flex;
            flex-direction: column;
            gap: 15rpx;
            z-index: 10;
            
            .res-item {
                background: #fff;
                padding: 10rpx 20rpx;
                border-radius: 30rpx;
                display: flex;
                align-items: center;
                border: 3rpx solid #333;
                box-shadow: 4rpx 4rpx 0 rgba(0,0,0,0.2);
                
                image {
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 15rpx;
                }
                text {
                    font-size: 28rpx;
                    font-weight: 800;
                    color: #333;
                }
            }
        }

		view.screen{
			width:100vw;
			overflow: hidden;
			position:absolute;
			top: 0;
			left: 0;
			z-index: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		view.btns{
			width:100vw;
			position:absolute;
            left: 0;
            height: 200rpx;
            z-index: 20;
            pointer-events: none; // 让点击穿透到下面的元素，除非点到按钮
            
			.mainBtn{
                pointer-events: auto;
				position:absolute;
				bottom:100rpx;
				left:50vw;
				transform: translateX(-50%);
				height:100rpx;
				width:350rpx;
				border-radius: 50rpx;
				background-color: #ffab91;
				font-size: 36rpx;
                line-height: 100rpx;
                font-weight: bold;
				color: #3e2723;
				transition: all .1s;
                border: 4rpx solid #3e2723;
                box-shadow: 0 8rpx 0 #3e2723;
                
                &.harvest {
                    background-color: #ffd54f;
                    animation: pulse 2s infinite;
                }
                
                &:active {
                    transform: translateX(-50%) translateY(4rpx);
                    box-shadow: 0 4rpx 0 #3e2723;
                }
			}
		}
        
        @keyframes pulse {
            0% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.05); }
            100% { transform: translateX(-50%) scale(1); }
        }

        // Bottom Sheet Styles (常态显示)
        .bottom-sheet {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #fff9c4; // 浅黄色背景
            border-top: 4rpx solid #333;
            border-radius: 30rpx 30rpx 0 0;
            z-index: 50;
            display: flex;
            flex-direction: column;
            transition: height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            
            &.dragging {
                transition: none;
            }
            
            .drag-handle-area {
                width: 100%;
                height: 50rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: ns-resize;
                
                .drag-handle {
                    width: 80rpx;
                    height: 10rpx;
                    background: #d7ccc8;
                    border: 2rpx solid #8d6e63;
                    border-radius: 5rpx;
                }
            }
            
            .sheet-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                padding: 0 30rpx 30rpx 30rpx;
                overflow: auto;
                
                // 新增：成长进度卡片
                .growth-card {
                    background: #e1f5fe;
                    border: 3rpx solid #333;
                    border-radius: 20rpx;
                    padding: 20rpx;
                    margin-bottom: 25rpx;
                    box-shadow: 4rpx 4rpx 0 #333;
                    
                    .growth-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10rpx;
                        
                        .growth-title {
                            display: flex;
                            align-items: center;
                            .icon { margin-right: 10rpx; }
                            .label {
                                font-size: 28rpx;
                                font-weight: 800;
                                color: #333;
                            }
                        }
                        
                        .val {
                            font-size: 28rpx;
                            font-weight: 800;
                            color: #0277bd;
                        }
                    }
                    
                    .progress-track {
                        width: 100%;
                        height: 24rpx;
                        background: #fff;
                        border: 3rpx solid #333;
                        border-radius: 12rpx;
                        overflow: hidden;
                        
                        .progress-bar {
                            height: 100%;
                            background: #4fc3f7;
                            border-right: 2rpx solid #333;
                            position: relative;
                            transition: width 0.5s ease-out;
                            
                            .glare {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                                animation: glare 2s infinite;
                            }
                        }
                    }
                }
                
                .sheet-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20rpx;
                    
                    .title {
                        font-size: 32rpx;
                        font-weight: 900;
                        color: #5d4037;
                    }
                    .task-summary {
                        font-size: 24rpx;
                        color: #5d4037;
                        background: #ffe082;
                        padding: 5rpx 15rpx;
                        border: 2rpx solid #333;
                        border-radius: 20rpx;
                        font-weight: bold;
                    }
                }
                
                .task-list {
                    flex: 1;

                    .task-item {
                        display: flex;
                        align-items: center;
                        padding: 20rpx;
                        background: #fff;
                        border: 3rpx solid #333;
                        border-radius: 20rpx;
                        margin-bottom: 20rpx;
                        box-shadow: 4rpx 4rpx 0 #e0e0e0;
                        
                        .task-icon {
                            width: 80rpx;
                            height: 80rpx;
                            background: #f1f8e9;
                            border: 2rpx solid #333;
                            border-radius: 20rpx;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 20rpx;
                            font-size: 40rpx;
                        }
                        
                        .task-content {
                            flex: 1;
                            .task-name {
                                font-size: 28rpx;
                                font-weight: 800;
                                color: #333;
                                margin-bottom: 5rpx;
                            }
                            .task-desc {
                                font-size: 22rpx;
                                color: #757575;
                            }
                        }
                        
                        .task-action {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                            
                            .reward-tag {
                                font-size: 20rpx;
                                color: #f57f17;
                                margin-bottom: 10rpx;
                                background: #fff9c4;
                                padding: 2rpx 10rpx;
                                border: 2rpx solid #fbc02d;
                                border-radius: 8rpx;
                                font-weight: bold;
                            }
                            
                            .do-btn {
                                margin: 0;
                                background: #66bb6a;
                                color: white;
                                font-size: 24rpx;
                                border-radius: 15rpx;
                                padding: 0 30rpx;
                                height: 60rpx;
                                line-height: 56rpx;
                                border: 3rpx solid #1b5e20;
                                box-shadow: 0 4rpx 0 #1b5e20;
                                font-weight: bold;
                                
                                &:active {
                                    transform: translateY(4rpx);
                                    box-shadow: none;
                                }
                                
                                &[disabled] {
                                    background: #bdbdbd;
                                    border-color: #616161;
                                    box-shadow: none;
                                    color: #616161;
                                }
                            }
                        }
                    }
                    
                    .empty-tip {
                        text-align: center;
                        color: #8d6e63;
                        padding: 50rpx 0;
                        font-weight: bold;
                    }
                }
            }
        }

        // Result Modal
        .result-modal-mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 200;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .result-modal {
                width: 600rpx;
                background: #fff;
                border: 6rpx solid #333;
                border-radius: 40rpx;
                padding: 40rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                box-shadow: 12rpx 12rpx 0 rgba(0,0,0,0.3);
                animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                
                .result-header {
                    margin-bottom: 40rpx;
                    text {
                        font-size: 44rpx;
                        font-weight: 900;
                        color: #f57f17;
                        text-shadow: 2rpx 2rpx 0 #333;
                        -webkit-text-stroke: 1rpx #333;
                    }
                }
                
                .result-body {
                    display: flex;
                    gap: 40rpx;
                    margin-bottom: 50rpx;
                    
                    .reward-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background: #fff9c4;
                        padding: 20rpx;
                        border: 3rpx solid #333;
                        border-radius: 20rpx;
                        
                        image {
                            width: 100rpx;
                            height: 100rpx;
                            margin-bottom: 15rpx;
                        }
                        text {
                            font-size: 32rpx;
                            color: #333;
                            font-weight: 800;
                        }
                    }
                }
                
                .confirm-btn {
                    width: 80%;
                    height: 90rpx;
                    line-height: 84rpx;
                    background: #ffca28;
                    color: #3e2723;
                    border-radius: 45rpx;
                    font-size: 36rpx;
                    font-weight: 900;
                    border: 4rpx solid #3e2723;
                    box-shadow: 0 6rpx 0 #3e2723;
                    
                    &:active {
                        transform: translateY(6rpx);
                        box-shadow: none;
                    }
                }
            }
        }
        
        @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes glare {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
	}
</style>
