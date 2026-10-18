<template>
  <Workspace :title="$t('通行证与红石规则')" active="/me"
    ><div class="rules-content">
      <div class="rules-hero">
        <div class="rules-hero__marks">
          <img src="/social/membership/loghome-pass.png" />
          <img src="/social/icons/redstone.svg" />
        </div>
        <span class="rules-hero__title">{{ $t("权益清晰，消费有据可查") }}</span>
        <span class="rules-hero__description">{{
          $t("以下规则适用于原木通行证、超级原木通行证及红石相关服务。")
        }}</span>
        <span class="rules-hero__date">{{
          $t("当前版本生效日期：2026 年 8 月 1 日")
        }}</span>
      </div>

      <div class="rules-section">
        <div class="rules-section__heading">
          <span>01</span>
          <div>
            <span>{{ $t("通行证方案") }}</span
            ><span>{{ $t("开通价格与有效期") }}</span>
          </div>
        </div>
        <div class="price-grid">
          <div class="price-card">
            <img src="/social/membership/loghome-pass.png" />
            <span class="price-card__name">{{ $t("原木通行证") }}</span>
            <span>{{ $t("月付 660 原木") }}</span
            ><span>{{ $t("年付 7200 原木") }}</span>
          </div>
          <div class="price-card price-card--super">
            <img src="/social/membership/loghome-super-pass.png" />
            <span class="price-card__name">{{ $t("超级原木通行证") }}</span>
            <span>{{ $t("月付 880 原木") }}</span
            ><span>{{ $t("年付 9600 原木") }}</span>
          </div>
        </div>
        <div class="rule-list">
          <div>
            <span>•</span
            ><span>{{
              $t(
                "月付按 30 天、年付按 365\n            天计算权益有效期，支付成功后立即生效。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t(
                "同档续费会从现有有效期末尾顺延；实际扣除和新到期日以确认页面及服务端结果为准。"
              )
            }}</span>
          </div>
        </div>
      </div>

      <div class="rules-section">
        <div class="rules-section__heading">
          <span>02</span>
          <div>
            <span>{{ $t("升级与自动续费") }}</span
            ><span>{{ $t("状态随时可查、可管理") }}</span>
          </div>
        </div>
        <div class="rule-list">
          <div>
            <span>•</span
            ><span>{{
              $t(
                "原木通行证升级至超级原木通行证，仅收取剩余有效天数对应的档位差价，到期日保持不变。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t("超级原木通行证有效期内暂不支持降级；可在到期后重新选择通行证档位。")
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t(
                "开启自动续费后，将在到期时按当前订阅周期自动扣除原木；余额不足时续费失败，权益到期终止。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t("关闭自动续费不会提前结束已生效权益，当前通行证仍可使用至到期日。")
            }}</span>
          </div>
        </div>
      </div>

      <div class="rules-section">
        <div class="rules-section__heading">
          <span>03</span>
          <div>
            <span>{{ $t("红石赠送") }}</span
            ><span>{{ $t("会员赠送与普通用户月赠") }}</span>
          </div>
        </div>
        <div class="grant-grid">
          <div>
            <span>{{ $t("普通用户") }}</span
            ><span>6</span><span>{{ $t("红石 / 月") }}</span>
          </div>
          <div>
            <span>{{ $t("原木通行证") }}</span
            ><span>100</span><span>{{ $t("红石 / 周期") }}</span>
          </div>
          <div>
            <span>{{ $t("超级通行证") }}</span
            ><span>200</span><span>{{ $t("红石 / 周期") }}</span>
          </div>
        </div>
        <div class="rule-list">
          <div>
            <span>•</span
            ><span>{{
              $t(
                "普通用户每个自然月赠送 6\n            红石；当月存在有效通行证时不重复领取普通用户月赠。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t(
                "月付通行证在开通及每次续费成功后赠送；年付通行证开通时先赠送一次，之后按月到账。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t("标准版升级超级版时，当期按两档赠送标准的差额补赠红石。")
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t(
                "通行证赠送、升级补赠和普通用户月赠红石自到账日起 3\n            个月内有效。"
              )
            }}</span>
          </div>
        </div>
      </div>

      <div class="rules-section rules-section--redstone">
        <div class="rules-section__heading">
          <span>04</span>
          <div>
            <span>{{ $t("红石兑换与消费") }}</span
            ><span>{{ $t("所有变动均记录账单") }}</span>
          </div>
        </div>
        <div class="exchange-rate">
          <img src="/social/resources/log.png" /><span>{{ $t("10 原木") }}</span
          ><span>=</span><img src="/social/icons/redstone.svg" /><span>{{
            $t("1 红石")
          }}</span>
        </div>
        <div class="usage-list">
          <div>
            <span>{{ $t("问问原木娘") }}</span
            ><span>{{ $t("普通 1 · 深度 2") }}</span>
          </div>
          <div>
            <span>{{ $t("笔泡 AI 助手") }}</span
            ><span>{{ $t("普通 1 · 深度 2 · 图像 5") }}</span>
          </div>
          <div>
            <span>{{ $t("文本纠错") }}</span
            ><span>{{ $t("普通免费 · 通行证智能免费 · 普通 2") }}</span>
          </div>
        </div>
        <div class="rule-list">
          <div>
            <span>•</span
            ><span>{{
              $t(
                "发起付费 AI\n            操作即按页面显示数量扣除红石；红石不足时不会创建付费任务。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t(
                "消费时优先使用最早到期的赠送红石，再使用永久有效的兑换红石；原木兑换所得红石不会过期。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t(
                "同一任务断线重连或重复提交不会重复扣费。兑换、赠送与消费记录均可在红石中心查询。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t("红石兑换比例和功能消耗如有调整，将以操作前页面展示为准。")
            }}</span>
          </div>
        </div>
        <div v-if="aiAssistanceEnabled" class="section-link" @tap="gotoRedstone">
          <span>{{ $t("前往红石中心") }}</span
          ><span class="ui-chevron" aria-hidden="true"></span>
        </div>
      </div>

      <div class="rules-section">
        <div class="rules-section__heading">
          <span>05</span>
          <div>
            <span>{{ $t("赠送与兑换码") }}</span
            ><span>{{ $t("权益发放至指定账号") }}</span>
          </div>
        </div>
        <div class="rule-list">
          <div>
            <span>•</span
            ><span>{{
              $t(
                "赠送好友前请确认接收账号和通行证方案；赠送成功后，权益发放至所选好友账号。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t(
                "兑换码需在有效状态下使用。同一兑换码不可重复使用，具体档位与时长以兑换确认结果为准。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{ $t("已有通行证时，兑换权益会依据对应方案进行续期或升级。") }}</span>
          </div>
        </div>
      </div>

      <div class="rules-section">
        <div class="rules-section__heading">
          <span>06</span>
          <div>
            <span>{{ $t("会员专属功能") }}</span
            ><span>{{ $t("权益有效期间开放") }}</span>
          </div>
        </div>
        <div class="rule-list">
          <div>
            <span>•</span
            ><span>{{
              $t(
                "定时发布仅限原木通行证及超级原木通行证会员使用，创建任务时会校验会员状态。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t(
                "主作者与一名协作者组成的双人协作作品免费；三人及以上协作需要主作者持有标准或超级原木通行证，否则协作者仅可预览作品，无法启用编辑、增删章节、排序和发布等其他权限。"
              )
            }}</span>
          </div>
          <div>
            <span>•</span
            ><span>{{
              $t(
                "其他会员专属能力以对应功能页面标识为准；通行证到期后，未执行的新操作将不再享有会员权限。"
              )
            }}</span>
          </div>
        </div>
      </div>

      <div class="rules-note">
        {{
          $t(
            "如页面展示与历史说明存在差异，以操作确认页、当前有效规则及服务端实际处理结果为准。"
          )
        }}
      </div>
    </div>
  </Workspace>
</template>

<script>
import Workspace from "~/components/social/Workspace.vue";
export default {
  components: { Workspace },
  head: () => ({ title: "通行证与红石规则 - 原木社区" }),
};
</script>
<style scoped>
.rules-content {
  color: var(--ink, #382d25);
}
.rules-hero,
.rules-section {
  background: var(--surface, #fffdf9);
  border: 1px solid var(--line, #e9e0d5);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
}
.rules-hero__marks,
.price-grid {
  display: flex;
  gap: 24px;
}
.rules-hero__marks img {
  width: 45px;
  height: 45px;
  object-fit: contain;
}
.rules-hero span {
  display: block;
  margin: 12px 0;
  line-height: 1.8;
}
.rules-hero__title {
  font-size: 24px;
  font-weight: 700;
}
.rules-hero__eyebrow {
  font-size: 11px;
  color: var(--wood, #947358);
}
.rules-hero__date {
  font-size: 12px;
  color: var(--muted, #82766c);
}
.rules-section__heading {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 19px;
  font-weight: 600;
  margin-bottom: 20px;
}
.rules-section__heading > span {
  color: var(--wood, #947358);
}
.rules-section__heading div span {
  display: block;
}
.rules-section__heading div span:last-child {
  font-size: 13px;
  color: var(--muted, #82766c);
  font-weight: 400;
  margin-top: 6px;
}
.price-card {
  flex: 1;
  min-width: 0;
  background: var(--surface, #fffdf9);
  color: var(--ink, #30343b);
  border: 1px solid var(--line, #e2e6eb);
  border-radius: 10px;
  padding: 20px;
}
.price-card span {
  display: block;
  margin-top: 8px;
  font-size: 14px;
}
.price-card img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.price-card__name {
  font-weight: 600;
}
.grant-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.grant-grid > div {
  padding: 18px;
  border-radius: 10px;
  background: var(--surface, #fffdf9);
  border: 1px solid var(--line, #e2e6eb);
}
.grant-grid span {
  display: block;
  color: var(--muted, #5b626d);
  font-size: 13px;
}
.grant-grid span:nth-child(2) {
  margin: 10px 0;
  color: var(--wood, #c65320);
  font-size: 28px;
  font-weight: 600;
}
.exchange-rate {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}
.exchange-rate img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.usage-list > div {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 20px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line, #e2e6eb);
}
.usage-list span:last-child,
.rules-note {
  color: var(--muted, #5b626d);
  font-size: 13px;
  line-height: 1.8;
}
.rule-list > div {
  display: flex;
  gap: 10px;
  font-size: 14px;
  line-height: 1.9;
  margin: 12px 0;
}
.rules-footer {
  font-size: 13px;
  line-height: 1.9;
  color: var(--muted, #82766c);
}
@media (max-width: 600px) {
  .price-grid {
    flex-direction: column;
  }
  .grant-grid {
    grid-template-columns: 1fr;
  }
}
</style>
