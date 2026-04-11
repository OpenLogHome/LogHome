<template>
	<div class="outer">
		<div class="searchPanel">
			<el-input
				v-model="searchQuery"
				clearable
				prefix-icon="el-icon-search"
				maxlength="60"
				placeholder="搜索整本小说"
				@input="handleSearchInput"
				@clear="clearSearch"
			></el-input>
			<div class="searchMeta">
				<span v-if="hasActiveSearch && !searchLoading && !searchError">{{ searchSummaryText }}</span>
				<span v-else-if="hasActiveSearch && searchLoading">{{ searchStatusText }}</span>
			</div>
		</div>
		<div class="articles">
			<div v-if="hasActiveSearch" class="searchResults">
				<div class="searchStateCard" v-if="searchLoading">
					<i class="el-icon-loading"></i>
					<span>{{ searchStatusText }}</span>
				</div>
				<div class="searchStateCard error" v-else-if="searchError">
					<i class="el-icon-warning-outline"></i>
					<span>{{ searchError }}</span>
				</div>
				<div class="searchStateCard empty" v-else-if="searchResults.length === 0">
					<i class="el-icon-document"></i>
					<span>没有找到已发布章节中的相关内容，试试更短的关键词。</span>
				</div>
				<div v-else class="searchResultList">
					<div
						class="searchResultCard"
						v-for="item in searchResults"
						:key="item.resultKey"
						@click="openSearchResult(item)"
					>
						<div class="searchResultHeader">
							<div class="searchResultTitle" v-html="item.highlightedTitle"></div>
							<div class="searchResultTags">
								<div
									v-if="item.typeLabel"
									class="searchResultTag"
									:class="item.articleType"
								>
									{{ item.typeLabel }}
								</div>
							</div>
						</div>
						<div class="searchResultMeta">
							{{ item.chapterLabel }}
							<span v-if="item.volumeLabel"> · {{ item.volumeLabel }}</span>
							<span v-if="item.matchLabel"> · {{ item.matchLabel }}</span>
						</div>
						<div class="searchResultParagraph" v-html="item.highlightedPreview"></div>
					</div>
				</div>
			</div>
			<div v-else class="volumeList">
				<div class="volume" v-for="(volume, vIndex) in volumeList" :key="vIndex">
					<div class="volume-header" @click="toggleVolume(vIndex)" v-if="volumeList.length > 1 || volume.title !== '正文'">
						<div class="volume-title">{{ volume.title }}</div>
						<uni-icons :type="volume.isExpanded ? 'bottom' : 'right'" size="16" color="#dddddd"></uni-icons>
					</div>
					<div class="chapter-list" v-show="volume.isExpanded">
						<navigator
							v-for="(item, idx) in volume.chapters"
							:key="item.article_id"
							:url="getReaderUrl(item.article_id)"
							open-type="redirect"
							@click="$emit('change', item.originalIndex)"
						>
							<div
								class="article"
								:key="item.article_id"
								:id="'chapter-' + item.originalIndex"
								:class="{ current: item.originalIndex === currentIdx }"
							>
								<div class="title">{{ item.title }}</div>
							</div>
						</navigator>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios"

const SEARCH_DEBOUNCE_MS = 250;
const SEARCH_BATCH_SIZE = 8;

export default {
	data() {
		return {
			uid: 0,
			articles: [],
			volumeList: [],
			searchQuery: "",
			searchResults: [],
			searchLoading: false,
			searchError: "",
			searchStatusText: "正在搜索内容...",
			searchDocumentMap: {},
			searchPreparedNovelId: 0,
			searchMaterialsPromise: null,
			searchRequestId: 0,
			searchDebounceTimer: null,
		}
	},
	props: {
		novel_id: {
			type: [Number, String],
			default: 0,
		},
		currentIdx: {
			type: Number,
			default: -1,
		},
		visible: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		normalizedSearchQuery() {
			return String(this.searchQuery || "").trim();
		},
		hasActiveSearch() {
			return this.normalizedSearchQuery.length > 0;
		},
		searchSummaryText() {
			return `找到 ${this.searchResults.length} 条结果`;
		},
	},
	watch: {
		novel_id: {
			immediate: true,
			handler(value) {
				const novelId = Number(value || 0);
				if (!novelId) {
					this.resetMenuState();
					return;
				}
				this.loadArticles(novelId);
			},
		},
		currentIdx() {
			if (this.hasActiveSearch) {
				return;
			}
			this.scheduleScrollToCurrent(0);
		},
		visible(value) {
			if (!value || this.hasActiveSearch) {
				return;
			}
			this.scheduleScrollToCurrent(120);
		},
	},
	beforeDestroy() {
		if (this.searchDebounceTimer) {
			clearTimeout(this.searchDebounceTimer);
			this.searchDebounceTimer = null;
		}
	},
	methods: {
		async loadArticles(uid) {
			uni.showLoading({
				title: "努力加载中",
			});
			this.uid = Number(uid || 0);
			this.resetSearchCache();
			try {
				const res = await axios.get(this.$baseUrl + "/library/get_articles?id=" + this.uid, {});
				this.articles = Array.isArray(res.data) ? res.data : [];
				this.processVolumes();
				this.scheduleScrollToCurrent(0);
				if (this.hasActiveSearch) {
					this.scheduleSearch(true);
				}
			} catch (error) {
				this.articles = [];
				this.volumeList = [];
				uni.showToast({
					title: error.toString(),
					icon: "none",
					duration: 2000,
				});
			} finally {
				uni.hideLoading();
			}
		},
		resetMenuState() {
			this.uid = 0;
			this.articles = [];
			this.volumeList = [];
			this.resetSearchCache();
		},
		resetSearchCache(preserveQuery = false) {
			if (this.searchDebounceTimer) {
				clearTimeout(this.searchDebounceTimer);
				this.searchDebounceTimer = null;
			}
			this.searchLoading = false;
			this.searchError = "";
			this.searchStatusText = "正在搜索内容...";
			this.searchResults = [];
			this.searchDocumentMap = {};
			this.searchPreparedNovelId = 0;
			this.searchMaterialsPromise = null;
			if (!preserveQuery) {
				this.searchQuery = "";
			}
		},
		getReaderUrl(articleId) {
			const readerProps = window.localStorage.getItem("readerProps");
			const isPageReader = readerProps === "page";
			let url = isPageReader
				? `/pages/readers/newReader/article?id=${articleId}`
				: `/pages/readers/article_rich?id=${articleId}`;
			if (this.novel_id) {
				url += `&novelId=${this.novel_id}`;
			}
			return url;
		},
		processVolumes() {
			const volumes = [];
			let currentVolume = {
				title: "正文",
				isExpanded: true,
				chapters: [],
			};
			let hasSpliters = false;

			this.articles.forEach((item, index) => {
				if (item.article_type === "spliter") {
					if (currentVolume.chapters.length > 0 || hasSpliters) {
						volumes.push(currentVolume);
					}
					currentVolume = {
						title: item.title,
						isExpanded: true,
						chapters: [],
					};
					hasSpliters = true;
				} else {
					item.originalIndex = index;
					item.volumeTitle = currentVolume.title;
					currentVolume.chapters.push(item);
				}
			});

			if (currentVolume.chapters.length > 0 || hasSpliters) {
				volumes.push(currentVolume);
			} else if (volumes.length === 0) {
				volumes.push(currentVolume);
			}

			this.volumeList = volumes;

			if (this.currentIdx !== undefined) {
				this.volumeList.forEach((volume) => {
					const hasCurrent = volume.chapters.some((chapter) => chapter.originalIndex === this.currentIdx);
					if (hasCurrent) {
						volume.isExpanded = true;
					}
				});
			}
		},
		toggleVolume(index) {
			this.volumeList[index].isExpanded = !this.volumeList[index].isExpanded;
			this.$forceUpdate();
			this.scheduleScrollToCurrent(0);
		},
		scheduleScrollToCurrent(delay = 0) {
			if (this.currentIdx === undefined || this.currentIdx === null || this.currentIdx < 0) {
				return;
			}
			this.$nextTick(() => {
				window.setTimeout(() => {
					this.scrollToCurrent();
				}, delay);
			});
		},
		scrollToCurrent() {
			if (this.currentIdx === undefined || this.currentIdx === null || this.currentIdx < 0) {
				return;
			}
			const element = this.$el
				? this.$el.querySelector(`#chapter-${this.currentIdx}`)
				: null;
			if (element) {
				element.scrollIntoView({ behavior: "auto", block: "center" });
			}
		},
		handleSearchInput() {
			this.scheduleSearch();
		},
		clearSearch() {
			this.searchQuery = "";
			this.scheduleSearch(true);
		},
		scheduleSearch(force = false) {
			if (this.searchDebounceTimer) {
				clearTimeout(this.searchDebounceTimer);
				this.searchDebounceTimer = null;
			}

			if (!this.hasActiveSearch) {
				this.searchRequestId += 1;
				this.searchLoading = false;
				this.searchError = "";
				this.searchStatusText = "正在搜索内容...";
				this.searchResults = [];
				return;
			}

			if (force) {
				this.runSearch();
				return;
			}

			this.searchDebounceTimer = setTimeout(() => {
				this.runSearch();
			}, SEARCH_DEBOUNCE_MS);
		},
		async runSearch() {
			const query = this.normalizedSearchQuery;
			if (!query) {
				this.searchResults = [];
				this.searchLoading = false;
				this.searchError = "";
				return;
			}

			const requestId = ++this.searchRequestId;
			this.searchLoading = true;
			this.searchError = "";
			this.searchStatusText = "正在搜索内容...";

			try {
				await this.ensureSearchMaterials();
				if (requestId !== this.searchRequestId) {
					return;
				}
				this.searchStatusText = "正在搜索内容...";
				this.searchResults = this.buildSearchResults(query);
			} catch (error) {
				if (requestId !== this.searchRequestId) {
					return;
				}
				this.searchResults = [];
				this.searchError = "搜索内容加载失败，请稍后重试";
			} finally {
				if (requestId === this.searchRequestId) {
					this.searchLoading = false;
				}
			}
		},
		async ensureSearchMaterials() {
			if (Number(this.searchPreparedNovelId) === Number(this.uid)) {
				return;
			}
			if (this.searchMaterialsPromise) {
				return this.searchMaterialsPromise;
			}

			this.searchMaterialsPromise = this.buildSearchDocuments().finally(() => {
				this.searchMaterialsPromise = null;
			});
			return this.searchMaterialsPromise;
		},
		async buildSearchDocuments() {
			const documentMap = {};
			const searchableArticles = this.getSearchableArticles();
			const total = searchableArticles.length;

			if (total === 0) {
				this.searchDocumentMap = {};
				this.searchPreparedNovelId = Number(this.uid);
				return;
			}

			let loadedCount = 0;
			this.searchStatusText = `正在加载章节内容（0/${total}）...`;

			for (let index = 0; index < searchableArticles.length; index += SEARCH_BATCH_SIZE) {
				const batch = searchableArticles.slice(index, index + SEARCH_BATCH_SIZE);
				const results = await Promise.allSettled(
					batch.map((article) =>
						axios.get(
							this.$baseUrl + "/articles/get_article?id=" + article.article_id + "&isCaching=true",
							{}
						)
					)
				);

				results.forEach((result, resultIndex) => {
					const article = batch[resultIndex];
					let articleDetail = {
						title: article.title || "",
						content: "",
					};

					if (result.status === "fulfilled") {
						const payload = Array.isArray(result.value.data)
							? result.value.data[0]
							: result.value.data;
						if (payload) {
							articleDetail = payload;
						}
					}

					const doc = this.createSearchDocument(article, articleDetail);
					if (doc) {
						documentMap[Number(article.article_id || 0)] = doc;
					}

					loadedCount += 1;
					this.searchStatusText = `正在加载章节内容（${loadedCount}/${total}）...`;
				});
			}

			this.searchDocumentMap = documentMap;
			this.searchPreparedNovelId = Number(this.uid);
		},
		getSearchableArticles() {
			return (this.articles || []).filter((item) => item && item.article_type !== "spliter");
		},
		createSearchDocument(article, articleDetail) {
			const title = String((articleDetail && articleDetail.title) || article.title || "");
			const rawContent = String((articleDetail && articleDetail.content) || "");
			const paragraphs = this.extractSearchParagraphs(article.article_type, rawContent);
			if (!title && paragraphs.length === 0) {
				return null;
			}

			return {
				article,
				articleId: Number(article.article_id || 0),
				articleType: article.article_type,
				articleChapter: Number(article.article_chapter || 0),
				title,
				paragraphs,
				searchTitle: this.normalizeSearchText(title),
				searchParagraphs: paragraphs.map((item) => this.normalizeSearchText(item)),
				searchBody: this.normalizeSearchText(paragraphs.join("\n")),
			};
		},
		extractSearchParagraphs(articleType, content) {
			if (articleType === "worldVocabulary") {
				return this.extractVocabularyParagraphs(content);
			}
			return this.extractTextParagraphs(content);
		},
		extractVocabularyParagraphs(content) {
			if (!content) {
				return [];
			}

			try {
				const parsed = JSON.parse(content);
				if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
					return this.extractTextParagraphs(content);
				}

				const paragraphs = [];
				if (typeof parsed.desc === "string" && parsed.desc.trim()) {
					paragraphs.push(parsed.desc);
				}
				if (Array.isArray(parsed.attributes)) {
					parsed.attributes.forEach((item) => {
						const line = [item && item.name, item && item.content]
							.filter((value) => typeof value === "string" && value.trim())
							.join("：");
						if (line) {
							paragraphs.push(line);
						}
					});
				}
				if (Array.isArray(parsed.relations)) {
					parsed.relations.forEach((item) => {
						const line = [item && item.name, item && item.relation]
							.filter((value) => typeof value === "string" && value.trim())
							.join("：");
						if (line) {
							paragraphs.push(line);
						}
					});
				}
				return this.cleanParagraphs(paragraphs);
			} catch (error) {
				return this.extractTextParagraphs(content);
			}
		},
		extractTextParagraphs(content) {
			if (!content) {
				return [];
			}

			try {
				const parsed = JSON.parse(content);
				if (Array.isArray(parsed)) {
					const paragraphs = [];
					parsed.forEach((block) => {
						if (!block || block.type !== "text" || typeof block.value !== "string") {
							return;
						}
						this.splitTextLines(block.value).forEach((line) => paragraphs.push(line));
					});
					return this.cleanParagraphs(paragraphs);
				}
				if (parsed && typeof parsed === "object") {
					const collected = [];
					this.collectObjectText(parsed, collected);
					return this.cleanParagraphs(collected);
				}
			} catch (error) {}

			return this.cleanParagraphs(this.splitTextLines(content));
		},
		collectObjectText(source, bucket) {
			if (typeof source === "string") {
				this.splitTextLines(source).forEach((line) => bucket.push(line));
				return;
			}
			if (Array.isArray(source)) {
				source.forEach((item) => this.collectObjectText(item, bucket));
				return;
			}
			if (!source || typeof source !== "object") {
				return;
			}

			Object.keys(source).forEach((key) => {
				if (["pic", "img", "image", "cover", "src", "avatar_url"].includes(key)) {
					return;
				}
				this.collectObjectText(source[key], bucket);
			});
		},
		splitTextLines(text) {
			return String(text || "")
				.replace(/\r/g, "")
				.split("\n")
				.map((line) => line.replace(/\s+$/, ""))
				.filter((line) => line.trim().length > 0);
		},
		cleanParagraphs(paragraphs) {
			return (paragraphs || [])
				.map((line) => String(line || "").replace(/\s+$/, ""))
				.filter((line) => line.trim().length > 0);
		},
		normalizeSearchText(text) {
			return String(text || "").toLocaleLowerCase();
		},
		buildSearchKeywords(query) {
			const rawKeywords = String(query || "")
				.trim()
				.split(/\s+/)
				.filter(Boolean)
				.map((item) => item.toLocaleLowerCase());
			return Array.from(new Set(rawKeywords));
		},
		buildSearchResults(query) {
			const keywords = this.buildSearchKeywords(query);
			if (keywords.length === 0) {
				return [];
			}

			const results = [];
			this.getSearchableArticles().forEach((article) => {
				const doc = this.searchDocumentMap[Number(article.article_id || 0)];
				if (!doc) {
					return;
				}
				const result = this.matchSearchDocument(doc, keywords);
				if (result) {
					results.push(result);
				}
			});

			return results.sort((left, right) => {
				if (right.score !== left.score) {
					return right.score - left.score;
				}
				return left.articleChapter - right.articleChapter;
			});
		},
		matchSearchDocument(doc, keywords) {
			const titleHitCount = keywords.filter((keyword) => doc.searchTitle.includes(keyword)).length;
			const allMatched = keywords.every(
				(keyword) => doc.searchTitle.includes(keyword) || doc.searchBody.includes(keyword)
			);
			if (!allMatched) {
				return null;
			}

			const titleHit = titleHitCount > 0;
			const firstParagraphIndex = this.findFirstMatchingParagraphIndex(doc.searchParagraphs, keywords);
			const bodyHit = firstParagraphIndex !== -1;
			if (!titleHit && !bodyHit) {
				return null;
			}

			const previewStartIndex = titleHit && !bodyHit ? 0 : Math.max(firstParagraphIndex, 0);
			const previewParagraphs = doc.paragraphs.length > 0
				? doc.paragraphs.slice(previewStartIndex, previewStartIndex + 3)
				: ["暂无正文内容"];
			const previewText = previewParagraphs.join("\n");

			return {
				resultKey: String(doc.articleId),
				article: doc.article,
				articleId: doc.articleId,
				articleType: doc.articleType,
				articleChapter: doc.articleChapter,
				typeLabel: this.getArticleTypeLabel(doc.articleType),
				chapterLabel: this.getArticleChapterLabel(doc.article),
				volumeLabel: this.getVolumeLabel(doc.article),
				matchLabel: titleHit && bodyHit ? "标题/正文命中" : titleHit ? "标题命中" : "正文命中",
				highlightedTitle: this.highlightText(doc.title || "未命名章节", keywords),
				highlightedPreview: this.highlightText(previewText, keywords),
				score: (titleHit ? 300 : 0) + (bodyHit ? 80 : 0) + titleHitCount * 25 + Math.max(0, 10 - previewStartIndex),
			};
		},
		findFirstMatchingParagraphIndex(paragraphs, keywords) {
			for (let index = 0; index < paragraphs.length; index += 1) {
				const paragraph = paragraphs[index];
				if (keywords.some((keyword) => paragraph.includes(keyword))) {
					return index;
				}
			}
			return -1;
		},
		getArticleTypeLabel(articleType) {
			if (articleType === "worldOutline") {
				return "大纲";
			}
			if (articleType === "worldVocabulary") {
				return "词条";
			}
			if (articleType === "richtext") {
				return "章节";
			}
			return "";
		},
		getArticleChapterLabel(article) {
			const chapter = Number(article && article.article_chapter ? article.article_chapter : 0);
			if (article.article_type === "richtext") {
				return `第${chapter}章`;
			}
			if (article.article_type === "worldOutline") {
				return `大纲 · 序号 ${chapter}`;
			}
			if (article.article_type === "worldVocabulary") {
				return `词条 · 序号 ${chapter}`;
			}
			return `序号 ${chapter}`;
		},
		getVolumeLabel(article) {
			const volumeTitle = String(article && article.volumeTitle ? article.volumeTitle : "");
			if (!volumeTitle || volumeTitle === "正文") {
				return "";
			}
			return volumeTitle;
		},
		escapeHtml(text) {
			return String(text || "")
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
		},
		escapeRegExp(text) {
			return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		},
		highlightText(text, keywords) {
			const source = String(text || "");
			const sortedKeywords = Array.from(new Set((keywords || []).filter(Boolean)))
				.sort((left, right) => right.length - left.length);
			if (sortedKeywords.length === 0) {
				return this.escapeHtml(source);
			}

			const matcher = new RegExp(sortedKeywords.map((item) => this.escapeRegExp(item)).join("|"), "ig");
			let lastIndex = 0;
			let result = "";

			source.replace(matcher, (match, offset) => {
				result += this.escapeHtml(source.slice(lastIndex, offset));
				result += `<mark>${this.escapeHtml(match)}</mark>`;
				lastIndex = offset + match.length;
				return match;
			});

			result += this.escapeHtml(source.slice(lastIndex));
			return result || this.escapeHtml(source);
		},
		openSearchResult(result) {
			if (!result || !result.article) {
				return;
			}

			if (this.$listeners && this.$listeners.change) {
				this.$emit("change", result.article.originalIndex);
				return;
			}

			uni.redirectTo({
				url: this.getReaderUrl(result.articleId),
			});
		},
	},
}
</script>

<style scoped lang="scss">
.outer {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #000a;
	color: #dddddd;
}

.searchPanel {
	padding: 22rpx 24rpx 18rpx;
	background: rgba(10, 10, 10, 0.92);
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	box-sizing: border-box;
	backdrop-filter: blur(12px);
}

.searchMeta {
	min-height: 32rpx;
	margin-top: 10rpx;
	font-size: 22rpx;
	color: #bdbdbd;
}

.articles {
	flex: 1;
	min-height: 0;
	width: 100%;
	overflow-y: auto;
}

.searchResults {
	padding: 16rpx 20rpx 28rpx;
	box-sizing: border-box;
}

.searchResultList {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.searchStateCard,
.searchResultCard {
	background: rgba(255, 255, 255, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.12);
	border-radius: 18rpx;
	padding: 22rpx 24rpx;
	box-sizing: border-box;
}

.searchStateCard {
	font-size: 28rpx;
	line-height: 1.6;
	text-align: center;
	color: #e7e7e7;
}

.searchStateCard i {
	margin-right: 12rpx;
}

.searchStateCard.error {
	color: #ffd6d6;
}

.searchStateCard.empty {
	color: #d4d4d4;
}

.searchResultCard {
	transition: background-color 0.2s ease, transform 0.2s ease;
}

.searchResultCard:active {
	background: rgba(255, 255, 255, 0.12);
	transform: scale(0.995);
}

.searchResultHeader {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16rpx;
}

.searchResultTitle {
	flex: 1;
	font-size: 30rpx;
	line-height: 1.5;
	font-weight: bold;
	color: #ffffff;
	word-break: break-word;
}

.searchResultTags {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 10rpx;
}

.searchResultTag {
	padding: 6rpx 14rpx;
	border-radius: 999rpx;
	font-size: 20rpx;
	line-height: 1;
	background: rgba(255, 255, 255, 0.14);
	color: #f5f5f5;
}

.searchResultTag.richtext {
	background: rgba(204, 154, 83, 0.26);
}

.searchResultTag.worldOutline {
	background: rgba(89, 171, 126, 0.28);
}

.searchResultTag.worldVocabulary {
	background: rgba(102, 149, 230, 0.28);
}

.searchResultMeta {
	margin-top: 10rpx;
	font-size: 23rpx;
	color: #d0c7be;
}

.searchResultParagraph {
	margin-top: 14rpx;
	font-size: 26rpx;
	line-height: 1.8;
	color: #f0f0f0;
	white-space: pre-wrap;
	word-break: break-word;
}

.searchResultTitle ::v-deep mark,
.searchResultParagraph ::v-deep mark {
	padding: 0 4rpx;
	border-radius: 6rpx;
	background: #ffe08a;
	color: #4a3200;
}

.volume-header {
	padding: 20rpx 35rpx;
	background-color: rgba(255, 255, 255, 0.1);
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: #cacaca 1rpx solid;
}

.volume-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #ffffff;
}

.article {
	padding-left: 35rpx;
	border-bottom: #cacaca 1rpx solid;
	background-color: transparent;
}

.article.current {
	background-color: rgba(255, 255, 255, 0.2);
}

.article.current .title {
	color: #ffd700;
	font-weight: bold;
}

.article .title {
	background-color: transparent;
	font-size: 35rpx;
	color: white;
	line-height: 100rpx;
}
</style>
