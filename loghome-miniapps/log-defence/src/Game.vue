<template>
	<div class="outer" v-dark>
		<div class="content">
			<!-- 顶部状态栏第一行：基地名 + 大本营等级 | 一键收集 / 仓库 -->
			<div class="topbar">
				<div class="stat base-stat">
					<span class="stat-val base-stat-name">{{ displayName }}</span>
					<span class="stat-cap">Lv.{{ baseLevel }}</span>
				</div>
				<div class="topbar-right">
					<div v-if="quickCollectOpen" class="wh-btn wh-btn--green" @click="collectAll">
						<span class="wh-text">{{ $t('me.labGamePage.quickCollect') }}</span>
						<span v-if="quickCollectCount > 0" class="wh-badge">{{ quickCollectCount }}</span>
					</div>
					<div class="wh-btn" @click="warehouseOpen = true">
						<img class="wh-icon" :src="gameIcon('warehouse')"  >
						<span class="wh-text">{{ $t('me.labGamePage.warehouseBtn') }}</span>
					</div>
				</div>
			</div>

			<!-- 顶部状态栏第二行：饱食 / 村民 / 绿宝石 -->
			<div class="statbar">
				<div class="stat" @click="foodOpen = true">
					<img class="stat-icon" :src="gameIcon('food')"  >
					<span class="stat-val">{{ fmtStat(foodStat.count) }}<span class="stat-cap">/+{{ fmtStat(foodStat.sat) }}</span></span>
				</div>
				<div class="stat" @click="villOpen = true">
					<img class="stat-icon" :src="gameIcon('villager')"  >
					<span class="stat-val">{{ fmtStat(villagers.length) }}<span class="stat-cap">/{{ fmtStat(capacity) }}</span></span>
				</div>
				<div class="stat">
					<img class="stat-icon" :src="gameIcon('emerald')"  >
					<span class="stat-val">{{ fmtStat(floorRes('emerald')) }}</span>
				</div>
			</div>

			<!-- 楼层切换：地上 / 地下层 -->
			<div class="layer-row">
				<div class="layer-btn" :class="{ 'layer-btn--on': layer === 'ground' }" @click="switchLayer('ground')">
					<img class="layer-icon" :src="gameIcon('ground')"   ><span>{{ $t('me.labGamePage.layerGround') }}</span>
				</div>
				<div class="layer-btn" :class="{ 'layer-btn--on': layer === 'ug' }" @click="switchLayer('ug')">
					<img class="layer-icon" :src="gameIcon('ug')"   ><span>{{ $t('me.labGamePage.layerUnder') }}</span>
				</div>
			</div>

			<!-- 村庄（地上层外围一圈城墙，共 4 段整边：0上 / 1右 / 2下 / 3左，四角由上下两段包边融合） -->
			<div class="village">
				<!-- 顶边城墙（walls 0） -->
				<div v-if="layer === 'ground'" class="wall-strip">
					<div class="wall-cell" @click="tapWall(0)">
						<div v-if="walls[0]" class="wall wall--c-t" :class="{ 'wall--hurt': wallDurPct(0) < 100 }" :style="{ background: wallMatColor(walls[0].level) }">
							<img class="wall-char" :src="gameIcon('wall')"   >
							<div class="wall-lv">Lv.{{ walls[0].level }}</div>
						</div>
						<div v-else class="wall-cell--empty"><span class="wall-cell-plus">＋</span></div>
					</div>
				</div>
				<div class="wall-mid">
					<!-- 左边城墙（walls 3） -->
					<div v-if="layer === 'ground'" class="wall-strip wall-strip--v">
						<div class="wall-cell" @click="tapWall(3)">
							<div v-if="walls[3]" class="wall" :class="{ 'wall--hurt': wallDurPct(3) < 100 }" :style="{ background: wallMatColor(walls[3].level) }">
								<img class="wall-char" :src="gameIcon('wall')"   >
								<div class="wall-lv">Lv.{{ walls[3].level }}</div>
							</div>
							<div v-else class="wall-cell--empty"><span class="wall-cell-plus">＋</span></div>
						</div>
					</div>

					<!-- 九宫格村庄 -->
					<div class="grid" :class="{ 'grid--under': layer === 'ug' }">
				<div
					v-for="(plot, idx) in activePlots"
					:key="layer + '-' + idx"
					class="plot"
					:class="{
						'plot--odd': (Math.floor(idx / 3) + idx % 3) % 2 === 1,
						'plot--center': layer === 'ground' && idx === CENTER_IDX
					}"
					@click="tapPlot(idx)"
				>
					<!-- 中间格：大本营（仅地上，底色随大本营等级主题色变动） -->
					<template v-if="layer === 'ground' && idx === CENTER_IDX">
						<div class="base" :style="{ background: thColor }">
							<img class="base-char" :src="gameIcon('base')"  >
							<div class="building-lv">Lv.{{ baseLevel }}</div>
						</div>
						<div v-if="thBusy" class="busy-flag">
							<img class="busy-icon" :src="gameIcon('hammer')"  >
							<span class="busy-time">{{ thBusyText }}</span>
						</div>
						<div v-if="thCanUpgrade" class="up-arrow" @click.stop="tapPlot(idx)">
							<img class="up-arrow-icon" :src="gameIcon('upgrade')"  >
						</div>
					</template>
					<!-- 扩占地块：多格建筑的延伸部分，点击打开主建筑面板 -->
					<template v-else-if="plot && plot.extOf !== undefined">
						<div class="building building--ext" :style="{ background: buildingDef(plot.extType).color }">
							<img class="building-char building-char--ext" :src="gameIcon(plot.extType)"  >
						</div>
					</template>
					<!-- 已建造建筑 -->
					<template v-else-if="plot">
						<div class="building" :style="{ background: buildingDef(plot.type).color }">
							<img class="building-char" :src="gameIcon(plot.type)"  >
							<div class="building-lv">Lv.{{ plot.level }}</div>
							<div v-if="totalSlots(plot) > 0 && !plot.busy" class="building-worker">
								<img v-if="isHeroIdx(layer, idx)" class="worker-hero" :src="gameIcon('star')"  >
								<span v-else>{{ plot.workers + '/' + totalSlots(plot) }}</span>
							</div>
						</div>
						<div v-if="plot.busy" class="busy-flag">
							<img class="busy-icon" :src="gameIcon('hammer')"  >
							<span class="busy-time">{{ busyRemain(plot) }}</span>
						</div>
						<div v-if="canUpgradePlot(plot)" class="up-arrow" @click.stop="tapPlot(idx)">
							<img class="up-arrow-icon" :src="gameIcon('upgrade')"  >
						</div>
						<!-- 产出囤积读条（部落冲突式：囤积 > 0 时显示） -->
						<div v-if="bufRatio(plot) > 0" class="collect-bar">
							<div class="collect-bar-fill" :style="{ width: Math.min(100, bufRatio(plot) * 100) + '%' }"></div>
						</div>
						<!-- 收集角标（有整数量可收时显示，点击收集） -->
						<div v-if="bufCount(plot) >= 1" class="collect-badge" @click.stop="collectPlot(idx)">
							<img class="collect-badge-icon" :src="gameIcon(bufMain(plot) ? bufMain(plot).id : 'collect')"   >
						</div>
					</template>
					<!-- 地下待清理 / 清理中 -->
					<template v-else-if="layer === 'ug' && !ugCleared[idx]">
						<div class="locked-plot">
							<img v-if="ugClearing[idx] > 0" class="locked-icon" :src="gameIcon('pickaxe')"></img>
							<img v-else class="locked-icon" :src="gameIcon('rock')"  >
							<span class="locked-text">{{ ugClearing[idx] > 0 ? $t('me.labGamePage.ugClearing', { n: ugClearLeftMin(idx) }) : $t('me.labGamePage.ugLocked') }}</span>
							<div v-if="ugClearing[idx] > 0" class="locked-bar">
								<div class="locked-bar-fill" :style="{ width: ((1 - (ugClearing[idx] - nowTs) / (ugClearMin * 60000)) * 100) + '%' }"></div>
							</div>
						</div>
					</template>
					<!-- 空地 -->
					<template v-else>
						<div class="empty-plot">
							<div class="empty-mark">+</div>
						</div>
					</template>
				</div>
				</div>

					<!-- 右边城墙（walls 1） -->
					<div v-if="layer === 'ground'" class="wall-strip wall-strip--v">
						<div class="wall-cell" @click="tapWall(1)">
							<div v-if="walls[1]" class="wall" :class="{ 'wall--hurt': wallDurPct(1) < 100 }" :style="{ background: wallMatColor(walls[1].level) }">
								<img class="wall-char" :src="gameIcon('wall')"   >
								<div class="wall-lv">Lv.{{ walls[1].level }}</div>
							</div>
							<div v-else class="wall-cell--empty"><span class="wall-cell-plus">＋</span></div>
						</div>
					</div>
				</div>
				<!-- 底边城墙（walls 2） -->
				<div v-if="layer === 'ground'" class="wall-strip">
					<div class="wall-cell" @click="tapWall(2)">
						<div v-if="walls[2]" class="wall wall--c-b" :class="{ 'wall--hurt': wallDurPct(2) < 100 }" :style="{ background: wallMatColor(walls[2].level) }">
							<img class="wall-char" :src="gameIcon('wall')"   >
							<div class="wall-lv">Lv.{{ walls[2].level }}</div>
						</div>
						<div v-else class="wall-cell--empty"><span class="wall-cell-plus">＋</span></div>
					</div>
				</div>
			</div>

			<!-- 放置模式横幅：点击空地放置收纳中的建筑 -->
			<div v-if="placeSel !== null" class="place-banner">
				<span class="place-banner-text">{{ $t('me.labGamePage.placeHint', { n: placeName() }) }}</span>
				<div class="place-banner-cancel" @click="cancelPlace">{{ $t('me.labGamePage.placeCancel') }}</div>
			</div>

			<!-- 功能入口（占位） -->
			<div class="feature-row">
				<div class="feature-btn" @click="openMarket">
					<img class="feature-icon" :src="gameIcon('market')"  >
					<span class="feature-name">{{ $t('me.labGamePage.market') }}</span>
					<div v-if="traderHere" class="mkt-badge"><img class="mkt-badge-icon" :src="gameIcon('hero')"  ></div>
				</div>
				<div class="feature-btn" @click="openExp">
					<img class="feature-icon" :src="gameIcon('expedition')"  >
					<span class="feature-name">{{ $t('me.labGamePage.expedition') }}</span>
					<div v-if="expedition" class="exp-badge">{{ expRemainText }}</div>
				</div>
			</div>

			<div class="feature-row feature-row--craft">
				<div class="feature-btn" @click="openCraft">
					<img class="feature-icon" :src="gameIcon('smith')"  >
					<span class="feature-name">{{ $t('me.labGamePage.craftTitle') }}</span>
				</div>
			</div>

			<!-- 僵尸夜袭（独立一行，含倒计时与临时仓库入口） -->
			<div class="raid-row" @click="raidOpen = true">
				<img class="feature-icon" :src="gameIcon('raid')"  >
				<div class="raid-main">
					<span class="raid-name">{{ $t('me.labGamePage.raid') }}</span>
					<span class="raid-sub">{{ $t('me.labGamePage.raidStr') }} {{ zombiePower }} · {{ $t('me.labGamePage.power') }} {{ Math.floor(raidPower) }}</span>
					<span v-if="hordeText" class="raid-horde"><img class="inline-icon" :src="gameIcon('journal')"   > {{ hordeText }}</span>
					<span v-if="tiredText" class="raid-horde raid-horde--tired"><img class="inline-icon" :src="gameIcon('villager')"   > {{ tiredText }}</span>
					<span class="raid-count" :class="{ 'raid-count--on': raidStatus.active }">{{ raidStatus.text }}</span>
				</div>
				<div v-if="raidTempTotal > 0" class="raid-badge">{{ raidTempTotal }}</div>
			</div>

			<!-- 开发者控制台（测试阶段专用） -->
			<div v-if="$root.allowDev" class="dev-box">
				<div class="dev-head" @click="devOpen = !devOpen">
					<span class="dev-title">{{ $t('me.labGamePage.devTitle') }}</span>
					<span class="dev-toggle">{{ devOpen ? '−' : '+' }}</span>
				</div>
				<template v-if="devOpen">
					<!-- 修改资源 -->
					<div class="dev-row">
						<picker class="dev-picker" :range="devResNames" @change="onDevResPick">
							<div class="dev-picker-val">{{ devResLabel }}</div>
						</picker>
						<input class="dev-input" v-model="devResVal" type="number" />
						<div class="dev-btn" @click="devSetRes">{{ $t('me.labGamePage.devSet') }}</div>
					</div>
					<!-- 等级 / 村民 / 一键资源 -->
					<div class="dev-row">
						<input class="dev-input dev-input--sm" v-model="devBaseVal" type="number" />
						<div class="dev-btn" @click="devSetBase">TH</div>
						<input class="dev-input dev-input--sm" v-model="devVillVal" type="number" />
						<div class="dev-btn" @click="devSetVillagers">{{ $t('me.labGamePage.villagers') }}</div>
						<div class="dev-btn dev-btn--gold" @click="devFillRes">{{ $t('me.labGamePage.devFill') }}</div>
					</div>
					<!-- 时间倍速（仅加速在线产出） -->
					<div class="dev-row">
						<span class="dev-speed-label">{{ $t('me.labGamePage.devSpeed') }}</span>
						<div
							v-for="s in speedOptions"
							:key="s"
							class="dev-speed-btn"
							:class="{ 'dev-speed-btn--on': speed === s }"
							@click="devSetSpeed(s)"
						>×{{ s }}</div>
					</div>
					<!-- 模拟夜袭（直接结算 N 小时的掉落与耐久损耗，受临时仓库 8 小时上限约束） -->
					<div class="dev-row">
						<span class="dev-speed-label">{{ $t('me.labGamePage.devRaid') }} · {{ $t('me.labGamePage.raidDef') }} {{ raidPower }}</span>
						<div
							v-for="h in raidSimOptions"
							:key="h"
							class="dev-speed-btn"
							:class="{ 'dev-speed-btn--on': devRaidH === h }"
							@click="devSimRaid(h)"
						>{{ h }}h</div>
					</div>
					<!-- 跳过施工：全部建筑建造/升级与大本营升级立即完工 -->
					<div class="dev-row">
						<div class="dev-btn dev-btn--gold dev-btn--wide" @click="devSkipBuilds">{{ $t('me.labGamePage.devSkipBuilds') }}</div>
					</div>
					<!-- 一键建筑满级：已建建筑+大本营+城墙全部满级满耐久 -->
					<div class="dev-row">
						<div class="dev-btn dev-btn--gold dev-btn--wide" @click="devMaxAll">{{ $t('me.labGamePage.devMaxAll') }}</div>
					</div>
					<!-- 立即完工（测试用：跳过全部建造/升级计时） -->
					<div class="dev-row">
						<span class="dev-speed-label">{{ $t('me.labGamePage.devFinish') }}</span>
						<div class="dev-btn dev-btn--gold" @click="devFinishAll">{{ $t('me.labGamePage.devFinishBtn') }}</div>
					</div>
					<!-- 挑战快进（测试用：立即结算下一波；血潮阶段则立即击杀 Boss） -->
					<div class="dev-row">
						<span class="dev-speed-label">{{ $t('me.labGamePage.devWaveNext') }}</span>
						<div class="dev-btn dev-btn--gold" @click="devWaveStep">{{ $t('me.labGamePage.devWaveNextBtn') }}</div>
					</div>
					<!-- 一键资源不消耗（全部资源直接拉到 9999，测试消耗链路） -->
					<div class="dev-row">
						<div class="dev-btn dev-btn--gold dev-btn--wide" @click="devNoConsume">{{ $t('me.labGamePage.devNoConsume') }}</div>
					</div>
					<!-- 刷新流浪商人（立即到访并补满库存） -->
					<div class="dev-row">
						<div class="dev-btn dev-btn--gold dev-btn--wide" @click="devRefreshTrader">{{ $t('me.labGamePage.devTraderRefresh') }}</div>
					</div>
					<!-- 重置 -->
					<div class="dev-row">
						<div class="dev-btn dev-btn--danger dev-btn--wide" @click="devReset">{{ $t('me.labGamePage.devReset') }}</div>
					</div>
				</template>
			</div>

			<!-- 好友村庄消息日志（面板悬浮于功能坞上方，点「消息日志」开合） -->
			<div v-if="flogOpen" class="fr-logbox">
				<div v-for="(lg, li) in friendLogs" :key="li" class="fr-log">
					<span class="fr-log-tag" :class="'fr-log-tag--' + lg.type">{{ $t('me.labGamePage.' + lg.tkey) }}</span>
					<span class="fr-log-text">{{ lg.text }}</span>
				</div>
			</div>

			<div class="game-toolbar">
			<!-- 英雄雇佣入口（左下角悬浮，村民列表上方；雇佣中显示剩余时间） -->
			<div class="vill-btn hero-btn" @click="heroOpen = true">
				<img class="hero-avatar" :src="gameIcon('hero')"  :class="{ 'hero-avatar--on': heroActive }" >
				<span class="vill-btn-text">{{ heroBtnLabel }}</span>
			</div>

			<!-- 村民列表入口（左下角悬浮，建筑图鉴上方） -->
			<div class="vill-btn" @click="villOpen = true">
				<img class="vill-btn-icon" :src="gameIcon('villager')"   >
				<span class="vill-btn-text">{{ $t('me.labGamePage.villListTitle') }}</span>
			</div>

			<!-- 建筑图鉴入口（左下角悬浮） -->
			<div class="bl-btn" @click="blOpen = true">
				<img class="bl-btn-icon" :src="gameIcon('book')"   >
				<span class="bl-btn-text">{{ $t('me.labGamePage.buildList') }}</span>
			</div>

			<!-- 好友村庄消息日志（收纳为图标按钮，点开查看） -->
			<div class="fr-btn fr-btn--log" @click="flogOpen = !flogOpen">
				<img class="fr-btn-icon" :src="gameIcon('journal')"   >
				<span class="fr-btn-text">{{ $t('me.labGamePage.logTitle') }}</span>
			</div>
			<div class="fr-btn" @click="frOpen = true">
				<img class="fr-btn-icon" :src="gameIcon('friends')"   >
				<span class="fr-btn-text">{{ $t('me.labGamePage.friendVillage') }}</span>
			</div>

			</div>

			<!-- 建造选单 -->
			<div v-if="buildIdx !== null" class="overlay" @click.self="buildIdx = null">
				<div class="modal">
					<div class="modal-title">{{ $t('me.labGamePage.build') }}</div>
					<div v-if="buildableActive.length === 0" class="empty-tip">{{ $t('me.labGamePage.noBuildable') }}</div>
					<div
						v-for="item in buildableActive"
						:key="item.b.key"
						class="build-item"
						@click="buildAt(buildIdx, item)"
					>
						<img class="build-char" :src="gameIcon(item.b.key)"   >
						<div class="build-main">
							<div class="build-name-row">
								<span class="build-name">{{ langName(item.b) }}</span>
								<span class="build-quota">{{ item.count }}/{{ item.quota }}</span>
							</div>
							<div class="cost-row">
								<span v-if="item.free" class="cost-item cost-item--free">{{ $t('me.labGamePage.firstFree') }}</span>
								<template v-else>
									<span
										v-for="(c, ci) in costList(item.cost)"
										:key="ci"
										class="cost-item"
										:class="{ 'cost-item--lack': !c.ok }"
									>{{ c.text }}</span>
								</template>
								<span class="cost-item cost-item--time"><img class="inline-icon" :src="gameIcon('clock')"   > {{ buildTimeText(1) }}</span>
							</div>
						</div>
					</div>
					<div class="modal-close" @click="buildIdx = null">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 城墙详情：建造 / 升级 / 修补 -->
			<div v-if="wallSel !== null" class="overlay" @click.self="wallSel = null">
				<div class="modal">
					<div class="modal-title">
						<img class="modal-title-char" :src="gameIcon('wall')"   >
						{{ wallTitle }}
					</div>
					<div class="desc-box">{{ $t('me.labGamePage.wallDesc') }}</div>
					<div v-if="wallCur" class="def-box">
						<div class="def-stats">
							<span class="def-stat" :class="{ 'def-stat--low': wallDur < MAX_DUR }">{{ $t('me.labGamePage.defLabel') }} {{ Math.floor(wallCurDef) }}<span class="def-stat-sub">/{{ wallMaxDef }}</span></span>
						</div>
						<div class="vill-bar-row">
							<span class="vill-bar-label">{{ $t('me.labGamePage.durability') }}</span>
							<div class="vill-bar"><div class="vill-bar-fill vill-bar-fill--dur" :style="{ width: wallDur + '%' }"></div></div>
							<span class="vill-bar-val">{{ Math.floor(wallDur) }}</span>
						</div>
						<div v-if="wallDur < MAX_DUR" class="upgrade-btn upgrade-btn--wide" :class="{ 'upgrade-btn--disabled': !canRepairWall }" @click="repairWall">
							{{ $t('me.labGamePage.repair') }}（{{ wallRepairCostText }}）
						</div>
					</div>
					<div v-if="wallNext" class="upgrade-box">
						<div class="upgrade-info">
							<span class="upgrade-title">{{ wallCur ? $t('me.labGamePage.upgrade') + ' · ' + wallMatName(wallCur.level + 1) : $t('me.labGamePage.wallBuild') + ' · ' + wallMatName(1) }}</span>
							<span v-if="baseLevel < wallNext.th" class="upgrade-sub upgrade-sub--warn">{{ $t('me.labGamePage.thReq', { n: wallNext.th }) }}</span>
							<div v-else class="cost-row">
								<span
									v-for="(c, ci) in costList(wallNext.cost)"
									:key="ci"
									class="cost-item"
									:class="{ 'cost-item--lack': !c.ok }"
								>{{ c.text }}</span>
							</div>
						</div>
						<div class="upgrade-btn" :class="{ 'upgrade-btn--disabled': !wallCanUp }" @click="wallCur ? upgradeWall() : buildWall()">
							{{ wallCur ? $t('me.labGamePage.upgrade') : $t('me.labGamePage.wallBuild') }}
						</div>
					</div>
					<div class="modal-close" @click="wallSel = null">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 建筑详情 -->
			<div v-if="selIdx !== null && selPlot" class="overlay" @click.self="selIdx = null">
				<div class="modal">
					<div class="modal-title">
						<img class="modal-title-char" :src="gameIcon(selDef.key)"   >
						{{ langName(selDef) }} Lv.{{ selPlot.level }}
					</div>

					<!-- 功能/产出说明 -->
					<div class="desc-box">{{ selDesc }}</div>
					<div v-if="selProdList.length" class="prod-row">
						<span class="prod-label">{{ $t('me.labGamePage.perHour') }}</span>
						<span
							v-for="(p, pi) in selProdList"
							:key="pi"
							class="prod-item"
							:class="{ 'prod-item--neg': p.neg, 'prod-item--lack': p.lack }"
						>{{ p.text }}</span>
					</div>

					<!-- 下界传送门：危险工位提示（驻守扣血磨装备） -->
					<div v-if="selDef.key === 'portal'" class="mkt-hint portal-danger"><img class="inline-icon" :src="gameIcon('star')"   > {{ $t('me.labGamePage.portalDanger', { h: portalWork.hpPerH, w: portalWork.wearPerH }) }}</div>

					<!-- 铁匠铺燃料：燃料值池 + 来源选择（默认木炭）+ 手动补充 -->
					<div v-if="selDef.key === 'smith'" class="fuel-box">
						<div class="worker-info">
							<span class="worker-title">{{ $t('me.labGamePage.fuelValue') }} {{ Math.floor(fuel) }}</span>
							<span class="worker-sub">{{ $t('me.labGamePage.fuelHint', { c: FUEL_VALUE.charcoal, l: FUEL_VALUE.log }) }}</span>
						</div>
						<div class="fuel-picker">
							<div class="fuel-opt" :class="{ 'fuel-opt--on': fuelType === 'charcoal' }" @click="setFuelType('charcoal')">
								{{ $t('me.labGamePage.fuelCharcoal') }} +{{ FUEL_VALUE.charcoal }}
							</div>
							<div class="fuel-opt" :class="{ 'fuel-opt--on': fuelType === 'log' }" @click="setFuelType('log')">
								{{ $t('me.labGamePage.fuelLog') }} +{{ FUEL_VALUE.log }}
							</div>
						</div>
						<div class="upgrade-btn upgrade-btn--wide" @click="convertFuel">
							{{ $t('me.labGamePage.fuelAdd', { n: FUEL_ADD_NUM }) }}
						</div>
					</div>

					<!-- 产出囤积（部落冲突式：收集后才入库） -->
					<div v-if="selCapTotal > 0" class="collect-box">
						<div class="worker-info">
							<span class="worker-title">{{ $t('me.labGamePage.collectStored') }}</span>
							<span class="worker-sub">{{ $t('me.labGamePage.collectHint') }}</span>
						</div>
						<div v-for="(b, bi) in selBufList" :key="bi" class="vill-bar-row">
							<span class="vill-bar-label">{{ resName(b.id) }}</span>
							<div class="vill-bar"><div class="vill-bar-fill vill-bar-fill--sat" :style="{ width: (b.ratio * 100) + '%' }"></div></div>
							<span class="vill-bar-val">{{ Math.floor(b.val) }}/{{ b.cap }}</span>
						</div>
						<div class="upgrade-btn upgrade-btn--wide" :class="{ 'upgrade-btn--disabled': selBufCount < 1 }" @click="collectSel">
							{{ $t('me.labGamePage.collectBtn') }}
						</div>
					</div>

					<!-- 攻防与耐久（瞭望塔等防御建筑） -->
					<div v-if="selAtk > 0 || selDefVal > 0" class="def-box">
						<div class="def-stats">
							<span v-if="selAtk > 0" class="def-stat" :class="{ 'def-stat--low': selStaffRatio < 1 }">{{ $t('me.labGamePage.atk') }} {{ Math.floor(selAtk * selStaffRatio * selDur / MAX_DUR) }}<span class="def-stat-sub">/{{ selAtk }}</span></span>
							<span v-if="selDefVal > 0" class="def-stat" :class="{ 'def-stat--low': selStaffRatio < 1 }">{{ $t('me.labGamePage.defLabel') }} {{ Math.floor(selDefVal * selStaffRatio * selDur / MAX_DUR) }}<span class="def-stat-sub">/{{ selDefVal }}</span></span>
						</div>
						<span v-if="selStaffRatio < 1" class="def-hint">{{ $t('me.labGamePage.staffHint', { n: selSlots - (selPlot.workers || 0) }) }}</span>
						<div class="vill-bar-row">
							<span class="vill-bar-label">{{ $t('me.labGamePage.durability') }}</span>
							<div class="vill-bar"><div class="vill-bar-fill vill-bar-fill--dur" :style="{ width: selDur + '%' }"></div></div>
							<span class="vill-bar-val">{{ Math.floor(selDur) }}</span>
						</div>
						<div v-if="selDur < MAX_DUR" class="upgrade-btn upgrade-btn--wide" :class="{ 'upgrade-btn--disabled': !canRepairSel }" @click="repairSel">
							{{ $t('me.labGamePage.repair') }}（{{ repairSelCostText }}）
						</div>
					</div>

					<!-- 工位 -->
					<div v-if="selSlots > 0" class="worker-box">
						<div class="worker-info">
							<span class="worker-title">{{ $t('me.labGamePage.workers') }}（{{ langWorker(selDef) }}）</span>
							<span class="worker-sub">{{ isHeroIdx(selLayer, selIdx) ? $t('me.labGamePage.heroFull') : selPlot.workers + '/' + selSlots }} · {{ $t('me.labGamePage.unassigned') }} {{ unassigned }}</span>
							<span v-if="selCrewNames" class="worker-sub"><img class="inline-icon" :src="gameIcon('villager')"   > {{ selCrewNames }}</span>
						</div>
						<div class="worker-btns">
							<div class="worker-btn" @click="assignWorker(-1)">−</div>
							<div class="worker-btn worker-btn--add" @click="assignWorker(1)">＋</div>
						</div>
					</div>

					<!-- 原木娘指派 / 召回（雇佣中可用） -->
					<div v-if="heroActive && !hero.plot && selSlots > 0" class="upgrade-btn upgrade-btn--wide" @click="assignHeroSel">
						{{ $t('me.labGamePage.heroAssignBtn') }}
					</div>
					<div v-else-if="isHeroIdx(selLayer, selIdx)" class="upgrade-btn upgrade-btn--wide" @click="recallHero">
						{{ $t('me.labGamePage.heroRecallBtn') }}
					</div>

					<!-- 升级 -->
					<div v-if="selNext" class="upgrade-box">
						<div class="upgrade-info">
							<span class="upgrade-title">{{ $t('me.labGamePage.upgrade') }} Lv.{{ selPlot.level + 1 }}</span>
							<span v-if="selPlot.busy" class="upgrade-sub upgrade-sub--warn"><img class="inline-icon" :src="gameIcon('hammer')"   > {{ $t('me.labGamePage.buildingBusy') }} · {{ busyRemain(selPlot) }}</span>
							<span v-else-if="baseLevel < selNext.th" class="upgrade-sub upgrade-sub--warn">{{ $t('me.labGamePage.thReq', { n: selNext.th }) }}</span>
							<div v-else class="cost-row">
								<span
									v-for="(c, ci) in costList(selNext.cost)"
									:key="ci"
									class="cost-item"
									:class="{ 'cost-item--lack': !c.ok }"
								>{{ c.text }}</span>
								<span class="cost-item cost-item--time"><img class="inline-icon" :src="gameIcon('clock')"   > {{ buildTimeText(selPlot.level + 1) }}</span>
							</div>
						</div>
						<div v-if="!selPlot.busy" class="upgrade-btn" :class="{ 'upgrade-btn--disabled': !canUpgradeSel }" @click="upgradeSel">
							{{ $t('me.labGamePage.upgradeBtn') }}
						</div>
					</div>
					<div v-else class="maxlv-tip">{{ $t('me.labGamePage.maxLv') }}</div>

					<!-- 收纳（首次免费，后续绿宝石；等级/耐久/囤积保留，可在建筑列表重新放置） -->
					<div class="demolish-btn store-btn" @click="storeSel">
						{{ $t('me.labGamePage.storeBtn') }}
						<span class="store-cost">（{{ storeCostText() }}）</span>
					</div>

					<!-- 拆除 -->
					<div class="demolish-btn" @click="demolishSel">{{ $t('me.labGamePage.demolish') }}</div>
					<div class="modal-close" @click="selIdx = null">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 大本营面板：升级 / 村民 / 仓库 / 改名 -->
			<div v-if="warehouseOpen" class="overlay" @click.self="warehouseOpen = false">
				<div class="modal modal--tall">
					<div class="modal-title">{{ displayName }}</div>

					<!-- 改名 -->
					<div class="rename-box">
						<span class="rename-label">{{ $t('me.labGamePage.renameLabel') }}</span>
						<input
							class="rename-input"
							v-model="nameInput"
							type="text"
							:maxlength="12"
							:placeholder="$t('me.labGamePage.renamePlaceholder')"
						/>
						<div class="rename-save" @click="saveName">{{ $t('me.labGamePage.renameSave') }}</div>
					</div>

					<!-- 大本营升级 -->
					<div class="th-box">
						<div class="th-head">
							<span class="upgrade-title">{{ $t('me.labGamePage.thUpgrade') }}</span>
							<span class="th-lv">Lv.{{ baseLevel }}<template v-if="thNext"> → Lv.{{ baseLevel + 1 }}</template></span>
						</div>
						<div class="th-unlock"><img class="inline-icon" :src="gameIcon('hammer')"   > {{ $t('me.labGamePage.builderSlots') }} {{ activeBuilds }}/{{ builderSlotsTotal }}</div>
						<div v-if="thBusy" class="th-unlock"><img class="inline-icon" :src="gameIcon('hammer')"   > {{ $t('me.labGamePage.buildingBusy') }} · {{ thBusyText }}</div>
						<div v-if="buildQueueItems.length" class="queue-box">
							<div v-for="q in buildQueueItems" :key="q.i" class="queue-row">
								<span class="queue-name"><img class="inline-icon" :src="gameIcon('clock')"   > {{ q.name }} · {{ $t('me.labGamePage.queueWait') }}</span>
								<span class="queue-cancel" @click="cancelQueue(q.i)">{{ $t('me.labGamePage.queueCancelBtn') }}</span>
							</div>
						</div>
						<template v-if="thNext && !thBusy">
							<div class="req-row">
								<span class="req-label">{{ $t('me.labGamePage.prereq') }}</span>
								<span
									v-for="(r, ri) in thReqList"
									:key="ri"
									class="req-item"
									:class="r.ok ? 'req-item--ok' : 'req-item--bad'"
								>{{ r.text }}</span>
							</div>
							<div class="cost-row">
								<span
									v-for="(c, ci) in costList(thNext.cost)"
									:key="ci"
									class="cost-item"
									:class="{ 'cost-item--lack': !c.ok }"
								>{{ c.text }}</span>
								<span class="cost-item cost-item--time"><img class="inline-icon" :src="gameIcon('clock')"   > {{ thTimeText }}</span>
							</div>
							<div class="th-unlock">{{ $t('me.labGamePage.unlockHint', { s: isEn ? thNext.unlockEn : thNext.unlockZh }) }}</div>
							<div class="upgrade-btn upgrade-btn--wide" :class="{ 'upgrade-btn--disabled': !thCanUpgrade }" @click="upgradeTH">
								{{ $t('me.labGamePage.upgradeBtn') }}
							</div>
						</template>
						<div v-if="!thNext && !thBusy" class="maxlv-tip">{{ $t('me.labGamePage.thMax') }}</div>
					</div>

					<!-- 大本营防御（夜袭损耗，可修补） -->
					<div class="worker-box">
						<div class="worker-info">
							<span class="worker-title">{{ $t('me.labGamePage.defLabel') }} {{ Math.floor(baseDef) }}<span class="def-stat-sub">/{{ BASE_DEF[baseLevel] || 0 }}</span></span>
							<span class="worker-sub">{{ $t('me.labGamePage.durability') }} {{ Math.floor(baseDur) }}/{{ MAX_DUR }}</span>
						</div>
						<div class="upgrade-btn" :class="{ 'upgrade-btn--disabled': !canRepairBase }" @click="repairBase">
							{{ $t('me.labGamePage.repair') }}
						</div>
					</div>

					<!-- 村民 -->
					<div class="worker-box">
						<div class="worker-info" @click="villOpen = true">
							<span class="worker-title">{{ $t('me.labGamePage.villagers') }} {{ villagers.length }}/{{ capacity }}<span v-if="moodEffText" class="def-stat-sub"> · {{ $t('me.labGamePage.moodEff') }} {{ moodEffText }}</span></span>
							<span class="worker-sub">{{ $t('me.labGamePage.unassigned') }} {{ unassigned }} · {{ $t('me.labGamePage.villViewList') }}</span>
						</div>
						<div class="upgrade-btn" :class="{ 'upgrade-btn--disabled': !canTrain }" @click="trainVillager">
							{{ $t('me.labGamePage.train') }}
						</div>
					</div>

					<!-- 仓库 -->
					<div class="wh-title">{{ $t('me.labGamePage.warehouse') }}<span class="wh-slots">{{ $t('me.labGamePage.whSlots') }} {{ whUsed }}/{{ whSlotsTotal }}</span></div>
					<div v-if="ownedList.length === 0" class="empty-tip">{{ $t('me.labGamePage.emptyWarehouse') }}</div>
					<div v-for="r in ownedList" :key="r" class="res-row">
						<img class="res-dot" :src="gameIcon(r)"  >
						<span class="res-name">{{ resName(r) }}</span>
						<span class="res-th" :style="{ background: resThColor(r) }">TH{{ resTh(r) }}</span>
						<span class="res-val">{{ floorRes(r) }}<span class="res-slot" v-if="resSlotCount(r) > 1"> · {{ $t('me.labGamePage.whNSlots', { n: resSlotCount(r) }) }}</span></span>
					</div>

					<div class="modal-close" @click="warehouseOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 村民列表：名字/改名、血量/饱食、心情、装备 -->
			<div v-if="villOpen" class="overlay" @click.self="villOpen = false">
				<div class="modal modal--tall">
					<div class="modal-title">{{ $t('me.labGamePage.villListTitle') }}（{{ villagers.length }}/{{ capacity }}）</div>
					<div class="vill-toolbar">
						<div class="bl-hint">{{ $t('me.labGamePage.autoEatHint') }}</div>
						<div class="vill-feed" :class="{ 'vill-feed--disabled': !feedAllReady }" @click="feedAll">{{ $t('me.labGamePage.feedAll') }}</div>
					</div>
					<div v-if="villagers.length === 0" class="empty-tip">{{ $t('me.labGamePage.villEmpty') }}</div>
					<div v-for="v in villagers" :key="v.id" class="vill-card">
						<div class="vill-head">
							<span class="vill-avatar">{{ v.name.slice(0, 1) }}</span>
							<span class="vill-name">{{ v.name }}</span>
							<span v-if="villJobs[v.id]" class="vill-job">{{ villJobs[v.id] }}</span>
							<span v-if="v.onExp" class="vill-hunger vill-hunger--exp">{{ $t('me.labGamePage.expOnExp') }}</span>
							<span v-if="v.hunger > 0" class="vill-hunger">{{ $t('me.labGamePage.hungerTag') }}</span>
							<span class="vill-mood" :style="{ color: moodInfo(v).color }">{{ $t('me.labGamePage.' + moodInfo(v).key) }}</span>
							<span class="vill-rename" @click="renameVillager(v)">{{ $t('me.labGamePage.renameVillagerBtn') }}</span>
						</div>
						<div class="vill-tracks">
							<div v-for="t in trackList(v)" :key="t.key" class="vill-track">
								<span class="vill-track-name">{{ t.name }}<span class="vill-track-lv">Lv{{ t.lv }}</span></span>
								<div class="vill-track-bar"><div class="vill-track-fill" :style="{ width: t.pct + '%' }"></div></div>
							</div>
						</div>
						<div class="vill-bar-row">
							<span class="vill-bar-label">{{ $t('me.labGamePage.hp') }}</span>
							<div class="vill-bar"><div class="vill-bar-fill vill-bar-fill--hp" :style="{ width: v.hp + '%' }"></div></div>
							<span class="vill-bar-val">{{ Math.floor(v.hp) }}</span>
						</div>
						<div class="vill-bar-row">
							<span class="vill-bar-label">{{ $t('me.labGamePage.satiety') }}</span>
							<div class="vill-bar"><div class="vill-bar-fill vill-bar-fill--sat" :style="{ width: v.satiety + '%' }"></div></div>
							<span class="vill-bar-val">{{ Math.floor(v.satiety) }}</span>
						</div>
						<div class="vill-foot">
							<div class="vill-equip">
								<span class="vill-equip-label">{{ $t('me.labGamePage.equipment') }}</span>
								<div
									v-for="si in 3"
									:key="si"
									class="vill-equip-slot"
									:class="{ 'vill-equip-slot--filled': !!v.equip[si - 1] }"
									@click="tapEquipSlot(v, si - 1)"
								>
									<img class="vill-equip-char" :src="gameIcon(v.equip[si - 1])"  v-if="v.equip[si - 1]" >
									<span class="vill-equip-name">{{ v.equip[si - 1] ? resName(v.equip[si - 1]) : $t('me.labGamePage.' + equipSlotKey(si - 1)) }}<span v-if="equipDurText(v, si - 1)" class="vill-equip-dur" :class="{ 'vill-equip-dur--low': equipDurLow(v, si - 1) }"> {{ equipDurText(v, si - 1) }}</span></span>
								</div>
							</div>
							<div class="vill-feed" :class="{ 'vill-feed--disabled': !canFeed(v) }" @click="feedVillager(v)">
								{{ $t('me.labGamePage.feed') }}
							</div>
						</div>
					</div>
					<div class="modal-close" @click="villOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 喂食选择：食物 / 药水 -->
			<div v-if="feedOpen" class="overlay" @click.self="feedOpen = false">
				<div class="modal">
					<div class="modal-title">{{ $t('me.labGamePage.feedPickTitle') }}<span v-if="feedVill" class="feed-vill-name">{{ feedVill.name }}</span></div>
					<div v-for="f in feedOptions" :key="f.id" class="res-row" :class="{ 'res-row--off': f.stock < 1 || (f.id !== 'potion' && feedVill && feedVill.satiety >= 99.5) }" @click="doFeed(f)">
						<img class="res-dot" :src="gameIcon(f.id)"   >
						<div class="fr-main">
							<div class="res-name">{{ resName(f.id) }} ×{{ f.stock }}</div>
							<div class="food-sat">{{ f.effect }}</div>
						</div>
					</div>
					<div class="modal-close" @click="feedOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 英雄雇佣：原木娘（24h，按食物饱食度付费，指派工位满功率） -->
			<div v-if="heroOpen" class="overlay" @click.self="heroOpen = false">
				<div class="modal">
					<div class="modal-title">{{ $t('me.labGamePage.heroTitle') }}</div>
					<div class="hero-card">
						<img class="hero-avatar hero-avatar--lg" :src="gameIcon('hero')"  :class="{ 'hero-avatar--on': heroActive }" >
						<div class="build-main">
							<div class="build-name-row">
								<span class="build-name">{{ $t('me.labGamePage.heroName') }}</span>
								<span class="build-quota">24h</span>
							</div>
							<div class="hero-desc">{{ $t('me.labGamePage.heroDesc') }}</div>
						</div>
					</div>
					<template v-if="!heroActive">
						<div class="bl-hint">{{ $t('me.labGamePage.heroCostHint', { n: heroCostSat, have: foodStat.sat }) }}</div>
						<div class="upgrade-btn upgrade-btn--wide" :class="{ 'upgrade-btn--disabled': foodStat.sat < heroCostSat }" @click="hireHero">
							{{ $t('me.labGamePage.heroHireBtn') }}
						</div>
					</template>
					<template v-else>
						<div class="bl-hint"><img class="inline-icon" :src="gameIcon('clock')"   > {{ $t('me.labGamePage.heroRemainHint', { t: heroRemainText }) }}</div>
						<div class="bl-hint">{{ heroPlotInfo ? $t('me.labGamePage.heroAtHint', { s: heroPlotInfo }) : $t('me.labGamePage.heroIdleHint') }}</div>
						<div v-if="heroPlotInfo" class="upgrade-btn upgrade-btn--wide" @click="recallHero">{{ $t('me.labGamePage.heroRecallBtn') }}</div>
					</template>
					<div class="modal-close" @click="heroOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 下界远征：选路线/时长/队员出发，扣一次性口粮；远征中可提前召回（部分奖励） -->
			<div v-if="expOpen" class="overlay" @click.self="expOpen = false">
				<div class="modal modal--tall">
					<div class="modal-title">{{ $t('me.labGamePage.expTitle') }}</div>
					<template v-if="!expedition">
						<div class="bl-hint">{{ $t('me.labGamePage.expHint') }}</div>
						<div v-for="r in expRoutes" :key="r.key" class="exp-route" :class="{ 'exp-route--on': r.key === expSelKey, 'exp-route--lock': baseLevel < r.th }" @click="expSelRouteTap(r.key)">
							<div class="exp-route-head">
								<span class="exp-route-name">{{ isEn ? r.en : r.zh }}</span>
								<span class="exp-danger">{{ expDangerStr(r.danger) }}</span>
							</div>
							<div class="exp-route-sub">
								<span v-if="baseLevel < r.th" class="exp-lock">{{ $t('me.labGamePage.thReq', { n: r.th }) }}</span>
								<span v-else>{{ $t('me.labGamePage.expPartyCap', { min: r.partyMin, max: r.partyMax }) }} · {{ $t('me.labGamePage.expWearRate', { n: Math.round(r.wear * 100) }) }}</span>
							</div>
						</div>
						<div class="exp-sec">{{ $t('me.labGamePage.expDuration') }}</div>
						<div class="exp-hours">
							<div v-for="(h, hi) in expPanelRoute.hours" :key="hi" class="exp-hour" :class="{ 'exp-hour--on': hi === expSelHoursIdx }" @click="expSelHoursTap(hi)">
								<span class="exp-hour-t">{{ h }}h</span>
								<span class="exp-hour-s">{{ $t('me.labGamePage.expRation', { n: expPanelRoute.satPerHour * h }) }}</span>
							</div>
						</div>
						<div class="exp-sec">{{ $t('me.labGamePage.expParty') }} {{ expPartyIds.length }}/{{ expPanelRoute.partyMax }}</div>
						<div class="exp-vills">
							<div v-for="v in villagers" :key="v.id" class="exp-vill" :class="{ 'exp-vill--on': expPartyIds.indexOf(v.id) >= 0 }" @click="expToggleVill(v.id)">
								<span class="exp-vill-avatar" :style="{ background: resColor(v.equip[0] || 'log') }">{{ v.name.slice(0, 1) }}</span>
								<span class="exp-vill-name">{{ v.name }}</span>
								<span class="exp-vill-glv" :class="{ 'exp-vill-glv--on': trackLv(v, 'guard') > 1 }"><img class="inline-icon" :src="gameIcon('ironArmor')"   >{{ trackLv(v, 'guard') }}</span>
							</div>
						</div>
						<div class="bl-hint">{{ $t('me.labGamePage.expCostHint', { n: fmtStat(expFoodNeed) }) }}</div>
						<div class="bl-hint">{{ $t('me.labGamePage.expWearHint') }}</div>
						<div class="bl-hint"><img class="inline-icon" :src="gameIcon('flame')"   > {{ $t('me.labGamePage.expFlint', { n: Math.floor(flintUses || 0) }) }}</div>
						<div class="upgrade-btn upgrade-btn--wide" :class="{ 'upgrade-btn--disabled': !expCanDepart }" @click="expDepart">
							{{ $t('me.labGamePage.expDepart') }}
						</div>
					</template>
					<template v-else>
						<div class="exp-route exp-route--on">
							<div class="exp-route-head">
								<span class="exp-route-name">{{ expActiveRoute ? (isEn ? expActiveRoute.en : expActiveRoute.zh) : '' }}</span>
								<span class="exp-danger">{{ expActiveRoute ? expDangerStr(expActiveRoute.danger) : '' }}</span>
							</div>
							<div class="exp-route-sub">{{ $t('me.labGamePage.expOnCount', { n: expedition.party.length }) }}</div>
						</div>
						<div class="exp-remain"><img class="inline-icon" :src="gameIcon('clock')"   > {{ expRemainText }}</div>
						<div class="exp-vills">
							<div v-for="v in villagers" :key="v.id" class="exp-vill" :class="{ 'exp-vill--on': expedition.party.indexOf(v.id) >= 0, 'exp-vill--exp': v.onExp }">
								<span class="exp-vill-avatar" :style="{ background: resColor(v.equip[0] || 'log') }">{{ v.name.slice(0, 1) }}</span>
								<span class="exp-vill-name">{{ v.name }}</span>
							</div>
						</div>
						<div class="bl-hint">{{ $t('me.labGamePage.expRecallHint') }}</div>
						<div class="upgrade-btn upgrade-btn--wide" @click="expRecallTap">{{ $t('me.labGamePage.expRecallBtn') }}</div>
					</template>
					<div class="modal-close" @click="expOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 远征归来：收获 / 装备损耗 / 殉难 -->
			<div v-if="expResultOpen && expResult" class="overlay" @click.self="expResultOpen = false">
				<div class="modal">
					<div class="modal-title">{{ $t('me.labGamePage.expResultTitle') }}<span v-if="expResultRouteName" class="feed-vill-name">{{ expResultRouteName }}</span></div>
					<div v-if="!expResult.complete" class="bl-hint">{{ $t('me.labGamePage.expResultRecall') }}</div>
					<div v-for="(g, gid) in expResult.gains" :key="gid" class="res-row">
						<img class="res-dot" :src="gameIcon(gid)"   >
						<div class="fr-main"><div class="res-name">{{ resName(gid) }}</div></div>
						<span class="res-val">+{{ g }}</span>
					</div>
					<div v-if="expResult.lootLost" class="bl-hint">{{ $t('me.labGamePage.expLootLost') }}</div>
				<div v-if="expResult.guardExp" class="exp-sec"><img class="inline-icon" :src="gameIcon('ironArmor')"   > {{ $t('me.labGamePage.expGuardGain', { n: expResult.guardExp }) }}</div>
				<div v-for="(g, gi) in expResult.guardUps" :key="'gu' + gi" class="exp-line"><img class="inline-icon" :src="gameIcon('ironArmor')"   > {{ g }}</div>
					<div v-if="expResult.broken.length" class="exp-sec">{{ $t('me.labGamePage.expBroken') }}</div>
					<div v-for="(b, bi) in expResult.broken" :key="'b' + bi" class="exp-line"><img class="inline-icon" :src="gameIcon('sword')"   > {{ b }}</div>
					<div v-if="expResult.usedRestore.length" class="exp-sec">{{ $t('me.labGamePage.expRestoreUsed') }}</div>
					<div v-for="(u, ui) in expResult.usedRestore" :key="'u' + ui" class="exp-line">🧪 {{ u }}</div>
					<div v-if="expResult.fallen.length" class="exp-sec exp-sec--bad">{{ $t('me.labGamePage.expFallen') }}</div>
					<div v-for="(f, fi) in expResult.fallen" :key="'f' + fi" class="exp-line exp-line--bad">✝ {{ f }}</div>
					<div class="modal-close" @click="expResultOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 合成台（MC 工作台配方） -->
			<div v-if="craftOpen" class="overlay" @click.self="craftOpen = false">
				<div class="modal">
					<div class="modal-title">{{ $t('me.labGamePage.craftTitle') }}</div>
					<div class="raid-hint">{{ $t('me.labGamePage.craftHint') }}</div>
					<div v-for="r in craftList" :key="r.id" class="craft-row">
						<img class="res-dot" :src="gameIcon(r.outId)"   >
						<div class="craft-main">
							<div class="craft-name">{{ resName(r.outId) }} ×{{ r.outN }}</div>
							<div class="craft-need" :class="{ 'craft-need--lack': !r.afford }">{{ r.inText }}</div>
						</div>
						<div class="craft-btn" :class="{ 'craft-btn--off': !r.ok }" @click="doCraft(r)">{{ $t('me.labGamePage.craftBtn') }}</div>
					</div>
					<div class="modal-close" @click="craftOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 村民装备选择（武器 / 盔甲 / 回复） -->
			<div v-if="equipOpen" class="overlay" @click.self="equipOpen = false">
				<div class="modal">
					<div class="modal-title">{{ $t('me.labGamePage.equipPickTitle', { slot: $t('me.labGamePage.' + equipSlotKey(equipSlotIdx)) }) }}<span v-if="equipTarget" class="feed-vill-name">{{ equipTarget.name }}</span></div>
					<div v-if="equipSlotIdx === 2" class="mkt-hint">{{ $t('me.labGamePage.equipRestoreHint') }}</div>
					<div v-if="equipTarget && equipTarget.equip[equipSlotIdx]" class="res-row" @click="unequipCur">
						<span class="res-dot" style="background:#b04a3a">−</span>
						<div class="fr-main">
							<div class="res-name">{{ $t('me.labGamePage.equipTakeOff') }}</div>
							<div class="food-sat">{{ $t('me.labGamePage.equipTakeOffHint') }}</div>
						</div>
					</div>
					<div v-for="it in equipOptions" :key="it.key" class="res-row" @click="doEquip(it.key)">
						<img class="res-dot" :src="gameIcon(it.key)"   >
						<div class="fr-main">
							<div class="res-name">{{ resName(it.key) }} ×{{ it.stock }}</div>
							<div class="food-sat">{{ equipEffectText(it.def) }}</div>
						</div>
					</div>
					<div v-if="equipOptions.length === 0" class="empty-tip">{{ $t('me.labGamePage.equipEmptyTip') }}</div>
					<div class="modal-close" @click="equipOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 食物优先级设置 -->
			<div v-if="foodOpen" class="overlay" @click.self="foodOpen = false">
				<div class="modal modal--tall">
					<div class="modal-title">{{ $t('me.labGamePage.foodTitle') }}</div>
					<div class="bl-hint">{{ $t('me.labGamePage.foodHint') }}</div>
					<div v-for="(f, fi) in foodSortList" :key="f.id" class="res-row">
						<img class="res-dot" :src="gameIcon(f.id)"   >
						<div class="fr-main">
							<div class="res-name">{{ resName(f.id) }} ×{{ f.count }}</div>
							<div class="food-sat">{{ $t('me.labGamePage.satiety') }} +{{ f.sat }} · {{ $t('me.labGamePage.foodMood') }} {{ f.mood >= 0 ? '+' : '' }}{{ f.mood }}</div>
							<div v-if="f.hunger" class="food-sat food-hunger">{{ $t('me.labGamePage.foodHunger', { h: f.hunger, extra: hungerExtra }) }}</div>
						</div>
						<div class="food-mv" :class="{ 'food-mv--off': fi === 0 }" @click="foodMove(f.id, -1)">↑</div>
						<div class="food-mv" :class="{ 'food-mv--off': fi === foodSortList.length - 1 }" @click="foodMove(f.id, 1)">↓</div>
					</div>
					<div class="food-reset" @click="foodPrioReset">{{ $t('me.labGamePage.foodReset') }}</div>
					<div class="modal-close" @click="foodOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 建筑图鉴 -->
			<div v-if="blOpen" class="overlay" @click.self="blOpen = false">
				<div class="modal modal--tall">
					<div class="modal-title">{{ $t('me.labGamePage.buildList') }}</div>
					<div class="bl-hint">{{ $t('me.labGamePage.blHint') }}</div>
					<div v-for="b in blList" :key="b.key" class="bl-item">
						<div class="bl-head">
							<img class="bl-char" :src="gameIcon(b.key)"   >
							<span class="bl-name">{{ langName(b) }}</span>
							<span v-if="occText(b)" class="bl-occ">{{ occText(b) }}</span>
							<span class="bl-th">TH{{ b.levels[0].th }}{{ $t('me.labGamePage.blUnlock') }}</span>
						</div>
						<div v-if="builtLoc(b.key) || storedIdxs(b.key).length" class="bl-status">
							<span v-if="builtLoc(b.key)" class="bl-tag bl-tag--built">{{ builtLoc(b.key) }}</span>
							<div v-for="si in storedIdxs(b.key)" :key="'st' + si" class="bl-tag bl-tag--stored">
								<span>{{ $t('me.labGamePage.storedTag') }} Lv{{ stored[si].level }}</span>
								<span class="bl-place-btn" @click="startPlace(si)">{{ $t('me.labGamePage.placeBtn') }}</span>
							</div>
						</div>
						<template v-for="(l, li) in blLines(b)">
							<div v-if="l.desc" :key="'d' + li" class="bl-desc">{{ l.desc }}</div>
							<div v-if="l.text" :key="'p' + li" class="bl-prod">
								<span class="bl-lv">Lv{{ l.lv }}</span>
								<span class="bl-prod-text">{{ l.text }}</span>
							</div>
						</template>
					</div>
					<div class="modal-close" @click="blOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 好友的村庄 -->
			<div v-if="frOpen" class="overlay" @click.self="frOpen = false">
				<div class="modal">
					<div class="modal-title">{{ $t('me.labGamePage.friendVillage') }}</div>
					<div v-for="(f, fi) in friendVillages" :key="fi" class="fr-item" @click="openFriendVillage(fi)">
						<span class="fr-char" :style="{ background: f.color }">{{ f.char }}</span>
						<div class="fr-main">
							<div class="fr-name">{{ f.name }}</div>
							<div class="fr-sub">{{ f.owner }} · Lv.{{ f.lv }}</div>
						</div>
						<div class="fr-visit" @click.stop="openFriendVillage(fi)">{{ $t('me.labGamePage.fvVisit') }}</div>
					</div>
					<div class="modal-close" @click="frOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 僵尸夜袭面板 -->
			<div v-if="raidOpen" class="overlay" @click.self="raidOpen = false">
				<div class="modal">
					<div class="modal-title">{{ $t('me.labGamePage.raid') }}</div>
					<div class="raid-status" :class="{ 'raid-status--on': raidStatus.active }">
						{{ raidStatus.active ? $t('me.labGamePage.raidOngoing') : $t('me.labGamePage.raidPeace') }} · {{ raidStatus.text }}
					</div>
					<div class="raid-def">{{ $t('me.labGamePage.raidStr') }} {{ zombiePower }} · {{ $t('me.labGamePage.power') }} {{ raidPower.toFixed(1) }} · {{ $t('me.labGamePage.defLabel') }} {{ Math.floor(villageDef) }}</div>
					<div v-if="hordeText" class="raid-status raid-status--horde"><img class="inline-icon" :src="gameIcon('journal')"   > {{ hordeText }}</div>
					<div v-if="tiredText" class="raid-status raid-status--tired"><img class="inline-icon" :src="gameIcon('villager')"   > {{ tiredText }}</div>
					<!-- 夜袭挑战模式：七波防守 + 血潮 Boss -->
					<div class="wave-box">
						<div class="wh-title"><img class="inline-icon" :src="gameIcon('sword')"   > {{ $t('me.labGamePage.waveTitle') }}</div>
						<div class="raid-hint">{{ $t('me.labGamePage.waveDesc') }}</div>
						<div v-if="waveCanOptIn || waveCanResume" class="upgrade-btn upgrade-btn--wide" @click="optInWave">
							{{ $t('me.labGamePage.waveEnable') }}
						</div>
						<div v-if="waveOn" class="upgrade-btn upgrade-btn--wide wave-close-btn" @click="closeWave">
							{{ $t('me.labGamePage.waveClose') }}
						</div>
						<div v-if="waveShowPanel" class="wave-live">
							<div class="wave-progress">{{ $t('me.labGamePage.waveProgress', { n: raidWave.done, m: waveCount }) }}</div>
							<div v-if="waveNextText" class="wave-progress wave-progress--dim">{{ waveNextText }}</div>
							<div v-if="bossState" class="boss-box">
								<div class="boss-head">
									<span class="boss-name"><img class="inline-icon" :src="gameIcon('raid')"   > {{ $t('me.labGamePage.bossTitle', { n: bossState.name }) }}</span>
									<span class="boss-hp-num">{{ bossState.hp }}/{{ bossState.max }}</span>
								</div>
								<div class="boss-bar"><div class="boss-bar-fill" :style="{ width: bossState.pct + '%' }"></div></div>
							</div>
							<div v-else-if="raidWave.bossDead" class="wave-progress"><img class="inline-icon" :src="gameIcon('raid')"   > {{ $t('me.labGamePage.bossKilled', { n: raidWave.bossName }) }}</div>
							<div v-else-if="raidWave.bossEscaped" class="wave-progress"><img class="inline-icon" :src="gameIcon('raid')"   > {{ $t('me.labGamePage.bossEscaped', { n: raidWave.bossName }) }}</div>
							<div v-for="(l, li) in raidWave.log" :key="li" class="wave-log">
								<span class="wave-log-text">{{ l.text }}</span>
								<span v-if="l.gains" class="wave-log-gains">{{ l.gains }}</span>
								<span v-if="l.extra" class="wave-log-extra">{{ l.extra }}</span>
							</div>
						</div>
					</div>
					<div class="wh-title">{{ $t('me.labGamePage.raidTemp') }}</div>
					<div v-if="raidTempTotal <= 0" class="empty-tip">{{ $t('me.labGamePage.raidEmpty') }}</div>
					<div v-for="r in raidTempList" :key="r.id" class="res-row">
						<img class="res-dot" :src="gameIcon(r.id)"   >
						<span class="res-name">{{ resName(r.id) }}</span>
						<span class="res-val">{{ r.val }}</span>
					</div>
					<div class="raid-hint">{{ $t('me.labGamePage.raidHint') }}</div>
					<div class="upgrade-btn upgrade-btn--wide" :class="{ 'upgrade-btn--disabled': raidTempTotal <= 0 }" @click="claimRaid">
						{{ $t('me.labGamePage.raidClaim') }}
					</div>
					<div class="modal-close" @click="raidOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 好友的村庄（进入后的村庄面板） -->
			<div v-if="fvOpen" class="overlay" @click.self="fvOpen = false">
				<div class="modal modal--tall">
					<div class="modal-title">{{ fvVillage.name }}</div>
					<div class="fr-item">
						<span class="fr-char" :style="{ background: fvVillage.color }">{{ fvVillage.char }}</span>
						<div class="fr-main">
							<div class="fr-name">{{ fvVillage.owner }}</div>
							<div class="fr-sub">{{ $t('me.labGamePage.baseLevel') }} Lv.{{ fvVillage.lv }}</div>
						</div>
					</div>
					<div class="upgrade-btn upgrade-btn--wide" @click="openFriendMarket">{{ $t('me.labGamePage.market') }}</div>
					<div class="modal-close" @click="fvOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 好友的市场（浏览演示数据） -->
			<div v-if="fmOpen" class="overlay" @click.self="fmOpen = false">
				<div class="modal modal--tall">
					<div class="modal-title">{{ $t('me.labGamePage.fvMarket', { name: fvVillage.name }) }}</div>
					<div v-for="(s, si) in fmListings" :key="si" class="fr-item">
						<img class="fr-char" :src="gameIcon(s.id)"   >
						<div class="fr-main">
							<div class="fr-name">{{ resName(s.id) }} ×{{ s.qty }}</div>
							<div class="fr-sub">
								{{ $t('me.labGamePage.mktPrice') }} <img class="mkt-em" :src="gameIcon('emerald')"  >{{ s.price }} · {{ $t('me.labGamePage.mktTotal') }} <img class="mkt-em" :src="gameIcon('emerald')"  >{{ s.qty * s.price }}
							</div>
						</div>
						<div class="fr-visit" @click="mktBuySoon">{{ $t('me.labGamePage.mktBuyAction') }}</div>
					</div>
					<div class="modal-close" @click="fmOpen = false">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 市场管理（自己的市场：九宫格，前 6 格出售 + 末 3 格收购） -->
			<div v-if="mktOpen" class="overlay" @click.self="closeMarket">
				<div class="modal">
					<div class="modal-title">{{ $t('me.labGamePage.mktManage') }}</div>
					<div class="mkt-grid">
						<div
							v-for="n in 9"
							:key="'mkt' + n"
							class="mkt-cell"
							:class="{ 'mkt-cell--buy': n > 6 }"
							@click="tapMktCell(n - 1)"
						>
							<template v-if="mktSlotAt(n - 1)">
								<div class="mkt-tile" :style="{ background: resColor(mktSlotAt(n - 1).id) }">
									<span class="mkt-tile-tag">{{ n > 6 ? $t('me.labGamePage.mktTagBuy') : $t('me.labGamePage.mktTagSell') }}</span>
									<img class="mkt-tile-char" :src="gameIcon(mktSlotAt(n - 1).id)"   >
									<span class="mkt-tile-qty">×{{ mktSlotAt(n - 1).qty }}</span>
									<div class="mkt-tile-price">
										<img class="mkt-em" :src="gameIcon('emerald')"  >
										<span>{{ mktSlotAt(n - 1).price }}</span>
									</div>
								</div>
							</template>
							<template v-else>
								<div class="mkt-cell-empty">
									<span class="mkt-tile-tag">{{ n > 6 ? $t('me.labGamePage.mktTagBuy') : $t('me.labGamePage.mktTagSell') }}</span>
									<span class="mkt-cell-plus">＋</span>
								</div>
							</template>
						</div>
					</div>
					<div class="mkt-hint">{{ $t('me.labGamePage.mktGridHint') }}</div>
					<!-- 流浪商人：每天随机到访（停留 6 小时），售卖列表按木炭等资源结算 -->
					<div class="trader-box" @click="ensureTrader">
						<div class="trader-head">
							<span class="trader-name"><img class="inline-icon" :src="gameIcon('hero')"   > {{ $t('me.labGamePage.traderTitle') }}</span>
							<span v-if="traderHere" class="trader-stock">{{ $t('me.labGamePage.traderStay', { n: traderLeftH }) }}</span>
						</div>
						<template v-if="traderHere">
							<div v-for="g in TRADER.goods" :key="g.id" class="trader-row" :class="{ 'trader-row--off': (trader.stock[g.id] || 0) < 1 || !canAfford(g.cost) }" @click.stop="buyTraderGood(g)">
								<img class="res-dot" :src="gameIcon(g.id)"   >
								<span class="trader-good">{{ resName(g.id) }} ×{{ trader.stock[g.id] || 0 }}</span>
								<span class="trader-buy">{{ costText(g.cost) }}</span>
							</div>
						</template>
						<div v-else class="trader-row trader-row--off">
							<span class="trader-good">{{ $t('me.labGamePage.traderAway') }}</span>
						</div>
						<div class="mkt-hint">{{ $t('me.labGamePage.traderHint', { n: TRADER.hours }) }}</div>
					</div>
					<div class="modal-close" @click="closeMarket">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>

			<!-- 上架 / 收购编辑弹窗（货币：绿宝石） -->
			<div v-if="mktEdit" class="overlay" @click.self="mktCancelEdit">
				<div class="modal">
					<div class="modal-title">{{ mktEdit.type === 'sell' ? $t('me.labGamePage.mktList') : $t('me.labGamePage.mktBuy') }}</div>
					<picker class="dev-picker" :range="devResNames" @change="onMktResPick">
						<div class="dev-picker-val">{{ resName(mktResId) }}</div>
					</picker>
					<div class="mkt-form-row">
						<input class="dev-input" v-model="mktQty" type="number" :placeholder="$t('me.labGamePage.mktQty')" />
						<input class="dev-input" v-model="mktPrice" type="number" :placeholder="$t('me.labGamePage.mktPriceEm')" />
					</div>
					<div class="mkt-hint">{{ $t('me.labGamePage.mktStackCapHint', { n: stackOfRes(mktResId) }) }}</div>
					<div v-if="mktEditExisting" class="demolish-btn" @click="mktRemoveCurrent">
						{{ mktEdit.type === 'sell' ? $t('me.labGamePage.mktOff') : $t('me.labGamePage.mktCancelOrder') }}
					</div>
					<div class="upgrade-btn upgrade-btn--wide" @click="mktSave">{{ $t('me.labGamePage.mktConfirm') }}</div>
					<div class="modal-close" @click="mktCancelEdit">{{ $t('me.labGamePage.close') }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { defenseIcon } from './game/defense-icons.js'
import { gameStorage } from './storage.js'
const darkModeMixin = { computed: { isDarkMode() { return this.$root.dark } } }
import {
	RESOURCES, BUILDINGS, BUILDING_MAP, TH_LEVELS, TH_QUOTA,
	GROUND_ONLY, UG_CLEAR_COST, UG_CLEAR_MIN, RAID, BASE_DEF, ZOMBIE_POWER,
	FOODS, EAT_THRESHOLD, HUNGER_EXTRA, MOOD_GOOD, MOOD_BAD, MOOD_FACTOR,
	EQUIP_SLOTS, EQUIP_ITEMS, EXPEDITION_ROUTES, expRoute, RAID_WAVES, CRAFT_RECIPES,
	VILL_TRACKS, trackOfBuild, TRACK_LV_EXP, trackLevel, trackBonus, GUARD_EXPED,
	SMITH_CRAFT, TRADER, FLINT_DUR, EQUIP_DUR, PORTAL_WORK,
	efficiency, collectCap, stackOf, whSlots, START_RESOURCES, QUICK_COLLECT_TH, TH_COLORS, RES_TH,
	buildTimeSec, thBuildTimeSec, builderSlots,
	FUEL_VALUE, FUEL_COST, FUEL_ADD_NUM, WALL, WALL_RING_NUM, STORAGE_COST
} from './game/village-data.js'

const CENTER_IDX = 4
const STORE_KEY = 'LogHomeVillage'
const NAME_KEY = 'LogHomeBaseName'
const TRAIN_WHEAT = 20
const MAX_OFFLINE_HOURS = 8
// 开发者倍速档位：仅加速在线时的产出结算
const DEV_SPEEDS = [1, 2, 5, 10, 30, 60]
const START_VILLAGERS = 1
// 村民默认名池（原木主题，取自树木名）
const VILL_NAMES = ['阿橡', '阿松', '阿桦', '阿杨', '小杉', '阿榆', '小枫', '阿柳', '阿槐', '小柏', '阿楠', '小檀']
// 村民状态：每小时饱食消耗；饱食≥50回血 / 饱食归零掉血；心情向目标值漂移
const SATIETY_DECAY = 4
const HP_REGEN = 4
const HP_STARVE = 6
// 英雄原木娘：雇佣费用 = 20 名村民一天的饱食份额（按饱食消耗折算成食物），雇佣时长 24 小时
const HERO_SHARE = 20
const HERO_HOURS = 24
const HERO_COST_SAT = HERO_SHARE * SATIETY_DECAY * 24
// 下界远征：提前召回的奖励折算（已进行时间比例 × 该系数）；回复物在受伤时被用掉的概率
const EXP_RECALL_RATIO = 0.7
const EXP_RESTORE_USE = 0.5
// 手动喂食：药水效果（食物效果取 FOODS）
const FEED_POTION = { hp: 30, sat: 10, mood: 5 }
// 防御耐久：上限 100；夜袭期间损耗，用原木/圆石修补（1 点耐久 = 各 1 材料）
const MAX_DUR = 100

function emptyPlots() {
	return new Array(9).fill(null)
}

// 耐久值规范化：缺省/非法视为满耐久
function normDur(x) {
	return (typeof x === 'number' && isFinite(x)) ? Math.max(0, Math.min(MAX_DUR, x)) : MAX_DUR
}

// 地块规范化：耐久 + 产出囤积 + 施工状态（旧档无 buf 视为空囤积；囤积超出上限时夹取）
function normPlot(p) {
	if (!p) return p
	const out = Object.assign({}, p, { dur: normDur(p.dur), buf: (p.buf && typeof p.buf === 'object') ? p.buf : {}, crew: Array.isArray(p.crew) ? p.crew.filter(id => typeof id === 'number') : [] })
	const b = out.busy
	out.busy = (b && typeof b.end === 'number' && b.to >= 1) ? b : null
	const def = BUILDING_MAP[out.type]
	const cap = def ? collectCap(def, out.level) : null
	if (cap) {
		const clamped = {}
		Object.keys(cap).forEach(id => { clamped[id] = Math.min(cap[id], Math.max(0, Number(out.buf[id]) || 0)) })
		out.buf = clamped
	} else {
		out.buf = {}
	}
	return out
}

export default {
	mixins: [darkModeMixin],
	data() {
		return {
			CENTER_IDX,
			BASE_DEF,
			MAX_DUR,
			WALL,
			FUEL_VALUE,
			FUEL_COST,
			FUEL_ADD_NUM,
			TRADER,
			baseLevel: 0,
			// 大本营耐久（夜袭损耗，可修补）
			baseDur: MAX_DUR,
			// 大本营施工状态（部落冲突式升级耗时）：null 或 { to, end }；end=0 + queued=true 表示排队等待建筑工
			thBusy: null,
			// 建筑工排队：工位占满后新任务在此按下单顺序排队（材料下单时已扣除），{ kind:'building'|'th', layer, idx, to, dur, cost }
			buildQueue: [],
			// 英雄原木娘：null 或 { until 完工时间戳, plot: null | { layer, idx } 指派工位 }
			hero: null,
			heroOpen: false,
			// 合成台（MC 工作台配方）
			craftOpen: false,
			// 下界远征：null 或 { route, hours, start, end, party: [villagerId] }；队员 onExp 期间状态冻结
			expedition: null,
			expOpen: false,
			expSelKey: 'ashPath',
			expSelHoursIdx: 0,
			expPartyIds: [],
			expResult: null,
			expResultOpen: false,
			plots: emptyPlots(),
			// 城墙：九宫格外围 16 段（仅地上层），每段 null=未建 或 { level, dur }
			walls: new Array(WALL_RING_NUM).fill(null),
			wallSel: null,
			// 地下层：ugCleared 标记已清理（默认仅入口正下方 1 格可用）；ugClearing 为清理中格子的完工时间戳（0=未清理）
			ugPlots: emptyPlots(),
			ugCleared: new Array(9).fill(false),
			ugClearing: new Array(9).fill(0),
			layer: 'ground',
			selLayer: 'ground',
			buildLayer: 'ground',
			// 收纳仓库：收纳的建筑（{type, level, dur, buf}）保留等级/耐久/囤积，可在建筑列表重新放置
			stored: [],
			// 首次收纳免费标记
			storeFreeUsed: false,
			// 放置模式：待放置建筑在 stored 中的下标，null=未进入放置模式
			placeSel: null,
			// 僵尸夜袭：临时仓库（掉落暂存）与已累积收益小时数（上限 8h）
			raidOpen: false,
			raidTemp: { rotten: 0, iron: 0, book: 0, flint: 0, lapis: 0 },
			raidTempHours: 0,
			// 打火石耐久（=剩余远征次数）与流浪商人（每日沙子）
			flintUses: 0,
			trader: { day: '', appearAt: 0, stock: {} },
			// 尸潮预告：raidHordeKey=已判定过的夜晚 key（防止重复 roll）；raidHorde={ key, hour, side(1右/东|3左/西), mult, breached }
			raidHordeKey: 0,
			// 夜袭挑战模式：null=今晚未开启；{ key, on, done, bossName, bossHpMax, bossDead, bossEscaped, log: [] }
			raidWave: null,
			// 血潮首杀（全局一次性奖励）
			raidBossSlain: false,
			raidHorde: null,
			// 破墙惩罚：消极怠工截止时间戳（产出 × breachDebuffMul）
			breachDebuffUntil: 0,
			// 铁匠铺燃料：燃料值池 + 燃料来源（默认木炭，转化值更高）
			fuel: 0,
			fuelType: 'charcoal',
			nowTs: Date.now(),
			// 市场：好友村庄浏览 + 自己的市场管理（6 上架 + 3 收购）
			fvOpen: false,
			fvIdx: 0,
			fmOpen: false,
			mktOpen: false,
			marketListings: new Array(6).fill(null),
			marketOrders: new Array(3).fill(null),
			mktEdit: null,
			mktResId: 'log',
			mktQty: '',
			mktPrice: '',
			// 村民对象列表：{ id, name, hp, satiety, mood, equip }
			villagers: [],
			villagerSeq: 0,
			villOpen: false,
			// 手动喂食选择器（food / potion）
			feedOpen: false,
			feedTarget: null,
			// 村民装备选择器（equipTargetId + 装备位下标 0武器/1盔甲/2回复）
			equipOpen: false,
			equipTargetId: null,
			equipSlotIdx: -1,
			// 首次建村民住所免费（含拆除重建判断）
			dormFreeUsed: false,
			// 开局赠送村民（一次性迁移标记，旧档也补发）
			startVillagerGranted: false,
			resources: {},
			baseName: '',
			nameInput: '',
			warehouseOpen: false,
			buildIdx: null,
			selIdx: null,
			blOpen: false,
			frOpen: false,
			saveTimer: null,
			secTimer: null,
			// 开发者控制台
			devOpen: false,
			devResId: 'log',
			devResVal: 1000,
			devBaseVal: 0,
			devVillVal: 0,
			devRaidH: 1,
			speed: 1,
			// 食物自动进食优先级（id 有序列表；空 = 默认 tier 升序、腐肉垫底）
			foodPrio: [],
			foodOpen: false,
			flogOpen: false
		}
	},
	computed: {
		isEn() { return this.$i18n.locale === 'en' },
		displayName() {
			if (this.baseName) return this.baseName
			return this.$t('me.labGamePage.baseDefault', { name: this.currentUserName() })
		},
		capacity() {
			// 大本营自带 1 个村民空位，村民住所提供额外容量
			let cap = 1
			this.plots.forEach(p => {
				if (p && p.type === 'dorm') {
					// 施工中不计新容量：新建未完工不计（视为 0 级），升级完工前维持旧级容量
					const effLv = p.busy ? (p.busy.to > p.level ? p.level : 0) : p.level
					if (effLv > 0) {
						const def = BUILDING_MAP.dorm
						cap += def.levels[effLv - 1].cap
					}
				}
			})
			return cap
		},
		assignedTotal() {
			return this.allPlots.reduce((sum, p) => sum + (p ? (p.workers || 0) : 0), 0)
		},
		unassigned() {
			// 远征中的村民不在村：不进闲置池（原有工位随行冻结，归来自动恢复）
			return Math.max(0, this.villagers.length - this.expOnCount - this.assignedTotal)
		},
		canTrain() {
			return this.villagers.length < this.capacity && (this.resources.wheat || 0) >= TRAIN_WHEAT
		},
		// 地上 + 地下全部建筑
		allPlots() { return this.plots.concat(this.ugPlots) },
		// 村民 id → 村民（工位 crew / 经验结算用）
		villMap() {
			const m = {}
			this.villagers.forEach(v => { m[v.id] = v })
			return m
		},
		// 村民 id → 当班建筑名（村民卡片「在岗」标签）
		villJobs() {
			const m = {}
			this.allPlots.forEach(p => {
				if (!p || !p.crew || !p.crew.length) return
				const def = BUILDING_MAP[p.type]
				if (!def) return
				p.crew.forEach(id => { m[id] = this.isEn ? def.en : def.zh })
			})
			return m
		},
		// 当前楼层的 9 格
		activePlots() { return this.layer === 'ug' ? this.ugPlots : this.plots },
		// 地下室入口所在地上格（无则为 -1）
		basementIdx() {
			return this.plots.findIndex(p => p && p.type === 'basement')
		},
		// 建造选单（underground=true 时仅地下可放的建筑）：TH 解锁 + 数量配额
		buildableGround() { return this.buildableFor(false) },
		buildableUg() { return this.buildableFor(true) },
		buildableActive() { return this.buildLayer === 'ug' ? this.buildableUg : this.buildableGround },
		selPlot() { return this.selIdx === null ? null : (this.selLayer === 'ug' ? this.ugPlots[this.selIdx] : this.plots[this.selIdx]) },
		selDef() { return this.selPlot ? BUILDING_MAP[this.selPlot.type] : null },
		selSlots() { return this.selDef ? this.selDef.slots[this.selPlot.level - 1] : 0 },
		// 当班村民名单（详情面板展示）
		selCrewNames() {
			if (!this.selPlot || !Array.isArray(this.selPlot.crew) || !this.selPlot.crew.length) return ''
			return this.selPlot.crew.map(id => (this.villMap[id] || {}).name).filter(Boolean).join('、')
		},
		selNext() {
			if (!this.selDef) return null
			return this.selDef.levels[this.selPlot.level] || null
		},
		selDesc() {
			if (!this.selDef) return ''
			const cur = this.selDef.levels[this.selPlot.level - 1]
			if (!cur.desc) return ''
			return this.isEn ? (cur.descEn || cur.desc) : cur.desc
		},
		selProdList() {
			if (!this.selDef) return []
			const cur = this.selDef.levels[this.selPlot.level - 1]
			// 与实际结算一致：工位满员率 × 心情效率（原木娘指派中视作满功率）
			const eff = this.isHeroIdx(this.selLayer, this.selIdx) ? 1 : efficiency(this.selPlot.workers, this.selSlots) * this.moodFactor * this.workMorale()
			// 未满编时附注满功耗数值，提示补村民可提升产出
			const full = eff < 1 ? this.$t('me.labGamePage.fullPower') : ''
			const fmt = n => (n % 1 === 0 ? n : n.toFixed(1))
			const list = []
			if (cur.prod) {
				Object.keys(cur.prod).forEach(id => {
					const rate = cur.prod[id] * eff
					list.push({ id, neg: false, text: '+ ' + this.resName(id) + ' ' + fmt(rate) + (full ? '（' + full + fmt(cur.prod[id]) + '）' : '') })
				})
			}
			if (cur.consumes) {
				Object.keys(cur.consumes).forEach(id => {
					const rate = cur.consumes[id] * eff
					list.push({ neg: true, text: '− ' + this.resName(id) + ' ' + fmt(rate) + (full ? '（' + full + fmt(cur.consumes[id]) + '）' : '') })
				})
			}
			// 铁匠铺：附注燃料值消耗（满编合计）
			if (this.selDef.key === 'smith' && cur.prod) {
				const keys = Object.keys(cur.prod)
				const rate = keys.reduce((s, id) => s + cur.prod[id] * eff * (FUEL_COST[id] || 0), 0)
				const rateFull = keys.reduce((s, id) => s + cur.prod[id] * (FUEL_COST[id] || 0), 0)
				list.push({ neg: true, text: '− ' + this.$t('me.labGamePage.fuelValue') + ' ' + fmt(rate) + (full ? '（' + full + fmt(rateFull) + '）' : '') })
				// 熔炼配方产物改「名称 +N」并附原料单耗（玻璃耗沙子、铁锭耗粗铁）；原料不够造 1 个时标红停产
				keys.forEach(id => {
					const rec = SMITH_CRAFT[id]
					const item = list.find(x => x.id === id)
					if (!rec || !item) return
					const ings = Object.keys(rec).map(ing => this.resName(ing) + '×' + rec[ing]).join('+')
					const halted = !Object.keys(rec).every(ing => (this.resources[ing] || 0) >= rec[ing])
					item.text = this.resName(id) + ' +' + fmt(cur.prod[id] * eff) + (full ? '（' + full + fmt(cur.prod[id]) + '）' : '')
					item.text += '（' + this.$t('me.labGamePage.smithCraftCost', { n: ings }) + (halted ? ' · ' + this.$t('me.labGamePage.smithCraftLack') : '') + '）'
					if (halted) item.lack = true
				})
			}
			return list
		},
		// 选中建筑的囤积列表（部落冲突式产出暂存）
		selBufList() {
			const p = this.selPlot
			if (!p || !this.selDef) return []
			const cap = collectCap(this.selDef, p.level) || {}
			return Object.keys(cap).map(id => {
				const val = (p.buf && p.buf[id]) || 0
				return { id, val, cap: cap[id], ratio: Math.min(1, val / cap[id]) }
			})
		},
		selCapTotal() { return this.selBufList.reduce((s, b) => s + b.cap, 0) },
		selBufCount() { return this.selBufList.reduce((s, b) => s + Math.floor(b.val), 0) },
		canUpgradeSel() {
			if (!this.selNext || (this.selPlot && this.selPlot.busy)) return false
			return this.baseLevel >= this.selNext.th && this.canAfford(this.selNext.cost)
		},
		thNext() {
			return TH_LEVELS[this.baseLevel] || null
		},
		thReqList() {
			if (!this.thNext) return []
			return this.thNext.req.map(([type, lv]) => {
				const def = BUILDING_MAP[type]
				const best = this.allPlots.reduce((max, p) => (p && p.type === type && p.level > max) ? p.level : max, 0)
				const label = this.isEn ? def.en : def.zh
				return {
					ok: best >= lv,
					text: label + ' Lv' + lv + (best >= lv ? ' ✓' : ` (${best}/${lv})`)
				}
			})
		},
		thCanUpgrade() {
			if (!this.thNext || this.thBusy) return false
			return this.thReqList.every(r => r.ok) && this.canAfford(this.thNext.cost)
		},
		// ---------- 建筑工工位 ----------
		// 当前大本营等级的建筑工总数
		builderSlotsTotal() {
			return builderSlots(this.baseLevel)
		},
		// 正在施工的任务数（新建/升级/大本营升级；排队中的不计入）
		activeBuilds() {
			let n = this.plots.concat(this.ugPlots).filter(p => p && p.busy && !p.busy.queued).length
			if (this.thBusy && !this.thBusy.queued) n++
			return n
		},
		// 空闲建筑工数
		builderFree() {
			return Math.max(0, this.builderSlotsTotal - this.activeBuilds)
		},
		// 排队任务列表（模板展示：任务名 + 取消下标）
		buildQueueItems() {
			return this.buildQueue.map((j, i) => {
				let name
				if (j.kind === 'th') {
					name = this.$t('me.labGamePage.thUpgrade') + ' Lv.' + j.to
				} else {
					const arr = j.layer === 'ug' ? this.ugPlots : this.plots
					const p = arr[j.idx]
					const def = p && BUILDING_MAP[p.type]
					name = def ? (this.isEn ? def.en : def.zh) + ' Lv.' + j.to : '?'
				}
				return { i, name }
			})
		},
		// 大本营施工剩余时间（依赖 nowTs 每秒刷新）
		thBusyText() {
			if (!this.thBusy) return ''
			if (this.thBusy.queued) return this.$t('me.labGamePage.queueWait')
			return this.fmtDur((this.thBusy.end - this.nowTs) / 1000)
		},
		// 大本营升级耗时文本
		thTimeText() {
			return this.thNext ? this.fmtDur(thBuildTimeSec(this.baseLevel + 1)) : ''
		},
		// ---------- 英雄原木娘 ----------
		// 雇佣中（依赖 nowTs 每秒刷新倒计时；过期由 checkBuilds 清理）
		heroActive() {
			return !!this.hero && this.hero.until > this.nowTs
		},
		// ---------- 下界远征 ----------
		expRoutes() { return EXPEDITION_ROUTES },
		// 面板当前选中的路线（远征未出发时）
		expPanelRoute() {
			return EXPEDITION_ROUTES.find(r => r.key === this.expSelKey) || EXPEDITION_ROUTES[0]
		},
		expPanelHours() {
			const hs = this.expPanelRoute ? this.expPanelRoute.hours : []
			return hs[this.expSelHoursIdx] || hs[0] || 0
		},
		// 出发口粮：每名村民每小时饱食 × 时长 × 人数
		expFoodNeed() {
			const r = this.expPanelRoute
			return r ? r.satPerHour * this.expPanelHours * this.expPartyIds.length : 0
		},
		// 出发按钮可用：路线解锁 + 队伍人数达标 + 口粮够
		expCanDepart() {
			const r = this.expPanelRoute
			if (!r || this.expedition || this.baseLevel < r.th) return false
			const n = this.expPartyIds.length
			if (n < r.partyMin || n > r.partyMax) return false
			// 打火石耐久即远征次数：耐久不足不能出发
			if ((this.flintUses || 0) < 1) return false
			return (this.foodStat.sat || 0) >= this.expFoodNeed
		},
		// 远征中信息
		expActiveRoute() {
			return this.expedition ? expRoute(this.expedition.route) : null
		},
		expOnCount() {
			return this.villagers.filter(v => v.onExp).length
		},
		expRemainText() {
			if (!this.expedition) return ''
			return this.fmtDur((this.expedition.end - this.nowTs) / 1000)
		},
		expResultRouteName() {
			const r = this.expResult ? expRoute(this.expResult.route) : null
			return r ? (this.isEn ? r.en : r.zh) : ''
		},
		heroRemainText() {
			if (!this.heroActive) return ''
			return this.fmtDur((this.hero.until - this.nowTs) / 1000)
		},
		// 雇佣费用（20 名村民一天的饱食份额）
		heroCostSat() { return HERO_COST_SAT },
		heroBtnLabel() {
			return this.heroActive
				? this.$t('me.labGamePage.heroName') + ' ' + this.heroRemainText
				: this.$t('me.labGamePage.heroBtn')
		},
		// 指派地块的显示名（建筑被拆时视为未指派）
		heroPlotInfo() {
			if (!this.heroActive || !this.hero.plot) return null
			const { layer, idx } = this.hero.plot
			const p = (layer === 'ug' ? this.ugPlots : this.plots)[idx]
			if (!p) return null
			const def = BUILDING_MAP[p.type]
			if (!def) return null
			return (this.isEn ? def.en : def.zh) + (layer === 'ug' ? this.$t('me.labGamePage.layerUg') : '')
		},
		// 流浪商人当前是否在村（到访窗口内）
		traderHere() {
			return this.trader.appearAt > 0 && this.nowTs >= this.trader.appearAt && this.nowTs < this.trader.appearAt + TRADER.hours * 3600000
		},
		traderLeftH() {
			return Math.max(1, Math.ceil((this.trader.appearAt + TRADER.hours * 3600000 - this.nowTs) / 3600000))
		},
		ownedList() {
			return Object.keys(this.resources)
				.filter(id => id !== 'emerald' && (this.resources[id] || 0) >= 0.001)
				.sort((a, b) => (this.resources[b] || 0) - (this.resources[a] || 0))
		},
		// 仓库格子容量：每格一组，绿宝石为货币不占格
		whSlotsTotal() { return whSlots(this.baseLevel) },
		whUsed() {
			let used = 0
			Object.keys(this.resources).forEach(id => {
				if (id === 'emerald') return
				const v = Math.floor(this.resources[id] || 0)
				if (v >= 1) used += Math.ceil(v / stackOf(id))
			})
			return used
		},
		// 开发者控制台
		devResIds() { return Object.keys(RESOURCES) },
		devResNames() { return this.devResIds.map(id => this.resName(id) + ' · ' + id) },
		devResLabel() { return this.resName(this.devResId) },
		speedOptions() { return DEV_SPEEDS },
		raidSimOptions() { return [0.5, 1, 2, 4, 8] },
		// 一键收集入口：TH5 起开放，前期隐藏
		quickCollectOpen() { return this.baseLevel >= QUICK_COLLECT_TH },
		// 大本营主题色（随等级变动）
		thColor() { return TH_COLORS[this.baseLevel] || '#8b5e34' },
		// ---------- 食物与进食优先级 ----------
		// 饥饿buff每小时额外饱食消耗（模板展示用）
		hungerExtra() { return HUNGER_EXTRA },
		// 地下清理耗时（分钟，模板展示用）
		ugClearMin() { return UG_CLEAR_MIN },
		// 完整优先级列表：玩家设置在前，其余按默认（tier 升序、腐肉垫底）补齐
		foodPrioList() {
			const ids = Object.keys(FOODS)
			const def = ids.slice().sort((a, b) => {
				const ta = a === 'rotten' ? 99 : FOODS[a].tier
				const tb = b === 'rotten' ? 99 : FOODS[b].tier
				return ta - tb
			})
			const order = this.foodPrio.filter(id => ids.indexOf(id) >= 0)
			def.forEach(id => { if (order.indexOf(id) < 0) order.push(id) })
			return order.map(id => {
				const count = Math.floor(this.resources[id] || 0)
				return { id, count, sat: FOODS[id].sat, mood: FOODS[id].mood || 0, hunger: FOODS[id].hunger || 0, total: count * FOODS[id].sat }
			})
		},
		// 顶栏汇总：食物总数与可转化的总饱食度
		foodStat() {
			const s = this.foodPrioList.reduce((m, f) => ({ count: m.count + f.count, sat: m.sat + f.total }), { count: 0, sat: 0 })
			return s
		},
		// 优先级排序弹窗列表：仅显示当前持有的食物（未持有的隐藏、不参与排序）
		foodSortList() {
			return this.foodPrioList.filter(f => f.count >= 1)
		},
		// 手动喂食可选列表：全部食物（默认 tier 升序、腐肉垫底）+ 药水（回血）
		feedOptions() {
			const foods = this.foodPrioList.map(f => ({ id: f.id, food: true, sat: f.sat, mood: f.mood, hunger: f.hunger }))
			foods.push({ id: 'potion', food: false, hp: FEED_POTION.hp, sat: FEED_POTION.sat, mood: FEED_POTION.mood })
			return foods.map(f => {
				const bits = []
				if (f.hp) bits.push(this.$t('me.labGamePage.feedHp', { n: f.hp }))
				if (f.sat) bits.push(this.$t('me.labGamePage.satiety') + ' +' + f.sat)
				if (f.mood) bits.push(this.$t('me.labGamePage.foodMood') + ' ' + (f.mood > 0 ? '+' : '') + f.mood)
				if (f.hunger) bits.push(this.$t('me.labGamePage.foodHunger', { h: f.hunger, extra: HUNGER_EXTRA }))
				return { id: f.id, food: f.food, stock: Math.floor(this.resources[f.id] || 0), effect: bits.join(' · ') }
			})
		},
		// 当前喂食目标村民
		feedVill() {
			return this.villagers.find(v => v.id === this.feedTarget) || null
		},
		// 一键喂食可用：有未吃饱村民且有食物库存（不含药水）
		feedAllReady() {
			return this.villagers.some(v => v.satiety < 99.5) && this.foodPrioList.some(f => f.count >= 1 && f.sat > 0)
		},
		// ---------- 村民装备 ----------
		equipTarget() {
			return this.villagers.find(v => v.id === this.equipTargetId) || null
		},
		// 当前装备位可选列表：同槽位物品且仓库有货
		equipOptions() {
			if (!this.equipTarget || this.equipSlotIdx < 0 || this.equipSlotIdx >= EQUIP_SLOTS.length) return []
			const slot = EQUIP_SLOTS[this.equipSlotIdx].key
			return Object.keys(EQUIP_ITEMS)
				.filter(k => EQUIP_ITEMS[k].slot === slot && this.floorRes(k) >= 1)
				.map(k => ({ key: k, def: EQUIP_ITEMS[k], stock: Math.floor(this.resources[k] || 0) }))
		},
		// 可一键收集的总量（所有建筑囤积的整数量之和）
		quickCollectCount() {
			let n = 0
			this.allPlots.forEach(p => {
				if (!p) return
				const cap = collectCap(BUILDING_MAP[p.type], p.level)
				if (!cap) return
				Object.keys(cap).forEach(id => { n += Math.floor((p.buf || {})[id] || 0) })
			})
			return n
		},
		// 建筑图鉴
		// 建筑图鉴：按解锁大本营等级升序（同等级保持配置顺序）
		blList() { return BUILDINGS.slice().sort((a, b) => a.levels[0].th - b.levels[0].th) },
		// ---------- 僵尸夜袭 ----------
		// 战力 = Σ 瞭望塔 攻击力 ×（已用弓箭手 / 工位）×（耐久 / 100）+ Σ 村民武器攻击（民兵参战）
		raidPower() {
			let power = 0
			this.allPlots.forEach((p, i) => {
				if (!p || p.type !== 'watchtower') return
				const def = BUILDING_MAP.watchtower
				const cur = def.levels[p.level - 1]
				const slots = def.slots[p.level - 1]
				if (!cur || slots <= 0) return
				// 原木娘指派中视作满员（allPlots 前 9 格为地上、后 9 格为地下）
				const ratio = this.isHeroIdx(i < 9 ? 'ground' : 'ug', i < 9 ? i : i - 9) ? 1 : Math.min(1, (p.workers || 0) / slots)
				power += (cur.atk || 0) * ratio * (normDur(p.dur) / 100)
			})
			this.villagers.forEach(v => {
				const w = v.equip && v.equip[0] ? EQUIP_ITEMS[v.equip[0]] : null
				if (w && w.slot === 'weapon') power += w.atk
			})
			return power
		},
		// 大本营当前防御力（随耐久折减）
		baseDef() {
			return ((BASE_DEF[this.baseLevel] || 0) * this.baseDur / MAX_DUR)
		},
		// 城墙当前总防御力（Σ 每段 def × 耐久/100，仅已建段）
		wallDef() {
			let def = 0
			this.walls.forEach(w => {
				if (!w) return
				const cur = WALL.levels[w.level - 1]
				if (cur) def += (cur.def || 0) * (normDur(w.dur) / 100)
			})
			return def
		},
		// 村庄总防御力 = 大本营 + 城墙（夜袭受伤结算用）
		villageDef() { return this.baseDef + this.wallDef },
		// ---------- 城墙弹窗 ----------
		wallCur() { return this.wallSel === null ? null : (this.walls[this.wallSel] || null) },
		wallDur() { return this.wallCur ? normDur(this.wallCur.dur) : MAX_DUR },
		wallTitle() {
			return this.wallCur
				? this.wallMatName(this.wallCur.level) + ' Lv.' + this.wallCur.level
				: this.$t('me.labGamePage.wallBuild')
		},
		wallCurDef() {
			if (!this.wallCur) return 0
			const cur = WALL.levels[this.wallCur.level - 1]
			return ((cur && cur.def) || 0) * (this.wallDur / MAX_DUR)
		},
		wallMaxDef() {
			if (!this.wallCur) return 0
			const cur = WALL.levels[this.wallCur.level - 1]
			return (cur && cur.def) || 0
		},
		// 未建 → 0 级建造；已建 → 下一级（无则 null）
		wallNext() {
			if (!this.wallCur) return WALL.levels[0]
			return WALL.levels[this.wallCur.level] || null
		},
		wallCanUp() {
			if (!this.wallNext) return false
			return this.baseLevel >= this.wallNext.th && this.canAfford(this.wallNext.cost)
		},
		// 城墙修补材料随材质：木墙原木、石墙石头、铁墙铁锭（1 点耐久 = 1 材料）
		wallRepairRes() {
			const lv = this.wallCur ? this.wallCur.level : 0
			return ['log', 'stone', 'iron'][lv] || 'log'
		},
		wallRepairCost() {
			const c = {}
			c[this.wallRepairRes] = Math.ceil(MAX_DUR - this.wallDur)
			return c
		},
		wallRepairCostText() {
			return this.costText(this.wallRepairCost)
		},
		// 传送门驻守危险参数（模板展示用）
		portalWork() {
			return PORTAL_WORK
		},
		canRepairWall() {
			return this.wallDur < MAX_DUR && (this.resources[this.wallRepairRes] || 0) >= Math.ceil(MAX_DUR - this.wallDur)
		},
		// 僵尸夜袭强度（随大本营等级提高）
		zombiePower() {
			return ZOMBIE_POWER[this.baseLevel] || 0
		},
		// 心情效率：全村平均心情 >80 产出 +15%，<30 产出 -15%（无人则无修正）
		moodFactor() {
			if (this.villagers.length === 0) return 1
			const avg = this.villagers.reduce((s, v) => s + (v.mood || 0), 0) / this.villagers.length
			if (avg > MOOD_GOOD) return 1 + MOOD_FACTOR
			if (avg < MOOD_BAD) return 1 - MOOD_FACTOR
			return 1
		},
		moodEffText() {
			if (this.moodFactor === 1) return ''
			const pct = Math.round(Math.abs(this.moodFactor - 1) * 100)
			return (this.moodFactor > 1 ? '+' : '−') + pct + '%'
		},
		// ---------- 尸潮预告 ----------
		// 今晚（以 18:00 为界）的夜晚 key：晚 18 点后翻到新的一晚
		hordeKeyNow() {
			return Math.floor((this.nowTs + 8 * 3600000 - RAID.startHour * 3600000) / 86400000)
		},
		// 主界面夜袭行 / 夜袭面板的预告文案（仅当夜 & 夜袭窗口内显示）
		hordeText() {
			const h = this.raidHorde
			if (!h || h.key !== this.hordeKeyNow || !this.isRaidAt(this.bjNow())) return ''
			return this.$t('me.labGamePage.raidHordeHint', {
				h: h.hour,
				x: '×' + h.mult,
				p: Math.round(this.zombiePower * h.mult),
				side: this.$t(h.side === 1 ? 'me.labGamePage.raidSideE' : 'me.labGamePage.raidSideW')
			})
		},
		// 消极怠工（破墙惩罚）剩余提示
		tiredText() {
			if (this.nowTs >= this.breachDebuffUntil) return ''
			return this.$t('me.labGamePage.raidTired', {
				pct: Math.round((1 - RAID.breachDebuffMul) * 100),
				t: this.fmtDur((this.breachDebuffUntil - this.nowTs) / 1000)
			})
		},
		// ---------- 夜袭挑战模式 ----------
		// 新挑战使用北京时间的当前日历日，白天预约的是今晚而非昨晚。
		waveStartKey() { return Math.floor((this.nowTs + 8 * 3600000) / 86400000) },
		// 总波数（模板需展示，从配置取）
		waveCount() { return RAID_WAVES.count },
		// 能否开启挑战（挑战未进行中、当晚 22:00 第一波未到）
		waveCanOptIn() {
			if (this.raidWave && this.raidWave.on) return false
			return Date.now() < this.waveTimesAbs()[0]
		},
		// 关闭后可重新开启续场（挑战未打完且下一波未到）
		waveCanResume() {
			const wv = this.raidWave
			if (!wv || wv.on || wv.bossDead || wv.bossEscaped) return false
			if (wv.done >= RAID_WAVES.count) return false
			return Date.now() < this.waveTimesAbs(wv.key)[wv.done]
		},
		// 挑战模式进行中（跨多晚：开启后直到打完/关闭一直成立）
		waveOn() {
			return !!(this.raidWave && this.raidWave.on)
		},
		// 进度面板展示条件：进行中，或有战报可看（打完/关闭后保留）
		waveShowPanel() {
			const wv = this.raidWave
			return !!(wv && (wv.on || (wv.log && wv.log.length)))
		},
		// 下一波倒计时 / 血潮激战文案
		waveNextText() {
			const wv = this.raidWave
			if (!this.waveOn || wv.done >= RAID_WAVES.count) return ''
			const times = this.waveTimesAbs(wv.key)
			const t = times[wv.done]
			if (this.nowTs >= t) {
				return (this.baseLevel >= RAID_WAVES.bossTh && wv.done === RAID_WAVES.count - 1)
					? this.$t('me.labGamePage.bossFighting')
					: ''
			}
			return this.$t('me.labGamePage.waveNext', { t: this.fmtDur((t - this.nowTs) / 1000) })
		},
		// 血潮 Boss 战况（血条实时消耗 = 当前战力 × 已战时长）
		bossState() {
			const wv = this.raidWave
			if (!this.waveOn || wv.done < RAID_WAVES.count - 1) return null
			if (this.baseLevel < RAID_WAVES.bossTh || wv.bossDead || wv.bossEscaped || !wv.bossHpMax) return null
			const start = this.waveTimesAbs(wv.key)[RAID_WAVES.count - 1]
			if (this.nowTs < start) return null
			const battleEnd = this.waveWindowEnd(wv.key)
			const dmg = Math.min(wv.bossHpMax, this.raidPower * (Math.min(this.nowTs, battleEnd) - start) / 3600000)
			const hp = Math.max(0, Math.round(wv.bossHpMax - dmg))
			return { name: wv.bossName, hp, max: wv.bossHpMax, pct: Math.max(0, Math.min(100, Math.round(hp / wv.bossHpMax * 100))) }
		},
		// ---------- 合成台 ----------
		craftList() {
			return CRAFT_RECIPES.map(r => {
				const outId = Object.keys(r.out)[0]
				const noRoom = Object.keys(r.out).some(id => this.addRoom(id) < r.out[id])
				return {
					id: r.id || outId,
					in: r.in,
					out: r.out,
					outId,
					outN: r.out[outId],
					inText: this.costText(r.in),
					afford: this.canAfford(r.in),
					ok: this.canAfford(r.in) && !noRoom
				}
			})
		},
		// 选中建筑的攻防数值（原始值，未按耐久/驻军折减）
		selAtk() {
			if (!this.selDef) return 0
			return this.selDef.levels[this.selPlot.level - 1].atk || 0
		},
		selDefVal() {
			if (!this.selDef) return 0
			return this.selDef.levels[this.selPlot.level - 1].def || 0
		},
		// 选中建筑驻军比例（0~1，工位为 0 的建筑视为满编）
		selStaffRatio() {
			if (this.selSlots <= 0) return 1
			// 原木娘指派中：视作满员
			if (this.isHeroIdx(this.selLayer, this.selIdx)) return 1
			return Math.min(1, (this.selPlot.workers || 0) / this.selSlots)
		},
		selDur() { return this.durOf(this.selPlot) },
		canRepairSel() {
			return this.selDur < MAX_DUR && this.canAfford(this.repairCostOf(this.selDur))
		},
		repairSelCostText() { return this.costText(this.repairCostOf(this.selDur)) },
		canRepairBase() {
			return this.baseDur < MAX_DUR && this.canAfford(this.repairCostOf(this.baseDur))
		},
		// 夜袭状态与倒计时（北京时间 18:00 ~ 次日 06:00）
		raidStatus() {			const bj = this.bjNow()
			const active = this.isRaidAt(bj)
			const d = new Date(bj)
			let target
			if (active) {
				target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), RAID.endHour, 0, 0)
			} else {
				target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), RAID.startHour, 0, 0)
			}
			if (target <= bj) target += 86400000
			const diff = Math.max(0, target - bj)
			const pad = n => (n < 10 ? '0' + n : '' + n)
			const text = (active ? this.$t('me.labGamePage.raidEndIn') : this.$t('me.labGamePage.raidStartIn'))
				+ ' ' + pad(Math.floor(diff / 3600000)) + ':' + pad(Math.floor(diff % 3600000 / 60000)) + ':' + pad(Math.floor(diff % 60000 / 1000))
			return { active, text }
		},
		raidTempList() {
			const list = []
			if ((this.raidTemp.rotten || 0) >= 1) list.push({ id: 'rotten', val: Math.floor(this.raidTemp.rotten) })
			if ((this.raidTemp.iron || 0) >= 1) list.push({ id: 'iron', val: Math.floor(this.raidTemp.iron) })
			if ((this.raidTemp.book || 0) >= 1) list.push({ id: 'book', val: Math.floor(this.raidTemp.book) })
			if ((this.raidTemp.flint || 0) >= 1) list.push({ id: 'flint', val: Math.floor(this.raidTemp.flint) })
			if ((this.raidTemp.lapis || 0) >= 1) list.push({ id: 'lapis', val: Math.floor(this.raidTemp.lapis) })
			return list
		},
		raidTempTotal() {
			return this.raidTempList.reduce((s, r) => s + r.val, 0)
		},
		// 好友的村庄（占位数据，后续接后端好友体系）
		friendVillages() {
			return [{
				char: this.$t('me.labGamePage.fvDemoName').slice(0, 1),
				name: this.$t('me.labGamePage.fvDemoName'),
				owner: this.$t('me.labGamePage.fvDemoOwner'),
				lv: 3,
				color: '#6aa84f'
			}]
		},
		fvVillage() { return this.friendVillages[this.fvIdx] || this.friendVillages[0] },
		// 好友村庄消息日志（演示数据）：以北京时间凌晨 5 点为一天边界，按日种子生成，
		// 同一天内内容稳定，跨天（5 点后）自动刷新；后续接后端真实日志
		friendLogs() {
			const day = 86400000
			const dayIdx = Math.floor((this.bjNow() - 5 * 3600000) / day)
			// LCG 伪随机：同一天稳定，跨天变化
			let s = (dayIdx * 2654435761 + 12345) % 4294967296
			const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 }
			const pool = ['log', 'stone', 'wheat', 'carrot', 'iron', 'bread', 'apple']
			const pick = () => pool[Math.floor(rnd() * pool.length)]
			const logs = []
			// 1. 每日仓库增减统计（3~4 项，正负增量）
			const parts = []
			const nStat = 3 + Math.floor(rnd() * 2)
			for (let i = 0; i < nStat; i++) {
				const delta = Math.floor(rnd() * 220) - 90
				if (delta === 0) continue
				parts.push(this.resName(pick()) + (delta > 0 ? ' +' : ' −') + Math.abs(delta))
			}
			if (parts.length) logs.push({ type: 'stat', tkey: 'logTypeStat', text: parts.join(' · ') })
			// 2. 市场收购/售出记录（1~3 条）
			const nMkt = 1 + Math.floor(rnd() * 3)
			for (let i = 0; i < nMkt; i++) {
				const sell = rnd() > 0.5
				logs.push({
					type: 'market',
					tkey: 'logTypeMarket',
					text: this.$t(sell ? 'me.labGamePage.logSold' : 'me.labGamePage.logBought', {
						item: this.resName(pick()),
						n: 1 + Math.floor(rnd() * 20),
						p: 1 + Math.floor(rnd() * 8)
					})
				})
			}
			// 3. 好友偷取资源（约四成概率发生）
			if (rnd() > 0.6) {
				const thief = VILL_NAMES[Math.floor(rnd() * VILL_NAMES.length)]
				logs.push({
					type: 'steal',
					tkey: 'logTypeSteal',
					text: this.$t('me.labGamePage.logSteal', { name: thief, item: this.resName(pick()), n: 1 + Math.floor(rnd() * 30) })
				})
			} else {
				logs.push({ type: 'steal', tkey: 'logTypeSteal', text: this.$t('me.labGamePage.logNoSteal') })
			}
			// 4. 更新公告（固定文案，置底）
			logs.push({ type: 'notice', tkey: 'logTypeNotice', text: this.$t('me.labGamePage.logNotice') })
			return logs
		},
		// 好友市场演示挂单（后续接后端）
		fmListings() {
			return [
				{ id: 'log', qty: 200, price: 1 },
				{ id: 'stone', qty: 80, price: 2 },
				{ id: 'bread', qty: 15, price: 4 }
			]
		},
		// 市场编辑弹窗当前编辑的挂单/收购单（新建时为 null）
		mktEditExisting() {
			if (!this.mktEdit) return null
			return this.mktEdit.type === 'sell'
				? this.marketListings[this.mktEdit.idx]
				: this.marketOrders[this.mktEdit.idx]
		}
	},
	created() {
		this.loadState()
		const saved = gameStorage.getItem(NAME_KEY)
		if (saved) this.baseName = saved
	},
	mounted() {
		this.resumeGame()
	},
	beforeDestroy() {
		this.teardown()
	},
	methods: {
		resumeGame() {
			if (this.saveTimer || this.secTimer) return
			this.nowTs = Date.now()
			this.settleProduction(false)
			this.saveTimer = setInterval(() => this.settleProduction(true), 30000)
			this.secTimer = setInterval(() => { this.nowTs = Date.now(); this.checkBuilds() }, 1000)
		},
		gameIcon: defenseIcon,
		teardown() {
			if (this.saveTimer) { clearInterval(this.saveTimer); this.saveTimer = null }
			if (this.secTimer) { clearInterval(this.secTimer); this.secTimer = null }
			this.persist()
		},
		// ---------- 状态持久化 ----------
		loadState() {
			try {
				const raw = gameStorage.getItem(STORE_KEY)
				if (!raw) {
					// 新档：默认带 1 名村民
					this.villagers = [this.makeVillager()]
					this.startVillagerGranted = true
					return
				}
				const s = JSON.parse(raw)
				this.baseLevel = (typeof s.baseLevel === 'number') ? s.baseLevel : 0
				this.baseDur = normDur(s.baseDur)
				// 大本营施工状态：旧档无该字段视为空闲
				this.thBusy = (s.thBusy && typeof s.thBusy.end === 'number' && s.thBusy.to >= 1) ? s.thBusy : null
				// 英雄原木娘：旧档无该字段视为未雇佣；到期的由 checkBuilds 清理
				this.hero = (s.hero && typeof s.hero.until === 'number')
					? { until: s.hero.until, plot: (s.hero.plot && typeof s.hero.plot.idx === 'number' && (s.hero.plot.layer === 'ug' || s.hero.plot.layer === 'ground')) ? s.hero.plot : null }
					: null
				// 建筑耐久：旧档无该字段默认满耐久
				this.plots = Object.assign(emptyPlots(), s.plots || {}).map(normPlot)
				this.ugPlots = Object.assign(emptyPlots(), s.ugPlots || {}).map(normPlot)
				this.ugCleared = new Array(9).fill(false).map((c, i) => !!(s.ugCleared && s.ugCleared[i]) || !!this.ugPlots[i])
				// 地下清理中的完工时间戳：旧档无该字段视为空闲
				this.ugClearing = new Array(9).fill(0).map((c, i) => (s.ugClearing && typeof s.ugClearing[i] === 'number' && s.ugClearing[i] > Date.now()) ? s.ugClearing[i] : 0)
				// 建筑工排队：仅保留地块/大本营施工排队标记仍一致的任务（防止手动改档悬空）
				this.buildQueue = (Array.isArray(s.buildQueue) ? s.buildQueue : []).filter(j => {
					if (!j || (j.kind !== 'th' && j.kind !== 'building')) return false
					if (typeof j.to !== 'number' || typeof j.dur !== 'number') return false
					if (j.kind === 'th') return !!(this.thBusy && this.thBusy.queued && this.thBusy.to === j.to)
					const arr = j.layer === 'ug' ? this.ugPlots : this.plots
					const p = arr[j.idx]
					return !!(p && p.busy && p.busy.queued && p.busy.to === j.to)
				})
				// 村民：旧档为数字（人数），迁移为对象列表
				if (Array.isArray(s.villagers)) {
					this.villagerSeq = s.villagerSeq || s.villagers.length
					this.villagers = s.villagers.map(v => this.normalizeVillager(v))
				} else {
					const n = parseInt(s.villagers, 10) || 0
					this.villagerSeq = 0
					this.villagers = []
					for (let i = 0; i < n; i++) this.villagers.push(this.makeVillager())
				}
				this.dormFreeUsed = !!s.dormFreeUsed
				// 旧档迁移：开局村民只补发一次
				if (!s.startVillagerGranted) {
					while (this.villagers.length < START_VILLAGERS) this.villagers.push(this.makeVillager())
					this.startVillagerGranted = true
				}
				// 下界远征：名单里的队员必须还在村中；onExp 标记以远征名单为准（防双源不一致）
				const expOk = s.expedition && expRoute(s.expedition.route) && typeof s.expedition.end === 'number' && Array.isArray(s.expedition.party)
				this.expedition = expOk ? {
					route: s.expedition.route,
					hours: Math.max(1, s.expedition.hours || 1),
					start: s.expedition.start || (s.expedition.end - Math.max(1, s.expedition.hours || 1) * 3600000),
					end: s.expedition.end,
					party: s.expedition.party.filter(id => this.villagers.some(v => v.id === id))
				} : null
				const onIds = this.expedition ? this.expedition.party : []
				this.villagers.forEach(v => { v.onExp = onIds.indexOf(v.id) >= 0 })
				this.resources = Object.assign({}, this.baseLevel >= 1 ? Object.assign({}, START_RESOURCES, { sand: 0 }) : {}, s.resources || {})
				// 旧档迁移：煤炭并入木炭（同名资源合并）；已移除资源（钢锭/蜜脾/熟食）直接清除
				if (s.resources && s.resources.coal) {
					this.$set(this.resources, 'charcoal', (this.resources.charcoal || 0) + s.resources.coal)
					this.$delete(this.resources, 'coal')
				}
				['steel', 'honeycomb', 'cookedFood'].forEach(id => {
					if (this.resources[id] !== undefined) this.$delete(this.resources, id)
				})
				this.speed = DEV_SPEEDS.indexOf(s.speed) >= 0 ? s.speed : 1
				this.foodPrio = Array.isArray(s.foodPrio) ? s.foodPrio.filter(id => Object.keys(FOODS).indexOf(id) >= 0) : []
				this.raidTemp = Object.assign({ rotten: 0, iron: 0, book: 0, flint: 0, lapis: 0 }, s.raidTemp || {})
				// 打火石耐久（剩余远征次数）；流浪商人按本地日期刷新沙子库存
				this.flintUses = (typeof s.flintUses === 'number' && isFinite(s.flintUses)) ? Math.max(0, s.flintUses) : 0
				const today = this.traderDay()
				this.trader = (s.trader && s.trader.day === today && typeof s.trader.appearAt === 'number' && s.trader.appearAt > 0)
					? { day: today, appearAt: s.trader.appearAt, stock: Object.assign({}, s.trader.stock || {}) }
					: this.rollTrader(today)
				this.raidTempHours = s.raidTempHours || 0
				// 尸潮预告：夜晚 key 必须是数字，horde 结构校验（key/hour/side/mult/breached）
				this.raidHordeKey = (typeof s.raidHordeKey === 'number' && isFinite(s.raidHordeKey)) ? s.raidHordeKey : 0
				const h = s.raidHorde
				this.raidHorde = (h && h.key === this.raidHordeKey && typeof h.hour === 'number' && (h.side === 1 || h.side === 3) && typeof h.mult === 'number' && h.mult >= 1)
					? { key: h.key, hour: h.hour, side: h.side, mult: h.mult, breached: !!h.breached }
					: null
				this.breachDebuffUntil = (typeof s.breachDebuffUntil === 'number' && isFinite(s.breachDebuffUntil)) ? s.breachDebuffUntil : 0
				// 挑战模式：整包校验（key/done 数字、on 布尔、log 数组），旧档或脏数据视为未开启
				const wv = s.raidWave
				this.raidWave = (wv && typeof wv.key === 'number' && isFinite(wv.key)
					&& typeof wv.on === 'boolean' && typeof wv.done === 'number' && wv.done >= 0 && wv.done < RAID_WAVES.count
					&& typeof wv.bossName === 'string' && (typeof wv.bossHpMax === 'number' || wv.bossHpMax === null || wv.bossHpMax === undefined)
					&& Array.isArray(wv.log))
					? {
						key: wv.key,
						on: wv.on,
						done: wv.done,
						bossName: wv.bossName,
						bossHpMax: (typeof wv.bossHpMax === 'number') ? wv.bossHpMax : null,
						bossDead: !!wv.bossDead,
						bossEscaped: !!wv.bossEscaped,
						log: wv.log.slice(0, 7)
					}
					: null
				this.raidBossSlain = !!s.raidBossSlain
				this.fuel = Number(s.fuel) || 0
				this.fuelType = s.fuelType === 'log' ? 'log' : 'charcoal'
				// 收纳仓库：校验类型合法、等级收进范围；首次收纳免费标记
				this.stored = (Array.isArray(s.stored) ? s.stored : [])
					.filter(x => x && typeof x.type === 'string' && BUILDING_MAP[x.type])
					.map(x => ({
						type: x.type,
						level: Math.min(BUILDING_MAP[x.type].levels.length, Math.max(1, x.level || 1)),
						dur: normDur(x.dur),
						buf: (x.buf && typeof x.buf === 'object') ? x.buf : {}
					}))
				this.storeFreeUsed = !!s.storeFreeUsed
				// 城墙：旧档无该字段默认全未建；旧 16 段档按 顶5/右3/底5/左3 合并为 4 段整边（等级取最高、耐久取均值）
				let rawWalls = Array.isArray(s.walls) ? s.walls : null
				if (rawWalls && rawWalls.length > WALL_RING_NUM) {
					const sides = [rawWalls.slice(0, 5), rawWalls.slice(5, 8), rawWalls.slice(8, 13), rawWalls.slice(13, 16)]
					rawWalls = sides.map(g => {
						const built = g.filter(Boolean)
						if (!built.length) return null
						return {
							level: Math.min(WALL.levels.length, Math.max.apply(null, built.map(w => w.level || 1))),
							dur: Math.round(built.reduce((sm, w) => sm + normDur(w.dur), 0) / built.length)
						}
					})
				}
				this.walls = new Array(WALL_RING_NUM).fill(null).map((_, i) => {
					const w = rawWalls ? rawWalls[i] : null
					return w ? { level: Math.min(WALL.levels.length, Math.max(1, w.level || 1)), dur: normDur(w.dur) } : null
				})
				const ml = Array.isArray(s.marketListings) ? s.marketListings : []
				this.marketListings = new Array(6).fill(null).map((_, i) => ml[i] || null)
				const mo = Array.isArray(s.marketOrders) ? s.marketOrders : []
				this.marketOrders = new Array(3).fill(null).map((_, i) => mo[i] || null)
				// 旧档迁移：已达多格占地等级的建筑若尚未扩占（旧档建造），自动占相邻空地（无空地维持原状）
				;['ground', 'ug'].forEach(layer => {
					const arr = this.plotsOf(layer)
					arr.forEach((p, i) => {
						if (!p || !p.type || p.extOf !== undefined) return
						const need = this.occOf(p.type, p.level) - 1
						if (need <= 0) return
						if (arr.some(q => q && q.extOf === i)) return
						this.freeAdj(layer, i).slice(0, need).forEach(j => this.claimOne(layer, j, i, p.type))
					})
				})
				// 工位落实到具体村民：旧档只有 workers 计数，自动从闲置村民补齐 crew（经验结算按人）
				this.syncCrew()
			} catch (e) {}
		},
		// 工位 crew 名单与 workers 计数对齐：crew 缺员从闲置村民补齐（远征中的排最后），超出裁剪
		syncCrew() {
			const alive = new Set(this.villagers.map(v => v.id))
			const taken = new Set()
			const init = p => {
				if (!p) return null
				const crew = []
				;(Array.isArray(p.crew) ? p.crew : []).forEach(id => {
					if (alive.has(id) && !taken.has(id)) { crew.push(id); taken.add(id) }
				})
				return Object.assign({}, p, { crew })
			}
			const plots = this.plots.map(init)
			const ugPlots = this.ugPlots.map(init)
			// 需要补员的地块（旧档迁移/村民死亡后人数已回调）
			const need = []
			plots.concat(ugPlots).forEach(p => {
				if (!p) return
				const missing = Math.max(0, Math.floor(p.workers || 0) - p.crew.length)
				for (let i = 0; i < Math.min(missing, this.villagers.length); i++) need.push(p)
			})
			const idle = this.villagers.filter(v => !taken.has(v.id)).sort((a, b) => (a.onExp ? 1 : 0) - (b.onExp ? 1 : 0))
			let ii = 0
			need.forEach(p => { if (ii < idle.length) { p.crew.push(idle[ii++].id) } })
			const trim = p => {
				if (!p) return p
				const crew = p.crew.slice(0, Math.min(p.crew.length, p.workers || 0))
				return crew.length === (p.workers || 0) && crew.length === p.crew.length ? p : Object.assign({}, p, { crew, workers: crew.length })
			}
			this.plots = plots.map(trim)
			this.ugPlots = ugPlots.map(trim)
		},
		persist() {
			try {
				gameStorage.setItem(STORE_KEY, JSON.stringify({
					baseLevel: this.baseLevel,
					thBusy: this.thBusy,
					buildQueue: this.buildQueue,
					hero: this.hero,
					expedition: this.expedition,
					plots: this.plots,
					ugPlots: this.ugPlots,
					stored: this.stored,
					storeFreeUsed: this.storeFreeUsed,
					ugCleared: this.ugCleared,
					ugClearing: this.ugClearing,
					villagers: this.villagers,
					villagerSeq: this.villagerSeq,
					dormFreeUsed: this.dormFreeUsed,
					startVillagerGranted: this.startVillagerGranted,
					resources: this.resources,
					speed: this.speed,
					foodPrio: this.foodPrio,
					raidTemp: this.raidTemp,
					raidTempHours: this.raidTempHours,
					flintUses: this.flintUses,
					trader: this.trader,
					raidHordeKey: this.raidHordeKey,
					raidHorde: this.raidHorde,
					breachDebuffUntil: this.breachDebuffUntil,
					raidWave: this.raidWave,
					raidBossSlain: this.raidBossSlain,
					fuel: this.fuel,
					fuelType: this.fuelType,
					walls: this.walls,
					baseDur: this.baseDur,
					marketListings: this.marketListings,
					marketOrders: this.marketOrders,
					lastTick: Date.now()
				}))
			} catch (e) {}
		},
		// ---------- 产出结算（含离线挂机） ----------
		// applySpeed=true 时套用开发者倍速（仅在线 30s 心跳调用；离线补算不加速）
		settleProduction(applySpeed) {
			try {
				const raw = gameStorage.getItem(STORE_KEY)
				const last = raw ? (JSON.parse(raw).lastTick || 0) : 0
				let hours = last ? Math.min(MAX_OFFLINE_HOURS, (Date.now() - last) / 3600000) : 0
				if (applySpeed && this.speed > 1) hours = Math.min(MAX_OFFLINE_HOURS, hours * this.speed)
				// 倍速在线结算时把囤积上限同步放大 capMul 倍，否则 2 小时囤积上限会把加速产出截断丢弃
				if (hours > 1 / 120) this.produce(hours, applySpeed && this.speed > 1 ? this.speed : 1)
				// 夜袭结算：按真实时间与夜袭窗口的重叠部分计（最多回溯 8 小时）
				if (last) {
					let raidHours = this.raidHoursBetween(Math.max(last, Date.now() - MAX_OFFLINE_HOURS * 3600000), Date.now())
					if (applySpeed && this.speed > 1) raidHours *= this.speed
					if (raidHours > 1 / 120) this.settleRaid(raidHours)
				}
			} catch (e) {}
			this.persist()
		},
		// ---------- 僵尸夜袭 ----------
		// 北京时间（UTC+8）的等效毫秒值：真实时间戳 + 8h，用 UTC 取值即为北京墙上时间（与设备时区无关）
		// 依赖 nowTs（每秒心跳）以驱动 raidStatus 倒计时每秒重算
		bjNow() {
			return this.nowTs + 8 * 3600000
		},
		isRaidAt(bjMs) {
			const h = new Date(bjMs).getUTCHours()
			return h >= RAID.startHour || h < RAID.endHour
		},
		// [start, end] 与夜袭窗口（北京时间 18~24 / 0~6）重叠的小时数
		raidHoursBetween(start, end) {
			if (end <= start) return 0
			const day = 86400000
			const BJ = 8 * 3600000
			// 起点所在北京日的 0 点（换算回真实 UTC 时间戳）
			const day0 = Math.floor((start + BJ) / day) * day - BJ
			let sum = 0
			for (let a = day0; a < end; a += day) {
				// 每个北京日的两个夜袭区间：18:00~24:00 与 0:00~06:00
				sum += this.overlap(start, end, a + RAID.startHour * 3600000, a + day)
				sum += this.overlap(start, end, a, a + RAID.endHour * 3600000)
			}
			return sum / 3600000
		},
		overlap(s, e, ws, we) {
			return Math.max(0, Math.min(e, we) - Math.max(s, ws))
		},
		// ---------- 尸潮预告 ----------
		// 每晚进夜袭窗口后判定一次：小概率出现预告（key 已判定过则不再 roll，无论结果）
		rollHorde() {
			const key = Math.floor((Date.now() + 8 * 3600000 - RAID.startHour * 3600000) / 86400000)
			if (this.raidHordeKey === key) return
			this.raidHordeKey = key
			this.raidHorde = null
			if (!this.isRaidAt(this.bjNow())) return
			if (Math.random() >= RAID.forecastChance) return
			this.raidHorde = {
				key,
				hour: RAID.forecastHour,
				side: Math.random() < 0.5 ? 1 : 3,
				mult: Math.round((RAID.forecastMultMin + Math.random() * (RAID.forecastMultMax - RAID.forecastMultMin)) * 10) / 10,
				breached: false
			}
			this.persist()
			uni.showToast({
				title: this.$t('me.labGamePage.raidForecast', {
					h: this.raidHorde.hour,
					x: '×' + this.raidHorde.mult,
					side: this.$t(this.raidHorde.side === 1 ? 'me.labGamePage.raidSideE' : 'me.labGamePage.raidSideW')
				}),
				icon: 'none',
				duration: 3500
			})
		},
		// 尸潮生效时段（真实时间戳区间）：预告时刻 ~ 次日 06:00 窗口结束
		hordeSpan() {
			const h = this.raidHorde
			if (!h) return null
			const day = 86400000, BJ = 8 * 3600000
			// key = (now+BJ-18h) 所在天 → 该晚 18:00 的真实时间戳
			const eveStart = h.key * day - BJ + RAID.startHour * 3600000
			const hStart = eveStart + (h.hour - RAID.startHour) * 3600000
			return { start: hStart, end: eveStart + (24 - RAID.startHour + RAID.endHour) * 3600000 }
		},
		// 消极怠工（破墙惩罚）：期间产出 × breachDebuffMul
		workMorale() {
			return Date.now() < this.breachDebuffUntil ? RAID.breachDebuffMul : 1
		},
		// ---------- 夜袭挑战模式 ----------
		// 7 波的真实时间戳：每波固定北京时间 22:00，相邻波次间隔一天（次日晚十点），最后两波仅隔一小时
		waveTimesAbs(key) {
			const k = (key === undefined) ? this.waveStartKey : key
			const day = 86400000, BJ = 8 * 3600000
			const first = k * day - BJ + RAID_WAVES.startHour * 3600000
			const arr = []
			for (let i = 0; i < RAID_WAVES.count - 1; i++) arr.push(first + i * RAID_WAVES.dayInterval * day)
			arr.push(arr[RAID_WAVES.count - 2] + RAID_WAVES.lastGapMin * 60000)
			return arr
		},
		// 挑战事件结束（最后一波当晚的次日 06:00）的真实时间戳
		waveWindowEnd(key) {
			const times = this.waveTimesAbs(key)
			return times[RAID_WAVES.count - 2] + (24 - RAID_WAVES.startHour + RAID.endHour) * 3600000
		},
		// 开启挑战（22:00 第一波前）；关闭过的可续场（保留进度继续）
		optInWave() {
			if (this.raidWave && this.raidWave.on) return
			const now = Date.now()
			// 续场：已有关闭的未完成挑战且下一波未到 → 恢复进行
			const wv = this.raidWave
			if (wv && !wv.bossDead && !wv.bossEscaped && wv.done < RAID_WAVES.count && now < this.waveTimesAbs(wv.key)[wv.done]) {
				wv.on = true
				this.persist()
				uni.showToast({ title: this.$t('me.labGamePage.waveResumeToast'), icon: 'none' })
				return
			}
			// 全新开启：当晚第一波未到才行
			if (now >= this.waveTimesAbs()[0]) return
			const isBoss = this.baseLevel >= RAID_WAVES.bossTh
			this.raidWave = {
				key: this.waveStartKey,
				on: true,
				done: 0,
				bossName: isBoss ? RAID_WAVES.bossNames[Math.floor(Math.random() * RAID_WAVES.bossNames.length)] : '',
				bossHpMax: isBoss ? Math.round(this.zombiePower * RAID_WAVES.bossHpPerPower) : 0,
				bossDead: false,
				bossEscaped: false,
				log: []
			}
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.waveOnToast', { m: RAID_WAVES.count }), icon: 'none' })
		},
		// 关闭挑战（随时可关；下一波前可重新开启续场）
		closeWave() {
			const wv = this.raidWave
			if (!wv || !wv.on) return
			wv.on = false
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.waveCloseToast'), icon: 'none' })
		},
		// 心跳调用：到时的波次逐波结算（挑战跨多晚，key 为开启当晚）；第七波 TH 达标为血潮 Boss（实时血条，击杀/窗口结束逃跑）
		resolveWaves() {
			const wv = this.raidWave
			if (!wv || !wv.on) return
			const times = this.waveTimesAbs(wv.key)
			const now = Date.now()
			while (wv.done < RAID_WAVES.count - 1 && now >= times[wv.done]) {
				this.resolveWave(wv.done, times[wv.done])
			}
			if (wv.done < RAID_WAVES.count - 1) return
			if (this.baseLevel < RAID_WAVES.bossTh) {
				// 未达 Boss 等级：第七波照常按倍率结算
				if (wv.done === RAID_WAVES.count - 1 && now >= times[RAID_WAVES.count - 1]) this.resolveWave(RAID_WAVES.count - 1, times[RAID_WAVES.count - 1])
				return
			}
			if (wv.bossDead || wv.bossEscaped) return
			const start = times[RAID_WAVES.count - 1]
			if (now < start) return
			const hp = this.bossState ? this.bossState.hp : wv.bossHpMax
			if (hp <= 0) {
				this.killBoss()
			} else if (now >= this.waveWindowEnd(wv.key)) {
				this.escapeBoss()
			}
		},
		// 结算普通波：表现 = 我方战防占比 → 掉落；并施加 1 小时等效的夜袭损耗
		resolveWave(i, ts) {
			const wv = this.raidWave
			const power = Math.round(this.zombiePower * RAID_WAVES.mults[i])
			const defTotal = this.raidPower + this.villageDef
			const perf = (power + defTotal) > 0 ? Math.min(1, defTotal / (power + defTotal)) : 1
			const gains = this.applyWaveLoot(RAID_WAVES.loot[i], perf, i + 1)
			this.applyWaveWear(power)
			wv.done = i + 1
			// 第七波结算完（无 Boss 线路）挑战收官
			if (wv.done >= RAID_WAVES.count) wv.on = false
			const text = this.$t('me.labGamePage.waveIncoming', { n: i + 1, x: '×' + RAID_WAVES.mults[i] })
				+ ' ' + this.$t('me.labGamePage.wavePerf', { p: Math.round(perf * 100) })
			this.pushWaveLog(text, gains)
			this.persist()
			uni.showToast({ title: text + (this.gainsText(gains) ? '  ' + this.gainsText(gains) : ''), icon: 'none', duration: 3000 })
		},
		// 波次掉落：表现 < perfBad 只有腐肉垫底；否则数量 × 表现（取整+概率进位），仓库满则遗弃
		applyWaveLoot(loot, perf, waveN) {
			const gains = {}
			if (perf < RAID_WAVES.perfBad) {
				const n = 4 + waveN * 2
				const got = this.addRes('rotten', n)
				if (got > 0) gains.rotten = got
				return gains
			}
			Object.keys(loot).forEach(id => {
				const q = loot[id] * Math.min(1, perf)
				let n = Math.floor(q)
				if (Math.random() < q - n) n += 1
				if (n < 1) return
				const got = this.addRes(id, n)
				if (got > 0) gains[id] = (gains[id] || 0) + got
			})
			return gains
		},
		// 波次反扑：1 小时等效的夜袭损耗（建筑/大本营/城墙耐久 + 村民受伤），伤害按该波强度占比
		applyWaveWear(power) {
			const mit = def => 100 / (100 + (def || 0))
			const defTotal = this.raidPower + this.villageDef
			this.allPlots.forEach(p => {
				if (!p || p.type !== 'watchtower') return
				const cur = BUILDING_MAP.watchtower.levels[p.level - 1]
				const slots = BUILDING_MAP.watchtower.slots[p.level - 1]
				const ratio = slots > 0 ? Math.min(1, (p.workers || 0) / slots) : 1
				const realDef = (cur.def || 0) * ratio * (normDur(p.dur) / 100)
				p.dur = normDur(this.durOf(p) - RAID.wearTower * mit(realDef))
			})
			this.baseDur = normDur(this.baseDur - RAID.wearBase * mit(BASE_DEF[this.baseLevel]))
			this.walls.forEach(w => {
				if (!w) return
				const cur = WALL.levels[w.level - 1]
				const realDef = ((cur && cur.def) || 0) * (normDur(w.dur) / 100)
				w.dur = normDur(w.dur - RAID.wearWall * mit(realDef))
			})
			const press = (power + defTotal) > 0 ? power / (power + defTotal) : 0
			if (press > 0 && this.villagers.length) {
				this.villagers.forEach(v => {
					if (v.onExp) return
					const a = v.equip && v.equip[1] ? EQUIP_ITEMS[v.equip[1]] : null
					const ad = a && a.slot === 'armor' ? a.def : 0
					v.hp = Math.max(0, v.hp - RAID.villDmg * press * (100 / (100 + ad)))
				})
			}
			this.notifyDeaths(this.reapDead())
		},
		// 血潮被击杀：满掉落 + 全局首杀奖励（挑战收官）
		killBoss() {
			const wv = this.raidWave
			wv.bossDead = true
			wv.on = false
			const gains = this.applyWaveLoot(RAID_WAVES.loot[RAID_WAVES.loot.length - 1], 1, RAID_WAVES.count)
			let extra = ''
			if (!this.raidBossSlain) {
				this.raidBossSlain = true
				Object.keys(RAID_WAVES.firstKill).forEach(id => { this.addRes(id, RAID_WAVES.firstKill[id]) })
				extra = this.$t('me.labGamePage.waveFirstKill')
			}
			this.applyWaveWear(Math.round(this.zombiePower * 1.2))
			const text = this.$t('me.labGamePage.bossKilled', { n: wv.bossName })
			this.pushWaveLog(text, gains, extra)
			this.persist()
			uni.showToast({ title: text + (extra ? '  ' + extra : ''), icon: 'none', duration: 3500 })
		},
		// 血潮逃走（窗口结束未击杀）：村庄遭反扑 + 少量保底腐肉（挑战收官）
		escapeBoss() {
			const wv = this.raidWave
			wv.bossEscaped = true
			wv.on = false
			this.applyWaveWear(Math.round(this.zombiePower * 2.2))
			this.allPlots.forEach(p => { if (p) p.dur = normDur(this.durOf(p) - 8) })
			this.baseDur = normDur(this.baseDur - 10)
			this.villagers.forEach(v => { if (!v.onExp) v.hp = Math.max(0, v.hp - 10) })
			this.notifyDeaths(this.reapDead())
			const gains = {}
			const got = this.addRes('rotten', 20)
			if (got > 0) gains.rotten = got
			const text = this.$t('me.labGamePage.bossEscaped', { n: wv.bossName })
			this.pushWaveLog(text, gains)
			this.persist()
			uni.showToast({ title: text, icon: 'none', duration: 3500 })
		},
		// 战报入档（最新在前，最多 7 条）
		pushWaveLog(text, gains, extra) {
			const wv = this.raidWave
			if (!wv) return
			wv.log.unshift({ text, gains: this.gainsText(gains), extra: extra || '' })
			if (wv.log.length > RAID_WAVES.count) wv.log.pop()
		},
		// 掉落进临时仓库（上限 8 小时收益，超出丢弃）；同时损耗防御设施耐久与村民血量
		settleRaid(hours) {
			// 每晚进窗口后判定一次尸潮预告
			this.rollHorde()
			// 耐久损耗按实际夜袭时长计（不受临时仓库上限影响）；实际防御力 = 面板值 × 驻军比例 × 耐久，越高损耗越慢
			const mit = def => 100 / (100 + (def || 0))
			const brokenTowers = []
			this.allPlots.forEach(p => {
				if (!p || p.type !== 'watchtower') return
				const was = this.durOf(p)
				const wdef = BUILDING_MAP.watchtower
				const cur = wdef.levels[p.level - 1]
				const slots = wdef.slots[p.level - 1]
				const ratio = slots > 0 ? Math.min(1, (p.workers || 0) / slots) : 1
				const realDef = (cur.def || 0) * ratio * (normDur(p.dur) / 100)
				p.dur = normDur(this.durOf(p) - RAID.wearTower * mit(realDef) * hours)
				if (was > 0 && this.durOf(p) <= 0) brokenTowers.push(p)
			})
			const baseWas = this.baseDur
			this.baseDur = normDur(this.baseDur - RAID.wearBase * mit(BASE_DEF[this.baseLevel]) * hours)
			const baseBroken = baseWas > 0 && this.baseDur <= 0
			// 尸潮：预告尸潮时段与本次结算区间的重叠小时数（强度增幅 + 预告侧城墙额外损耗）
			const rStart = Date.now() - hours * 3600000
			const span = this.hordeSpan()
			let hordeHours = 0
			if (this.raidHorde && span) hordeHours = this.overlap(rStart, Date.now(), span.start, span.end) / 3600000
			// 城墙：每段独立损耗（无驻军，防御力 = 段 def × 自身耐久）；预告侧在尸潮时段额外损耗，被打穿触发破墙惩罚
			let hordeBreach = false
			this.walls.forEach((w, wi) => {
				if (!w) return
				const cur = WALL.levels[w.level - 1]
				const realDef = ((cur && cur.def) || 0) * (normDur(w.dur) / 100)
				const was = w.dur
				let wear = RAID.wearWall * mit(realDef) * hours
				if (this.raidHorde && wi === this.raidHorde.side && hordeHours > 0) {
					wear += RAID.hordeWallWear * mit(realDef) * hordeHours
				}
				w.dur = normDur(w.dur - wear)
				if (this.raidHorde && wi === this.raidHorde.side && hordeHours > 0 && !this.raidHorde.breached && was > 0 && w.dur <= 0) {
					this.raidHorde.breached = true
					hordeBreach = true
				}
			})
			// 尸潮攻破预告侧城墙：一次性惩罚（建筑/大本营耐久削减 + 在村村民受伤 + 消极怠工）
			if (hordeBreach) {
				this.allPlots.forEach(p => { if (p) p.dur = normDur(this.durOf(p) - RAID.breachBuildDmg) })
				this.baseDur = normDur(this.baseDur - RAID.breachBaseDmg)
				this.villagers.forEach(v => { if (!v.onExp) v.hp = Math.max(0, v.hp - RAID.breachVillDmg) })
				this.breachDebuffUntil = Date.now() + RAID.breachDebuffHours * 3600000
				uni.showToast({
					title: this.$t('me.labGamePage.raidBreach', { side: this.$t(this.raidHorde.side === 1 ? 'me.labGamePage.raidSideE' : 'me.labGamePage.raidSideW') }),
					icon: 'none',
					duration: 3500
				})
			}
			// 僵尸强度 vs 总防御（瞭望塔战力 + 大本营防御 + 城墙防御）→ 村民受伤；防御完全压制时不掉血
			// 尸潮时段僵尸强度按增幅提升（按重叠时长时间加权）
			let zPower = this.zombiePower
			if (hordeHours > 0 && hours > 0) zPower *= 1 + (this.raidHorde.mult - 1) * (hordeHours / hours)
			const defTotal = this.raidPower + this.villageDef
			const press = (zPower + defTotal) > 0 ? zPower / (zPower + defTotal) : 0
			if (press > 0 && this.villagers.length) {
				const dmg = RAID.villDmg * press * hours
				this.villagers.forEach(v => {
					// 远征中的村民不在村，不受夜袭波及
					if (v.onExp) return
					// 盔甲减免：受伤 × 100/(100+防御)，无甲全额
					const a = v.equip && v.equip[1] ? EQUIP_ITEMS[v.equip[1]] : null
					const ad = a && a.slot === 'armor' ? a.def : 0
					v.hp = Math.max(0, v.hp - dmg * (100 / (100 + ad)))
				})
			}
			// 建筑被破坏 → 损失村民：瞭望塔被打穿驻军全灭，大本营被打穿损失固定人数
			let names = []
			if (brokenTowers.length) {
				const n = brokenTowers.reduce((s, p) => s + (p.workers || 0), 0)
				brokenTowers.forEach(p => { p.workers = 0 })
				if (n > 0) names = names.concat(this.removeVillagers(n))
			}
			if (baseBroken) names = names.concat(this.removeVillagers(RAID.baseLoss))
			// 血量归零的村民死亡
			names = names.concat(this.reapDead())
			this.notifyDeaths(names)
			const room = Math.max(0, RAID.tempMaxHours - this.raidTempHours)
			if (room <= 0) return
			const eff = Math.min(room, hours)
			this.raidTempHours += eff
			const power = this.raidPower
			this.raidTemp.rotten = (this.raidTemp.rotten || 0) + (RAID.rottenBase + RAID.rottenPerPower * power) * eff
			const ironExp = (RAID.ironBase + RAID.ironPerPower * power) * eff
			let iron = Math.floor(ironExp)
			if (Math.random() < ironExp - iron) iron += 1
			this.raidTemp.iron = (this.raidTemp.iron || 0) + iron
			// 书本/打火石：小概率掉落（期望累积，领取时取整）
			this.raidTemp.book = (this.raidTemp.book || 0) + (RAID.bookBase || 0) * eff
			this.raidTemp.flint = (this.raidTemp.flint || 0) + (RAID.flintBase || 0) * eff
			this.raidTemp.lapis = (this.raidTemp.lapis || 0) + (RAID.lapisBase || 0) * eff
		},
		// 移除 n 名村民（血量最低的先死，远征中的除外），并从建筑驻军中除名，返回死者名单
		removeVillagers(n) {
			const names = []
			for (let k = 0; k < n; k++) {
				let idx = -1
				for (let j = 0; j < this.villagers.length; j++) {
					if (this.villagers[j].onExp) continue
					if (idx < 0 || this.villagers[j].hp < this.villagers[idx].hp) idx = j
				}
				if (idx < 0) break
				names.push(this.villagers[idx].name)
				this.dropEquip(this.villagers[idx])
				this.villagers.splice(idx, 1)
				this.unassignWorker()
			}
			return names
		},
		// 血量归零的村民死亡并从驻军除名，返回死者名单
		reapDead() {
			const names = []
			for (let j = this.villagers.length - 1; j >= 0; j--) {
				if (this.villagers[j].hp <= 0) {
					names.unshift(this.villagers[j].name)
					this.dropEquip(this.villagers[j])
					this.villagers.splice(j, 1)
					this.unassignWorker()
				}
			}
			return names
		},
		// 村民减少后，从某个有驻军的建筑工位除名（优先移除本轨道经验最低者）
		unassignWorker() {
			for (let pi = 0; pi < this.allPlots.length; pi++) {
				const p = this.allPlots[pi]
				if (!p || !(p.workers || 0)) continue
				if (Array.isArray(p.crew) && p.crew.length) {
					const track = trackOfBuild(p.type)
					let pick = 0
					p.crew.forEach((id, i) => {
						const v = this.villagers.find(x => x.id === id)
						const pv = this.villagers.find(x => x.id === p.crew[pick])
						if (v && pv && (v.tracks[track] || 0) < (pv.tracks[track] || 0)) pick = i
					})
					// allPlots 项与 this.plots/ugPlots 同引用，直接改会失去响应性——重建数组
					const crew = p.crew.slice()
					crew.splice(pick, 1)
					const np = Object.assign({}, p, { crew, workers: crew.length })
					if (pi < 9) this.plots = this.plots.map((q, qi) => qi === pi ? np : q)
					else this.ugPlots = this.ugPlots.map((q, qi) => qi === pi - 9 ? np : q)
				} else {
					const np = Object.assign({}, p, { workers: (p.workers || 1) - 1 })
					if (pi < 9) this.plots = this.plots.map((q, qi) => qi === pi ? np : q)
					else this.ugPlots = this.ugPlots.map((q, qi) => qi === pi - 9 ? np : q)
				}
				return
			}
		},
		notifyDeaths(names) {
			if (!names.length) return
			uni.showToast({ title: this.$t('me.labGamePage.villFallen', { n: names.length, names: names.slice(0, 3).join('、') }), icon: 'none' })
		},
		// ---------- 村民装备 ----------
		// 村民死亡时身上的装备返还仓库（仓库满则溢出丢弃，addRes 钳制）
		dropEquip(v) {
			(v.equip || []).forEach(k => { if (k && EQUIP_ITEMS[k]) this.addRes(k, 1) })
		},
		// 装备位 i18n 键（equipWeapon / equipArmor / equipRestore）
		equipSlotKey(i) {
			const s = EQUIP_SLOTS[i]
			return s ? 'equip' + s.key.charAt(0).toUpperCase() + s.key.slice(1) : ''
		},
		equipEffectText(def) {
			if (!def) return ''
			if (def.atk) return this.$t('me.labGamePage.atk') + ' +' + def.atk
			if (def.def) return this.$t('me.labGamePage.defLabel') + ' +' + def.def
			if (def.heal) return this.$t('me.labGamePage.equipHeal') + ' +' + def.heal
			return ''
		},
		// 点装备位：远征中不可换装（装备随人远征）；回复位有装备 = 直接使用（回血消耗）；其余 / 空位打开选择器
		tapEquipSlot(v, si) {
			if (v.onExp) return
			const def = v.equip[si] ? EQUIP_ITEMS[v.equip[si]] : null
			if (def && def.slot === 'restore') { this.useRestore(v); return }
			this.equipTargetId = v.id
			this.equipSlotIdx = si
			this.equipOpen = true
		},
		// 使用回复位装备：回血并消耗
		useRestore(v) {
			const key = v.equip[2]
			const def = key ? EQUIP_ITEMS[key] : null
			if (!def || def.slot !== 'restore') return
			if (v.hp >= 99.5) {
				uni.showToast({ title: this.$t('me.labGamePage.hpFull'), icon: 'none' })
				return
			}
			this.$set(v.equip, 2, null)
			v.hp = Math.min(100, v.hp + def.heal)
			uni.showToast({ title: this.$t('me.labGamePage.restoreUsed', { n: Math.round(def.heal) }), icon: 'none' })
		},
		// 装备：旧装备返还仓库（仓库满则拒绝），新装备从仓库扣除
		doEquip(key) {
			const v = this.equipTarget
			if (!v || this.equipSlotIdx < 0 || !EQUIP_ITEMS[key]) return
			if ((this.resources[key] || 0) < 1) return
			const old = v.equip[this.equipSlotIdx]
			if (old && this.addRoom(old) < 1) {
				uni.showToast({ title: this.$t('me.labGamePage.whFull'), icon: 'none' })
				return
			}
			if (old) this.addRes(old, 1)
			this.addRes(key, -1)
			this.$set(v.equip, this.equipSlotIdx, key)
			// 耐久制：装备时按满值计（卸下/返还视为入库整修，耐久重置）
			if (this.equipSlotIdx < 2 && EQUIP_DUR[key]) {
				if (!v.dur) this.$set(v, 'dur', {})
				this.$set(v.dur, this.equipSlotIdx, EQUIP_DUR[key])
			}
			this.equipOpen = false
		},
		// 卸下当前装备返还仓库
		unequipCur() {
			const v = this.equipTarget
			if (!v || this.equipSlotIdx < 0) return
			const old = v.equip[this.equipSlotIdx]
			if (old) {
				if (this.addRoom(old) < 1) {
					uni.showToast({ title: this.$t('me.labGamePage.whFull'), icon: 'none' })
					return
				}
				this.addRes(old, 1)
				this.$set(v.equip, this.equipSlotIdx, null)
				if (v.dur) this.$set(v.dur, this.equipSlotIdx, null)
			}
			this.equipOpen = false
		},
		// 装备磨损（耐久制）：si=武器0/盔甲1；pts 为本次消耗点数，归零即损毁不返还。
		// 返回 true 表示该件损毁；brokenArr 可选（收集「村民·装备」损毁文案）
		wearEquip(v, si, pts, brokenArr) {
			const k = v.equip && v.equip[si]
			if (!k || !EQUIP_ITEMS[k] || !(pts > 0)) return false
			const max = EQUIP_DUR[k] || 100
			const cur = (v.dur && typeof v.dur[si] === 'number') ? v.dur[si] : max
			const left = cur - pts
			if (left > 0) {
				if (!v.dur) this.$set(v, 'dur', {})
				this.$set(v.dur, si, Math.ceil(left))
				return false
			}
			this.$set(v.equip, si, null)
			if (v.dur) this.$set(v.dur, si, null)
			if (brokenArr) brokenArr.push(v.name + '·' + this.resName(k))
			return true
		},
		// 村民卡片装备耐久文本（回复位无耐久）
		equipDurText(v, si) {
			const k = v.equip && v.equip[si]
			if (!k || si > 1) return ''
			const max = EQUIP_DUR[k]
			if (!max) return ''
			const cur = (v.dur && typeof v.dur[si] === 'number') ? v.dur[si] : max
			return Math.max(0, Math.ceil(cur)) + '/' + max
		},
		equipDurLow(v, si) {
			const k = v.equip && v.equip[si]
			const max = k ? EQUIP_DUR[k] : 0
			if (!max) return false
			const cur = (v.dur && typeof v.dur[si] === 'number') ? v.dur[si] : max
			return cur / max < 0.3
		},
		claimRaid() {
			if (this.raidTempTotal <= 0) return
			const wantR = Math.floor(this.raidTemp.rotten || 0)
			const gotR = wantR >= 1 ? this.addRes('rotten', wantR) : 0
			let gotI = 0
			const wantI = Math.floor(this.raidTemp.iron || 0)
			if (wantI >= 1) gotI = this.addRes('iron', wantI)
			// 书本直接入库；打火石入库同时折算成耐久（剩余远征次数）；青金石直接入库
			let gotB = 0, gotF = 0, gotL = 0
			const wantB = Math.floor(this.raidTemp.book || 0)
			if (wantB >= 1) gotB = this.addRes('book', wantB)
			const wantF = Math.floor(this.raidTemp.flint || 0)
			if (wantF >= 1) gotF = this.addRes('flint', wantF)
			const wantL = Math.floor(this.raidTemp.lapis || 0)
			if (wantL >= 1) gotL = this.addRes('lapis', wantL)
			if (gotF > 0) this.flintUses = (this.flintUses || 0) + gotF * FLINT_DUR
			this.raidTemp = {
				rotten: (this.raidTemp.rotten || 0) - gotR,
				iron: (this.raidTemp.iron || 0) - gotI,
				book: (this.raidTemp.book || 0) - gotB,
				flint: (this.raidTemp.flint || 0) - gotF,
				lapis: (this.raidTemp.lapis || 0) - gotL
			}
			this.raidTempHours = 0
			this.persist()
			if (gotR + gotI <= 0) {
				uni.showToast({ title: this.$t('me.labGamePage.whFull'), icon: 'none' })
			} else {
				let title = this.$t('me.labGamePage.raidClaimed')
				if (gotR + gotI < wantR + wantI) title += ' · ' + this.$t('me.labGamePage.whFull')
				uni.showToast({ title, icon: 'none' })
			}
		},
		// ---------- 产出囤积与收集（部落冲突式） ----------
		// 地块囤积总量（整数量，用于角标显隐）
		bufCount(p) {
			const cap = collectCap(BUILDING_MAP[p.type], p.level)
			if (!cap) return 0
			return Object.keys(cap).reduce((s, id) => s + Math.floor((p.buf && p.buf[id]) || 0), 0)
		},
		// 地块囤积读条比例（0~1）
		bufRatio(p) {
			const cap = collectCap(BUILDING_MAP[p.type], p.level)
			if (!cap) return 0
			const keys = Object.keys(cap)
			const sumCap = keys.reduce((s, id) => s + cap[id], 0)
			if (sumCap <= 0) return 0
			const sum = keys.reduce((s, id) => s + ((p.buf && p.buf[id]) || 0), 0)
			return sum / sumCap
		},
		// 角标展示囤积量最大的资源（须已有整数量）
		bufMain(p) {
			const cap = collectCap(BUILDING_MAP[p.type], p.level)
			if (!cap) return null
			let best = null
			Object.keys(cap).forEach(id => {
				const v = Math.floor((p.buf && p.buf[id]) || 0)
				if (v >= 1 && (!best || v > best.v)) best = { id, v }
			})
			return best
		},
		bufMainChar(p) { const m = this.bufMain(p); return m ? this.resChar(m.id) : '' },
		bufMainId(p) { const m = this.bufMain(p); return m ? m.id : '' },
		bufMainIcon(p) { return this.resIcon(this.bufMainId(p)) },
		// 把整数量囤积收进仓库（保留小数继续囤），仓库满时只收能装下的，余量留在囤积里
		// 返回 { gains, full } 或 null（没收到东西）
		doCollect(p) {
			const cap = collectCap(BUILDING_MAP[p.type], p.level)
			if (!cap) return null
			const buf = Object.assign({}, p.buf || {})
			const gains = {}
			let got = 0
			let full = false
			Object.keys(cap).forEach(id => {
				const v = Math.floor(buf[id] || 0)
				if (v < 1) return
				const take = Math.min(v, this.addRoom(id))
				if (take < v) full = true
				if (take >= 1) { this.addRes(id, take); buf[id] = (buf[id] || 0) - take; gains[id] = take; got += take }
				else full = true
			})
			if (!got) return full ? { gains: {}, full: true } : null
			p.buf = buf
			return { gains, full }
		},
		gainsText(gains) {
			return Object.keys(gains).map(id => this.resName(id) + '×' + gains[id]).join(' ')
		},
		collectPlot(idx) {
			const p = this.activePlots[idx]
			if (!p) return
			const r = this.doCollect(p)
			if (r) {
				this.persist()
				this.collectToast(r)
			}
		},
		collectSel() {
			const p = this.selPlot
			if (!p) return
			const r = this.doCollect(p)
			if (r) {
				this.persist()
				this.collectToast(r)
			}
		},
		// 一键收集全部建筑，toast 汇总显示收集量
		collectAll() {
			const total = {}
			let anyFull = false
			this.allPlots.forEach(p => {
				if (!p) return
				const r = this.doCollect(p)
				if (!r) return
				anyFull = anyFull || r.full
				Object.keys(r.gains).forEach(id => { total[id] = (total[id] || 0) + r.gains[id] })
			})
			if (!Object.keys(total).length) {
				if (anyFull) this.collectToast({ gains: {}, full: true })
				return
			}
			this.persist()
			this.collectToast({ gains: total, full: anyFull })
		},
		collectToast(r) {
			const gains = r.gains || {}
			let title = this.gainsText(gains)
			if (!Object.keys(gains).length) title = this.$t('me.labGamePage.whFull')
			else if (r.full) title += ' · ' + this.$t('me.labGamePage.whFull')
			uni.showToast({ title, icon: 'none' })
		},
		// capMul：囤积上限放大倍数（在线倍速结算时 = 倍速，离线补算 = 1）
		produce(hours, capMul) {
			const moodF = this.moodFactor
			const cm = capMul || 1
			const vmap = {}
			this.villagers.forEach(v => { vmap[v.id] = v })
			const lvUps = []
			this.allPlots.forEach((p, i) => {
				if (!p) return
				// 施工中（新建/升级）不产出、不消耗原料
				if (p.busy) return
				const def = BUILDING_MAP[p.type]
				if (!def) return
				const cur = def.levels[p.level - 1]
				if (!cur || !cur.prod) return
				const slots = def.slots[p.level - 1]
				// 职业轨道：当班村民的轨道等级为工位产出加效率（+5% ×（等级-1），按当班均值）
				const track = trackOfBuild(p.type)
				const crew = (p.crew || []).map(id => this.villMap[id]).filter(Boolean)
				const crewBonus = (track && crew.length)
					? crew.reduce((sm, v) => sm + trackBonus(trackLevel(v.tracks[track] || 0)), 0) / crew.length
					: 0
				// 功耗 = 工位满员率 × 心情效率 × 轨道等级加成；原木娘指派中视作满人满功率（allPlots 前 9 格地上、后 9 格地下）
				const eff = this.isHeroIdx(i < 9 ? 'ground' : 'ug', i < 9 ? i : i - 9) ? 1 : efficiency(p.workers, slots) * moodF * (1 + crewBonus) * this.workMorale()
				// 下界传送门：危险工位——驻守队员每小时生命 −PORTAL_WORK.hpPerH、装备磨损 wearPerH 点（远征中的队员状态冻结不重复结算）
				if (p.type === 'portal' && crew.length) {
					crew.forEach(v => {
						if (!v || v.onExp) return
						v.hp = Math.max(0, (v.hp || 100) - PORTAL_WORK.hpPerH * hours)
						for (let si = 0; si < 2; si++) this.wearEquip(v, si, PORTAL_WORK.wearPerH * hours)
					})
				}
				// 部落冲突式：产出囤积在建筑内（上限 = 满编时产 × COLLECT_CAP_HOURS），收集后才入库
				const capRaw = collectCap(def, p.level)
				const cap = capRaw ? Object.keys(capRaw).reduce((m, id) => { m[id] = capRaw[id] * cm; return m }, {}) : null
				const buf = Object.assign({}, p.buf || {})
				// 厨房：面包受小麦库存与囤积余量双重限制，小麦即时从仓库扣除
				if (p.type === 'smith') {
					// 铁匠铺：木炭线 1:1 消耗原木；全部产出按燃料值消耗，燃料池不足时按所选燃料自动转化
					const roomOf = id => Math.max(0, (cap[id] || 0) - (buf[id] || 0))
					const gains = {}
					Object.keys(cur.prod).forEach(id => {
						gains[id] = Math.min(cur.prod[id] * eff * hours, roomOf(id))
					})
					// 原木限制：每产 1 木炭耗 1 原木
					const logStock = this.resources.log || 0
					const realChar = Math.min(gains.charcoal || 0, logStock)
					if (cur.prod.charcoal) gains.charcoal = realChar
					this.resources.log = logStock - realChar
					// 合成材料限制：玻璃耗沙子、铁锭耗粗铁（SMITH_CRAFT），材料不足则该产物降产
					Object.keys(cur.prod).forEach(id => {
						const rec = SMITH_CRAFT[id]
						if (!rec || !(gains[id] > 0)) return
						let maxFromIng = Infinity
						Object.keys(rec).forEach(ing => {
							maxFromIng = Math.min(maxFromIng, (this.resources[ing] || 0) / rec[ing])
						})
						const real = Math.min(gains[id], maxFromIng)
						Object.keys(rec).forEach(ing => {
							this.resources[ing] = Math.max(0, (this.resources[ing] || 0) - real * rec[ing])
						})
						gains[id] = real
					})
					// 燃料值限制：不足则整体等比降产
					const fuelNeed = Object.keys(gains).reduce((s, id) => s + gains[id] * (FUEL_COST[id] || 0), 0)
					if (fuelNeed > 0) {
						const avail = this.ensureFuel(fuelNeed)
						const scale = avail / fuelNeed
						if (scale < 1) Object.keys(gains).forEach(id => { gains[id] *= scale })
						this.fuel = Math.max(0, this.fuel - avail)
					}
					Object.keys(gains).forEach(id => { if (gains[id] > 0) buf[id] = (buf[id] || 0) + gains[id] })
				} else if (cur.consumes) {
					const breadId = Object.keys(cur.prod)[0]
					const room = Math.max(0, (cap[breadId] || 0) - (buf[breadId] || 0))
					const wantBread = Math.min(cur.prod[breadId] * eff * hours, room)
					const wheatNeed = cur.consumes.wheat / cur.prod[breadId] * wantBread
					const wheatStock = this.resources.wheat || 0
					const realBread = wheatStock >= wheatNeed ? wantBread : wheatStock / (cur.consumes.wheat / cur.prod[breadId])
					this.resources.wheat = wheatStock - realBread * (cur.consumes.wheat / cur.prod[breadId])
					buf[breadId] = (buf[breadId] || 0) + realBread
				} else {
					Object.keys(cur.prod).forEach(id => {
						const gain = cur.prod[id] * eff * hours
						const room = Math.max(0, (cap[id] || 0) - (buf[id] || 0))
						buf[id] = (buf[id] || 0) + Math.min(gain, room)
					})
				}
				p.buf = buf
				// 在岗经验：劳作/技工轨道按工作时长涨（护卫经验只在远征获取）；囤积满也算出工
				if (track && crew.length && VILL_TRACKS[track].expH > 0) {
					crew.forEach(v => {
						const before = trackLevel(v.tracks[track] || 0)
						v.tracks[track] = (v.tracks[track] || 0) + VILL_TRACKS[track].expH * hours
						const after = trackLevel(v.tracks[track])
						if (after > before) lvUps.push(v.name + ' Lv' + before + '→' + after)
					})
				}
			})
			if (lvUps.length) uni.showToast({ title: this.$t('me.labGamePage.trackUp', { names: lvUps.slice(0, 3).join('、') }), icon: 'none' })
			// 村民状态演变：饱食消耗（饥饿buff额外消耗）→ 自动进食 → 饥饿掉血/吃饱回血 → 心情漂移
			this.villagers.forEach(v => {
				// 远征中的村民状态冻结（口粮出发时已一次性支付）
				if (v.onExp) return
				if (v.hunger > 0) v.hunger = Math.max(0, v.hunger - hours)
				v.satiety = Math.max(0, v.satiety - (SATIETY_DECAY + (v.hunger > 0 ? HUNGER_EXTRA : 0)) * hours)
				// 自动进食：饱食不足时吃优先级最高（tier 最低）的食物，腐肉仅在断粮时才吃
				let guard = 12
				while (v.satiety < EAT_THRESHOLD && guard-- > 0) {
					const fid = this.pickFood()
					if (!fid) break
					const f = FOODS[fid]
					this.addRes(fid, -1)
					v.satiety = Math.min(100, v.satiety + f.sat)
					v.mood = Math.max(0, Math.min(100, v.mood + f.mood))
					if (f.hunger) v.hunger = f.hunger
				}
				if (v.satiety <= 0) {
					v.hp = Math.max(0, v.hp - HP_STARVE * hours)
				} else if (v.satiety >= 50) {
					v.hp = Math.min(100, v.hp + HP_REGEN * hours)
				}
				const target = v.satiety * 0.6 + v.hp * 0.4
				v.mood = Math.max(0, Math.min(100, v.mood + (target - v.mood) * Math.min(1, 2 * hours)))
			})
			// 血量归零的村民死亡（含饥饿等非夜袭死因）
			this.notifyDeaths(this.reapDead())
		},
		// 本地日期串（流浪商人每日刷新用）
		traderDay() {
			const d = new Date()
			return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
		},
		// 当天零点时间戳（到访时刻随机区间起点）
		dayStartTs() {
			const d = new Date()
			d.setHours(0, 0, 0, 0)
			return d.getTime()
		},
		// 掷出今天的到访时刻：当天随机一小时开门，停留 TRADER.hours 小时（必落在当天内）
		rollTrader(day) {
			const appearAt = this.dayStartTs() + Math.floor(Math.random() * (24 - TRADER.hours)) * 3600000
			const stock = {}
			TRADER.goods.forEach(g => { stock[g.id] = g.stock })
			return { day, appearAt, stock }
		},
		// 打开/回到市场时刷新商人（跨天重掷到访时刻与库存）
		ensureTrader() {
			const day = this.traderDay()
			if (this.trader.day !== day) this.trader = this.rollTrader(day)
		},
		// 向流浪商人买 1 个商品（按商品 cost 结算，木炭等资源）
		buyTraderGood(g) {
			this.ensureTrader()
			if (!this.traderHere) {
				uni.showToast({ title: this.$t('me.labGamePage.traderAway'), icon: 'none' })
				return
			}
			if ((this.trader.stock[g.id] || 0) < 1) {
				uni.showToast({ title: this.$t('me.labGamePage.traderSoldOut'), icon: 'none' })
				return
			}
			if (!this.canAfford(g.cost)) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			if (this.addRes(g.id, 1) < 1) {
				uni.showToast({ title: this.$t('me.labGamePage.whFull'), icon: 'none' })
				return
			}
			this.pay(g.cost)
			this.$set(this.trader.stock, g.id, (this.trader.stock[g.id] || 0) - 1)
			this.persist()
		},
		// 挑选自动进食的食物：按玩家设置的优先级取第一个有库存者；默认腐肉垫底
		pickFood() {
			const order = this.foodPrioList.map(f => f.id)
			for (let i = 0; i < order.length; i++) {
				if ((this.resources[order[i]] || 0) >= 1) return order[i]
			}
			return null
		},
		// 调整食物优先级（dir: -1 上移 / +1 下移），并落盘
		// 只在持有的食物之间交换位置；未持有的食物保持原优先级位（隐藏不参与排序）
		foodMove(id, dir) {
			const order = this.foodPrioList.map(f => f.id)
			const visible = order.filter(fid => Math.floor(this.resources[fid] || 0) >= 1)
			const vi = visible.indexOf(id)
			const vj = vi + dir
			if (vi < 0 || vj < 0 || vj >= visible.length) return
			const other = visible[vj]
			const i = order.indexOf(id)
			const j = order.indexOf(other)
			order[i] = other
			order[j] = id
			this.foodPrio = order
			this.persist()
		},
		foodPrioReset() {
			this.foodPrio = []
			this.persist()
		},
		// ---------- 铁匠铺燃料 ----------
		// 燃料池不足时按玩家选定的燃料来源（默认木炭）自动转化补足，返回可用燃料值
		ensureFuel(need) {
			if (this.fuel >= need) return need
			const t = this.fuelType
			let stock = Math.floor(this.resources[t] || 0)
			while (this.fuel < need && stock >= 1) {
				stock -= 1
				this.$set(this.resources, t, (this.resources[t] || 0) - 1)
				this.fuel += FUEL_VALUE[t]
			}
			return Math.min(need, this.fuel)
		},
		// 手动补充燃料：一次转化 FUEL_ADD_NUM 个所选燃料入池
		convertFuel() {
			const t = this.fuelType
			const stock = Math.floor(this.resources[t] || 0)
			const n = Math.min(FUEL_ADD_NUM, stock)
			if (n <= 0) {
				uni.showToast({ title: this.$t('me.labGamePage.fuelNoStock'), icon: 'none' })
				return
			}
			this.$set(this.resources, t, (this.resources[t] || 0) - n)
			this.fuel += n * FUEL_VALUE[t]
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.fuelAdded', { n: Math.round(n * FUEL_VALUE[t]) }), icon: 'none' })
		},
		setFuelType(t) {
			if (this.fuelType === t) return
			this.fuelType = t
			this.persist()
		},
		// ---------- 工具 ----------
		langName(def) { return this.isEn ? def.en : def.zh },
		langWorker(def) { return this.isEn ? (def.workerEn || '') : (def.workerZh || '') },
		buildingDef(type) { return BUILDING_MAP[type] },
		// 建筑地块像素图标：刷石机复用 px-rock，其余按 key 取 pxb-*
		bIcon(type) { return defenseIcon(type) },
		resName(id) { const r = RESOURCES[id]; return r ? (this.isEn ? r.en : r.zh) : id },
		// 资源像素图标：圆石/面包/绿宝石复用既有图标，其余走 pxr-*；无图标的返回空走首字兜底
		resIcon(id) { return id ? defenseIcon(id) : '' },
		resColor(id) { return (RESOURCES[id] && CAT_COLORS[RESOURCES[id].cat]) || '#999999' },
		resChar(id) { const n = this.resName(id); return ((n || '') + '').slice(0, 1) || '?' },
		floorRes(id) { return Math.floor(this.resources[id] || 0) },
		// 顶栏数值格式化：超四位数显示 9999+，防止挤爆状态条
		fmtStat(n) { return n > 9999 ? '9999+' : String(Math.floor(n)) },
		// 资源最早可获取的大本营等级与其主题色（仓库颜色标签用）
		resTh(id) { return RES_TH[id] || 1 },
		resThColor(id) { return TH_COLORS[this.resTh(id)] || '#999999' },
		// 该资源在仓库占用的格数（不足一组按一组计）
		resSlotCount(id) {
			const v = this.floorRes(id)
			return v >= 1 ? Math.ceil(v / stackOf(id)) : 0
		},
		stackOfRes(id) { return stackOf(id) },
		durOf(p) { return normDur(p && p.dur) },
		// 修补费用：缺失耐久 × 每点原木1 + 圆石1
		repairCostOf(dur) {
			const missing = Math.ceil(MAX_DUR - dur)
			return { log: missing, cobble: missing }
		},
		// ---------- 村民 ----------
		makeVillager() {
			this.villagerSeq += 1
			const used = this.villagers.map(x => x.name)
			const pool = VILL_NAMES.filter(n => used.indexOf(n) < 0)
			const name = pool.length ? pool[Math.floor(Math.random() * pool.length)] : (this.isEn ? 'Villager ' : '村民') + this.villagerSeq
			return { id: this.villagerSeq, name, hp: 100, satiety: 100, mood: 80, equip: [null, null, null], dur: {}, tracks: { labor: 0, tech: 0, guard: 0 } }
		},
		normalizeVillager(v) {
			const stat = x => (typeof x === 'number' && isFinite(x)) ? Math.max(0, Math.min(100, x)) : 100
			const exp = x => (typeof x === 'number' && isFinite(x) && x > 0) ? x : 0
			this.villagerSeq = Math.max(this.villagerSeq, v.id || 0)
			// 装备归一化：仅接受合法物品 key，非字符串/未知 key 一律置空
			const eq = [null, null, null]
			if (Array.isArray(v.equip)) v.equip.slice(0, 3).forEach((k, i) => { if (typeof k === 'string' && EQUIP_ITEMS[k]) eq[i] = k })
			// 装备耐久：仅武器/盔甲位（0/1）有耐久，非法/缺省视为满值（旧档兼容）
			const dur = {}
			;[0, 1].forEach(si => {
				const k = eq[si]
				const max = k ? EQUIP_DUR[k] : 0
				if (!max) return
				const n = v.dur ? Number(v.dur[si]) : NaN
				dur[si] = (isFinite(n) && n > 0) ? Math.min(max, Math.ceil(n)) : max
			})
			// 职业轨道累计经验：旧档无该字段视为 0（Lv1）
			const tr = (v.tracks && typeof v.tracks === 'object') ? v.tracks : {}
			return {
				id: v.id || (this.villagerSeq += 1),
				name: ((v.name || '') + '').trim() || ((this.isEn ? 'Villager ' : '村民') + (v.id || this.villagerSeq)),
				hp: stat(v.hp),
				satiety: stat(v.satiety),
				mood: stat(v.mood),
				// 饥饿buff剩余小时（吃腐肉导致）
				hunger: (typeof v.hunger === 'number' && isFinite(v.hunger)) ? Math.max(0, v.hunger) : 0,
				// 远征中标记以存档的 expedition.party 为准（loadState 统一回填）
				onExp: false,
				equip: eq,
				dur,
				tracks: { labor: exp(tr.labor), tech: exp(tr.tech), guard: exp(tr.guard) }
			}
		},
		moodInfo(v) {
			if (v.mood >= 70) return { key: 'moodHappy', color: '#2e7d32' }
			if (v.mood >= 40) return { key: 'moodOk', color: '#b8860b' }
			return { key: 'moodDown', color: '#c0392b' }
		},
		// 村民某轨道当前等级（模板用）
		trackLv(v, key) {
			return trackLevel((v.tracks && v.tracks[key]) || 0)
		},
		// 村民三条轨道的展示数据（名称/等级/经验条百分比）
		trackList(v) {
			const names = {
				labor: this.$t('me.labGamePage.trackLabor'),
				tech: this.$t('me.labGamePage.trackTech'),
				guard: this.$t('me.labGamePage.trackGuard')
			}
			return ['labor', 'tech', 'guard'].map(key => {
				const expv = (v.tracks && v.tracks[key]) || 0
				const lv = trackLevel(expv)
				const maxed = lv >= TRACK_LV_EXP.length
				const cur = TRACK_LV_EXP[lv - 1]
				const next = TRACK_LV_EXP[lv] || cur
				const pct = maxed ? 100 : Math.min(100, Math.floor((expv - cur) / (next - cur) * 100))
				return { key, name: names[key], lv, pct }
			})
		},
		// 可否喂食：远征中不可喂；任一食物有库存（且未吃饱）或药水有库存
		canFeed(v) {
			if (v.onExp) return false
			return this.feedOptions.some(f => {
				if (f.stock < 1) return false
				return f.food ? v.satiety < 99.5 : true
			})
		},
		// 点喂食 → 打开食物/药水选择器
		feedVillager(v) {
			if (v.onExp) return
			this.feedTarget = v.id
			this.feedOpen = true
		},
		// 确认喂食：食物加饱食/心情（腐肉附加饥饿buff），药水主要回血
		doFeed(f) {
			const v = this.feedVill
			if (!v) { this.feedOpen = false; return }
			if ((this.resources[f.id] || 0) < 1) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			if (f.food && v.satiety >= 99.5) {
				uni.showToast({ title: this.$t('me.labGamePage.feedFull'), icon: 'none' })
				return
			}
			this.addRes(f.id, -1)
			if (!f.food) {
				// 药水：回血为主，附带少量饱食/心情
				v.hp = Math.min(100, v.hp + FEED_POTION.hp)
				v.satiety = Math.min(100, v.satiety + FEED_POTION.sat)
				v.mood = Math.max(0, Math.min(100, v.mood + FEED_POTION.mood))
			} else {
				const fd = FOODS[f.id]
				v.satiety = Math.min(100, v.satiety + fd.sat)
				v.mood = Math.max(0, Math.min(100, v.mood + (fd.mood || 0)))
				if (fd.hunger) v.hunger = fd.hunger
			}
			this.persist()
		},
		// 一键喂食：按食物优先级给所有未饱肚子村民自动喂食（不用药水），喂到满或库存耗尽；远征中的跳过
		feedAll() {
			if (!this.feedAllReady) return
			let fed = 0, used = 0
			const order = this.foodPrioList.filter(f => f.count >= 1 && f.sat > 0).map(f => f.id)
			this.villagers.forEach(v => {
				if (v.onExp) return
				while (v.satiety < 99.5) {
					const id = order.find(k => (this.resources[k] || 0) >= 1)
					if (!id) break
					this.addRes(id, -1)
					used++
					const fd = FOODS[id]
					v.satiety = Math.min(100, v.satiety + fd.sat)
					v.mood = Math.max(0, Math.min(100, v.mood + (fd.mood || 0)))
					if (fd.hunger) v.hunger = fd.hunger
					fed++
				}
			})
			this.persist()
			uni.showToast({ title: this.$t(fed > 0 ? 'me.labGamePage.feedAllDone' : 'me.labGamePage.feedAllNone', { n: fed, m: used }), icon: 'none' })
		},
		renameVillager(v) {
			uni.showModal({
				title: this.$t('me.labGamePage.renameVillager'),
				editable: true,
				content: v.name,
				placeholderText: this.$t('me.labGamePage.villNamePlaceholder'),
				success: (res) => {
					if (!res.confirm) return
					const val = ((res.content || '') + '').trim().slice(0, 8)
					if (!val) {
						uni.showToast({ title: this.$t('me.labGamePage.renameEmpty'), icon: 'none' })
						return
					}
					v.name = val
					this.persist()
				}
			})
		},
		totalSlots(plot) {
			const def = BUILDING_MAP[plot.type]
			return def ? def.slots[plot.level - 1] : 0
		},
		costList(cost) {
			return Object.keys(cost).map(id => ({
				id,
				ok: (this.resources[id] || 0) >= cost[id],
				text: this.resName(id) + '×' + cost[id]
			}))
		},
		canAfford(cost) {
			return Object.keys(cost).every(id => (this.resources[id] || 0) >= cost[id])
		},
		pay(cost) {
			Object.keys(cost).forEach(id => { this.$set(this.resources, id, (this.resources[id] || 0) - cost[id]) })
		},
		// 该资源还能再收纳多少：同种物品已占格先填满余量，剩余空格各容纳一组
		addRoom(id) {
			const stack = stackOf(id)
			const whole = Math.floor(this.resources[id] || 0)
			const mySlots = Math.ceil(whole / stack)
			const used = this.whUsed
			return Math.max(0, mySlots * stack - whole) + Math.max(0, this.whSlotsTotal - used) * stack
		},
		// 入库（正数受仓库格容量限制，超出部分丢弃；返回实际入库量）
		addRes(id, delta) {
			if (delta > 0 && id !== 'emerald') {
				const room = this.addRoom(id)
				if (room < delta) delta = room
				if (delta <= 0) return 0
			}
			this.$set(this.resources, id, (this.resources[id] || 0) + delta)
			return delta
		},
		costText(cost) {
			return Object.keys(cost).map(id => this.resName(id) + '×' + cost[id]).join('、')
		},
		currentUserName() {
			try {
				const cached = JSON.parse(gameStorage.getItem('LogHomeUserInfo') || 'null')
				return (cached && (cached.name || cached.username)) || ''
			} catch (e) { return '' }
		},
		comingSoon() {
			uni.showToast({ title: this.$t('me.labGamePage.comingSoon'), icon: 'none' })
		},
		// 空地无可建建筑（配额用满 / TH 未解锁）
		noBuilding() {
			uni.showToast({ title: this.$t('me.labGamePage.noBuilding'), icon: 'none' })
		},
		// ---------- 市场 ----------
		openMarket() {
			this.mktOpen = true
		},
		openFriendVillage(fi) {
			this.fvIdx = fi
			this.frOpen = false
			this.fvOpen = true
		},
		openFriendMarket() {
			this.fvOpen = false
			this.fmOpen = true
		},
		mktBuySoon() {
			uni.showToast({ title: this.$t('me.labGamePage.mktVisitSoon'), icon: 'none' })
		},
		// 九宫格市场：0-5 = 出售上架，6-8 = 收购
		mktSlotAt(i) {
			return i < 6 ? this.marketListings[i] : this.marketOrders[i - 6]
		},
		tapMktCell(i) {
			const type = i < 6 ? 'sell' : 'buy'
			const idx = i < 6 ? i : i - 6
			this.mktStartEdit(type, idx)
		},
		closeMarket() {
			this.mktOpen = false
			this.mktEdit = null
			this.ensureTrader()
		},
		mktRemoveCurrent() {
			if (!this.mktEdit) return
			this.mktRemove(this.mktEdit.type, this.mktEdit.idx)
			this.mktEdit = null
		},
		mktStartEdit(type, idx) {
			const slot = (type === 'sell' ? this.marketListings : this.marketOrders)[idx]
			this.mktResId = slot ? slot.id : 'log'
			this.mktQty = slot ? String(slot.qty) : ''
			this.mktPrice = slot ? String(slot.price) : ''
			this.mktEdit = { type, idx }
		},
		mktCancelEdit() {
			this.mktEdit = null
		},
		onMktResPick(e) {
			this.mktResId = this.devResIds[Number(e.detail.value)] || 'log'
		},
		mktSave() {
			const qty = parseInt(this.mktQty, 10)
			const price = parseInt(this.mktPrice, 10)
			if (!qty || qty <= 0 || isNaN(price) || price < 0) return
			// 单格（单笔挂单/收购）上限一组
			const stack = stackOf(this.mktResId)
			if (qty > stack) {
				uni.showToast({ title: this.$t('me.labGamePage.mktStackCap', { n: stack }), icon: 'none' })
				return
			}
			// 上架校验库存（暂不锁定库存，交易结算接入后端后再托管）
			if (this.mktEdit.type === 'sell' && qty > this.floorRes(this.mktResId)) {
				uni.showToast({ title: this.$t('me.labGamePage.mktNotEnoughRes'), icon: 'none' })
				return
			}
			const entry = { id: this.mktResId, qty, price }
			if (this.mktEdit.type === 'sell') this.$set(this.marketListings, this.mktEdit.idx, entry)
			else this.$set(this.marketOrders, this.mktEdit.idx, entry)
			this.mktEdit = null
			this.persist()
		},
		mktRemove(type, idx) {
			if (type === 'sell') this.$set(this.marketListings, idx, null)
			else this.$set(this.marketOrders, idx, null)
			this.persist()
		},
		// ---------- 交互 ----------
		buildableFor(underground) {
			return BUILDINGS
				.filter(b => underground ? GROUND_ONLY.indexOf(b.key) < 0 : true)
				.map(b => {
					const count = this.allPlots.filter(p => p && p.type === b.key).length
					+ this.stored.filter(s => s.type === b.key).length // 收纳中的也占配额，防重复建造
					const quota = (TH_QUOTA[b.key] || [0, 0, 0, 0, 0, 0, 0, 0])[this.baseLevel - 1] || 0
					return { b, count, quota, free: b.key === 'dorm' && !this.dormFreeUsed }
				})
				.filter(item => item.b.levels[0].th <= this.baseLevel && item.count < item.quota)
				.sort((a, b) => a.b.levels[0].th - b.b.levels[0].th)
				.map(item => Object.assign(item, { cost: item.b.levels[0].cost }))
		},
		switchLayer(l) {
			if (l === 'ug' && this.basementIdx < 0) {
				uni.showToast({ title: this.$t('me.labGamePage.needBasement'), icon: 'none' })
				return
			}
			this.layer = l
			this.selIdx = null
			this.buildIdx = null
		},
		tapPlot(idx) {
			// 放置模式：点击任何地块都走放置流程
			if (this.placeSel !== null) { this.placeAt(idx); return }
			if (this.layer === 'ground' && idx === this.CENTER_IDX) { this.warehouseOpen = true; return }
			if (this.layer === 'ug') {
				const plot = this.ugPlots[idx]
				// 扩占格点击 → 打开主建筑面板
				if (plot) { this.selLayer = 'ug'; this.selIdx = plot.extOf !== undefined ? plot.extOf : idx }
				else if (this.ugCleared[idx]) {
					if (this.buildableUg.length > 0) { this.buildLayer = 'ug'; this.buildIdx = idx }
					else { this.noBuilding() }
				}
				else if (this.ugClearing[idx] > 0) {
					uni.showToast({ title: this.$t('me.labGamePage.ugClearing', { n: this.ugClearLeftMin(idx) }), icon: 'none' })
				}
				else { this.clearUgPlot(idx) }
				return
			}
			const plot = this.plots[idx]
			if (plot) { this.selLayer = 'ground'; this.selIdx = plot.extOf !== undefined ? plot.extOf : idx }
			else if (this.buildableGround.length > 0) { this.buildLayer = 'ground'; this.buildIdx = idx }
			else { this.noBuilding() }
		},
		buildAt(idx, item) {
			// 首次建村民住所免费
			if (item.free) {
				this.dormFreeUsed = true
			} else {
				if (!this.canAfford(item.cost)) {
					uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
					return
				}
				this.pay(item.cost)
			}
			const durSec = buildTimeSec(1)
			const queued = this.builderFree <= 0
			const busy = queued ? { to: 1, end: 0, queued: true } : { to: 1, end: Date.now() + durSec * 1000 }
			const fresh = { type: item.b.key, level: 1, workers: 0, dur: MAX_DUR, buf: {}, busy }
			if (this.buildLayer === 'ug') {
				this.ugPlots = this.ugPlots.map((p, i) => i === idx ? fresh : p)
			} else {
				this.plots = this.plots.map((p, i) => i === idx ? fresh : p)
				// 建造地下室入口：解锁其正下方的地下格
				if (item.b.key === 'basement') {
					this.ugCleared = this.ugCleared.map((c, i) => i === idx ? true : c)
				}
			}
			// 工位占满：加入建筑工排队（材料下单时已扣除，取消可全额返还）
			if (queued) {
				this.buildQueue.push({ kind: 'building', layer: this.buildLayer, idx, to: 1, dur: durSec, cost: item.free ? {} : item.cost, free: !!item.free })
			}
			this.buildIdx = null
			this.persist()
			uni.showToast({ title: queued
				? this.$t('me.labGamePage.queueFull')
				: this.$t('me.labGamePage.buildStart', { t: this.fmtDur(durSec) }), icon: 'none' })
		},
		// ---------- 施工进度（部落冲突式建造/升级耗时） ----------
		// 每秒心跳调用：到期即完工（含离线跨天，end 为墙钟时间戳）
		checkBuilds() {
			const now = Date.now()
			// 原木娘雇佣到期：离岗（指派的地块工位空出，需手动重新派工）
			if (this.hero && now >= this.hero.until) {
				this.hero = null
				this.persist()
				uni.showToast({ title: this.$t('me.labGamePage.heroGone'), icon: 'none' })
			}
			// 下界远征到期归来（离线超期则在首次心跳结算）
			if (this.expedition && now >= this.expedition.end) {
				this.settleExp(false)
			}
			// 夜袭挑战模式：到时的波次逐波结算（离线超期的重进即补算）
			this.resolveWaves()
			let nDone = 0
			const fin = (p) => {
				// queued=true 为排队等待建筑工的任务（end=0），不参与到期完工判定
				if (p && p.busy && !p.busy.queued && now >= p.busy.end) {
					nDone++
					const np = Object.assign({}, p)
					if (np.busy.to > np.level) np.level = np.busy.to
					np.busy = null
					return np
				}
				return p
			}
			this.plots = this.plots.map(fin)
			this.ugPlots = this.ugPlots.map(fin)
			// 地下清理完工：时间到解锁格子
			let ugDone = false
			let ugCount = 0
			this.ugClearing = this.ugClearing.map((end, i) => {
				if (end > 0 && now >= end) {
					ugDone = true
					ugCount++
					this.ugCleared = this.ugCleared.map((c, ci) => ci === i ? true : c)
					return 0
				}
				return end
			})
			if (this.thBusy && !this.thBusy.queued && now >= this.thBusy.end) {
				this.baseLevel = this.thBusy.to
				this.thBusy = null
				this.grantStartRes()
				uni.showToast({ title: this.baseLevel === 1 ? this.$t('me.labGamePage.thStartRes') : this.$t('me.labGamePage.thUpgradeDone', { n: this.baseLevel }), icon: 'none' })
				this.persist()
			}
			if (nDone > 0) {
				this.persist()
				uni.showToast({ title: this.$t('me.labGamePage.buildDone'), icon: 'none' })
			}
			if (ugDone) {
				this.ugClearReward(ugCount)
				this.persist()
			}
			// 建筑工空出：按下单顺序激活排队任务
			this.activateQueue()
		},
		// ---------- 建筑工工位排队 ----------
		// 把 busy 状态写回指定层地块
		setBusy(layer, idx, busy) {
			if (layer === 'ug') {
				this.ugPlots = this.ugPlots.map((p, i) => i === idx && p ? Object.assign({}, p, { busy }) : p)
			} else {
				this.plots = this.plots.map((p, i) => i === idx && p ? Object.assign({}, p, { busy }) : p)
			}
		},
		// 工位空出后按下单顺序激活排队任务（每秒心跳 / 完工后调用）
		activateQueue() {
			let started = 0
			while (this.builderFree > 0 && this.buildQueue.length) {
				const job = this.buildQueue.shift()
				const end = Date.now() + job.dur * 1000
				if (job.kind === 'th') {
					this.thBusy = { to: job.to, end }
				} else {
					this.setBusy(job.layer, job.idx, { to: job.to, end })
				}
				started++
			}
			if (started > 0) {
				this.persist()
				uni.showToast({ title: this.$t('me.labGamePage.queueStart'), icon: 'none' })
			}
		},
		// 取消排队任务：全额返还下单材料；新建任务一并拆除地块（尚未开工）
		cancelQueue(i) {
			const job = this.buildQueue[i]
			if (!job) return
			this.buildQueue = this.buildQueue.filter((_, k) => k !== i)
			if (job.kind === 'th') {
				this.thBusy = null
			} else {
				const arr = job.layer === 'ug' ? this.ugPlots : this.plots
				const p = arr[job.idx]
				if (p && p.busy && p.busy.queued) {
					// Upgrade reservations must return to the completed level's footprint.
					let keep = job.to > p.level ? this.occOf(p.type, p.level) - 1 : 0
					const cleared = arr.map(q => {
						if (!q || q.extOf !== job.idx) return q
						return keep-- > 0 ? q : null
					})
					if (job.layer === 'ug') this.ugPlots = cleared
					else this.plots = cleared
					if (job.to <= p.level) {
						// 新建任务：地块移除
						if (job.layer === 'ug') {
							this.ugPlots = this.ugPlots.map((q, k) => k === job.idx ? null : q)
						} else {
							this.plots = this.plots.map((q, k) => k === job.idx ? null : q)
						}
					} else {
						this.setBusy(job.layer, job.idx, null)
					}
				}
			}
			// Refunds restore owned materials even if other production filled the warehouse meanwhile.
			Object.keys(job.cost || {}).forEach(id => {
				if (job.cost[id]) this.$set(this.resources, id, (this.resources[id] || 0) + job.cost[id])
			})
			// 免费首住所的排队任务被取消：返还免费资格
			if (job.free) this.dormFreeUsed = false
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.queueCancelled'), icon: 'none' })
		},
		// 耗时格式化：1时5分 / 5分30秒 / 45秒
		fmtDur(sec) {
			sec = Math.max(0, Math.round(sec))
			const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60
			const H = this.$t('me.labGamePage.durH'), M = this.$t('me.labGamePage.durM'), S = this.$t('me.labGamePage.durS')
			if (h > 0) return h + H + m + M
			if (m > 0) return m + M + s + S
			return s + S
		},
		// 地块施工剩余时间文本（依赖 nowTs 每秒刷新）
		busyRemain(p) {
			if (!p || !p.busy) return ''
			if (p.busy.queued) return this.$t('me.labGamePage.queueWait')
			return this.fmtDur((p.busy.end - this.nowTs) / 1000)
		},
		// 升到某级所需耗时文本（模板展示用）
		buildTimeText(level) {
			return this.fmtDur(buildTimeSec(level))
		},
		// ---------- 英雄原木娘 ----------
		// 该楼层/下标的地块是否指派了原木娘
		isHeroIdx(layer, idx) {
			return !!(this.hero && this.heroActive && this.hero.plot && this.hero.plot.layer === layer && this.hero.plot.idx === idx)
		},
		// 雇佣：按食物优先级扣减仓库食物，总饱食度 ≥ 20 名村民一天的份额
		hireHero() {
			if (this.heroActive) return
			if ((this.foodStat.sat || 0) < HERO_COST_SAT) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			let need = HERO_COST_SAT
			this.foodPrioList.forEach(f => {
				if (need <= 0 || f.count < 1 || f.sat <= 0) return
				const take = Math.min(f.count, Math.ceil(need / f.sat))
				this.addRes(f.id, -take)
				need -= take * f.sat
			})
			this.hero = { until: Date.now() + HERO_HOURS * 3600000, plot: null }
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.heroHired'), icon: 'none' })
		},
		// 指派到当前详情建筑：顶替原村民（返回待分配池），地块视作满人满功率
		assignHeroSel() {
			if (!this.heroActive || this.hero.plot) return
			if (this.selSlots <= 0) return
			this.hero = { until: this.hero.until, plot: { layer: this.selLayer, idx: this.selIdx } }
			this.setPlot(this.selIdx, Object.assign({}, this.selPlot, { crew: [], workers: 0 }))
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.heroAssigned'), icon: 'none' })
		},
		// 召回（村民不自动回到该工位，需手动重派）
		recallHero() {
			if (!this.hero) return
			this.hero = { until: this.hero.until, plot: null }
			this.persist()
		},
		// ---------- 合成台（MC 工作台配方，即时合成） ----------
		openCraft() {
			this.craftOpen = true
		},
		doCraft(r) {
			if (!this.canAfford(r.in)) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			const full = Object.keys(r.out).some(id => this.addRoom(id) < r.out[id])
			if (full) {
				uni.showToast({ title: this.$t('me.labGamePage.whFull'), icon: 'none' })
				return
			}
			this.pay(r.in)
			Object.keys(r.out).forEach(id => { this.addRes(id, r.out[id]) })
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.craftDone', { n: this.resName(r.outId) }), icon: 'none' })
		},
		// ---------- 下界远征 ----------
		expDangerStr(d) {
			let s = ''
			for (let i = 0; i < d; i++) s += '★'
			return s
		},
		// 打开面板：重置选择（远征进行中面板只显示进度）
		openExp() {
			this.expOpen = true
			if (this.expedition) return
			if (!expRoute(this.expSelKey)) this.expSelKey = EXPEDITION_ROUTES[0].key
			this.expSelHoursIdx = 0
			this.expPartyIds = []
		},
		expSelRouteTap(key) {
			if (this.expedition || this.expSelKey === key) return
			this.expSelKey = key
			this.expSelHoursIdx = 0
			this.expPartyIds = []
		},
		expSelHoursTap(i) {
			if (this.expedition) return
			this.expSelHoursIdx = i
		},
		expToggleVill(id) {
			if (this.expedition) return
			const i = this.expPartyIds.indexOf(id)
			if (i >= 0) { this.expPartyIds.splice(i, 1); return }
			if (this.expPartyIds.length >= this.expPanelRoute.partyMax) return
			this.expPartyIds.push(id)
		},
		// 按食物优先级一次性支付口粮（饱食度），够扣返回 true
		expPayFood(need) {
			if ((this.foodStat.sat || 0) < need) return false
			let rem = need
			this.foodPrioList.forEach(f => {
				if (rem <= 0 || f.count < 1 || f.sat <= 0) return
				const take = Math.min(f.count, Math.ceil(rem / f.sat))
				this.addRes(f.id, -take)
				rem -= take * f.sat
			})
			return true
		},
		// 出发：校验路线/人数/口粮 → 扣口粮 → 记录远征并冻结队员状态
		expDepart() {
			if (this.expedition || !this.expCanDepart) return
			const r = this.expPanelRoute
			const hours = this.expPanelHours
			const n = this.expPartyIds.length
			if (!this.expPayFood(r.satPerHour * hours * n)) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			// 消耗 1 点打火石耐久（= 1 次远征）
			this.flintUses = Math.max(0, (this.flintUses || 0) - 1)
			const start = Date.now()
			this.expedition = { route: r.key, hours, start, end: start + hours * 3600000, party: this.expPartyIds.slice() }
			const ids = this.expedition.party
			this.villagers.forEach(v => { if (ids.indexOf(v.id) >= 0) v.onExp = true })
			this.expOpen = false
			this.expPartyIds = []
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.expDeparted'), icon: 'none' })
		},
		// 提前召回（确认后按已进行时间折算部分奖励）
		expRecallTap() {
			if (!this.expedition) return
			uni.showModal({
				title: this.$t('me.labGamePage.expRecall'),
				content: this.$t('me.labGamePage.expRecallHint'),
				success: (res) => { if (res.confirm) this.settleExp(true) }
			})
		},
		// 远征结算：recalled=提前召回；forceFull=开发者立即归来（按满时长计）
		settleExp(recalled, forceFull) {
			const exp = this.expedition
			if (!exp) return
			const r = expRoute(exp.route)
			if (!r) { this.expedition = null; this.persist(); return }
			const hrs = forceFull ? exp.hours : Math.min(exp.hours, Math.max(0, (Date.now() - exp.start) / 3600000))
			const complete = !recalled && hrs >= exp.hours - 1 / 120
			const ratio = complete ? 1 : (hrs / exp.hours) * EXP_RECALL_RATIO
			const luck = 0.85 + Math.random() * 0.3
			// 护卫等级奖励：战利品 ×（1 + 6% × 队伍平均等级加成），全队护卫 Lv5 时 +24%
			const lootMul = 1 + GUARD_EXPED.lootPerLv * (exp.party.reduce((sm, id) => {
				const v = this.villMap[id]
				return sm + (v ? trackBonus(trackLevel(v.tracks.guard || 0)) : 0)
			}, 0) / Math.max(1, exp.party.length))
			// 战利品期望 = 每人每小时基础掉落 × 人数 × 时长 × 召回折算 × 浮动 × 护卫奖励
			const gains = {}
			let lootLost = false
			Object.keys(r.loot).forEach(id => {
				const q = r.loot[id] * exp.party.length * hrs * ratio * luck * lootMul
				let n = Math.floor(q)
				if (Math.random() < q - n) n += 1
				if (n < 1) return
				const got = this.addRes(id, n)
				if (got > 0) gains[id] = (gains[id] || 0) + got
				if (got < n) lootLost = true
			})
			// 队员归来：受伤（盔甲+护卫减伤）→ 回复物救命 → 殉难判定 → 武器/盔甲损耗 → 心情疲惫 → 护卫经验
			const broken = [], usedRestore = [], fallen = []
			const guardUps = []
			let guardTotal = 0
			const ids = exp.party.slice()
			for (let i = this.villagers.length - 1; i >= 0; i--) {
				const v = this.villagers[i]
				if (ids.indexOf(v.id) < 0) continue
				v.onExp = false
				const armor = v.equip && v.equip[1] ? EQUIP_ITEMS[v.equip[1]] : null
				const ad = armor && armor.slot === 'armor' ? armor.def : 0
				// 护卫等级减伤：等效防御 +15 ×（等级-1）
				const gdef = (trackLevel(v.tracks.guard || 0) - 1) * GUARD_EXPED.dmgDefPerLv
				let dmg = r.risk * hrs * (100 / (100 + ad + gdef))
				const rstKey = v.equip && v.equip[2]
				const rst = rstKey ? EQUIP_ITEMS[rstKey] : null
				if (rst && rst.slot === 'restore' && dmg > 0 && Math.random() < EXP_RESTORE_USE) {
					this.$set(v.equip, 2, null)
					usedRestore.push(v.name + '·' + this.resName(rstKey))
					dmg = Math.max(0, dmg - rst.heal)
				}
				v.hp = Math.max(0, v.hp - dmg)
				if (v.hp <= 0) {
					// 殉难：装备随人留在了下界，不返还
					fallen.push(v.name)
					this.villagers.splice(i, 1)
					this.unassignWorker()
					continue
				}
				// 装备耐久磨损：路线损毁率 ×100 点/h（材料越好耐久越高，磨损归零损毁不返还）
				for (let si = 0; si < 2; si++) {
					this.wearEquip(v, si, r.wear * 100 * hrs, broken)
				}
				v.mood = Math.max(0, Math.min(100, v.mood - Math.min(30, r.risk * hrs * 0.4)))
				// 护卫经验：只有活着回来的队员获得（提前召回按折算）
				const gExp = Math.round((r.guardExp || 0) * hrs * (complete ? 1 : ratio))
				if (gExp > 0) {
					const gBefore = trackLevel(v.tracks.guard || 0)
					v.tracks.guard = (v.tracks.guard || 0) + gExp
					const gAfter = trackLevel(v.tracks.guard)
					if (gAfter > gBefore) guardUps.push(v.name + ' Lv' + gBefore + '→' + gAfter)
					guardTotal += gExp
				}
			}
			this.expedition = null
			this.expResult = {
				route: exp.route, hours: exp.hours, complete,
				recalled: !complete, ratio, gains, lootLost, broken, usedRestore, fallen,
				guardExp: guardTotal, guardUps
			}
			this.expResultOpen = true
			this.persist()
		},
		// ---------- 城墙 ----------
		tapWall(i) {
			this.wallSel = i
		},
		// 地图上城墙格的耐久百分比（未建为 0）
		wallDurPct(i) {
			const w = this.walls[i]
			return w ? normDur(w.dur) : 0
		},
		// 城墙材质（木/石/铁）颜色、字与名称
		wallMatColor(level) { return (WALL.levels[level - 1] || WALL.levels[0]).color },
		wallMatChar(level) { return (WALL.levels[level - 1] || WALL.levels[0]).char },
		wallMatName(level) {
			const lv = WALL.levels[level - 1] || WALL.levels[0]
			return this.isEn ? lv.nameEn : lv.name
		},
		// 建造该段城墙
		buildWall() {
			const lv0 = WALL.levels[0]
			if (this.baseLevel < lv0.th) {
				uni.showToast({ title: this.$t('me.labGamePage.thReq', { n: lv0.th }), icon: 'none' })
				return
			}
			if (!this.canAfford(lv0.cost)) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			this.pay(lv0.cost)
			this.$set(this.walls, this.wallSel, { level: 1, dur: MAX_DUR })
			this.persist()
		},
		// 升级该段城墙
		upgradeWall() {
			const w = this.wallCur
			const next = WALL.levels[w.level]
			if (!next) return
			if (this.baseLevel < next.th) {
				uni.showToast({ title: this.$t('me.labGamePage.thReq', { n: next.th }), icon: 'none' })
				return
			}
			if (!this.canAfford(next.cost)) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			this.pay(next.cost)
			w.level += 1
			this.persist()
		},
		// 修补该段城墙：1 点耐久 = 1 材料（木墙原木、石墙石头、铁墙铁锭）
		repairWall() {
			const w = this.wallCur
			if (!w || this.wallDur >= MAX_DUR) return
			const res = this.wallRepairRes
			if ((this.resources[res] || 0) < Math.ceil(MAX_DUR - this.wallDur)) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			this.pay(this.wallRepairCost)
			w.dur = MAX_DUR
			this.persist()
		},
		// 清理地下待清理格：花费绿宝石 + 等待清理时间（墙钟时间戳，离线同样推进）
		clearUgPlot(idx) {
			uni.showModal({
				title: this.$t('me.labGamePage.ugClear'),
				content: this.$t('me.labGamePage.ugClearConfirm', { s: this.costText(UG_CLEAR_COST), t: UG_CLEAR_MIN }),
				success: (res) => {
					if (!res.confirm) return
					if (!this.canAfford(UG_CLEAR_COST)) {
						uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
						return
					}
					this.pay(UG_CLEAR_COST)
					this.ugClearing = this.ugClearing.map((c, i) => i === idx ? Date.now() + UG_CLEAR_MIN * 60000 : c)
					this.persist()
					uni.showToast({ title: this.$t('me.labGamePage.ugClearStart', { t: UG_CLEAR_MIN }), icon: 'none' })
				}
			})
		},
		// 清理剩余分钟数（供模板/点击提示）
		ugClearLeftMin(idx) {
			const end = this.ugClearing[idx]
			if (!(end > 0)) return 0
			return Math.max(1, Math.ceil((end - this.nowTs) / 60000))
		},
		// 地下清理完工奖励：粗铁，小概率金锭（silent=true 不弹 toast，供开发者控制台批量完工）
		ugClearReward(count, silent) {
			let iron = 4 * count, goldN = 0
			for (let k = 0; k < count; k++) if (Math.random() < 0.2) goldN++
			if (iron > 0) this.$set(this.resources, 'rawIron', (this.resources.rawIron || 0) + iron)
			if (goldN > 0) this.$set(this.resources, 'gold', (this.resources.gold || 0) + goldN)
			if (!silent && (iron > 0 || goldN > 0)) {
				uni.showToast({ title: goldN > 0
					? this.$t('me.labGamePage.ugRewardGold', { i: iron, g: goldN })
					: this.$t('me.labGamePage.ugReward', { i: iron }), icon: 'none' })
			}
		},
		// 按选中楼层写回地块
		setPlot(idx, plot) {
			if (this.selLayer === 'ug') {
				this.ugPlots = this.ugPlots.map((p, i) => i === idx ? plot : p)
			} else {
				this.plots = this.plots.map((p, i) => i === idx ? plot : p)
			}
		},
		// ---------- 占地与收纳 ----------
		// 建筑该等级占地格数（未配置 occ 默认 1）
		occOf(type, level) {
			const def = BUILDING_MAP[type]
			if (!def || !def.occ) return 1
			return def.occ[(level || 1) - 1] || 1
		},
		// 上下左右相邻下标（±1 不跨行）
		neighborsOf(idx) {
			const r = Math.floor(idx / 3)
			return [idx - 3, idx + 3, idx - 1, idx + 1].filter(j =>
				j >= 0 && j <= 8 && (Math.abs(j - idx) !== 1 || Math.floor(j / 3) === r)
			)
		},
		plotsOf(layer) { return layer === 'ug' ? this.ugPlots : this.plots },
		// 相邻可用空地（空地 + 地下层已清理；地上中心为大本营不可占）
		freeAdj(layer, idx) {
			const arr = this.plotsOf(layer)
			return this.neighborsOf(idx).filter(j => {
				if (layer === 'ground' && j === CENTER_IDX) return false
				if (arr[j]) return false
				if (layer === 'ug' && !this.ugCleared[j]) return false
				return true
			})
		},
		// 把 j 标记为 idx 建筑的扩占格
		claimOne(layer, j, anchor, type) {
			const mark = { extOf: anchor, extType: type }
			if (layer === 'ug') this.ugPlots = this.ugPlots.map((p, i) => i === j ? mark : p)
			else this.plots = this.plots.map((p, i) => i === j ? mark : p)
		},
		// 释放指向 anchor 的扩占格（收纳/拆除时）
		releaseExt(layer, anchor) {
			if (layer === 'ug') this.ugPlots = this.ugPlots.map(p => (p && p.extOf === anchor) ? null : p)
			else this.plots = this.plots.map(p => (p && p.extOf === anchor) ? null : p)
		},
		// 该建筑已建位置（地上/地下层文本），未建返回空串
		builtLoc(key) {
			if (this.plots.some(p => p && p.type === key)) return this.$t('me.labGamePage.layerGround')
			if (this.ugPlots.some(p => p && p.type === key)) return this.$t('me.labGamePage.layerUnder')
			return ''
		},
		storedIdxs(key) {
			const r = []
			this.stored.forEach((s, i) => { if (s.type === key) r.push(i) })
			return r
		},
		// 多格建筑占地提示文本（如「Lv4起占2格」），单格返回空串
		occText(b) {
			if (!b.occ) return ''
			const li = b.occ.findIndex(o => o > 1)
			if (li < 0) return ''
			return this.$t('me.labGamePage.blOcc', { n: li + 1, c: b.occ[li] })
		},
		// ---------- 收纳 ----------
		storeCostText() {
			return this.storeFreeUsed
				? this.$t('me.labGamePage.storeCost', { s: STORAGE_COST.emerald })
				: this.$t('me.labGamePage.storeFreeTag')
		},
		storeSel() {
			const p = this.selPlot
			if (!p) return
			if (p.busy) {
				uni.showToast({ title: this.$t('me.labGamePage.storeBusy'), icon: 'none' })
				return
			}
			// 地下室入口：地下还有建筑时不能收纳
			if (p.type === 'basement' && this.ugPlots.some(Boolean)) {
				uni.showToast({ title: this.$t('me.labGamePage.ugNoDemolish'), icon: 'none' })
				return
			}
			if (this.isHeroIdx(this.selLayer, this.selIdx)) this.recallHero()
			const free = !this.storeFreeUsed
			uni.showModal({
				title: this.$t('me.labGamePage.storeBtn'),
				content: this.$t('me.labGamePage.storeConfirm', { s: free ? this.$t('me.labGamePage.storeFreeTag') : STORAGE_COST.emerald }),
				success: (res) => {
					if (!res.confirm) return
					if (!free) {
						if (!this.canAfford(STORAGE_COST)) {
							uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
							return
						}
						this.pay(STORAGE_COST)
					}
					this.storeFreeUsed = true
					this.releaseExt(this.selLayer, this.selIdx)
					// 等级/耐久/囤积保留；驻留村民自动回到待分配池
					this.stored.push({ type: p.type, level: p.level, dur: p.dur, buf: p.buf || {} })
					this.setPlot(this.selIdx, null)
					this.selIdx = null
					this.persist()
					uni.showToast({ title: this.$t('me.labGamePage.storeDone'), icon: 'none' })
				}
			})
		},
		// ---------- 放置（建筑列表 → 重新放置） ----------
		startPlace(i) {
			if (!this.stored[i]) return
			this.placeSel = i
			this.blOpen = false
			this.selIdx = null
			uni.showToast({ title: this.$t('me.labGamePage.placeHint', { n: this.langName(BUILDING_MAP[this.stored[i].type]) }), icon: 'none' })
		},
		cancelPlace() { this.placeSel = null },
		placeName() {
			const s = this.stored[this.placeSel]
			return s ? this.langName(BUILDING_MAP[s.type]) : ''
		},
		placeAt(idx) {
			const s = this.stored[this.placeSel]
			if (!s) { this.placeSel = null; return }
			if (GROUND_ONLY.indexOf(s.type) >= 0 && this.layer === 'ug') {
				uni.showToast({ title: this.$t('me.labGamePage.placeGround'), icon: 'none' })
				return
			}
			if (this.layer === 'ug' && !this.ugCleared[idx]) {
				uni.showToast({ title: this.$t('me.labGamePage.ugLocked'), icon: 'none' })
				return
			}
			if (this.layer === 'ground' && idx === CENTER_IDX) {
				uni.showToast({ title: this.$t('me.labGamePage.placeOccupied'), icon: 'none' })
				return
			}
			if (this.plotsOf(this.layer)[idx]) {
				uni.showToast({ title: this.$t('me.labGamePage.placeOccupied'), icon: 'none' })
				return
			}
			const need = this.occOf(s.type, s.level) - 1
			const frees = this.freeAdj(this.layer, idx)
			if (frees.length < need) {
				uni.showToast({ title: this.$t('me.labGamePage.needAdj', { n: this.langName(BUILDING_MAP[s.type]), c: need }), icon: 'none' })
				return
			}
			this.stored.splice(this.placeSel, 1)
			const fresh = { type: s.type, level: s.level, workers: 0, dur: s.dur, buf: s.buf || {}, busy: null }
			if (this.layer === 'ug') this.ugPlots = this.ugPlots.map((p, i) => i === idx ? fresh : p)
			else this.plots = this.plots.map((p, i) => i === idx ? fresh : p)
			frees.slice(0, need).forEach(j => this.claimOne(this.layer, j, idx, s.type))
			this.placeSel = null
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.placeDone'), icon: 'none' })
		},
		// 该建筑当前能否升级（有下一级 + 未在施工 + 大本营等级达标 + 材料够）
		canUpgradePlot(p) {
			if (!p || p.busy) return false
			const def = BUILDING_MAP[p.type]
			if (!def) return false
			const next = def.levels[p.level] || null
			if (!next) return false
			return this.baseLevel >= next.th && this.canAfford(next.cost)
		},
		assignWorker(delta) {
			const plot = this.selPlot
			if (plot.busy) return
			// 原木娘指派中：工位由原木娘顶替，不再派村民
			if (this.isHeroIdx(this.selLayer, this.selIdx)) return
			const used = plot.workers
			if (delta > 0 && (this.unassigned <= 0 || used >= this.selSlots)) return
			if (delta < 0 && used <= 0) return
			const crew = (plot.crew || []).slice()
			if (delta > 0) {
				// 新人上位：补本轨道经验最低的闲置村民（经验相同的取先入职的）
				const track = trackOfBuild(plot.type)
				const taken = new Set()
				this.allPlots.forEach(p => { if (p && p.crew) p.crew.forEach(id => taken.add(id)) })
				let pick = null
				this.villagers.forEach(v => {
					if (taken.has(v.id) || v.onExp) return
					if (!pick || ((v.tracks[track] || 0) < (pick.tracks[track] || 0))) pick = v
				})
				if (!pick) return
				crew.push(pick.id)
			} else {
				// 老手留任：移除本轨道经验最低的当班村民
				const track = trackOfBuild(plot.type)
				let pick = 0
				crew.forEach((id, i) => {
					const v = this.villagers.find(x => x.id === id)
					const pv = this.villagers.find(x => x.id === crew[pick])
					if (v && pv && (v.tracks[track] || 0) < (pv.tracks[track] || 0)) pick = i
				})
				crew.splice(pick, 1)
			}
			this.setPlot(this.selIdx, Object.assign({}, plot, { crew, workers: crew.length }))
			this.persist()
		},
		upgradeSel() {
			if (!this.canUpgradeSel) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			const targetLevel = this.selPlot.level + 1
			// 升到多格占地等级：需要相邻空地，开工即占下（收纳/拆除时释放）
			const need = this.occOf(this.selDef.key, targetLevel) - this.occOf(this.selDef.key, this.selPlot.level)
			if (need > 0) {
				const frees = this.freeAdj(this.selLayer, this.selIdx)
				if (frees.length < need) {
					uni.showToast({ title: this.$t('me.labGamePage.needAdj', { n: this.langName(this.selDef), c: need }), icon: 'none' })
					return
				}
				frees.slice(0, need).forEach(j => this.claimOne(this.selLayer, j, this.selIdx, this.selPlot.type))
			}
			this.pay(this.selNext.cost)
			// 部落冲突式：升级进入施工状态，到期才生效（checkBuilds 每秒检查）；工位占满则排队
			const durSec = buildTimeSec(targetLevel)
			const queued = this.builderFree <= 0
			const busy = queued ? { to: targetLevel, end: 0, queued: true } : { to: targetLevel, end: Date.now() + durSec * 1000 }
			this.setPlot(this.selIdx, Object.assign({}, this.selPlot, { busy }))
			if (queued) {
				this.buildQueue.push({ kind: 'building', layer: this.selLayer, idx: this.selIdx, to: targetLevel, dur: durSec, cost: this.selNext.cost })
			}
			this.persist()
			uni.showToast({ title: queued
				? this.$t('me.labGamePage.queueFull')
				: this.$t('me.labGamePage.buildStart', { t: this.fmtDur(durSec) }), icon: 'none' })
		},
		demolishSel() {
			// 施工中不允许拆除
			if (this.selPlot.busy) {
				uni.showToast({ title: this.$t('me.labGamePage.busyNoDemolish'), icon: 'none' })
				return
			}
			// 地下室入口：地下还有建筑时不允许拆除
			if (this.selPlot.type === 'basement' && this.ugPlots.some(Boolean)) {
				uni.showToast({ title: this.$t('me.labGamePage.ugNoDemolish'), icon: 'none' })
				return
			}
			// 原木娘在该地块：先召回再拆，避免指派悬空
			if (this.isHeroIdx(this.selLayer, this.selIdx)) this.recallHero()
			uni.showModal({
				title: this.$t('me.labGamePage.demolish'),
				content: this.$t('me.labGamePage.demolishConfirm'),
				success: (res) => {
					if (!res.confirm) return
					this.releaseExt(this.selLayer, this.selIdx)
					this.setPlot(this.selIdx, null)
					this.selIdx = null
					this.persist()
				}
			})
		},
		// 升至 TH1 时一次性发放初始物资（只补缺，不覆盖已有数值）
		grantStartRes() {
			this.resources = Object.assign({}, START_RESOURCES, { sand: 0 }, this.resources)
		},
		upgradeTH() {
			if (!this.thCanUpgrade) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			this.pay(this.thNext.cost)
			// 大本营升级同样有施工耗时，到期才升等级（解锁随生效时间走）；占用 1 名建筑工，占满则排队
			const target = this.baseLevel + 1
			const durSec = thBuildTimeSec(target)
			const queued = this.builderFree <= 0
			this.thBusy = queued ? { to: target, end: 0, queued: true } : { to: target, end: Date.now() + durSec * 1000 }
			if (queued) {
				this.buildQueue.push({ kind: 'th', layer: null, idx: -1, to: target, dur: durSec, cost: this.thNext.cost })
			}
			this.persist()
			uni.showToast({ title: queued
				? this.$t('me.labGamePage.queueFull')
				: this.$t('me.labGamePage.buildStart', { t: this.fmtDur(durSec) }), icon: 'none' })
		},
		// 开发者控制台：立即完成全部施工（含大本营）
		devFinishAll() {
			const now = Date.now()
			const fin = (p) => {
				if (p && p.busy) {
					const np = Object.assign({}, p)
					if (np.busy.to > np.level) np.level = np.busy.to
					np.busy = null
					return np
				}
				return p
			}
			this.plots = this.plots.map(fin)
			this.ugPlots = this.ugPlots.map(fin)
			// 排队任务一并立即完工
			this.buildQueue = []
			// 地下清理也立即完工（同样结算粗铁/金子）
			let ugDevCount = 0
			this.ugClearing = this.ugClearing.map((end, i) => {
				if (end > 0) {
					ugDevCount++
					this.ugCleared = this.ugCleared.map((c, ci) => ci === i ? true : c)
					return 0
				}
				return end
			})
			if (ugDevCount > 0) this.ugClearReward(ugDevCount, true)
			if (this.thBusy) {
				this.baseLevel = this.thBusy.to
				this.thBusy = null
				this.grantStartRes()
			}
			// 地下清理中的格子一并完成
			if (this.ugClearing.some(end => end > 0)) {
				this.ugCleared = this.ugCleared.map((c, i) => this.ugClearing[i] > 0 ? true : c)
				this.ugClearing = new Array(9).fill(0)
			}
			// 远征队立即归来（按满时长结算）
			if (this.expedition) this.settleExp(false, true)
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.buildDone'), icon: 'none' })
		},
		// 开发者控制台：挑战快进——立即结算下一波；血潮阶段则立即击杀 Boss
		devWaveStep() {
			const wv = this.raidWave
			if (!wv || !wv.on) {
				uni.showToast({ title: this.$t('me.labGamePage.devWaveNo'), icon: 'none' })
				return
			}
			if (wv.done < RAID_WAVES.count - 1) {
				this.resolveWave(wv.done, Date.now())
				return
			}
			if (this.baseLevel < RAID_WAVES.bossTh) {
				if (wv.done === RAID_WAVES.count - 1) this.resolveWave(RAID_WAVES.count - 1, Date.now())
				return
			}
			if (wv.bossDead || wv.bossEscaped) {
				uni.showToast({ title: this.$t('me.labGamePage.devWaveNo'), icon: 'none' })
				return
			}
			this.killBoss()
		},
		// ---------- 防御修补 ----------
		repairSel() {
			const p = this.selPlot
			if (!p || this.durOf(p) >= MAX_DUR) return
			const cost = this.repairCostOf(this.durOf(p))
			if (!this.canAfford(cost)) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			this.pay(cost)
			p.dur = MAX_DUR
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.repairDone'), icon: 'none' })
		},
		repairBase() {
			if (this.baseDur >= MAX_DUR) return
			const cost = this.repairCostOf(this.baseDur)
			if (!this.canAfford(cost)) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			this.pay(cost)
			this.baseDur = MAX_DUR
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.repairDone'), icon: 'none' })
		},
		trainVillager() {
			if (!this.canTrain) {
				uni.showToast({ title: this.$t('me.labGamePage.notEnough'), icon: 'none' })
				return
			}
			this.resources.wheat -= TRAIN_WHEAT
			this.villagers.push(this.makeVillager())
			this.persist()
		},
		saveName() {
			const val = (this.nameInput || '').trim()
			if (!val) {
				uni.showToast({ title: this.$t('me.labGamePage.renameEmpty'), icon: 'none' })
				return
			}
			this.baseName = val
			gameStorage.setItem(NAME_KEY, val)
			this.nameInput = ''
			uni.showToast({ title: this.$t('me.labGamePage.renameSaved'), icon: 'none' })
		},
		// ---------- 开发者控制台 ----------
		// ---------- 建筑图鉴 ----------
		blLines(b) {
			const fmt = n => (n % 1 === 0 ? n : n.toFixed(1))
			return b.levels.map((lv, i) => {
				const parts = []
				const slots = b.slots[i]
				if (slots > 0) parts.push(this.$t('me.labGamePage.workers') + ' ' + slots)
				if (lv.cap) parts.push(this.$t('me.labGamePage.blCap') + ' ' + lv.cap)
				if (lv.atk) parts.push(this.$t('me.labGamePage.atk') + ' ' + lv.atk)
				if (lv.def) parts.push(this.$t('me.labGamePage.defLabel') + ' ' + lv.def)
				if (lv.prod) Object.keys(lv.prod).forEach(id => parts.push('+ ' + this.resName(id) + ' ' + fmt(lv.prod[id])))
				if (lv.consumes) Object.keys(lv.consumes).forEach(id => parts.push('− ' + this.resName(id) + ' ' + fmt(lv.consumes[id])))
				if (b.key === 'smith' && lv.prod) {
					const fuel = Object.keys(lv.prod).reduce((s, id) => s + lv.prod[id] * (FUEL_COST[id] || 0), 0)
					parts.push('− ' + this.$t('me.labGamePage.fuelValue') + ' ' + fmt(fuel))
				}
				return {
					lv: i + 1,
					desc: lv.desc ? (this.isEn ? (lv.descEn || lv.desc) : lv.desc) : '',
					text: parts.join(' · ')
				}
			})
		},
		// ---------- 开发者控制台 ----------
		devSetSpeed(s) {
			this.speed = s
			this.persist()
			uni.showToast({ title: '×' + s, icon: 'none' })
		},
		// 模拟 N 小时夜袭：走真实结算 settleRaid（掉落+耐久损耗+临时仓库上限），便于核对数值
		devSimRaid(h) {
			this.devRaidH = h
			const beforeR = this.raidTemp.rotten || 0
			const beforeI = this.raidTemp.iron || 0
			this.settleRaid(h)
			this.persist()
			const r = Math.floor((this.raidTemp.rotten || 0) - beforeR)
			const i = Math.floor((this.raidTemp.iron || 0) - beforeI)
			uni.showToast({ title: this.$t('me.labGamePage.devRaidDone', { h, r, i }), icon: 'none' })
		},
		// 跳过施工：全部建筑建造/升级与大本营升级立即完工
		devSkipBuilds() {
			const fin = p => {
				if (!p || !p.busy) return p
				const np = Object.assign({}, p)
				if (np.busy.to > np.level) np.level = np.busy.to
				np.busy = null
				return np
			}
			this.plots = this.plots.map(fin)
			this.ugPlots = this.ugPlots.map(fin)
			// 排队任务一并立即完工
			this.buildQueue = []
			// 地下清理也立即完工（同样结算粗铁/金子）
			let ugDevCount = 0
			this.ugClearing = this.ugClearing.map((end, i) => {
				if (end > 0) {
					ugDevCount++
					this.ugCleared = this.ugCleared.map((c, ci) => ci === i ? true : c)
					return 0
				}
				return end
			})
			if (ugDevCount > 0) this.ugClearReward(ugDevCount, true)
			if (this.thBusy) {
				this.baseLevel = this.thBusy.to
				this.thBusy = null
				this.grantStartRes()
			}
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.devDone'), icon: 'none' })
		},
		// 一键建筑满级：所有已建建筑（含地下）直接满级满耐久，大本营拉满 TH8，城墙满级满耐久
		devMaxAll() {
			const maxP = p => {
				if (!p || !p.type) return p
				const def = BUILDING_MAP[p.type]
				return Object.assign({}, p, { level: def ? def.levels.length : p.level, busy: null, dur: MAX_DUR })
			}
			this.plots = this.plots.map(maxP)
			this.ugPlots = this.ugPlots.map(maxP)
			this.baseLevel = TH_LEVELS.length
			this.grantStartRes()
			this.thBusy = null
			this.buildQueue = []
			this.baseDur = MAX_DUR
			this.walls = this.walls.map(w => w ? { level: WALL.levels.length, dur: MAX_DUR } : w)
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.devDone'), icon: 'none' })
		},
		onDevResPick(e) {
			this.devResId = this.devResIds[Number(e.detail.value)] || 'log'
		},
		devSetRes() {
			const v = parseFloat(this.devResVal)
			if (isNaN(v)) return
			this.$set(this.resources, this.devResId, Math.max(0, v))
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.devDone'), icon: 'none' })
		},
		devSetBase() {
			const v = Math.max(0, Math.min(TH_LEVELS.length, parseInt(this.devBaseVal, 10) || 0))
			this.baseLevel = v
			if (v >= 1) this.grantStartRes()
			this.devBaseVal = v
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.devDone'), icon: 'none' })
		},
		devSetVillagers() {
			const v = Math.max(0, parseInt(this.devVillVal, 10) || 0)
			while (this.villagers.length < v) this.villagers.push(this.makeVillager())
			if (this.villagers.length > v) this.villagers = this.villagers.slice(0, v)
			this.devVillVal = v
			this.syncCrew()
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.devDone'), icon: 'none' })
		},
		devFillRes() {
			Object.keys(RESOURCES).forEach(id => {
				this.$set(this.resources, id, id === 'emerald' ? 1000 : stackOf(id))
			})
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.devDone'), icon: 'none' })
		},
		// 一键资源不消耗：全部资源直接置 9999（无视仓库容量，测试消耗链路）
		devNoConsume() {
			Object.keys(RESOURCES).forEach(id => {
				this.$set(this.resources, id, 9999)
			})
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.devDone'), icon: 'none' })
		},
		// 刷新流浪商人：立即到访并补满库存（测试商人购买）
		devRefreshTrader() {
			const stock = {}
			TRADER.goods.forEach(g => { stock[g.id] = g.stock })
			this.trader = { day: this.traderDay(), appearAt: Date.now(), stock }
			this.persist()
			uni.showToast({ title: this.$t('me.labGamePage.devTraderDone'), icon: 'none' })
		},
		devReset() {
			uni.showModal({
				title: this.$t('me.labGamePage.devReset'),
				content: this.$t('me.labGamePage.devResetConfirm'),
				success: (res) => {
					if (!res.confirm) return
					try { gameStorage.removeItem(STORE_KEY) } catch (e) {}
					this.baseLevel = 0
					this.plots = emptyPlots()
					this.ugPlots = emptyPlots()
					this.ugCleared = new Array(9).fill(false)
					this.ugClearing = new Array(9).fill(0)
					this.layer = 'ground'
					this.selLayer = 'ground'
					this.buildLayer = 'ground'
					this.raidTemp = { rotten: 0, iron: 0, book: 0, flint: 0, lapis: 0 }
					this.raidTempHours = 0
					this.raidHordeKey = 0
					this.raidHorde = null
					this.breachDebuffUntil = 0
					this.raidWave = null
					this.raidBossSlain = false
					this.fuel = 0
					this.fuelType = 'charcoal'
					this.walls = new Array(WALL_RING_NUM).fill(null)
					this.wallSel = null
					this.baseDur = MAX_DUR
					this.thBusy = null
					this.hero = null
					this.expedition = null
					this.expResult = null
					this.expResultOpen = false
					this.expOpen = false
					this.expSelKey = 'ashPath'
					this.expSelHoursIdx = 0
					this.expPartyIds = []
					this.villagerSeq = 0
					this.villagers = [this.makeVillager()]
					this.marketListings = new Array(6).fill(null)
					this.marketOrders = new Array(3).fill(null)
					this.mktEdit = null
					this.stored = []
					this.storeFreeUsed = false
					this.placeSel = null
					this.dormFreeUsed = false
					this.startVillagerGranted = true
					this.resources = {}
					this.devBaseVal = 0
					this.devVillVal = 0
					this.buildIdx = null
					this.selIdx = null
					this.persist()
					uni.showToast({ title: this.$t('me.labGamePage.devDone'), icon: 'none' })
				}
			})
		}
	}
}

const CAT_COLORS = {
	wood: '#8B5E34',
	stone: '#7D7D7D',
	mineral: '#B06239',
	special: '#5C6BD0',
	misc: '#8F8F94',
	nether: '#8B3A62',
	farm: '#7CBD56',
	ranch: '#D0A35C',
	food: '#D08A5C',
	brew: '#A06AD0',
	equip: '#5C8A8B',
	currency: '#2FCE62'
}
</script>

<style lang="scss" scoped>
.outer {
	min-height: 100%;
	background-color: #fcf4e1;

	&.dark-mode { background-color: #171e19; }
}

.content {
	display: flex;
	box-sizing: border-box;
	width: 100%;
	padding: 24rpx 24rpx calc(150rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
	flex-direction: column;
	align-items: center;
}

/* 顶部状态栏 */
.topbar {
	display: flex;
	width: 100%;
	max-width: 640rpx;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
	padding: 14rpx 20rpx;
	border-radius: 16rpx;
	background: rgba(255, 255, 255, 0.6);

	.dark-mode & { background: rgba(35, 44, 37, 0.9); }
}

/* 状态栏第二行：饱食 / 村民 / 绿宝石 */
.statbar {
	display: flex;
	width: 100%;
	max-width: 640rpx;
	align-items: center;
	justify-content: space-between;
	gap: 24rpx;
	margin-bottom: 20rpx;
	padding: 10rpx 20rpx;
	border-radius: 16rpx;
	background: rgba(255, 255, 255, 0.6);

	.dark-mode & { background: rgba(35, 44, 37, 0.9); }
}

.stat {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #6d7267;

	.dark-mode & { color: #acb7a9; }
}

.stat-val {
	font-size: 30rpx;
	font-weight: bold;
	color: #393d33;

	.dark-mode & { color: #eeeae0; }
}

.stat-cap {
	font-size: 22rpx;
	font-weight: normal;
	color: #a09a89;
}

.stat-icon {
	width: 30rpx;
	height: 30rpx;
	image-rendering: pixelated;
}

.stat-char {
	width: 30rpx;
	height: 30rpx;
	line-height: 30rpx;
	border-radius: 8rpx;
	color: #fff;
	font-size: 20rpx;
	text-align: center;
}

/* 食物优先级弹窗 */
.food-sat {
	font-size: 20rpx;
	color: #a09a89;

	.dark-mode & { color: #8d968c; }
}

.food-hunger {
	color: #b04a3a;

	.dark-mode & { color: #d88a7a; }
}

.food-mv {
	width: 52rpx;
	height: 52rpx;
	line-height: 48rpx;
	text-align: center;
	border-radius: 12rpx;
	background: rgba(255, 255, 255, 0.65);
	border: 2rpx solid rgba(92, 82, 60, 0.3);
	color: #393d33;
	font-weight: bold;

	.dark-mode & {
		background: rgba(0, 0, 0, 0.25);
		color: #eeeae0;
		border-color: rgba(238, 234, 224, 0.3);
	}
}

.food-mv--off { opacity: 0.3; }

.food-reset {
	margin-top: 12rpx;
	text-align: center;
	font-size: 24rpx;
	color: #b06f34;

	.dark-mode & { color: #d8a06a; }
}

.topbar-right {
	display: flex;
	align-items: center;
	gap: 18rpx;
}

.wh-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 10rpx 20rpx;
	border-radius: 28rpx;
	background: #e05c34;

	&:active { opacity: 0.85; }
}

.wh-btn--green { background: #5e8c4a; }

.wh-badge {
	min-width: 28rpx;
	padding: 0 8rpx;
	height: 28rpx;
	line-height: 28rpx;
	border-radius: 14rpx;
	background: #fff;
	color: #5e8c4a;
	font-size: 20rpx;
	font-weight: bold;
	text-align: center;
}

.wh-icon {
	width: 28rpx;
	height: 28rpx;
	image-rendering: pixelated;
}

.wh-text {
	font-size: 22rpx;
	font-weight: bold;
	color: #fff;
}

/* 楼层切换 */
.layer-row {
	display: flex;
	width: 100%;
	max-width: 640rpx;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.layer-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 12rpx 0;
	border-radius: 14rpx;
	font-size: 24rpx;
	font-weight: bold;
	color: #6d7267;
	background: rgba(255, 255, 255, 0.6);

	.dark-mode & { color: #acb7a9; background: rgba(35, 44, 37, 0.9); }

	&--on {
		color: #fff;
		background: #8b5e34;

		.dark-mode & { color: #eeeae0; background: #8b5e34; }
	}

	&:active { opacity: 0.85; }
}

/* 九宫格 */
.grid {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	max-width: 640rpx;
	aspect-ratio: 1 / 1;
	border-radius: 20rpx;
	overflow: hidden;
	border: 6rpx solid #5c523c;
	box-sizing: border-box;
}

/* 城墙环：顶/底两排横条 + 左右两列竖条，中排为九宫格 */
.village {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.wall-strip {
	display: flex;
	width: 100%;
	max-width: 700rpx;
	height: 52rpx; /* 加宽城墙厚度，方便手机端点击 */
}

.wall-strip .wall-cell {
	width: 100%;
	height: 100%;
}

.wall-mid {
	display: flex;
	width: 100%;
	max-width: 700rpx;
	align-items: stretch;
	justify-content: center;
}

.wall-mid .grid {
	flex: 1 1 auto;
	width: auto;
}

.wall-strip--v {
	max-width: none;
	flex: 0 0 52rpx;
	height: auto; /* 覆盖基类厚度：竖条随九宫格等高拉伸 */
	align-self: stretch;
	flex-direction: column;
}

.wall-strip--v .wall-cell {
	width: 100%;
	height: auto;
	flex: 1 1 0;
}

.wall-cell {
	position: relative;
	box-sizing: border-box;
	padding: 0;
}

.wall {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 6rpx;
	border-radius: 0;
	overflow: hidden;
	box-shadow: inset 0 -6rpx 8rpx rgba(0, 0, 0, 0.18);
}

.wall-strip--v .wall {
	flex-direction: column;
	gap: 0;
}

/* 角部融合：上/下整边包住四角收圆角，左右竖边平直拼接 */
.wall--c-t { border-radius: 18rpx 18rpx 0 0; }
.wall--c-b { border-radius: 0 0 18rpx 18rpx; }

.wall--hurt { filter: brightness(0.72); }

.wall-char {
	font-size: 20rpx;
	font-weight: bold;
	color: #fff;
	text-shadow: 0 2rpx 2rpx rgba(0, 0, 0, 0.35);
}

.wall-lv {
	font-size: 14rpx;
	color: rgba(255, 255, 255, 0.85);
	line-height: 1;
}

.wall-cell--empty {
	position: absolute;
	inset: 2rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx dashed rgba(92, 82, 60, 0.45);
	border-radius: 6rpx;
	background: rgba(139, 94, 52, 0.08);

	.dark-mode & { border-color: rgba(238, 234, 224, 0.25); }
}

.wall-cell-plus {
	font-size: 16rpx;
	color: rgba(92, 82, 60, 0.55);

	.dark-mode & { color: rgba(238, 234, 224, 0.4); }
}

.plot {
	position: relative;
	width: 33.3333%;
	height: 33.3333%;
	box-sizing: border-box;
	background: #7cbd56;

	&--odd { background: #74b350; }

	& + .plot {
		border-left: 2rpx solid rgba(92, 82, 60, 0.25);
		border-top: 2rpx solid rgba(92, 82, 60, 0.25);
	}

	&--center {
		background: #6aa84f;
		box-shadow: inset 0 0 0 6rpx rgba(224, 160, 79, 0.55);
	}
}

/* 地下层配色 */
.grid--under .plot {
	background: #5d4a38;

	&--odd { background: #564433; }
	&--center { background: #5d4a38; box-shadow: none; }
}

/* 地下待清理格 */
.locked-plot {
	position: absolute;
	inset: 14%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4rpx;
	border-radius: 14rpx;
	border: 3rpx dashed rgba(255, 255, 255, 0.25);
	box-sizing: border-box;
	background: rgba(0, 0, 0, 0.15);
}

.locked-icon {
	font-size: 40rpx;
	line-height: 1;
}

.locked-text {
	font-size: 20rpx;
	color: rgba(255, 255, 255, 0.6);
}

.locked-bar {
	width: 70%;
	height: 8rpx;
	border-radius: 4rpx;
	background: rgba(0, 0, 0, 0.3);
	overflow: hidden;
}

.locked-bar-fill {
	height: 100%;
	border-radius: 4rpx;
	background: #ffd76e;
}

/* 大本营：与其他建筑一致的实色块风格 */
.base {
	position: absolute;
	inset: 10%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 6rpx;
	padding: 8rpx;
	border-radius: 16rpx;
	background: #8b5e34;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.25);
	box-sizing: border-box;
}

/* 基地字标：与其他建筑的「色块 + 字」风格一致 */
.base-char {
	font-size: 52rpx;
	font-weight: bold;
	line-height: 1;
	color: rgba(255, 255, 255, 0.92);
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.35);
}

/* 顶栏基地名（大本营等级左侧，超长省略号截断） */
.base-stat-name {
	max-width: 300rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

/* 建筑 */
.building {
	position: absolute;
	inset: 12%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 14rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.25);
}

.building-char {
	font-size: 52rpx;
	font-weight: bold;
	color: rgba(255, 255, 255, 0.92);
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.35);
}

.building-lv {
	position: absolute;
	right: 6rpx;
	bottom: 4rpx;
	font-size: 20rpx;
	font-weight: bold;
	color: #fff;
	text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.5);
}

.building-worker {
	position: absolute;
	left: 6rpx;
	top: 4rpx;
	font-size: 18rpx;
	color: rgba(255, 255, 255, 0.9);
	text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.5);
}

/* 产出囤积读条与收集角标（部落冲突式） */
.collect-bar {
	position: absolute;
	left: 16%;
	right: 16%;
	bottom: 8%;
	height: 8rpx;
	border-radius: 4rpx;
	background: rgba(0, 0, 0, 0.3);
	overflow: hidden;
}

.collect-bar-fill {
	height: 100%;
	border-radius: 4rpx;
	background: #ffd76e;
}

/* 可升级浮动箭头（建筑/大本营左上角，点击打开面板升级） */
.up-arrow {
	position: absolute;
	left: 8%;
	top: 6%;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background: #5e8c4a;
	border: 2rpx solid rgba(255, 255, 255, 0.85);
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.35);
	animation: up-bob 1.2s ease-in-out infinite;
}

.up-arrow-icon {
	font-size: 22rpx;
	line-height: 1;
	color: #fff;
	font-weight: bold;
}

@keyframes up-bob {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-6rpx); }
}

.collect-badge {
	position: absolute;
	right: 8%;
	top: 6%;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44rpx;
	height: 44rpx;
	border-radius: 10rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.85);
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.35);
	animation: collect-bob 1.2s ease-in-out infinite;

	&:active { opacity: 0.8; }
}

.collect-badge-icon {
	font-size: 22rpx;
	font-weight: bold;
	color: #fff;
	line-height: 1;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.4);
}

@keyframes collect-bob {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-6rpx); }
}

/* 空地 */
.empty-plot {
	position: absolute;
	inset: 14%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 14rpx;
	border: 3rpx dashed rgba(92, 82, 60, 0.45);
	box-sizing: border-box;

	.dark-mode & { border-color: rgba(238, 234, 224, 0.3); }
}

.empty-mark {
	font-size: 48rpx;
	font-weight: bold;
	color: rgba(92, 82, 60, 0.45);
	line-height: 1;

	.dark-mode & { color: rgba(238, 234, 224, 0.3); }
}

/* 功能入口 */
.feature-row {
	display: flex;
	width: 100%;
	max-width: 640rpx;
	gap: 16rpx;
	margin-top: 16rpx;
}

.feature-btn {
	flex: 1;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	padding: 14rpx 0;
	border-radius: 16rpx;
	background: rgba(255, 255, 255, 0.6);

	.dark-mode & { background: rgba(35, 44, 37, 0.9); }

	&:active { opacity: 0.85; }
}

.feature-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44rpx;
	height: 44rpx;
	border-radius: 10rpx;
	font-size: 24rpx;
	font-weight: bold;
	color: #fff;
}

.feature-name {
	font-size: 24rpx;
	font-weight: bold;
	color: #393d33;

	.dark-mode & { color: #eeeae0; }
}

/* 僵尸夜袭行 */
.raid-row {
	position: relative;
	display: flex;
	width: 100%;
	max-width: 640rpx;
	align-items: center;
	gap: 16rpx;
	margin-top: 16rpx;
	padding: 18rpx 20rpx;
	box-sizing: border-box;
	border-radius: 16rpx;
	background: rgba(107, 75, 184, 0.12);

	.dark-mode & { background: rgba(107, 75, 184, 0.25); }

	&:active { opacity: 0.85; }
}

.raid-main {
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.raid-name {
	font-size: 24rpx;
	font-weight: bold;
	color: #393d33;

	.dark-mode & { color: #eeeae0; }
}

.raid-sub {
	font-size: 20rpx;
	color: #8a5a2e;

	.dark-mode & { color: #d8b98a; }
}

.raid-count {
	font-size: 22rpx;
	color: #6d7267;

	&--on { color: #6B4BB8; font-weight: bold; }

	.dark-mode & { color: #acb7a9; }
}

.raid-badge {
	position: absolute;
	right: 16rpx;
	top: -8rpx;
	min-width: 36rpx;
	height: 36rpx;
	padding: 0 10rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 18rpx;
	font-size: 20rpx;
	font-weight: bold;
	color: #fff;
	background: #e05c34;
}

.raid-status {
	font-size: 24rpx;
	font-weight: bold;
	color: #6d7267;
	text-align: center;

	&--on { color: #6B4BB8; }

	.dark-mode & { color: #acb7a9; }
}

.raid-def {
	font-size: 22rpx;
	color: #6d7267;
	text-align: center;

	.dark-mode & { color: #acb7a9; }
}

.raid-hint {
	font-size: 20rpx;
	color: #a09a89;
	line-height: 1.5;
	text-align: center;
}

/* 市场管理（九宫格 · 木质货架） */
.mkt-grid {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	aspect-ratio: 1 / 1;
	border-radius: 20rpx;
	overflow: hidden;
	border: 6rpx solid #6b4b36;
	box-sizing: border-box;
	box-shadow: inset 0 0 0 4rpx rgba(255, 255, 255, 0.12);
}

.mkt-cell {
	position: relative;
	width: 33.3333%;
	height: 33.3333%;
	box-sizing: border-box;
	background: #c59a67;

	/* 木板交替纹路 */
	&:nth-child(odd) { background: #c59a67; }
	&:nth-child(even) { background: #bd9159; }

	&--buy { background: #a87f4e; }

	& + .mkt-cell {
		border-left: 2rpx solid rgba(107, 75, 54, 0.45);
		border-top: 2rpx solid rgba(107, 75, 54, 0.45);
	}
}

.mkt-tile {
	position: absolute;
	inset: 10%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 14rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.25);
}

.mkt-cell--buy .mkt-tile {
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.25), inset 0 0 0 4rpx rgba(107, 75, 184, 0.7);
}

.mkt-tile-tag {
	position: absolute;
	left: 8rpx;
	top: 6rpx;
	font-size: 18rpx;
	color: rgba(255, 255, 255, 0.85);
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.4);
}

.mkt-tile-char {
	font-size: 48rpx;
	font-weight: bold;
	color: rgba(255, 255, 255, 0.92);
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.35);
}

.mkt-tile-qty {
	position: absolute;
	right: 8rpx;
	bottom: 6rpx;
	font-size: 20rpx;
	font-weight: bold;
	color: #fff;
	text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.5);
}

.mkt-tile-price {
	position: absolute;
	left: 8rpx;
	bottom: 6rpx;
	display: flex;
	align-items: center;
	gap: 4rpx;
	font-size: 20rpx;
	font-weight: bold;
	color: #fff;
	text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.5);
}

.mkt-em {
	width: 22rpx;
	height: 22rpx;
	image-rendering: pixelated;
}

.mkt-cell-empty {
	position: absolute;
	inset: 12%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 14rpx;
	border: 3rpx dashed rgba(107, 75, 54, 0.55);
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.10);

	.dark-mode & {
		border-color: rgba(238, 234, 224, 0.35);
		background: rgba(0, 0, 0, 0.12);
	}
}

.mkt-cell-plus {
	font-size: 44rpx;
	font-weight: bold;
	color: rgba(107, 75, 54, 0.6);
	line-height: 1;

	.dark-mode & { color: rgba(238, 234, 224, 0.4); }
}

.mkt-hint {
	font-size: 20rpx;
	color: #a09a89;
	text-align: center;
	line-height: 1.5;
}

.mkt-form-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.mkt-form-row .dev-input {
	flex: 1 1 auto;
	min-width: 0;
}

/* 弹窗通用 */
.overlay {
	position: fixed;
	inset: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.45);
}

.modal {
	display: flex;
	width: 82%;
	max-width: 600rpx;
	max-height: 78vh;
	flex-direction: column;
	gap: 16rpx;
	padding: 40rpx 32rpx;
	border-radius: 24rpx;
	background: #fcf4e1;
	overflow-y: auto;

	.dark-mode & { background: #232c25; }

	&--tall { max-height: 84vh; }
}

.modal-title {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	font-size: 34rpx;
	font-weight: bold;
	color: #393d33;
	text-align: center;

	.dark-mode & { color: #eeeae0; }
}

.modal-title-char {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 48rpx;
	height: 48rpx;
	border-radius: 10rpx;
	font-size: 26rpx;
	color: #fff;
}

.modal-close {
	margin-top: 4rpx;
	padding: 12rpx;
	font-size: 26rpx;
	color: #a09a89;
	text-align: center;

	.dark-mode & { color: #7d887e; }

	&:active { opacity: 0.7; }
}

.empty-tip {
	font-size: 24rpx;
	color: #a09a89;
	text-align: center;
	padding: 20rpx 0;
}

/* 改名 */
.rename-box {
	display: flex;
	align-items: center;
	gap: 14rpx;
	padding: 20rpx;
	border-radius: 16rpx;
	background: rgba(139, 94, 52, 0.10);
}

.rename-label {
	flex: 0 0 auto;
	font-size: 24rpx;
	font-weight: bold;
	color: #393d33;

	.dark-mode & { color: #eeeae0; }
}

.rename-input {
	flex: 1 1 auto;
	min-width: 0;
	height: 60rpx;
	padding: 0 18rpx;
	box-sizing: border-box;
	font-size: 24rpx;
	color: #393d33;
	border-radius: 12rpx;
	background: rgba(255, 255, 255, 0.7);

	.dark-mode & {
		color: #eeeae0;
		background: rgba(23, 30, 25, 0.6);
	}
}

.rename-save {
	flex: 0 0 auto;
	padding: 12rpx 24rpx;
	border-radius: 32rpx;
	font-size: 24rpx;
	font-weight: bold;
	color: #fff;
	background: #e05c34;

	&:active { opacity: 0.85; }
}

/* 大本营升级 */
.th-box {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	padding: 20rpx;
	border-radius: 16rpx;
	background: rgba(224, 160, 79, 0.12);
}

.th-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.th-lv {
	font-size: 24rpx;
	font-weight: bold;
	color: #6d7267;

	.dark-mode & { color: #acb7a9; }
}

.req-row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 10rpx;
}

.req-label {
	font-size: 22rpx;
	color: #6d7267;

	.dark-mode & { color: #acb7a9; }
}

.req-item {
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;

	&--ok {
		color: #2e7d32;
		background: rgba(76, 175, 80, 0.15);
	}

	&--bad {
		color: #c0392b;
		background: rgba(192, 57, 43, 0.12);
	}
}

.th-unlock {
	font-size: 22rpx;
	color: #6d7267;

	.dark-mode & { color: #acb7a9; }
}

/* 费用 */
.cost-row {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
}

.cost-item {
	font-size: 22rpx;
	color: #2e7d32;

	&--lack { color: #c0392b; }
	&--free { color: #b8860b; font-weight: 600; }
	&--time {
		color: #8a5a2e;
		.dark-mode & { color: #d8a06a; }
	}
}

/* 施工中角标（建造/升级倒计时） */
.busy-flag {
	position: absolute;
	left: 50%;
	bottom: 6%;
	transform: translateX(-50%);
	z-index: 3;
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 4rpx 12rpx;
	border-radius: 999rpx;
	background: rgba(0, 0, 0, 0.62);
	white-space: nowrap;
}

.busy-icon { font-size: 20rpx; }

.busy-time {
	font-size: 20rpx;
	color: #ffe9c8;
}

/* 村民列表 */
.vill-card {
	margin-bottom: 16rpx;
	padding: 16rpx 20rpx;
	background: rgba(255, 255, 255, 0.55);
	border: 1rpx solid rgba(0, 0, 0, 0.08);
	border-radius: 14rpx;
}

.vill-head {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 12rpx;
}

.vill-avatar {
	width: 52rpx;
	height: 52rpx;
	line-height: 52rpx;
	text-align: center;
	border-radius: 50%;
	background: #7BA05B;
	color: #ffffff;
	font-size: 26rpx;
}

.vill-name {
	flex: 1;
	font-size: 28rpx;
	font-weight: 600;
	color: #3d3327;
}

.vill-mood {
	font-size: 22rpx;
}

.vill-hunger {
	font-size: 20rpx;
	color: #ffffff;
	background: #c0564a;
	padding: 2rpx 10rpx;
	border-radius: 8rpx;
}

/* 远征中标签（紫红，下界色） */
.vill-hunger--exp {
	background: #8B3A62;
}

.vill-rename {
	font-size: 22rpx;
	color: #5C6BD0;
	padding: 4rpx 10rpx;
	border: 1rpx solid #5C6BD0;
	border-radius: 8rpx;
}

.vill-bar-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 8rpx;
}

.vill-bar-label {
	width: 72rpx;
	font-size: 22rpx;
	color: #7a6f5d;
}

.vill-bar {
	flex: 1;
	height: 14rpx;
	background: rgba(0, 0, 0, 0.1);
	border-radius: 7rpx;
	overflow: hidden;
}

.vill-bar-fill {
	height: 100%;
	border-radius: 7rpx;

	&--hp { background: #c0564a; }
	&--sat { background: #d19a3e; }
	&--dur { background: #5C6BD0; }
}

/* 产出囤积块（纵向布局：标题/提示 + 囤积条 + 收集按钮） */
.collect-box {
	margin: 16rpx 0;
	padding: 14rpx 18rpx;
	border-radius: 14rpx;
	background: rgba(209, 154, 62, 0.10);
	border: 1rpx solid rgba(209, 154, 62, 0.30);

	.worker-info { margin-bottom: 12rpx; }

	.vill-bar-val { width: 110rpx; }

	.upgrade-btn { margin-top: 6rpx; }
}

/* 攻防数值块 */
.def-box {
	margin: 16rpx 0;
	padding: 14rpx 18rpx;
	background: rgba(92, 107, 208, 0.08);
	border: 1rpx solid rgba(92, 107, 208, 0.25);
	border-radius: 14rpx;
}

.def-stats {
	display: flex;
	gap: 24rpx;
	margin-bottom: 10rpx;
}

.def-stat {
	font-size: 24rpx;
	font-weight: 600;
	color: #5C6BD0;

	&--low { color: #b8860b; }
}

.def-hint {
	display: block;
	font-size: 20rpx;
	color: #b8860b;
	margin-bottom: 8rpx;
}

.def-stat-sub {
	font-size: 20rpx;
	font-weight: 400;
	color: #9a9083;
}

.vill-bar-val {
	width: 56rpx;
	text-align: right;
	font-size: 22rpx;
	color: #7a6f5d;
}

.vill-foot {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12rpx;
	margin-top: 10rpx;
}

.vill-equip {
	display: flex;
	align-items: center;
	gap: 8rpx;
	flex-wrap: wrap;
}

.vill-equip-label {
	font-size: 22rpx;
	color: #7a6f5d;
}

.vill-equip-slot {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 4rpx 12rpx 4rpx 6rpx;
	background: rgba(0, 0, 0, 0.06);
	border-radius: 8rpx;

	&--filled { background: rgba(209, 154, 62, 0.22); }
	&:active { opacity: 0.7; }
}

.vill-equip-char {
	width: 28rpx;
	height: 28rpx;
	line-height: 28rpx;
	border-radius: 6rpx;
	color: #fff;
	font-size: 18rpx;
	text-align: center;
}

.vill-equip-name {
	font-size: 20rpx;
	color: #6d6252;
}

.vill-feed {
	font-size: 22rpx;
	color: #ffffff;
	background: #d19a3e;
	padding: 8rpx 18rpx;
	border-radius: 10rpx;

	&--disabled { opacity: 0.45; }
}

/* 村民列表工具行：提示文案 + 一键喂食 */
.vill-toolbar {
	display: flex;
	align-items: center;
	gap: 16rpx;

	.bl-hint {
		flex: 1 1 auto;
		text-align: left;
	}
}

/* 工位 / 村民 */
.worker-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
	padding: 20rpx;
	border-radius: 16rpx;
	background: rgba(139, 94, 52, 0.10);
}

.worker-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
	min-width: 0;
}

/* 铁匠铺燃料 */
.fuel-box {
	display: flex;
	flex-direction: column;
	gap: 14rpx;
	padding: 20rpx;
	border-radius: 16rpx;
	background: rgba(176, 98, 57, 0.12);
}

.fuel-picker {
	display: flex;
	gap: 12rpx;
}

.fuel-opt {
	flex: 1 1 0;
	padding: 12rpx 0;
	border-radius: 12rpx;
	font-size: 24rpx;
	text-align: center;
	color: #6d7267;
	background: rgba(255, 255, 255, 0.6);
	border: 2rpx solid transparent;

	.dark-mode & {
		color: #acb7a9;
		background: rgba(23, 30, 25, 0.6);
	}
}

.fuel-opt--on {
	color: #fff;
	font-weight: bold;
	background: #B06239;
	border-color: #8b4a28;

	.dark-mode & { color: #fff; }
}

.worker-title {
	font-size: 24rpx;
	font-weight: bold;
	color: #393d33;

	.dark-mode & { color: #eeeae0; }
}

.worker-sub {
	font-size: 22rpx;
	color: #6d7267;

	.dark-mode & { color: #acb7a9; }
}

.worker-btns {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.worker-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56rpx;
	height: 56rpx;
	border-radius: 12rpx;
	font-size: 32rpx;
	font-weight: bold;
	color: #393d33;
	background: rgba(255, 255, 255, 0.7);

	.dark-mode & {
		color: #eeeae0;
		background: rgba(23, 30, 25, 0.6);
	}

	&--add { background: #4caf50; color: #fff; }

	&:active { opacity: 0.85; }
}

/* 建筑详情 */
.desc-box {
	font-size: 24rpx;
	color: #6d7267;
	line-height: 1.6;
	text-align: center;

	.dark-mode & { color: #acb7a9; }
}

.prod-row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 14rpx;
	border-radius: 12rpx;
	background: rgba(139, 94, 52, 0.08);
}

.prod-label {
	font-size: 22rpx;
	color: #a09a89;
}

.prod-item {
	font-size: 22rpx;
	color: #2e7d32;

	&--neg { color: #c0392b; }
}

/* 升级 */
.upgrade-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
	padding: 20rpx;
	border-radius: 16rpx;
	background: rgba(224, 160, 79, 0.12);
}

.upgrade-info {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	min-width: 0;
}

.upgrade-title {
	font-size: 26rpx;
	font-weight: bold;
	color: #393d33;

	.dark-mode & { color: #eeeae0; }
}

.upgrade-sub {
	font-size: 22rpx;
	color: #6d7267;

	&--warn { color: #c0392b; }

	.dark-mode & { color: #acb7a9; }
}

.upgrade-btn {
	flex: 0 0 auto;
	padding: 14rpx 26rpx;
	border-radius: 36rpx;
	font-size: 24rpx;
	font-weight: bold;
	color: #fff;
	background: #e05c34;

	&--wide {
		width: 100%;
		box-sizing: border-box;
		text-align: center;
	}

	&--disabled { opacity: 0.45; }

	&:active { opacity: 0.7; }
}

.maxlv-tip {
	font-size: 24rpx;
	color: #a09a89;
	text-align: center;
}

.demolish-btn {
	padding: 12rpx;
	font-size: 24rpx;
	color: #c0392b;
	text-align: center;

	&:active { opacity: 0.7; }
}

/* 仓库 */
.wh-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #393d33;
	text-align: center;

	.dark-mode & { color: #eeeae0; }
}

.wh-slots {
	margin-left: 14rpx;
	font-size: 22rpx;
	font-weight: normal;
	color: #a09a89;
}

.res-slot {
	font-size: 20rpx;
	color: #a09a89;
}

.res-row {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 14rpx 20rpx;
	border-radius: 14rpx;
	background: rgba(139, 94, 52, 0.08);

	&--off {
		opacity: 0.4;
	}
}

.feed-vill-name {
	margin-left: 12rpx;
	font-size: 24rpx;
	font-weight: normal;
	color: #8b5e34;
}

.res-dot {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	width: 44rpx;
	height: 44rpx;
	border-radius: 10rpx;
	font-size: 22rpx;
	font-weight: bold;
	color: #fff;
}

.res-name {
	flex: 1 1 auto;
	min-width: 0;
	font-size: 24rpx;
	color: #393d33;

	.dark-mode & { color: #eeeae0; }
}

/* 仓库资源的最早获取等级标签（颜色 = 对应大本营主题色） */
.res-th {
	flex: 0 0 auto;
	padding: 0 8rpx;
	height: 28rpx;
	line-height: 28rpx;
	border-radius: 8rpx;
	font-size: 18rpx;
	color: #fff;
	background: #a09a89;
}

.res-val {
	flex: 0 0 auto;
	font-size: 24rpx;
	font-weight: bold;
	color: #6d7267;

	.dark-mode & { color: #acb7a9; }
}

/* 开发者控制台 */
.dev-box {
	width: 100%;
	max-width: 640rpx;
	margin-top: 20rpx;
	padding: 16rpx 20rpx;
	box-sizing: border-box;
	border-radius: 16rpx;
	border: 2rpx dashed rgba(224, 92, 52, 0.5);
	background: rgba(224, 92, 52, 0.06);
}

.dev-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.dev-title {
	font-size: 24rpx;
	font-weight: bold;
	color: #e05c34;
}

.dev-toggle {
	font-size: 30rpx;
	font-weight: bold;
	color: #e05c34;
	line-height: 1;
}

.dev-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-top: 14rpx;
}

.dev-picker {
	flex: 1 1 auto;
	min-width: 0;
}

.dev-picker-val {
	height: 60rpx;
	display: flex;
	align-items: center;
	padding: 0 18rpx;
	box-sizing: border-box;
	overflow: hidden;
	font-size: 24rpx;
	color: #393d33;
	border-radius: 12rpx;
	background: rgba(255, 255, 255, 0.7);
	white-space: nowrap;
	text-overflow: ellipsis;

	.dark-mode & {
		color: #eeeae0;
		background: rgba(23, 30, 25, 0.6);
	}
}

.dev-input {
	flex: 0 0 160rpx;
	height: 60rpx;
	padding: 0 16rpx;
	box-sizing: border-box;
	font-size: 24rpx;
	color: #393d33;
	border-radius: 12rpx;
	background: rgba(255, 255, 255, 0.7);

	.dark-mode & {
		color: #eeeae0;
		background: rgba(23, 30, 25, 0.6);
	}

	&--sm {
		flex: 0 0 110rpx;
	}
}

.dev-btn {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 12rpx 22rpx;
	border-radius: 28rpx;
	font-size: 22rpx;
	font-weight: bold;
	color: #fff;
	background: #8b5e34;

	&--gold { background: #d0a35c; }
	&--danger { background: #c0392b; }
	&--wide { width: 100%; box-sizing: border-box; }

	&:active { opacity: 0.85; }
}

.dev-speed-label {
	flex: 0 0 auto;
	font-size: 22rpx;
	font-weight: bold;
	color: #e05c34;
}

.dev-speed-btn {
	flex: 1 1 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10rpx 0;
	border-radius: 22rpx;
	font-size: 22rpx;
	font-weight: bold;
	color: #8b5e34;
	background: rgba(139, 94, 52, 0.12);

	&--on {
		color: #fff;
		background: #8b5e34;
	}

	&:active { opacity: 0.85; }
}

/* 建筑图鉴 */
.bl-btn {
	position: fixed;
	left: 24rpx;
	bottom: calc(24rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
	z-index: 9;
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 14rpx 24rpx;
	border-radius: 32rpx;
	background: #8b5e34;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.25);

	&:active { opacity: 0.85; }
}

.bl-btn-icon {
	font-size: 28rpx;
	line-height: 1;
}

.bl-btn-text {
	font-size: 24rpx;
	font-weight: bold;
	color: #fff;
}

.bl-hint {
	font-size: 22rpx;
	color: #a09a89;
	text-align: center;
}

/* 村民列表悬浮按钮（左下角，建筑图鉴上方） */
.vill-btn {
	position: fixed;
	left: 24rpx;
	bottom: calc(104rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
	z-index: 9;
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 14rpx 24rpx;
	border-radius: 32rpx;
	background: #6b8f4f;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.25);

	&:active { opacity: 0.85; }
}

.vill-btn-icon {
	width: 30rpx;
	height: 30rpx;
	image-rendering: pixelated;
}

.vill-btn-text {
	font-size: 24rpx;
	font-weight: bold;
	color: #fff;
}

/* 英雄雇佣（原木娘）入口与卡片 */
.hero-btn {
	bottom: calc(184rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
	background: #cf9a2e;
}

.hero-avatar {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 30rpx;
	height: 30rpx;
	border-radius: 50%;
	font-size: 18rpx;
	font-weight: bold;
	color: #6b4b36;
	background: #ffe9c8;

	&--on {
		background: #7cbd56;
		color: #fff;
	}

	&--lg {
		width: 72rpx;
		height: 72rpx;
		font-size: 34rpx;
	}
}

.hero-card {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 16rpx 20rpx;
	border-radius: 14rpx;
	background: rgba(207, 154, 46, 0.14);
}

.hero-desc {
	font-size: 22rpx;
	color: #8a5a2e;

	.dark-mode & { color: #d8b98a; }
}

/* ---------------- 下界远征 ---------------- */
.exp-badge {
	position: absolute;
	top: -8rpx;
	right: -6rpx;
	max-width: 150rpx;
	overflow: hidden;
	font-size: 18rpx;
	color: #ffffff;
	background: #8B3A62;
	padding: 2rpx 10rpx;
	border-radius: 10rpx;
	white-space: nowrap;
}

.exp-route {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	padding: 14rpx 18rpx;
	margin-bottom: 10rpx;
	border: 3rpx solid transparent;
	border-radius: 14rpx;
	background: rgba(139, 58, 98, 0.08);
}

.exp-route--on {
	border-color: #8B3A62;
	background: rgba(139, 58, 98, 0.16);
}

.exp-route--lock {
	opacity: 0.55;
}

.exp-route-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.exp-route-name {
	font-size: 26rpx;
	font-weight: bold;
	color: #5a3a2e;

	.dark-mode & { color: #e8c9a0; }
}

.exp-danger {
	font-size: 22rpx;
	color: #c0564a;
}

.exp-route-sub {
	font-size: 20rpx;
	color: #8a7566;

	.dark-mode & { color: #b39a86; }
}

.exp-lock {
	color: #c08a3e;
}

.exp-sec {
	font-size: 22rpx;
	font-weight: bold;
	color: #6b4b36;
	margin: 10rpx 0 6rpx;

	.dark-mode & { color: #d8b98a; }
}

.exp-sec--bad {
	color: #c0564a;
}

.exp-hours {
	display: flex;
	gap: 12rpx;
}

.exp-hour {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rpx;
	padding: 12rpx 0;
	border: 3rpx solid transparent;
	border-radius: 12rpx;
	background: rgba(139, 94, 52, 0.08);
}

.exp-hour--on {
	border-color: #8B3A62;
	background: rgba(139, 58, 98, 0.16);
}

.exp-hour-t {
	font-size: 26rpx;
	font-weight: bold;
	color: #5a3a2e;

	.dark-mode & { color: #e8c9a0; }
}

.exp-hour-s {
	font-size: 18rpx;
	color: #8a7566;

	.dark-mode & { color: #b39a86; }
}

.exp-vills {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
	margin-bottom: 8rpx;
}

.exp-vill {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 6rpx 12rpx 6rpx 6rpx;
	border: 3rpx solid transparent;
	border-radius: 999rpx;
	background: rgba(139, 94, 52, 0.08);
}

.exp-vill--on {
	border-color: #7cbd56;
	background: rgba(124, 189, 86, 0.18);
}

.exp-vill--exp {
	opacity: 0.75;
}

.exp-vill-avatar {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	font-size: 22rpx;
	color: #ffffff;
}

.exp-vill-name {
	font-size: 22rpx;
	color: #5a3a2e;

	.dark-mode & { color: #e8c9a0; }
}

.exp-remain {
	text-align: center;
	font-size: 34rpx;
	font-weight: bold;
	color: #8B3A62;
	margin: 14rpx 0;
}

.exp-line {
	font-size: 22rpx;
	color: #6b4b36;
	padding: 4rpx 0;

	.dark-mode & { color: #d8b98a; }
}

.exp-line--bad {
	color: #c0564a;
}

.bl-item {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	padding: 18rpx 20rpx;
	border-radius: 16rpx;
	background: rgba(139, 94, 52, 0.08);
}

.bl-head {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.bl-char {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	width: 48rpx;
	height: 48rpx;
	border-radius: 10rpx;
	font-size: 26rpx;
	font-weight: bold;
	color: #fff;
}

.bl-name {
	flex: 1 1 auto;
	min-width: 0;
	font-size: 26rpx;
	font-weight: bold;
	color: #393d33;

	.dark-mode & { color: #eeeae0; }
}

.bl-th {
	flex: 0 0 auto;
	font-size: 20rpx;
	color: #6d7267;

	.dark-mode & { color: #acb7a9; }
}

.bl-desc {
	font-size: 22rpx;
	color: #6d7267;
	line-height: 1.5;

	.dark-mode & { color: #acb7a9; }
}

.bl-prod {
	display: flex;
	align-items: flex-start;
	gap: 10rpx;
}

.bl-lv {
	flex: 0 0 auto;
	font-size: 20rpx;
	font-weight: bold;
	color: #e05c34;
	line-height: 1.6;
}

.bl-prod-text {
	flex: 1 1 auto;
	min-width: 0;
	font-size: 22rpx;
	color: #393d33;
	line-height: 1.6;

	.dark-mode & { color: #eeeae0; }
}

/* 好友的村庄 */
.fr-btn {
	position: fixed;
	right: 24rpx;
	bottom: calc(24rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
	z-index: 9;
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 14rpx 24rpx;
	border-radius: 32rpx;
	background: #4c8a3f;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.25);

	&:active { opacity: 0.85; }
}

/* 消息日志按钮（好友入口上方，同款胶囊样式） */
.fr-btn--log {
	bottom: calc(110rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
	background: #a5793f;
}

/* 日志面板：悬浮于日志按钮上方 */
.fr-logbox {
	position: fixed;
	right: 24rpx;
	bottom: calc(196rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
	z-index: 9;
	width: 420rpx;
	max-height: 340rpx;
	overflow-y: auto;
	box-sizing: border-box;
	padding: 12rpx 16rpx;
	border-radius: 16rpx;
	background: rgba(255, 252, 245, 0.96);
	border: 2rpx solid rgba(92, 82, 60, 0.25);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.18);

	.dark-mode & {
		background: rgba(40, 44, 38, 0.96);
		border-color: rgba(238, 234, 224, 0.25);
	}
}

.fr-btn-icon {
	font-size: 28rpx;
	line-height: 1;
}

.fr-btn-text {
	font-size: 24rpx;
	font-weight: bold;
	color: #fff;
}

.fr-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 18rpx 20rpx;
	border-radius: 16rpx;
	background: rgba(139, 94, 52, 0.08);
}

.fr-char {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	width: 64rpx;
	height: 64rpx;
	border-radius: 14rpx;
	font-size: 28rpx;
	font-weight: bold;
	color: #fff;
	box-shadow: inset 0 0 0 4rpx rgba(255, 255, 255, 0.25);
}

.fr-main {
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.fr-name {
	font-size: 26rpx;
	font-weight: bold;
	color: #393d33;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	.dark-mode & { color: #eeeae0; }
}

.fr-sub {
	font-size: 22rpx;
	color: #6d7267;

	.dark-mode & { color: #acb7a9; }
}

/* 好友村庄消息日志 */
.fr-log {
	display: flex;
	align-items: flex-start;
	gap: 10rpx;
	padding: 10rpx 4rpx;
	border-bottom: 2rpx solid rgba(92, 82, 60, 0.12);
}

.fr-log-tag {
	flex: 0 0 auto;
	padding: 0 10rpx;
	height: 32rpx;
	line-height: 32rpx;
	border-radius: 8rpx;
	font-size: 18rpx;
	color: #fff;
	background: #a09a89;
}

.fr-log-tag--stat { background: #4f7ec2; }
.fr-log-tag--notice { background: #d08a3e; }
.fr-log-tag--market { background: #5e8c4a; }
.fr-log-tag--steal { background: #c0564a; }

.fr-log-text {
	flex: 1 1 auto;
	min-width: 0;
	font-size: 22rpx;
	line-height: 32rpx;
	color: #393d33;

	.dark-mode & { color: #eeeae0; }
}

.fr-visit {
	flex: 0 0 auto;
	padding: 12rpx 24rpx;
	border-radius: 28rpx;
	font-size: 22rpx;
	font-weight: bold;
	color: #fff;
	background: #4c8a3f;

	&:active { opacity: 0.85; }
}

@import "./logDefense-cel.scss";
@import "./logDefense-features.scss";
</style>
