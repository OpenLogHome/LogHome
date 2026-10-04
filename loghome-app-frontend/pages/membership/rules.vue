<template>
	<view class="rules-page">
		<view class="rules-glow rules-glow--one"></view>
		<view class="rules-glow rules-glow--two"></view>

		<view class="rules-header">
			<view class="rules-header__back" @tap="goBack"><view class="rules-header__back-icon"></view></view>
			<text class="rules-header__title">通行证与红石规则</text>
			<view class="rules-header__spacer"></view>
		</view>

		<view class="rules-content">
			<view class="rules-hero">
				<view class="rules-hero__marks">
					<image src="/static/membership/loghome-pass.png" mode="aspectFit"></image>
					<image src="/static/icons/redstone.svg" mode="aspectFit"></image>
				</view>
				<text class="rules-hero__eyebrow">LOGHOME PASS · SERVICE RULES</text>
				<text class="rules-hero__title">权益清晰，消费有据可查</text>
				<text class="rules-hero__description">以下规则适用于原木通行证、超级原木通行证及红石相关服务。</text>
				<text class="rules-hero__date">当前版本生效日期：2026 年 8 月 1 日</text>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>01</text><view><text>通行证方案</text><text>开通价格与有效期</text></view></view>
				<view class="price-grid">
					<view class="price-card">
						<image src="/static/membership/loghome-pass.png" mode="aspectFit"></image>
						<text class="price-card__name">原木通行证</text>
						<text>月付 660 原木</text><text>年付 7200 原木</text>
					</view>
					<view class="price-card price-card--super">
						<image src="/static/membership/loghome-super-pass.png" mode="aspectFit"></image>
						<text class="price-card__name">超级原木通行证</text>
						<text>月付 880 原木</text><text>年付 9600 原木</text>
					</view>
				</view>
				<view class="rule-list">
					<view><text>•</text><text>月付按 30 天、年付按 365 天计算权益有效期，支付成功后立即生效。</text></view>
					<view><text>•</text><text>同档续费会从现有有效期末尾顺延；实际扣除和新到期日以确认页面及服务端结果为准。</text></view>
				</view>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>02</text><view><text>升级与自动续费</text><text>状态随时可查、可管理</text></view></view>
				<view class="rule-list">
					<view><text>•</text><text>原木通行证升级至超级原木通行证，仅收取剩余有效天数对应的档位差价，到期日保持不变。</text></view>
					<view><text>•</text><text>超级原木通行证有效期内暂不支持降级；可在到期后重新选择通行证档位。</text></view>
					<view><text>•</text><text>开启自动续费后，将在到期时按当前订阅周期自动扣除原木；余额不足时续费失败，权益到期终止。</text></view>
					<view><text>•</text><text>关闭自动续费不会提前结束已生效权益，当前通行证仍可使用至到期日。</text></view>
				</view>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>03</text><view><text>红石赠送</text><text>会员赠送与普通用户月赠</text></view></view>
				<view class="grant-grid">
					<view><text>普通用户</text><text>6</text><text>红石 / 月</text></view>
					<view><text>原木通行证</text><text>100</text><text>红石 / 周期</text></view>
					<view><text>超级通行证</text><text>200</text><text>红石 / 周期</text></view>
				</view>
				<view class="rule-list">
					<view><text>•</text><text>普通用户每个自然月赠送 6 红石；当月存在有效通行证时不重复领取普通用户月赠。</text></view>
					<view><text>•</text><text>月付通行证在开通及每次续费成功后赠送；年付通行证开通时先赠送一次，之后按月到账。</text></view>
					<view><text>•</text><text>标准版升级超级版时，当期按两档赠送标准的差额补赠红石。</text></view>
					<view><text>•</text><text>通行证赠送、升级补赠和普通用户月赠红石自到账日起 3 个月内有效。</text></view>
				</view>
			</view>

			<view class="rules-section rules-section--redstone">
				<view class="rules-section__heading"><text>04</text><view><text>红石兑换与消费</text><text>所有变动均记录账单</text></view></view>
				<view class="exchange-rate"><image src="/static/resources/log.png" mode="aspectFit"></image><text>10 原木</text><text>=</text><image src="/static/icons/redstone.svg" mode="aspectFit"></image><text>1 红石</text></view>
				<view class="usage-list">
					<view><text>问问原木娘</text><text>普通 1 · 深度 2</text></view>
					<view><text>笔泡 AI 助手</text><text>普通 1 · 深度 2 · 图像 5</text></view>
					<view><text>文本纠错</text><text>普通免费 · 通行证智能免费 · 普通 2</text></view>
				</view>
				<view class="rule-list">
					<view><text>•</text><text>发起付费 AI 操作即按页面显示数量扣除红石；红石不足时不会创建付费任务。</text></view>
					<view><text>•</text><text>消费时优先使用最早到期的赠送红石，再使用永久有效的兑换红石；原木兑换所得红石不会过期。</text></view>
					<view><text>•</text><text>同一任务断线重连或重复提交不会重复扣费。兑换、赠送与消费记录均可在红石中心查询。</text></view>
					<view><text>•</text><text>红石兑换比例和功能消耗如有调整，将以操作前页面展示为准。</text></view>
				</view>
				<view v-if="aiAssistanceEnabled" class="section-link" @tap="gotoRedstone"><text>前往红石中心</text><text class="ui-chevron" aria-hidden="true"></text></view>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>05</text><view><text>赠送与兑换码</text><text>权益发放至指定账号</text></view></view>
				<view class="rule-list">
					<view><text>•</text><text>赠送好友前请确认接收账号和通行证方案；赠送成功后，权益发放至所选好友账号。</text></view>
					<view><text>•</text><text>兑换码需在有效状态下使用。同一兑换码不可重复使用，具体档位与时长以兑换确认结果为准。</text></view>
					<view><text>•</text><text>已有通行证时，兑换权益会依据对应方案进行续期或升级。</text></view>
				</view>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>06</text><view><text>会员专属功能</text><text>权益有效期间开放</text></view></view>
				<view class="rule-list">
					<view><text>•</text><text>定时发布仅限原木通行证及超级原木通行证会员使用，创建任务时会校验会员状态。</text></view>
					<view><text>•</text><text>主作者与一名协作者组成的双人协作作品免费；三人及以上协作需要主作者持有标准或超级原木通行证，否则协作者仅可预览作品，无法启用编辑、增删章节、排序和发布等其他权限。</text></view>
					<view><text>•</text><text>其他会员专属能力以对应功能页面标识为准；通行证到期后，未执行的新操作将不再享有会员权限。</text></view>
				</view>
			</view>

			<view class="rules-note">如页面展示与历史说明存在差异，以操作确认页、当前有效规则及服务端实际处理结果为准。</view>
		</view>
	</view>
</template>

<script>
export default {
	methods: {
		goBack() { uni.navigateBack({ delta: 1 }); },
		gotoRedstone() { uni.navigateTo({ url: '/pages/redstone/index' }); },
	},
};
</script>

<style scoped lang="scss">
page { background: #120d0b; }
.rules-page { --accent: #efc57e; --text: #fff3df; --secondary: #cbb8a0; --muted: #927f6d; --border: rgba(255,225,181,.13); position: relative; box-sizing: border-box; min-height: 100vh; overflow: hidden; color: var(--text); background: radial-gradient(circle at 84% 3%, rgba(172,105,48,.2), transparent 27%), linear-gradient(158deg,#241813,#120d0b 70%); }
.rules-glow { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(8rpx); }
.rules-glow--one { top: 650rpx; right: -180rpx; width: 420rpx; height: 420rpx; background: rgba(205,139,67,.055); }
.rules-glow--two { top: 1900rpx; left: -230rpx; width: 480rpx; height: 480rpx; background: rgba(127,70,40,.08); }
.rules-header { position: relative; z-index: 3; display: flex; align-items: center; box-sizing: border-box; padding: calc(var(--loghome-safe-top, 0px) + 18rpx) 28rpx 14rpx; }
.rules-header__back,.rules-header__spacer { flex-shrink: 0; width: 72rpx; height: 72rpx; }
.rules-header__back { display: flex; align-items: center; justify-content: center; border: 1rpx solid var(--border); border-radius: 50%; color: var(--accent); background: rgba(255,255,255,.04); }
.rules-header__back-icon { box-sizing: border-box; width: 20rpx; height: 20rpx; border-left: 4rpx solid currentColor; border-bottom: 4rpx solid currentColor; transform: translateX(4rpx) rotate(45deg); }
.rules-header__title { flex: 1; min-width: 0; font-size: 30rpx; font-weight: 680; letter-spacing: 2rpx; text-align: center; }
.rules-content { position: relative; z-index: 2; padding: 14rpx 30rpx calc(52rpx + var(--loghome-safe-bottom, 0px)); }
.rules-hero { position: relative; padding: 30rpx; overflow: hidden; border: 1rpx solid rgba(243,203,134,.18); border-radius: 28rpx; background: linear-gradient(135deg,rgba(111,67,33,.7),rgba(48,31,22,.92)); box-shadow: 0 22rpx 46rpx rgba(0,0,0,.2); }
.rules-hero__marks { display: flex; align-items: center; gap: 9rpx; }
.rules-hero__marks image { width: 58rpx; height: 58rpx; image-rendering: pixelated; }
.rules-hero__marks image:last-child { width: 47rpx; height: 47rpx; }
.rules-hero__eyebrow,.rules-hero__title,.rules-hero__description,.rules-hero__date { display: block; }
.rules-hero__eyebrow { margin-top: 20rpx; font-size: 15rpx; letter-spacing: 3rpx; color: #e5b96f; }
.rules-hero__title { margin-top: 9rpx; font-size: 36rpx; font-weight: 760; }
.rules-hero__description { margin-top: 12rpx; font-size: 21rpx; line-height: 1.65; color: var(--secondary); }
.rules-hero__date { margin-top: 20rpx; font-size: 17rpx; color: var(--muted); }
.rules-section { margin-top: 18rpx; padding: 24rpx; border: 1rpx solid var(--border); border-radius: 24rpx; background: rgba(255,255,255,.05); }
.rules-section--redstone { background: linear-gradient(145deg,rgba(106,34,35,.22),rgba(255,255,255,.045)); }
.rules-section__heading { display: flex; align-items: center; padding-bottom: 19rpx; border-bottom: 1rpx solid var(--border); }
.rules-section__heading > text { display: flex; align-items: center; justify-content: center; width: 48rpx; height: 48rpx; border-radius: 14rpx; font-size: 18rpx; font-weight: 750; color: #2c1c12; background: var(--accent); }
.rules-section__heading > view { margin-left: 14rpx; }
.rules-section__heading > view text { display: block; }
.rules-section__heading > view text:first-child { font-size: 25rpx; font-weight: 680; }
.rules-section__heading > view text:last-child { margin-top: 4rpx; font-size: 17rpx; color: var(--muted); }
.price-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11rpx; margin-top: 18rpx; }
.price-card { display: flex; flex-direction: column; padding: 17rpx; border-radius: 18rpx; background: rgba(115,70,37,.23); }
.price-card--super { background: rgba(44,74,108,.25); }
.price-card image { width: 48rpx; height: 48rpx; }
.price-card text { margin-top: 7rpx; font-size: 18rpx; color: var(--secondary); }
.price-card__name { margin: 9rpx 0 2rpx !important; font-size: 22rpx !important; font-weight: 650; color: var(--text) !important; }
.rule-list { margin-top: 16rpx; }
.rule-list > view { display: flex; align-items: flex-start; margin-top: 13rpx; font-size: 20rpx; line-height: 1.65; color: var(--secondary); }
.rule-list > view > text:first-child { flex-shrink: 0; margin-right: 10rpx; color: var(--accent); }
.grant-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8rpx; margin-top: 18rpx; }
.grant-grid > view { padding: 14rpx 6rpx; border-radius: 16rpx; text-align: center; background: rgba(0,0,0,.16); }
.grant-grid text { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 16rpx; color: var(--muted); }
.grant-grid text:nth-child(2) { margin: 7rpx 0 3rpx; font-size: 29rpx; font-weight: 760; color: #efc57e; }
.exchange-rate { display: flex; align-items: center; justify-content: center; gap: 9rpx; margin-top: 18rpx; padding: 16rpx; border-radius: 17rpx; font-size: 22rpx; font-weight: 650; color: #f3d39a; background: rgba(0,0,0,.17); }
.exchange-rate image { width: 34rpx; height: 34rpx; image-rendering: pixelated; }
.usage-list { margin-top: 13rpx; }
.usage-list > view { display: flex; align-items: center; justify-content: space-between; min-height: 62rpx; border-bottom: 1rpx solid var(--border); font-size: 19rpx; color: var(--secondary); }
.usage-list > view text:last-child { margin-left: 18rpx; text-align: right; color: #e8bc76; }
.section-link { display: flex; align-items: center; justify-content: space-between; margin-top: 18rpx; padding: 16rpx 2rpx 2rpx; border-top: 1rpx solid var(--border); font-size: 20rpx; color: var(--accent); }
.section-link text:last-child { font-size: 31rpx; }
.rules-note { margin-top: 20rpx; padding: 0 12rpx; font-size: 17rpx; line-height: 1.65; text-align: center; color: var(--muted); }
.ui-chevron { display: inline-block; flex: none; width: 10rpx; height: 10rpx; border-top: 2rpx solid currentColor; border-right: 2rpx solid currentColor; transform: rotate(45deg); }
</style>
