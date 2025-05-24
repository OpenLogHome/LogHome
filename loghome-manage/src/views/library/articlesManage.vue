<template>
  <div class="outer">
    <div class="block">
        <div class="novel-info" v-if="novel">
            <div class="title-container">
                <el-page-header @back="goBack" :content="novel.name"></el-page-header>
                <h2>文章管理 - {{ novel.name }}</h2>
                <p class="subtitle">作者: {{ novel.author_name }}</p>
            </div>
        </div>

        <el-table
            :data="articlesList"
            style="width: 100%"
            border>
            <el-table-column
                prop="article_id"
                label="ID"
                width="80">
            </el-table-column>
            <el-table-column
                prop="article_chapter"
                label="章节"
                width="80">
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题"
                width="250">
            </el-table-column>
            <el-table-column
                prop="article_type"
                label="类型"
                width="120">
                <template slot-scope="scope">
                    <el-tag :type="getArticleTypeTag(scope.row.article_type)">
                        {{ getArticleTypeLabel(scope.row.article_type) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="is_draft"
                label="状态"
                width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.is_draft === 0 ? 'success' : 'warning'">
                        {{ scope.row.is_draft === 0 ? '已发布' : '草稿' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="update_time"
                label="更新时间"
                width="180">
                <template slot-scope="scope">
                    <span>{{ formatDate(scope.row.update_time) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button 
                        type="primary" 
                        size="small" 
                        @click="viewArticle(scope.row)">
                        查看
                    </el-button>
                    <el-button 
                        type="success" 
                        size="small" 
                        @click="editArticle(scope.row)">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <div class="pagination-container">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
    </div>

    <!-- 文章详情对话框 -->
    <el-dialog
        :title="selectedArticle ? selectedArticle.title : '文章详情'"
        :visible.sync="detailDialogVisible"
        width="70%">
        <div v-if="selectedArticle" class="article-detail">
            <div class="article-info">
                <p><strong>章节：</strong>{{ selectedArticle.article_chapter }}</p>
                <p><strong>类型：</strong>{{ getArticleTypeLabel(selectedArticle.article_type) }}</p>
                <p><strong>状态：</strong>{{ selectedArticle.is_draft === 0 ? '已发布' : '草稿' }}</p>
                <p><strong>更新时间：</strong>{{ formatDate(selectedArticle.update_time) }}</p>
            </div>
            <!-- 纯文本内容 -->
            <div class="article-content" v-if="selectedArticle.article_type === 'text'">
                <strong>内容：</strong>
                <div class="content-box">
                    <p>{{ selectedArticle.content }}</p>
                </div>
            </div>
            <!-- 富文本内容 -->
            <div class="article-content" v-else-if="selectedArticle.article_type === 'richtext'">
                <strong>内容：</strong>
                <div class="content-box richtext-content">
                    <div v-for="(block, index) in parseRichTextContent(selectedArticle.content)" :key="index">
                        <!-- 文本块 -->
                        <p v-if="block.type === 'text'" class="richtext-text">{{ block.value }}</p>
                        <!-- 图片块 -->
                        <div v-else-if="block.type === 'image'" class="richtext-img">
                            <el-image 
                                :src="block.img" 
                                fit="contain"
                                style="max-width: 100%; margin-bottom: 10px;">
                                <div slot="error" class="image-error">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 图片内容 -->
            <div class="article-content" v-else>
                <strong>暂不支持此类型的查看</strong>
            </div>
        </div>
    </el-dialog>

    <!-- 文章编辑对话框 -->
    <el-dialog
        :title="editingArticle.article_id ? '编辑文章' : '新增文章'"
        :visible.sync="editDialogVisible"
        width="70%">
        <el-form :model="editingArticle" label-width="100px">
            <el-form-item label="标题">
                <el-input v-model="editingArticle.title"></el-input>
            </el-form-item>
            <el-form-item label="章节">
                <el-input-number v-model="editingArticle.article_chapter" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="editingArticle.is_draft">
                    <el-radio :label="0">已发布</el-radio>
                    <el-radio :label="1">草稿</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 纯文本编辑器 -->
            <el-form-item label="内容" v-if="editingArticle.article_type === 'text'">
                <el-input
                    type="textarea"
                    :rows="15"
                    placeholder="请输入内容"
                    v-model="editingArticle.content">
                </el-input>
            </el-form-item>
            <!-- 富文本编辑器 -->
            <el-form-item label="内容" v-else-if="editingArticle.article_type === 'richtext'">
                <div class="richtext-editor">
                    <div class="editor-toolbar">
                        <el-button type="primary" size="small" @click="showAddBlockMenu = true">
                            <i class="el-icon-plus"></i> 添加内容块
                        </el-button>
                        
                        <!-- 添加块浮动菜单 -->
                        <div v-if="showAddBlockMenu" class="add-block-menu">
                            <div class="menu-title">在何处添加?</div>
                            <div class="menu-actions">
                                <el-button type="text" @click="addBlockPosition = 'start'; showAddBlockTypeMenu = true; showAddBlockMenu = false">
                                    在开头
                                </el-button>
                                <el-button type="text" @click="addBlockPosition = 'end'; showAddBlockTypeMenu = true; showAddBlockMenu = false">
                                    在末尾
                                </el-button>
                                <template v-if="richTextBlocks.length > 0">
                                    <el-button type="text" @click="showBlockPositionMenu = true; showAddBlockMenu = false">
                                        在指定位置
                                    </el-button>
                                </template>
                                <el-button type="text" @click="showAddBlockMenu = false">取消</el-button>
                            </div>
                        </div>
                        
                        <!-- 选择块类型菜单 -->
                        <div v-if="showAddBlockTypeMenu" class="add-block-menu">
                            <div class="menu-title">添加什么类型的块?</div>
                            <div class="menu-actions">
                                <el-button type="text" @click="addTextBlockAt(addBlockPosition === 'start' ? 0 : richTextBlocks.length)">
                                    <i class="el-icon-document"></i> 文本
                                </el-button>
                                <el-button type="text" @click="addImageBlockAt(addBlockPosition === 'start' ? 0 : richTextBlocks.length)">
                                    <i class="el-icon-picture-outline"></i> 图片
                                </el-button>
                                <el-button type="text" @click="showAddBlockTypeMenu = false">取消</el-button>
                            </div>
                        </div>
                        
                        <!-- 选择插入位置菜单 -->
                        <div v-if="showBlockPositionMenu" class="add-block-menu position-menu">
                            <div class="menu-title">选择插入位置</div>
                            <div class="position-list">
                                <div 
                                    v-for="(block, index) in richTextBlocks" 
                                    :key="block.id"
                                    class="position-item"
                                    @click="selectInsertPosition(index)">
                                    <div class="position-index">{{ index + 1 }}</div>
                                    <div class="position-content">
                                        <span v-if="block.type === 'text'">
                                            {{ truncateText(block.value, 20) }}
                                        </span>
                                        <span v-else-if="block.type === 'image'">
                                            [图片]
                                        </span>
                                    </div>
                                </div>
                                <div 
                                    class="position-item"
                                    @click="selectInsertPosition(richTextBlocks.length)">
                                    <div class="position-index">{{ richTextBlocks.length + 1 }}</div>
                                    <div class="position-content">末尾</div>
                                </div>
                            </div>
                            <div class="menu-actions">
                                <el-button type="text" @click="showBlockPositionMenu = false">取消</el-button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="blocks-container">
                        <div v-for="(block, index) in richTextBlocks" :key="block.id" class="richtext-block">
                            <div class="block-header">
                                <span class="block-type">{{ block.type === 'text' ? '文本' : '图片' }} #{{ index + 1 }}</span>
                                <div class="block-actions">
                                    <el-button 
                                        type="text" 
                                        icon="el-icon-arrow-up" 
                                        :disabled="index === 0"
                                        @click="moveBlockUp(index)">
                                    </el-button>
                                    <el-button 
                                        type="text" 
                                        icon="el-icon-arrow-down" 
                                        :disabled="index === richTextBlocks.length - 1"
                                        @click="moveBlockDown(index)">
                                    </el-button>
                                    <el-button 
                                        type="text" 
                                        icon="el-icon-plus"
                                        @click="addBlockAfter(index)">
                                    </el-button>
                                    <el-button 
                                        type="text" 
                                        icon="el-icon-delete" 
                                        @click="removeBlock(index)">
                                    </el-button>
                                </div>
                            </div>
                            
                            <!-- 文本块编辑 -->
                            <div v-if="block.type === 'text'" class="text-block-editor">
                                <el-input 
                                    type="textarea" 
                                    autosize
                                    placeholder="请输入文本内容" 
                                    v-model="block.value">
                                </el-input>
                            </div>
                            
                            <!-- 图片块编辑 -->
                            <div v-else-if="block.type === 'image'" class="image-block-editor">
                                <el-row :gutter="10">
                                    <el-col :span="block.img ? 16 : 24">
                                        <el-input 
                                            placeholder="图片URL" 
                                            v-model="block.img">
                                        </el-input>
                                    </el-col>
                                    <el-col :span="8" v-if="block.img">
                                        <el-button type="danger" size="small" @click="block.img = ''">清除</el-button>
                                    </el-col>
                                </el-row>
                                
                                <!-- 图片上传 -->
                                <div class="image-upload-container">
                                    <el-upload
                                        ref="imageUpload"
                                        action="http://img.codesocean.top/upload/img"
                                        :file-list="[]"
                                        :show-file-list="false"
                                        :headers="{'apikey': 'iSnMUQ9OLZpCVY3p7E3T5b2YwC39TS'}"
                                        :before-upload="validateImageUpload"
                                        :on-success="(res) => handleImageUploadSuccess(res, block)"
                                        :on-error="handleImageUploadError"
                                        name="img"
                                        list-type="picture-card"
                                        accept="image/*">
                                        <i class="el-icon-plus"></i>
                                        <div slot="tip" class="el-upload__tip">点击上传图片，只能上传不超过5MB的图片文件</div>
                                    </el-upload>
                                </div>
                                
                                <!-- 图片预览 -->
                                <div class="image-preview" v-if="block.img">
                                    <el-image 
                                        :src="block.img" 
                                        fit="contain"
                                        style="max-width: 100%; height: 200px; margin-top: 10px;">
                                        <div slot="error" class="image-error">
                                            <i class="el-icon-picture-outline"></i>
                                        </div>
                                    </el-image>
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="richTextBlocks.length === 0" class="empty-blocks">
                            <p>还没有内容块，请点击上方按钮添加</p>
                        </div>
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveArticle">保 存</el-button>
        </span>
    </el-dialog>
    
    <!-- 选择块类型对话框(指定位置) - 居中显示 -->
    <el-dialog
        :visible.sync="showInsertTypeMenu"
        width="300px"
        :show-close="false"
        center
        custom-class="insert-type-dialog"
        :append-to-body="true">
        <div class="menu-title text-center">
            在位置 {{ selectedPosition + 1 }} 添加什么类型的块?
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addTextBlockAt(selectedPosition)">
                <i class="el-icon-document"></i> 文本
            </el-button>
            <el-button type="success" @click="addImageBlockAt(selectedPosition)">
                <i class="el-icon-picture-outline"></i> 图片
            </el-button>
            <el-button @click="showInsertTypeMenu = false">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            novel: null,
            articlesList: [],
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            detailDialogVisible: false,
            editDialogVisible: false,
            selectedArticle: null,
            editingArticle: {
                article_id: null,
                title: '',
                article_chapter: 1,
                is_draft: 0,
                article_type: 'text',
                content: ''
            },
            richTextBlocks: [],
            // 富文本编辑器添加块的状态
            showAddBlockMenu: false,
            showAddBlockTypeMenu: false,
            showBlockPositionMenu: false,
            showInsertTypeMenu: false,
            addBlockPosition: 'end',
            selectedPosition: 0,
            articleTypes: {
                'text': { label: '纯文本', type: 'primary' },
                'richtext': { label: '富文本', type: 'warning' },
                'image': { label: '图片', type: 'success' }
            }
        }
    },
    created() {
        this.novelId = this.$route.params.novelId;
        this.fetchNovelInfo();
        this.fetchArticles();
    },
    methods: {
        goBack() {
            this.$router.push('/novelsManage');
        },
        fetchNovelInfo() {
            this.axios.get(this.$baseUrl + '/manage/library/get_novel_detail', {
                params: { novel_id: this.novelId }
            })
                .then(res => {
                    this.novel = res.data.novel;
                })
                .catch(error => {
                    this.$message({
                        showClose: true,
                        message: '获取小说信息失败',
                        type: 'error'
                    });
                    console.error(error);
                });
        },
        fetchArticles() {
            const params = {
                novel_id: this.novelId,
                page: this.pagination.page,
                pageSize: this.pagination.pageSize
            };
            
            this.axios.get(this.$baseUrl + '/manage/library/get_novel_articles', { params })
                .then(res => {
                    this.articlesList = res.data.data;
                    this.pagination.total = res.data.pagination.total;
                })
                .catch(error => {
                    this.$message({
                        showClose: true,
                        message: '获取文章列表失败',
                        type: 'error'
                    });
                    console.error(error);
                });
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.fetchArticles();
        },
        handleCurrentChange(val) {
            this.pagination.page = val;
            this.fetchArticles();
        },
        formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return date.toLocaleString();
        },
        viewArticle(article) {
            this.selectedArticle = article;
            this.detailDialogVisible = true;
        },
        editArticle(article) {
            this.axios.get(this.$baseUrl + '/manage/library/get_article_detail', {
                params: { article_id: article.article_id }
            })
                .then(res => {
                    this.editingArticle = { ...res.data };
                    if (this.editingArticle.article_type === 'richtext') {
                        this.initRichTextEditor();
                    }
                    this.editDialogVisible = true;
                })
                .catch(error => {
                    this.$message({
                        showClose: true,
                        message: '获取文章详情失败',
                        type: 'error'
                    });
                    console.error(error);
                });
        },
        saveArticle() {
            if (this.editingArticle.article_type === 'richtext') {
                this.editingArticle.content = JSON.stringify(this.richTextBlocks);
            }
            
            this.axios.post(this.$baseUrl + '/manage/library/update_article', this.editingArticle)
                .then(res => {
                    this.$message({
                        showClose: true,
                        message: '更新文章成功',
                        type: 'success'
                    });
                    this.editDialogVisible = false;
                    this.fetchArticles();
                })
                .catch(error => {
                    this.$message({
                        showClose: true,
                        message: '更新文章失败',
                        type: 'error'
                    });
                    console.error(error);
                });
        },
        parseImageContent(content) {
            if (!content) return [];
            try {
                const images = JSON.parse(content);
                if (Array.isArray(images)) {
                    return images.filter(item => item.type === 'image').map(item => item.img);
                } else {
                    return [content];
                }
            } catch (e) {
                return [content];
            }
        },
        parseRichTextContent(content) {
            if (!content) return [];
            try {
                const blocks = JSON.parse(content);
                if (Array.isArray(blocks)) {
                    return blocks;
                }
                return [];
            } catch (e) {
                console.error('富文本解析失败:', e);
                return [];
            }
        },
        getArticleTypeLabel(type) {
            return this.articleTypes[type]?.label || type;
        },
        getArticleTypeTag(type) {
            return this.articleTypes[type]?.type || 'info';
        },
        initRichTextEditor() {
            try {
                if (this.editingArticle.content) {
                    const blocks = JSON.parse(this.editingArticle.content);
                    if (Array.isArray(blocks)) {
                        // 确保每个块都有唯一ID
                        this.richTextBlocks = blocks.map(block => {
                            if (!block.id) {
                                block.id = this.generateBlockId();
                            }
                            return block;
                        });
                    } else {
                        this.richTextBlocks = [];
                    }
                } else {
                    this.richTextBlocks = [];
                }
            } catch (e) {
                console.error('初始化富文本编辑器失败:', e);
                this.richTextBlocks = [];
            }
        },
        generateBlockId() {
            return Date.now() + Math.floor(Math.random() * 1000);
        },
        addTextBlockAt(position) {
            const newBlock = {
                type: 'text',
                value: '',
                id: this.generateBlockId()
            };
            this.insertBlockAt(newBlock, position);
            this.showAddBlockTypeMenu = false;
            this.showInsertTypeMenu = false;
        },
        addImageBlockAt(position) {
            const newBlock = {
                type: 'image',
                img: '',
                id: this.generateBlockId()
            };
            this.insertBlockAt(newBlock, position);
            this.showAddBlockTypeMenu = false;
            this.showInsertTypeMenu = false;
        },
        insertBlockAt(block, position) {
            if (position === 0) {
                // 在开头插入
                this.richTextBlocks.unshift(block);
            } else if (position >= this.richTextBlocks.length) {
                // 在末尾插入
                this.richTextBlocks.push(block);
            } else {
                // 在中间插入
                this.richTextBlocks.splice(position, 0, block);
            }
        },
        selectInsertPosition(index) {
            this.selectedPosition = index;
            this.showBlockPositionMenu = false;
            this.showInsertTypeMenu = true;
        },
        addBlockAfter(index) {
            this.selectedPosition = index + 1;
            this.showInsertTypeMenu = true;
        },
        removeBlock(index) {
            this.$confirm('确定要删除这个内容块吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.richTextBlocks.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {});
        },
        moveBlockUp(index) {
            if (index > 0) {
                const temp = this.richTextBlocks[index];
                this.$set(this.richTextBlocks, index, this.richTextBlocks[index - 1]);
                this.$set(this.richTextBlocks, index - 1, temp);
            }
        },
        moveBlockDown(index) {
            if (index < this.richTextBlocks.length - 1) {
                const temp = this.richTextBlocks[index];
                this.$set(this.richTextBlocks, index, this.richTextBlocks[index + 1]);
                this.$set(this.richTextBlocks, index + 1, temp);
            }
        },
        validateImageUpload(file) {
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.$message.error('上传图片大小不能超过 5MB!');
                return false;
            }
            const isImage = /^image\//.test(file.type);
            if (!isImage) {
                this.$message.error('只能上传图片文件!');
                return false;
            }
            return true;
        },
        handleImageUploadSuccess(response, block) {
            console.log('图片上传成功:', response);
            if (response && response.url) {
                block.img = response.url;
                this.$message.success('图片上传成功');
            } else {
                this.$message.error('图片上传返回格式错误');
            }
        },
        handleImageUploadError(err) {
            console.error('图片上传失败:', err);
            this.$message.error('图片上传失败，请重试');
        },
        truncateText(text, length) {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
        }
    }
}
</script>

<style lang="scss" scoped>
.outer {
    padding: 20px;
    height: 93vh;
    overflow-y: auto;
}
.block {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.novel-info {
    margin-bottom: 20px;
}
.title-container {
    margin-bottom: 20px;
    h2 {
        margin-top: 20px;
        margin-bottom: 5px;
    }
    .subtitle {
        color: #666;
        margin-top: 0;
    }
}
.pagination-container {
    margin-top: 20px;
    text-align: right;
}
.article-detail {
    padding: 10px;
}
.article-info {
    margin-bottom: 20px;
}
.article-content {
    .content-box {
        margin-top: 10px;
        padding: 15px;
        border: 1px solid #eee;
        border-radius: 5px;
        background-color: #fafafa;
        max-height: 400px;
        overflow-y: auto;
        white-space: pre-wrap;
        
        &.richtext-content {
            white-space: normal;
            
            .richtext-text {
                margin: 8px 0;
                line-height: 1.6;
                text-indent: 2em;
            }
            
            .richtext-img {
                margin: 15px 0;
                text-align: center;
            }
        }
    }
}
.image-container {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.image-error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #f5f7fa;
    color: #909399;
    font-size: 30px;
}
.richtext-editor {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    background-color: #f8f9fa;
    
    .editor-toolbar {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ebeef5;
        display: flex;
        gap: 10px;
        position: relative;
        
        .add-block-menu {
            position: absolute;
            top: 40px;
            left: 0;
            background-color: white;
            border: 1px solid #ebeef5;
            border-radius: 4px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding: 10px;
            width: 220px;
            z-index: 100;
            
            &.position-menu {
                width: 250px;
            }
            
            .menu-title {
                font-weight: bold;
                margin-bottom: 10px;
                font-size: 14px;
                color: #606266;
            }
            
            .menu-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            
            .position-list {
                max-height: 200px;
                overflow-y: auto;
                margin-bottom: 10px;
                
                .position-item {
                    display: flex;
                    padding: 8px;
                    cursor: pointer;
                    border-radius: 4px;
                    
                    &:hover {
                        background-color: #f0f2f5;
                    }
                    
                    .position-index {
                        font-weight: bold;
                        margin-right: 10px;
                        color: #606266;
                    }
                    
                    .position-content {
                        flex: 1;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
    
    .blocks-container {
        .richtext-block {
            margin-bottom: 15px;
            background-color: white;
            border: 1px solid #ebeef5;
            border-radius: 4px;
            overflow: hidden;
            
            .block-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background-color: #f0f2f5;
                border-bottom: 1px solid #ebeef5;
                
                .block-type {
                    font-weight: bold;
                    font-size: 14px;
                    color: #606266;
                }
                
                .block-actions {
                    display: flex;
                    gap: 5px;
                }
            }
            
            .text-block-editor,
            .image-block-editor {
                padding: 10px;
            }
            
            .image-block-editor {
                .image-upload-container {
                    margin-top: 10px;
                }
                
                .image-preview {
                    margin-top: 10px;
                    border: 1px dashed #dcdfe6;
                    padding: 10px;
                    border-radius: 4px;
                    background-color: #f8f9fa;
                    text-align: center;
                }
                
                .el-upload--picture-card {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    background-color: transparent;
                    border: 1px dashed #d9d9d9;
                    margin: 0;
                }
                
                .el-upload__tip {
                    text-align: center;
                    margin-top: 10px;
                    color: #909399;
                }
            }
        }
        
        .empty-blocks {
            text-align: center;
            padding: 20px;
            color: #909399;
            background-color: white;
            border: 1px dashed #dcdfe6;
            border-radius: 4px;
        }
    }
}

// 居中对话框相关样式
.text-center {
    text-align: center;
}

.insert-type-dialog {
    .menu-title {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 20px;
        color: #606266;
    }
    
    .dialog-footer {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
    }
}
</style>