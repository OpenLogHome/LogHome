<template>
    <span class="log-power-wordmark" :class="{ 'is-fallback': failed, 'is-english': isEnglish }" role="img" :aria-label="$t('common.brand.logPower')">
        <image v-if="!failed" :key="wordmarkSrc" class="wordmark-image" :src="wordmarkSrc"
            mode="aspectFit" aria-hidden="true" @error="failed = true" />
        <text v-else>{{ $t('common.brand.logPower') }}</text>
    </span>
</template>

<script>
export default {
    name: 'LogPowerWordmark',
    data() {
        return { failed: false }
    },
    computed: {
        isEnglish() {
            return this.$i18n.locale === 'en'
        },
        wordmarkSrc() {
            return this.isEnglish
                ? '/static/brand/log-power-wordmark-en.png'
                : '/static/brand/log-power-wordmark.png'
        }
    },
    watch: {
        wordmarkSrc() {
            this.failed = false
        }
    }
}
</script>

<style scoped>
.log-power-wordmark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.8em;
    height: 1em;
    vertical-align: -0.16em;
    flex-shrink: 0;
    line-height: 1;
    letter-spacing: normal;
    position: relative;
    /* Let the rising arrow extend above the text line without clipping. */
    overflow: visible;
}
.wordmark-image {
    display: block;
    width: 100%;
    /* Align the letter bodies with adjacent text; the arrow rises above them.
       Canvas: 2051 × 767; letter-body vertical center: 364px. */
    height: 142.1%;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-47.46%);
}
.log-power-wordmark.is-english {
    width: 5.2em;
}
.log-power-wordmark.is-english .wordmark-image {
    /* The English asset intentionally carries transparent vertical padding. */
    height: 270%;
    top: 50%;
    transform: translateY(-50%);
}
.log-power-wordmark.is-fallback {
    width: auto;
    height: auto;
    position: static;
    overflow: visible;
    vertical-align: baseline;
    line-height: inherit;
}
</style>
