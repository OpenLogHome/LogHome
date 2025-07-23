<template>
    <div class="banner-container" v-if="banners.length > 0" v-dark>
        <swiper class="banner-swiper" 
            :indicator-dots="false" 
            :autoplay="autoplay" 
            :interval="8000" 
            :duration="500"
            :circular="true"
            indicator-active-color="#ffffff"
            indicator-color="rgba(255, 255, 255, 0.4)">
            <swiper-item 
                v-for="(banner, index) in banners" 
                :key="'banner-'+index" 
                class="banner-item"
                @click="navigateToBanner(banner)">
                <log-image :src="banner.image_url" alt="banner" class="banner-image"/>
                <!-- <div class="banner-mask" v-if="banner.title">
                    <div class="banner-title">{{banner.title}}</div>
                </div> -->
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
    name: "banner",
    mixins: [darkModeMixin],
    props: {
        page: {
            type: String,
            default: 'library'
        },
        // 新增可配置项
        autoplay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 3000
        },
        duration: {
            type: Number,
            default: 500
        },
        showDots: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            banners: []
        }
    },
    created() {
        this.getBanners();
    },
    methods: {
        async getBanners() {
            axios.get(this.$baseUrl + '/library/get_banners', {
                params: {
                    page: this.page
                }
            }).then((res) => {
                this.banners = res.data;
            }).catch((error) => {
                uni.showToast({
                    title: error.toString(),
                    icon:'none',
                    duration: 2000
                });
            }).then(() => {
                uni.hideLoading();
            });
        },
        navigateToBanner(banner) {
            if (banner.link_url && banner.link_url !== "None") {
                uni.navigateTo({
                    url: banner.link_url
                });
            }
        }
    }
}
</script>

<style scoped lang="scss">
.banner-container {
    margin: 10rpx 0 10rpx 0;
    padding: 10rpx 0;
    
    &.dark-mode {
        background-color: var(--card-background);
    }

    .banner-swiper {
        width: 710rpx;
        height: 150rpx; /* 7:2比例 (710/203 ≈ 7/2) */
        margin: 0 20rpx;
    }

    .banner-item {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 10rpx;
        overflow: hidden;
        
        &.dark-mode {
            box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
        }

        .banner-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10rpx;
        }

        .banner-mask {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 10rpx 20rpx;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
            border-radius: 0 0 10rpx 10rpx;

            .dark-mode & {
                background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
            }
        }
    }
}
</style> 