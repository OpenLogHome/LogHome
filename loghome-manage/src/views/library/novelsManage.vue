<template>
  <div class="outer">
    <div class="block">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
            <el-form-item label="关键词搜索">
                <el-input v-model="filterForm.keyword" placeholder="小说名称/内容" @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label="作者搜索">
                <el-input v-model="filterForm.authorName" placeholder="作者名称" @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleFilter">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table
            :data="novelsList"
            style="width: 100%"
            border>
            <el-table-column
                prop="novel_id"
                label="ID"
                width="80">
            </el-table-column>
            <el-table-column
                label="封面"
                width="120">
                <template slot-scope="scope">
                    <el-image
                        style="width: 80px; height: 100px"
                        :src="scope.row.picUrl || defaultCoverUrl"
                        fit="cover"
                        :onerror="`this.onerror=null;this.src='${defaultCoverUrl}'`">
                        <div slot="error" class="image-error">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="小说名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="author_name"
                label="作者"
                width="120">
            </el-table-column>
            <el-table-column
                prop="content"
                label="简介"
                min-width="250">
                <template slot-scope="scope">
                    <div class="novel-desc">{{ scope.row.content }}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="update_time"
                label="更新时间"
                width="180">
                <template slot-scope="scope">
                    <span>{{ formatDate(scope.row.update_time || scope.row.create_time) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间"
                width="180">
                <template slot-scope="scope">
                    <span>{{ formatDate(scope.row.create_time) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button 
                        type="primary" 
                        size="small" 
                        @click="viewNovelDetail(scope.row)">
                        详情
                    </el-button>
                    <el-button 
                        type="success" 
                        size="small" 
                        @click="manageArticles(scope.row)">
                        文章管理
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

    <!-- 小说详情对话框 -->
    <el-dialog
        title="小说详情"
        :visible.sync="detailDialogVisible"
        width="60%">
        <div v-if="selectedNovel" class="novel-detail">
            <div class="novel-header">
                <el-image
                    class="novel-cover"
                    :src="selectedNovel.picUrl || defaultCoverUrl"
                    fit="cover"
                    :onerror="`this.onerror=null;this.src='${defaultCoverUrl}'`">
                    <div slot="error" class="image-error">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
                <div class="novel-info">
                    <h2>
                        {{ selectedNovel.name }}
                        <el-tag v-if="selectedNovel.novel_type === 'world'" type="warning" size="mini">世界书</el-tag>
                    </h2>
                    <p><strong>作者：</strong>{{ selectedNovel.author_name }}</p>
                    <p><strong>文章数：</strong>{{ novelDetail.articlesCount || 0 }}</p>
                    <p><strong>创建时间：</strong>{{ formatDate(selectedNovel.create_time) }}</p>
                    <p><strong>更新时间：</strong>{{ formatDate(selectedNovel.update_time || selectedNovel.create_time) }}</p>
                    <p><strong>阅读量：</strong>{{ selectedNovel.view_count || 0 }}</p>
                    <div class="tags-container" v-if="novelDetail.tags && novelDetail.tags.length">
                        <strong>标签：</strong>
                        <el-tag 
                            v-for="tag in novelDetail.tags" 
                            :key="tag.tag_id"
                            type="success"
                            size="small"
                            style="margin-right: 5px">
                            {{ tag.tag_name }}
                        </el-tag>
                    </div>
                </div>
            </div>
            <div class="novel-content">
                <strong>简介：</strong>
                <p>{{ selectedNovel.content }}</p>
            </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            novelsList: [],
            filterForm: {
                keyword: '',
                authorName: ''
            },
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            detailDialogVisible: false,
            selectedNovel: null,
            novelDetail: {
                tags: [],
                articlesCount: 0
            },
            defaultCoverUrl: 'https://img.codesocean.top/img/DefaultCover.jpg' // 默认封面URL
        }
    },
    mounted() {
        this.fetchNovels();
    },
    methods: {
        fetchNovels() {
            const params = {
                page: this.pagination.page,
                pageSize: this.pagination.pageSize,
                keyword: this.filterForm.keyword || undefined,
                authorName: this.filterForm.authorName || undefined
            };
            
            this.axios.get(this.$baseUrl + '/manage/library/get_all_novels', { params })
                .then(res => {
                    // 处理数据，为没有封面的小说添加默认封面
                    this.novelsList = res.data.data.map(novel => {
                        if (!novel.picUrl) {
                            novel.picUrl = this.defaultCoverUrl;
                        }
                        return novel;
                    });
                    this.pagination.total = res.data.pagination.total;
                })
                .catch(error => {
                    this.$message({
                        showClose: true,
                        message: '获取小说列表失败',
                        type: 'error'
                    });
                    console.error(error);
                });
        },
        handleFilter() {
            this.pagination.page = 1;
            this.fetchNovels();
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.fetchNovels();
        },
        handleCurrentChange(val) {
            this.pagination.page = val;
            this.fetchNovels();
        },
        formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return date.toLocaleString();
        },
        viewNovelDetail(novel) {
            // 先设置基本信息，包括默认封面
            this.selectedNovel = novel;
            if (!this.selectedNovel.picUrl) {
                this.selectedNovel.picUrl = this.defaultCoverUrl;
            }
            this.detailDialogVisible = true;
            
            // 获取小说详细信息
            this.axios.get(this.$baseUrl + '/manage/library/get_novel_detail', {
                params: { novel_id: novel.novel_id }
            })
                .then(res => {
                    this.novelDetail = res.data;
                    // 确保详情中的小说也有封面
                    if (res.data.novel && !res.data.novel.picUrl) {
                        res.data.novel.picUrl = this.defaultCoverUrl;
                    }
                })
                .catch(error => {
                    this.$message({
                        showClose: true,
                        message: '获取小说详情失败',
                        type: 'error'
                    });
                    console.error(error);
                });
        },
        manageArticles(novel) {
            this.$router.push(`/articlesManage/${novel.novel_id}`);
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
    width: calc(100% - 300px);
}
.pagination-container {
    margin-top: 20px;
    text-align: right;
}
.novel-desc {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
}
.novel-detail {
    padding: 10px;
}
.novel-header {
    display: flex;
    margin-bottom: 20px;
}
.novel-cover {
    width: 150px;
    height: 200px;
    margin-right: 20px;
}
.novel-info {
    flex: 1;
    h2 {
        margin-top: 0;
    }
}
.novel-content {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}
.tags-container {
    margin-top: 10px;
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
</style> 