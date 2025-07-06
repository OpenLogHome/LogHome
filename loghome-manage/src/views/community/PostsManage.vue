<template>
  <div class="posts-manage">
    <div class="header">
      <h2>帖子管理</h2>
      <div class="search-box">
        <el-button type="primary" @click="handleCreate" style="margin-right: 15px;">创建帖子</el-button>
        <el-input
          placeholder="请输入帖子标题或内容"
          v-model="searchKeyword"
          class="search-input"
          clearable
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-select v-model="statusFilter" placeholder="状态筛选" @change="handleSearch">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="待审核" :value="0"></el-option>
          <el-option label="已通过" :value="1"></el-option>
          <el-option label="已拒绝" :value="2"></el-option>
          <el-option label="已删除" :value="3"></el-option>
        </el-select>
        <el-select v-model="circleFilter" placeholder="圈子筛选" filterable clearable @change="handleSearch" v-if="circles.length > 0">
          <el-option
            v-for="item in circles"
            :key="item.circle_id"
            :label="item.name"
            :value="item.circle_id"
          ></el-option>
        </el-select>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">帖子总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.today }}</div>
            <div class="stat-label">今日新增</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">待审核</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.reported }}</div>
            <div class="stat-label">被举报</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 帖子列表 -->
    <el-table
      :data="posts"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column
        prop="post_id"
        label="ID"
        width="80"
      ></el-table-column>
      <el-table-column label="帖子信息" min-width="300">
        <template slot-scope="scope">
          <div class="post-info">
            <div class="post-title">{{ scope.row.title }}</div>
            <div class="post-content">{{ scope.row.content }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150">
        <template slot-scope="scope">
          <div class="author-info">
            <img :src="scope.row.author_avatar" class="author-avatar" fit="cover" style="width: 30px; height: 30px; border-radius: 50%;">
            <span class="author-name">{{ scope.row.author_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="circle_name"
        label="所属圈子"
        width="150"
      ></el-table-column>
      <el-table-column label="互动" width="150">
        <template slot-scope="scope">
          <div class="interaction-info">
            <span><i class="el-icon-chat-line-square"></i> {{ scope.row.comment_count || 0 }}</span>
            <span><i class="el-icon-star-on"></i> {{ scope.row.like_count || 0 }}</span>
            <span><i class="el-icon-view"></i> {{ scope.row.view_count || 0 }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="发布时间"
        width="180"
      >
        <template slot-scope="scope">
          {{ formatDate(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleDetail(scope.row)"
            type="primary"
            plain
          >查看</el-button>
          <el-button
            size="mini"
            @click="handleAudit(scope.row)"
            type="success"
            plain
            v-if="scope.row.status === 0"
          >审核</el-button>
          <el-button
            size="mini"
            @click="handleDelete(scope.row)"
            type="danger"
            plain
            v-if="scope.row.status !== 3"
          >删除</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            type="warning"
            plain
            v-if="scope.row.status !== 3"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 审核弹窗 -->
    <el-dialog
      title="帖子审核"
      :visible.sync="auditDialogVisible"
      width="600px"
    >
      <div class="audit-dialog-content">
        <div class="post-info-dialog">
          <h3>{{ currentPost.title }}</h3>
          <div class="post-meta">
            <span>作者：{{ currentPost.author_name }}</span>
            <span>圈子：{{ currentPost.circle_name }}</span>
            <span>发布时间：{{ formatDate(currentPost.create_time) }}</span>
          </div>
          <div class="post-content-dialog">{{ currentPost.content }}</div>
          <div class="post-images" v-if="currentPost.media_urls && currentPost.media_urls.length > 0">
            <div class="image-grid" :class="'grid-' + (currentPost.media_urls.length > 3 ? 'multi' : currentPost.media_urls.length)">
              <el-image
                v-for="(url, index) in currentPost.media_urls"
                :key="index"
                :src="url"
                :preview-src-list="currentPost.media_urls"
                fit="cover"
                class="post-image"
              ></el-image>
            </div>
          </div>
        </div>
        <el-form :model="auditForm" label-width="80px" class="audit-form">
          <el-form-item label="审核结果">
            <el-radio-group v-model="auditForm.status">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核理由" v-if="auditForm.status === 2">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入拒绝理由"
              v-model="auditForm.reason"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit" :loading="auditSubmitting">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除弹窗 -->
    <el-dialog
      title="删除帖子"
      :visible.sync="deleteDialogVisible"
      width="500px"
    >
      <div class="delete-dialog-content">
        <p>确定要删除帖子 "{{ currentPost.title }}" 吗？</p>
        <el-form :model="deleteForm" label-width="80px" class="delete-form">
          <el-form-item label="删除理由">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入删除理由"
              v-model="deleteForm.reason"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="submitDelete" :loading="deleteSubmitting">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      title="帖子详情"
      :visible.sync="detailDialogVisible"
      width="800px"
    >
      <div class="detail-dialog-content" v-loading="detailLoading">
        <div class="post-header">
          <h2>{{ postDetail.title }}</h2>
          <div class="post-meta-detail">
            <el-avatar :size="40" :src="postDetail.author_avatar"></el-avatar>
            <div class="post-meta-info">
              <div class="author-name">{{ postDetail.author_name }}</div>
              <div class="post-time">{{ formatDate(postDetail.create_time) }}</div>
            </div>
            <el-tag :type="getStatusType(postDetail.status)" class="post-status">{{ getStatusText(postDetail.status) }}</el-tag>
          </div>
        </div>
        <div class="post-content-detail">{{ postDetail.content }}</div>
        <div class="post-images-detail" v-if="postDetail.media_urls && postDetail.media_urls.length > 0">
          <div class="image-grid" :class="'grid-' + (postDetail.media_urls.length > 3 ? 'multi' : postDetail.media_urls.length)">
            <el-image
              v-for="(url, index) in postDetail.media_urls"
              :key="index"
              :src="url"
              :preview-src-list="postDetail.media_urls"
              fit="cover"
              class="post-image-detail"
              @click="previewImage(postDetail.media_urls, index)"
            ></el-image>
          </div>
        </div>
        <el-divider content-position="left">评论 ({{ postDetail.comments ? postDetail.comments.length : 0 }})</el-divider>
        <div class="comments-section" v-if="postDetail.comments && postDetail.comments.length > 0">
          <div class="comment-item" v-for="(comment, index) in postDetail.comments" :key="index">
            <div class="comment-header">
              <el-avatar :size="30" :src="comment.author_avatar"></el-avatar>
              <div class="comment-meta">
                <div class="comment-author">{{ comment.author_name }}</div>
                <div class="comment-time">{{ formatDate(comment.create_time) }}</div>
              </div>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
        </div>
        <div class="no-comments" v-else>
          暂无评论
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 创建/编辑帖子弹窗 -->
    <el-dialog
      :title="currentPost.post_id ? '编辑帖子' : '创建帖子'"
      :visible.sync="createDialogVisible"
      width="600px"
    >
      <div class="create-dialog-content">
        <el-form :model="createForm" :rules="createRules" ref="createForm" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="createForm.title" placeholder="请输入帖子标题"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" v-model="createForm.content" :rows="6" placeholder="请输入帖子内容"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="user_id">
            <el-select
              v-model="createForm.user_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入用户名或ID搜索"
              :remote-method="remoteSearchUsers"
              :loading="userSearchLoading"
              :disabled="!!currentPost.post_id"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.user_id"
                :label="item.name"
                :value="item.user_id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">ID: {{ item.user_id }}</span>
              </el-option>
            </el-select>
            <div class="el-form-item__description" v-if="currentPost.post_id">编辑模式下不可修改作者</div>
          </el-form-item>
          <el-form-item label="所属圈子" prop="circle_id">
            <el-select
              v-model="createForm.circle_id"
              filterable
              placeholder="请选择圈子"
              :disabled="!!$route.query.circle_id || !!currentPost.post_id"
            >
              <el-option
                v-for="item in circles"
                :key="item.circle_id"
                :label="item.name"
                :value="item.circle_id"
              ></el-option>
            </el-select>
            <div class="el-form-item__description" v-if="currentPost.post_id">编辑模式下不可修改圈子</div>
          </el-form-item>
          <el-form-item label="图片" prop="media_urls">
            <div class="image-upload-list">
              <div 
                v-for="(url, index) in createForm.media_urls" 
                :key="index" 
                class="image-item"
              >
                <img :src="url" class="preview-image" />
                <div class="image-actions">
                  <i class="el-icon-delete" @click="handleImageRemove(index)"></i>
                </div>
              </div>
              <div class="image-upload-btn" @click="handleUploadImage">
                <i class="el-icon-plus"></i>
              </div>
            </div>
            <div class="el-upload__tip">可上传多张图片，每张大小不超过5MB</div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCreate" :loading="createSubmitting">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'PostsManage',
  data() {
    return {
      // 搜索和筛选
      searchKeyword: '',
      statusFilter: -1,
      circleFilter: '',
      
      // 分页
      currentPage: 1,
      pageSize: 20,
      total: 0,
      
      // 数据
      posts: [],
      circles: [],
      loading: false,
      stats: {
        total: 0,
        today: 0,
        pending: 0,
        reported: 0
      },
      
      // 审核弹窗
      auditDialogVisible: false,
      currentPost: {},
      auditForm: {
        status: 1,
        reason: ''
      },
      auditSubmitting: false,
      
      // 删除弹窗
      deleteDialogVisible: false,
      deleteForm: {
        reason: ''
      },
      deleteSubmitting: false,
      
      // 详情弹窗
      detailDialogVisible: false,
      postDetail: {},
      detailLoading: false,
      
      // 创建帖子
      createDialogVisible: false,
      createForm: {
        title: '',
        content: '',
        user_id: '',
        circle_id: this.$route.query.circle_id || '',
        media_urls: []
      },
      createRules: {
        title: [{ required: true, message: '请输入帖子标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入帖子内容', trigger: 'blur' }],
        user_id: [{ required: true, message: '请选择作者', trigger: 'change' }],
        circle_id: [{ required: true, message: '请选择圈子', trigger: 'change' }]
      },
      createSubmitting: false,
      userSearchLoading: false,
      userOptions: [],
      imageFileList: []
    }
  },
  created() {
    this.fetchPostStats();
    this.fetchCircles();
    this.fetchPosts();
    
    // 如果是从圈子管理页面跳转过来的，设置圈子筛选
    if (this.$route.query.circle_id) {
      this.circleFilter = this.$route.query.circle_id;
    }
  },
  methods: {
    // 获取帖子统计数据
    async fetchPostStats() {
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/community/posts/stats');
        if (response.data) {
          this.stats = response.data;
        }
      } catch (error) {
        console.error('获取帖子统计数据失败', error);
        // 设置默认值，避免页面显示错误
        this.stats = {
          total: 0,
          today: 0,
          pending: 0,
          reported: 0
        };
      }
    },
    
    // 获取圈子列表（用于筛选）
    async fetchCircles() {
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/community/circles/list', {
          params: { status: 1, pageSize: 100 }
        });
        
        if (response.data) {
          this.circles = response.data.list || [];
        }
      } catch (error) {
        console.error('获取圈子列表失败', error);
        this.circles = [];
      }
    },
    
    // 获取帖子列表
    async fetchPosts() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize
        };
        
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword;
        }
        
        if (this.statusFilter !== -1) {
          params.status = this.statusFilter;
        }
        
        if (this.circleFilter) {
          params.circle_id = this.circleFilter;
        }
        
        const response = await this.axios.get(this.$baseUrl + '/manage/community/posts/list', { params });
        
        if (response.data) {
          this.posts = response.data.list || [];
          this.total = response.data.total || 0;
        }
      } catch (error) {
        console.error('获取帖子列表失败', error);
        this.$message.error('获取帖子列表失败');
        this.posts = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },
    
    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.fetchPosts();
    },
    
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchPosts();
    },
    
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchPosts();
    },
    
    // 查看详情
    async handleDetail(row) {
      this.currentPost = row;
      this.detailDialogVisible = true;
      this.detailLoading = true;
      
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/community/posts/detail', {
          params: { post_id: row.post_id }
        });
        
        if (response.data) {
          this.postDetail = response.data;
          
          // 处理媒体URL
          if (this.postDetail.media_urls) {
            this.postDetail.media_urls = this.parseMediaUrls(this.postDetail.media_urls);
          }
        }
      } catch (error) {
        console.error('获取帖子详情失败', error);
        this.$message.error('获取帖子详情失败');
        this.postDetail = {};
      } finally {
        this.detailLoading = false;
      }
    },
    
    // 审核
    handleAudit(row) {
      this.currentPost = row;
      this.auditForm = {
        status: 1,
        reason: ''
      };
      this.auditDialogVisible = true;
    },
    
    // 提交审核
    async submitAudit() {
      if (this.auditForm.status === 2 && !this.auditForm.reason) {
        this.$message.warning('请填写拒绝理由');
        return;
      }
      
      this.auditSubmitting = true;
      try {
        const response = await this.axios.post(this.$baseUrl + '/manage/community/posts/audit', {
          post_id: this.currentPost.post_id,
          status: this.auditForm.status,
          reason: this.auditForm.reason
        });
        
        if (response.data) {
          this.$message.success('审核成功');
          this.auditDialogVisible = false;
          this.fetchPostStats();
          this.fetchPosts();
        }
      } catch (error) {
        console.error('审核失败', error);
        this.$message.error('审核失败：' + (error.response?.data?.msg || '未知错误'));
      } finally {
        this.auditSubmitting = false;
      }
    },
    
    // 删除
    handleDelete(row) {
      this.currentPost = row;
      this.deleteForm = {
        reason: ''
      };
      this.deleteDialogVisible = true;
    },
    
    // 提交删除
    async submitDelete() {
      if (!this.deleteForm.reason) {
        this.$message.warning('请填写删除理由');
        return;
      }
      
      this.deleteSubmitting = true;
      try {
        const response = await this.axios.post(this.$baseUrl + '/manage/community/posts/delete', {
          post_id: this.currentPost.post_id,
          reason: this.deleteForm.reason
        });
        
        if (response.data) {
          this.$message.success('删除成功');
          this.deleteDialogVisible = false;
          this.fetchPostStats();
          this.fetchPosts();
        }
      } catch (error) {
        console.error('删除失败', error);
        this.$message.error('删除失败：' + (error.response?.data?.msg || '未知错误'));
      } finally {
        this.deleteSubmitting = false;
      }
    },
    
    // 格式化日期
    formatDate(date) {
      return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '待审核',
        1: '已通过',
        2: '已拒绝',
        3: '已删除'
      };
      return statusMap[status] || '未知';
    },
    
    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        0: 'warning',
        1: 'success',
        2: 'danger',
        3: 'info'
      };
      return typeMap[status] || '';
    },
    
    // 创建帖子
    handleCreate() {
      this.currentPost = {};
      this.createForm = {
        title: '',
        content: '',
        user_id: '',
        circle_id: this.$route.query.circle_id || '',
        media_urls: []
      };
      this.imageFileList = [];
      this.createDialogVisible = true;
    },
    
    // 编辑帖子
    async handleEdit(row) {
      this.currentPost = row;
      this.detailLoading = true;
      
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/community/posts/detail', {
          params: { post_id: row.post_id }
        });
        
        if (response.data) {
          const postData = response.data;
          // 处理媒体URL
          const parsedMediaUrls = this.parseMediaUrls(postData.media_urls);
          
          this.createForm = {
            post_id: postData.post_id,
            title: postData.title,
            content: postData.content,
            user_id: postData.user_id,
            circle_id: postData.circle_id,
            media_urls: parsedMediaUrls
          };
          
          this.createDialogVisible = true;
        }
      } catch (error) {
        console.error('获取帖子详情失败', error);
        this.$message.error('获取帖子详情失败');
      } finally {
        this.detailLoading = false;
      }
    },
    
    // 远程搜索用户
    async remoteSearchUsers(query) {
      if (query.length < 1) return;
      
      this.userSearchLoading = true;
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/community/users/list', {
          params: { keyword: query }
        });
        
        if (response.data) {
          this.userOptions = response.data;
        }
      } catch (error) {
        console.error('搜索用户失败', error);
      } finally {
        this.userSearchLoading = false;
      }
    },
    
    // 图片上传
    handleUploadImage() {
      this.$confirm('请选择上传方式', '上传图片', {
        confirmButtonText: '本地上传',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 创建隐藏的文件输入框
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = false;
        
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          
          // 检查文件类型和大小
          const isImage = file.type.startsWith('image/');
          const isLt5M = file.size / 1024 / 1024 < 5;
          
          if (!isImage) {
            this.$message.error('上传图片只能是图片格式!');
            return;
          }
          
          if (!isLt5M) {
            this.$message.error('上传图片大小不能超过 5MB!');
            return;
          }
          
          // 上传文件
          this.uploadFile(file).then(res => {
            if (res && res.url) {
              this.createForm.media_urls.push(res.url);
            }
          });
        };
        
        // 触发文件选择
        input.click();
      }).catch(() => {});
    },
    
    // 上传文件到服务器
    async uploadFile(file) {
      return new Promise((resolve, reject) => {
        const loading = this.$loading({
          lock: true,
          text: '图片上传中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        
        const formData = new FormData();
        formData.append('file', file);
        
        // 使用与editCircle.vue相同的上传端点
        this.axios.post('https://storage.codesocean.top/api/resource/upload?container=172018735018984', formData, {
          headers: {
            'ServiceKey': 'a24785bedb466b9733dd317771d4b69c08da07fd',
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          loading.close();
          this.$message.success('上传成功');
          
          const imageUrl = "http://storage.codesocean.top/api/resource/get/" + response.data.data.resource_id;
          resolve({url: imageUrl});
        }).catch(error => {
          loading.close();
          this.$message.error('上传失败');
          reject(error);
        });
      });
    },
    
    handleImageRemove(index) {
      this.createForm.media_urls.splice(index, 1);
    },
    
    // 图片预览
    previewImage(images, index) {
      // Element UI 已经有内置的图片预览功能，但如果需要手动触发，可以这样实现
      const previewImages = images.map(url => {
        // 确保URL是完整路径
        if (typeof url === 'string' && !url.startsWith('http')) {
          return url;
        }
        return url;
      });
      
      // 创建一个临时的 img 元素并触发点击以启动预览
      const img = new Image();
      img.src = previewImages[index];
      img.onload = () => {
        const preview = document.createElement('div');
        preview.style.display = 'none';
        preview.innerHTML = `<img src="${previewImages[index]}" preview="${previewImages.join(',')}" preview-text="图片预览">`;
        document.body.appendChild(preview);
        preview.querySelector('img').click();
        setTimeout(() => {
          document.body.removeChild(preview);
        }, 100);
      };
    },
    
    // 处理媒体URL，确保格式正确
    parseMediaUrls(mediaUrls) {
      if (!mediaUrls) return [];
      
      // 如果是字符串，尝试解析JSON
      if (typeof mediaUrls === 'string') {
        try {
          mediaUrls = JSON.parse(mediaUrls);
        } catch (e) {
          console.error('解析媒体URL失败', e);
          return [];
        }
      }
      
      // 确保是数组
      if (!Array.isArray(mediaUrls)) {
        return [];
      }
      
      // 确保所有URL都是相对路径
      return mediaUrls;
    },
    
    // 提交创建
    async submitCreate() {
      this.$refs.createForm.validate(async valid => {
        if (!valid) return;
        
        this.createSubmitting = true;
        try {
          let url, successMsg;
          
          if (this.currentPost.post_id) {
            // 编辑模式
            url = this.$baseUrl + '/manage/community/posts/update';
            successMsg = '更新成功';
          } else {
            // 创建模式
            url = this.$baseUrl + '/manage/community/posts/create';
            successMsg = '创建成功';
          }
          
          const response = await this.axios.post(url, this.createForm);
          
          if (response.data) {
            this.$message.success(successMsg);
            this.createDialogVisible = false;
            this.fetchPostStats();
            this.fetchPosts();
          }
        } catch (error) {
          console.error('操作失败', error);
          this.$message.error('操作失败：' + (error.response?.data?.msg || '未知错误'));
        } finally {
          this.createSubmitting = false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.posts-manage {
  padding: 20px;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      font-size: 24px;
    }
    
    .search-box {
      display: flex;
      align-items: center;
      
      .search-input {
        width: 300px;
        margin-right: 15px;
      }
      
      .el-select {
        margin-right: 15px;
      }
    }
  }
  
  .stat-cards {
    margin-bottom: 20px;
    
    .stat-card {
      .stat-content {
        text-align: center;
        
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #409EFF;
          margin-bottom: 10px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
  
  .post-info {
    .post-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .post-content {
      font-size: 12px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  
  .author-info {
    display: flex;
    align-items: center;
    
    .author-name {
      margin-left: 10px;
    }
  }
  
  .interaction-info {
    display: flex;
    
    span {
      margin-right: 15px;
      font-size: 14px;
      color: #666;
      
      i {
        margin-right: 5px;
      }
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .post-info-dialog {
    margin-bottom: 20px;
    
    h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
    }
    
    .post-meta {
      margin-bottom: 15px;
      font-size: 14px;
      color: #666;
      
      span {
        margin-right: 15px;
      }
    }
    
    .post-content-dialog {
      margin-bottom: 15px;
      line-height: 1.6;
    }
    
    .post-images {
      display: flex;
      flex-wrap: wrap;
      
      .post-image {
        width: 120px;
        height: 120px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
      }
    }
  }
  
  .post-header {
    margin-bottom: 20px;
    
    h2 {
      margin: 0 0 15px 0;
    }
    
    .post-meta-detail {
      display: flex;
      align-items: center;
      
      .post-meta-info {
        margin-left: 15px;
        flex: 1;
        
        .author-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .post-time {
          font-size: 12px;
          color: #999;
        }
      }
      
      .post-status {
        margin-left: auto;
      }
    }
  }
  
  .post-content-detail {
    margin-bottom: 20px;
    line-height: 1.8;
    white-space: pre-wrap;
  }
  
  .post-images-detail {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    
    .post-image-detail {
      width: 150px;
      height: 150px;
      margin-right: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
  }
  
  .comments-section {
    .comment-item {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .comment-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        .comment-meta {
          margin-left: 10px;
          
          .comment-author {
            font-weight: bold;
            margin-bottom: 3px;
          }
          
          .comment-time {
            font-size: 12px;
            color: #999;
          }
        }
      }
      
      .comment-content {
        padding-left: 40px;
        line-height: 1.6;
      }
    }
  }
  
  .no-comments {
    text-align: center;
    padding: 30px 0;
    color: #999;
    font-size: 14px;
  }

  .upload-list {
    ::v-deep .el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
    
    ::v-deep .el-upload-list--picture-card .el-upload-list__item {
      width: 100px;
      height: 100px;
    }
  }

  .post-images {
    margin-bottom: 20rpx;
  }

  .image-grid {
    display: flex;
    flex-wrap: wrap;
  }

  .grid-1 .post-image {
    width: 400px;
    height: 300px;
    border-radius: 8px;
  }

  .grid-2 .post-image, .grid-3 .post-image {
    width: calc(33.33% - 10px);
    height: 200px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
  }

  .grid-multi .post-image {
    width: calc(33.33% - 10px);
    height: 200px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
  }

  .image-count {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 14px;
    padding: 4px 12px;
    border-radius: 20px;
  }

  .post-images-detail .image-grid {
    display: flex;
    flex-wrap: wrap;
  }

  .post-images-detail .grid-1 .post-image-detail {
    width: 500px;
    height: 375px;
    border-radius: 8px;
  }

  .post-images-detail .grid-2 .post-image-detail, 
  .post-images-detail .grid-3 .post-image-detail {
    width: calc(33.33% - 10px);
    height: 200px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
  }

  .post-images-detail .grid-multi .post-image-detail {
    width: calc(33.33% - 10px);
    height: 200px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
  }

  .image-upload-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }

  .image-item {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    position: relative;
    overflow: hidden;
  }

  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-actions {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .image-item:hover .image-actions {
    opacity: 1;
  }

  .image-actions i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }

  .image-upload-btn {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .image-upload-btn i {
    font-size: 28px;
    color: #8c939d;
  }

  .image-upload-btn:hover {
    border-color: #409EFF;
  }

  .image-upload-btn:hover i {
    color: #409EFF;
  }
}
</style> 