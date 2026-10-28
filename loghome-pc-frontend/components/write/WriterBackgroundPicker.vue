<template>
  <div class="writer-background-picker">
    <button
      class="background-trigger"
      :aria-label="$t('选择写作背景')"
      :aria-expanded="String(open)"
      @click="open = true"
    >
      <img v-if="currentSkin" :src="currentSkin.image_url" alt="" />
      <span v-else class="background-swatch">Aa</span>
      <span class="background-trigger-copy"
        ><strong>{{ currentSkin ? currentSkin.skin_name : $t('纯色背景') }}</strong
        ><small>{{ $t('选择后立即预览') }}</small></span
      >
      <i class="el-icon-arrow-right" aria-hidden="true" />
    </button>
    <el-dialog
      :title="$t('写作背景')"
      :visible.sync="open"
      :custom-class="writerDialogClass + ' writer-background-dialog'"
      append-to-body
      width="600px"
    >
      <div class="background-tabs" role="group" :aria-label="$t('背景类型')">
        <button :aria-pressed="String(tab === 'theme')" @click="tab = 'theme'">
          {{ $t('纯色主题') }}
        </button>
        <button :aria-pressed="String(tab === 'skin')" @click="tab = 'skin'">
          {{ $t('背景皮肤') }}
        </button>
      </div>
      <p class="background-hint">
        {{ $t('点击卡片即可预览，背景会随当前主题调整明暗。') }}
      </p>
      <div
        v-if="tab === 'theme'"
        class="background-card-grid"
        role="group"
        :aria-label="$t('纯色背景')"
      >
        <button
          v-for="theme in themes"
          :key="theme.key"
          class="background-card"
          :aria-pressed="
            String(!currentSkin && preferences.theme === theme.key)
          "
          @click="selectTheme(theme.key)"
        >
          <span class="background-card-preview" :class="'preview-' + theme.key"
            >{{ $t('山川湖海') }}<br />{{ $t('落笔成诗') }}</span
          >
          <span>{{ theme.name }}</span>
        </button>
      </div>
      <div
        v-else
        class="background-card-grid"
        role="group"
        :aria-label="$t('背景皮肤')"
      >
        <button
          class="background-card"
          :aria-label="$t('纯色背景')"
          :aria-pressed="String(!currentSkin)"
          @click="
            $emit('preferences', { ...preferences, backgroundSkinKey: '' })
          "
        >
          <span class="background-card-preview background-swatch">Aa</span
          ><span>{{ $t('纯色背景') }}</span>
        </button>
        <button
          v-for="skin in skins"
          :key="skin.skin_key"
          class="background-card"
          :aria-pressed="
            String(preferences.backgroundSkinKey === skin.skin_key)
          "
          :aria-label="skin.skin_name + (skin.is_locked ? $t('，需要通行证') : '')"
          @click="selectSkin(skin)"
        >
          <span class="background-card-preview"
            ><img :src="skin.image_url" alt="" loading="lazy" /><span
              v-if="skin.required_membership !== 'none'"
              class="background-membership"
              >{{
                skin.required_membership === "super" ? $t('超级') : $t('通行证')
              }}</span
            ><i
              v-if="skin.is_locked"
              class="el-icon-lock background-lock"
              aria-hidden="true"
          /></span>
          <span>{{ skin.skin_name }}</span>
        </button>
      </div>
      <p v-if="tab === 'skin' && !skins.length" class="background-hint">
        {{ $t('暂无可用皮肤，可以先选择纯色主题。') }}
      </p>
      <span slot="footer"
        ><button class="secondary" @click="open = false">{{ $t('完成') }}</button></span
      >
    </el-dialog>
  </div>
</template>
<script>
import writerDialogTheme from "~/mixins/writer-dialog-theme";
import { WRITER_THEMES } from "~/utils/writer/preferences";
export default {
  mixins: [writerDialogTheme],
  props: { preferences: Object, skins: { type: Array, default: () => [] } },
  data: () => ({ open: false, tab: "skin", themes: WRITER_THEMES }),
  computed: {
    currentSkin() {
      return (
        this.skins.find(
          (skin) => skin.skin_key === this.preferences.backgroundSkinKey
        ) || null
      );
    },
  },
  methods: {
    selectTheme(theme) {
      this.$emit("preferences", {
        ...this.preferences,
        theme,
        backgroundSkinKey: "",
      });
    },
    selectSkin(skin) {
      if (skin.is_locked) {
        this.writerMessage(
          "info",
          this.$t('此背景需要{pass}', { pass: skin.required_membership === "super" ? this.$t('超级原木通行证') : this.$t('原木通行证') })
        );
        return;
      }
      this.$emit("preferences", {
        ...this.preferences,
        backgroundSkinKey: skin.skin_key,
      });
    },
  },
};
</script>
