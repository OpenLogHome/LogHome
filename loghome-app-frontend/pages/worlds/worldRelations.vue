<template>
	<div class="relations-page">
		<div class="chart-container" ref="chart" id="chart"></div>
		<div class="back-btn" @click="goBack">返回</div>
        <div class="loading" v-if="loading">加载关系数据中... {{loadedCount}}/{{totalCount}}</div>
	</div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
	data() {
		return {
			novelId: null,
			chart: null,
			nodes: [],
			links: [],
			loading: true,
			loadedCount: 0,
			totalCount: 0,
			colors: [
				'#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
				'#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#ff9f7f',
				'#fb7293', '#e062ae', '#e690d1', '#e7bcf3', '#9d96f5',
				'#8378ea', '#96bfff'
			]
		};
	},
	onLoad(options) {
		this.novelId = options.novel_id;
	},
	mounted() {
		if (this.novelId) {
			this.$nextTick(() => {
				this.fetchData();
			});
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
        async fetchData() {
            try {
                // First get list
                let res = await axios.get(this.$baseUrl + '/library/get_articles?id=' + this.novelId);
                let articles = res.data.filter(item => item.article_type == 'worldVocabulary');
                this.totalCount = articles.length;
                
                if (this.totalCount === 0) {
                    this.loading = false;
                    uni.showToast({title: '暂无词条', icon: 'none'});
                    return;
                }

                // Init nodes
                this.nodes = articles.map((item, index) => ({
                    id: item.article_id.toString(),
                    name: item.title,
                    symbolSize: 40 + (Math.random() * 20), // 随机大小增加视觉差异
                    value: item.article_id,
                    draggable: true,
                    itemStyle: {
                        color: this.colors[index % this.colors.length]
                    }
                }));

                this.initChart(); // Show nodes first

                // Fetch details concurrently
                const batchSize = 5;
                for (let i = 0; i < articles.length; i += batchSize) {
                    const batch = articles.slice(i, i + batchSize);
                    await Promise.all(batch.map(item => this.fetchArticleDetail(item.article_id)));
                    this.updateChart();
                }
                this.loading = false;
            } catch (e) {
                console.error(e);
                uni.showToast({title: '加载失败', icon: 'none'});
                this.loading = false;
            }
        },
        async fetchArticleDetail(articleId) {
            try {
                let res = await axios.get(this.$baseUrl + '/articles/get_article?id=' + articleId);
                if(res.data && res.data[0]) {
                    let contentStr = res.data[0].content;
                    if (contentStr) {
                        try {
                            let content = JSON.parse(contentStr);
                            if(content.relations) {
                                content.relations.forEach(rel => {
                                    // Check if target node exists
                                    if (this.nodes.some(n => n.id === rel.id.toString())) {
                                        this.links.push({
                                            source: articleId.toString(),
                                            target: rel.id.toString(),
                                            label: {
                                                show: true,
                                                formatter: rel.relation,
                                                fontSize: 10
                                            },
                                            lineStyle: {
                                                curveness: 0.2
                                            }
                                        });
                                    }
                                });
                            }
                        } catch (e) {
                            console.error("JSON parse error for article " + articleId, e);
                        }
                    }
                }
            } catch(e) {
                console.error(e);
            } finally {
                this.loadedCount++;
            }
        },
        initChart() {
            if(!this.$refs.chart) {
                console.error("Chart ref not found");
                return;
            }
            console.log("Initializing ECharts...");
            this.chart = echarts.init(this.$refs.chart);
            this.renderChart();
            
            // 使用 'click' 事件监听
            this.chart.on('click', (params) => {
                console.log("Chart clicked:", params.dataType, params);
                if (params.dataType === 'node') {
                    console.log("Node clicked, navigating to:", params.data.value);
                    uni.navigateTo({
                        url: '/pages/readers/newReader/article?id=' + params.data.value + '&novelId=' + this.novelId
                    });
                }
            });
            
            window.addEventListener('resize', () => {
                if(this.chart) this.chart.resize();
            });
        },
        updateChart() {
            if(this.chart) {
                this.chart.setOption({
                    series: [{
                        id: 'mainSeries',
                        data: this.nodes,
                        links: this.links
                    }]
                });
            }
        },
        renderChart() {
            const option = {
                title: {
                    text: '世界人物关系图',
                    left: 'center',
                    top: 20
                },
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        id: 'mainSeries',
                        type: 'graph',
                        layout: 'force',
                        data: this.nodes,
                        links: this.links,
                        roam: true,
                        draggable: true,
                        selectedMode: 'single',
                        select: {
                            itemStyle: {
                                borderWidth: 3,
                                borderColor: '#000'
                            }
                        },
                        label: {
                            show: true,
                            position: 'bottom',
                            formatter: '{b}'
                        },
                        force: {
                            repulsion: 300,
                            edgeLength: 150,
                            gravity: 0.1
                        },
                        lineStyle: {
                            color: 'source',
                            curveness: 0.3,
                            width: 2,
                            opacity: 0.7
                        },
                        edgeSymbol: ['none', 'arrow'],
                        edgeSymbolSize: 6,
                        emphasis: {
                            focus: 'adjacency',
                            lineStyle: {
                                width: 4
                            }
                        }
                    }
                ]
            };
            this.chart.setOption(option);
        }
	}
};
</script>

<style scoped>
.relations-page {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: #f5f5f5;
}
.chart-container {
    width: 100%;
    height: 100%;
    z-index: 1;
}
.back-btn {
    position: absolute;
    top: 40px;
    left: 20px;
    padding: 8px 16px;
    background: rgba(0,0,0,0.6);
    color: white;
    border-radius: 20px;
    z-index: 100;
    font-size: 14px;
    cursor: pointer;
}
.loading {
    position: absolute;
    top: 80px;
    left: 50%;
    height: fit-content;
    transform: translateX(-50%);
    background: rgba(255,255,255,0.9);
    padding: 10px 20px;
    border-radius: 20px;
    pointer-events: none;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    font-size: 12px;
    color: #666;
    z-index: 99;
}
</style>
