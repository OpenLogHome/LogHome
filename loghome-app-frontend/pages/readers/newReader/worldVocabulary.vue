<template>
	<div class="articleContent worldVocabulary" :style="{
        'height': '100%',
        'overflow-y': 'auto',
        'color': themesData[readerSettings.theme].fontColor
    }">
		<div class="topBar">
			<div class="left" @click="imgUploadVisible = true">
				<div class="pic" v-if="!article.content.pic && article.title"
                    :style="{'backgroundColor': themesData[readerSettings.theme].lineColor}">
					{{article.title.slice(0, 1)}} </div>
				<log-image :src="article.content.pic" alt="" v-if="article.content.pic"/>
			</div>
			<div class="right">
				<div class="tit" :style="{'color': themesData[readerSettings.theme].fontColor}">词条名称</div>
				<input class="input" placeholder="请输入词条名称" v-model="article.title" 
					:style="{
                        fontSize:readerSettings.fontSize * 1.2 + 'rpx',
                        'color': themesData[readerSettings.theme].fontColor
                    }" disabled />
			</div>
		</div>
		<div class="article"
			:style="{
                fontSize:readerSettings.fontSize + 'rpx',
                lineHeight:readerSettings.fontSize * readerSettings.lineHeight + 'rpx',
                fontFamily: fonts[readerSettings.font].family
            }">
			<div class="desc" style="margin-bottom: 30rpx;">
				{{article.content.desc}}
			</div>
			<el-card class="box-card" v-for="(item, index) in article.content.attributes"
				style="margin-bottom: 20rpx;" :key="'attr' + index" :body-style="{ padding: '10px', backgroundColor: themesData[readerSettings.theme].backgroundColor }">
				<div style="display:flex; justify-content:space-between;">
					<div class="attr" :style="{color: themesData[readerSettings.theme].fontColor}">
						<span style="color:#888888; margin-right: 40rpx;">{{item.name}}</span>
						{{item.content}}
					</div>
				</div>
			</el-card>

			<div v-if="article.content.relations && article.content.relations.length > 0">
				<div style="margin: 30rpx 0 20rpx 0; font-weight: bold; font-size: 32rpx;"
					:style="{color: themesData[readerSettings.theme].fontColor}">
					词条关系
				</div>
				<el-card class="box-card" v-for="(item, index) in article.content.relations"
					style="margin-bottom: 20rpx;" :key="'rela' + index"
					:body-style="{ padding: '10px', backgroundColor: themesData[readerSettings.theme].backgroundColor }">
					<div style="display:flex; justify-content:space-between; align-items: center;" @click="jumpToVocabulary(item.id)">
						<div class="attr" :style="{color: themesData[readerSettings.theme].fontColor}">
							<span style="color:#888888; margin-right: 40rpx;">{{item.name}}</span>
							{{item.relation}}
						</div>
						<i class="el-icon-arrow-right" style="color: #888888;"></i>
					</div>
				</el-card>
			</div>
            <!-- Add some padding at bottom for scrolling -->
            <div style="height: 100rpx;"></div>
		</div>
	</div>
</template>

<script>
export default {
    props: {
        article: {
            type: Object,
            required: true
        },
        readerSettings: {
            type: Object,
            required: true
        },
        themesData: {
            type: Object,
            required: true
        },
        fonts: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            imgUploadVisible: false
        }
    },
    mounted() {
        this.article.content = JSON.parse(this.article.content)
        this.$forceUpdate();
    },
    methods: {
        jumpToVocabulary(articleId) {
            this.$emit('jumpToArticle', articleId);
        }
    }
}
</script>

<style scoped lang="less">
.articleContent {
    height: 100%;
    width: 100%;
    
    .topBar {
        box-sizing: border-box;
        position: relative;
        display: flex;
        padding: 30rpx;
        padding-top: 60rpx;

        div.left {
            transform: translateY(-5rpx);

            .pic {
                width: 150rpx;
                height: 150rpx;
                border-radius: 100%;
                background-color: #6e3b24;
                display: flex;
                color: white;
                justify-content: center;
                align-items: center;
                font-size: 50rpx;

            }

            img {
                width: 150rpx;
                height: 150rpx;
                border-radius: 100%;
            }
        }

        div.right {
            margin-left: 30rpx;

            .tit {
                padding-left: 20rpx;
                margin-bottom: 20rpx;
            }

            input {
                padding-left: 20rpx;
                font-size: 35rpx;
                font-weight: bold;
                line-height: 150%;
                background: transparent;
                border: none;
            }
        }

    }
    
    .article {
        padding: 0 30rpx;
        white-space: pre-line;
    }
}
</style>
