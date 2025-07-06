<template>
  <div class="reports-manage">
    <div class="header">
      <h2>举报管理</h2>
      <div class="filter-box">
        <el-select v-model="statusFilter" placeholder="状态筛选" @change="handleFilterChange">
          <el-option label="待处理" :value="0"></el-option>
          <el-option label="已处理" :value="1"></el-option>
          <el-option label="已忽略" :value="2"></el-option>
        </el-select>
        <el-select v-model="typeFilter" placeholder="类型筛选" @change="handleFilterChange">
          <el-option label="全部" value=""></el-option>
          <el-option label="帖子" value="post"></el-option>
          <el-option label="评论" value="comment"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 举报列表 -->
    <el-table
      :data="reports"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column
        prop="report_id"
        label="ID"
        width="80"
      ></el-table-column>
      <el-table-column label="举报人" width="150">
        <template slot-scope="scope">
          <div class="reporter-info">
            <el-avatar :size="30" :src="scope.row.reporter_avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
            <span class="reporter-name">{{ scope.row.reporter_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="reason"
        label="举报原因"
        width="200"
      ></el-table-column>
      <el-table-column label="举报类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.target_type === 'post' ? 'primary' : 'success'">
            {{ scope.row.target_type === 'post' ? '帖子' : '评论' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="举报内容" min-width="300">
        <template slot-scope="scope">
          <div class="target-info" v-if="scope.row.target_info">
            <div class="target-content" v-if="scope.row.target_type === 'post'">
              <div class="target-title">{{ scope.row.target_info.title }}</div>
              <div class="target-text">{{ scope.row.target_info.content }}</div>
            </div>
            <div class="target-content" v-else>
              <div class="target-text">{{ scope.row.target_info.content }}</div>
            </div>
            <div class="target-author">作者：{{ scope.row.target_info.author_name }}</div>
          </div>
          <div class="no-target-info" v-else>
            内容已不存在
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="举报时间"
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
        v-if="statusFilter === 0"
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
            @click="handleReport(scope.row, 'handle')"
            type="danger"
            plain
          >处理</el-button>
          <el-button
            size="mini"
            @click="handleReport(scope.row, 'ignore')"
            type="info"
            plain
          >忽略</el-button>
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

    <!-- 详情弹窗 -->
    <el-dialog
      title="举报详情"
      :visible.sync="detailDialogVisible"
      width="700px"
    >
      <div class="detail-dialog-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="举报ID">{{ currentReport.report_id }}</el-descriptions-item>
          <el-descriptions-item label="举报时间">{{ formatDate(currentReport.create_time) }}</el-descriptions-item>
          <el-descriptions-item label="举报人">{{ currentReport.reporter_name }}</el-descriptions-item>
          <el-descriptions-item label="举报类型">{{ currentReport.target_type === 'post' ? '帖子' : '评论' }}</el-descriptions-item>
          <el-descriptions-item label="举报原因" :span="2">{{ currentReport.reason }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">举报内容</el-divider>
        <div class="target-detail" v-if="currentReport.target_info">
          <div class="target-header" v-if="currentReport.target_type === 'post'">
            <h3>{{ currentReport.target_info.title }}</h3>
            <div class="target-meta">作者：{{ currentReport.target_info.author_name }}</div>
          </div>
          <div class="target-body">
            {{ currentReport.target_info.content }}
          </div>
        </div>
        <div class="no-target-detail" v-else>
          内容已不存在
        </div>

        <el-divider v-if="currentReport.status !== 0"></el-divider>
        <div class="review-info" v-if="currentReport.status !== 0">
          <div class="review-header">
            <span class="review-status">{{ getStatusText(currentReport.status) }}</span>
            <span class="review-time">{{ formatDate(currentReport.review_time) }}</span>
          </div>
          <div class="review-reviewer" v-if="currentReport.reviewer_name">
            处理人：{{ currentReport.reviewer_name }}
          </div>
          <div class="review-comment" v-if="currentReport.review_comment">
            处理意见：{{ currentReport.review_comment }}
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
        <template v-if="currentReport.status === 0">
          <el-button type="danger" @click="handleReport(currentReport, 'handle')">处理举报</el-button>
          <el-button type="info" @click="handleReport(currentReport, 'ignore')">忽略举报</el-button>
        </template>
      </span>
    </el-dialog>

    <!-- 处理弹窗 -->
    <el-dialog
      :title="actionType === 'handle' ? '处理举报' : '忽略举报'"
      :visible.sync="actionDialogVisible"
      width="500px"
    >
      <div class="action-dialog-content">
        <p v-if="actionType === 'handle'">
          确定要处理该举报并{{ currentReport.target_type === 'post' ? '删除帖子' : '删除评论' }}吗？
        </p>
        <p v-else>
          确定要忽略该举报吗？
        </p>
        <el-form :model="actionForm" label-width="80px" class="action-form">
          <el-form-item :label="actionType === 'handle' ? '处理理由' : '忽略理由'">
            <el-input
              type="textarea"
              :rows="4"
              :placeholder="actionType === 'handle' ? '请输入处理理由' : '请输入忽略理由'"
              v-model="actionForm.reason"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="actionDialogVisible = false">取 消</el-button>
        <el-button :type="actionType === 'handle' ? 'danger' : 'info'" @click="submitAction" :loading="actionSubmitting">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ReportsManage',
  data() {
    return {
      // 筛选
      statusFilter: 0,
      typeFilter: '',
      
      // 分页
      currentPage: 1,
      pageSize: 20,
      total: 0,
      
      // 数据
      reports: [],
      loading: false,
      
      // 详情弹窗
      detailDialogVisible: false,
      currentReport: {},
      
      // 处理弹窗
      actionDialogVisible: false,
      actionType: 'handle', // 'handle' 或 'ignore'
      actionForm: {
        reason: ''
      },
      actionSubmitting: false
    }
  },
  created() {
    this.fetchReports();
  },
  methods: {
    // 获取举报列表
    async fetchReports() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          status: this.statusFilter
        };
        
        if (this.typeFilter) {
          params.target_type = this.typeFilter;
        }
        
        const response = await this.axios.get(this.$baseUrl + '/manage/community/reports/list', { params });
        
        if (response.data) {
          this.reports = response.data.list || [];
          this.total = response.data.total || 0;
        }
      } catch (error) {
        console.error('获取举报列表失败', error);
        this.$message.error('获取举报列表失败');
      } finally {
        this.loading = false;
      }
    },
    
    // 筛选变化
    handleFilterChange() {
      this.currentPage = 1;
      this.fetchReports();
    },
    
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchReports();
    },
    
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchReports();
    },
    
    // 查看详情
    handleDetail(row) {
      this.currentReport = row;
      this.detailDialogVisible = true;
    },
    
    // 处理或忽略举报
    handleReport(row, action) {
      this.currentReport = row;
      this.actionType = action;
      this.actionForm = {
        reason: ''
      };
      this.actionDialogVisible = true;
      this.detailDialogVisible = false; // 如果是从详情弹窗点击的，关闭详情弹窗
    },
    
    // 提交处理
    async submitAction() {
      if (!this.actionForm.reason) {
        this.$message.warning(`请填写${this.actionType === 'handle' ? '处理' : '忽略'}理由`);
        return;
      }
      
      this.actionSubmitting = true;
      try {
        const response = await this.axios.post(this.$baseUrl + '/manage/community/reports/handle', {
          report_id: this.currentReport.report_id,
          action: this.actionType,
          reason: this.actionForm.reason
        });
        
        if (response.data) {
          this.$message.success(this.actionType === 'handle' ? '处理成功' : '已忽略举报');
          this.actionDialogVisible = false;
          this.fetchReports();
        }
      } catch (error) {
        console.error('操作失败', error);
        this.$message.error('操作失败：' + (error.response?.data?.msg || '未知错误'));
      } finally {
        this.actionSubmitting = false;
      }
    },
    
    // 格式化日期
    formatDate(date) {
      return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '待处理',
        1: '已处理',
        2: '已忽略'
      };
      return statusMap[status] || '未知';
    },
    
    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        0: 'warning',
        1: 'success',
        2: 'info'
      };
      return typeMap[status] || '';
    }
  }
}
</script>

<style lang="scss" scoped>
.reports-manage {
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
    
    .filter-box {
      display: flex;
      align-items: center;
      
      .el-select {
        margin-left: 15px;
        width: 120px;
      }
    }
  }
  
  .reporter-info {
    display: flex;
    align-items: center;
    
    .reporter-name {
      margin-left: 10px;
    }
  }
  
  .target-info {
    .target-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .target-text {
      font-size: 12px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 5px;
    }
    
    .target-author {
      font-size: 12px;
      color: #999;
    }
  }
  
  .no-target-info {
    color: #999;
    font-style: italic;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .target-detail {
    margin-top: 20px;
    
    .target-header {
      margin-bottom: 15px;
      
      h3 {
        margin: 0 0 10px 0;
      }
      
      .target-meta {
        font-size: 14px;
        color: #666;
      }
    }
    
    .target-body {
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 4px;
      line-height: 1.6;
    }
  }
  
  .no-target-detail {
    margin-top: 20px;
    padding: 20px;
    text-align: center;
    background-color: #f9f9f9;
    border-radius: 4px;
    color: #999;
    font-style: italic;
  }
  
  .review-info {
    margin-top: 20px;
    
    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      
      .review-status {
        font-weight: bold;
      }
      
      .review-time {
        color: #999;
        font-size: 14px;
      }
    }
    
    .review-reviewer {
      margin-bottom: 10px;
    }
    
    .review-comment {
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 4px;
      line-height: 1.6;
    }
  }
}
</style> 