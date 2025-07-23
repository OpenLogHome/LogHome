<template>
  <div class="activity-messages-manage">
    <div class="header">
      <h2>活动消息管理</h2>
      <div class="search-box">
        <el-button type="primary" @click="handleCreate" style="margin-right: 15px;">发送活动消息</el-button>
        <el-input
          placeholder="请输入消息内容搜索"
          v-model="searchKeyword"
          class="search-input"
          clearable
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 活动消息列表 -->
    <el-table
      :data="messages"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column
        prop="message_id"
        label="ID"
        width="80"
      ></el-table-column>
      <el-table-column label="消息内容" min-width="300">
        <template slot-scope="scope">
          <div class="message-info">
            <div class="message-content">{{ scope.row.message_content }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="背景图片" width="150">
        <template slot-scope="scope">
          <el-image 
            v-if="scope.row.bg_url" 
            :src="scope.row.bg_url" 
            style="width: 100px; height: 60px;" 
            fit="cover"
            :preview-src-list="[scope.row.bg_url]"
          ></el-image>
          <span v-else>无背景图</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="router"
        label="跳转链接"
        width="150"
      ></el-table-column>
      <el-table-column
        label="发送时间"
        width="180"
      >
        <template slot-scope="scope">
          {{ formatDate(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column
        label="已读/总数"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.read_count }}/{{ scope.row.total_count }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
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
            @click="handleDelete(scope.row)"
            type="danger"
            plain
          >删除</el-button>
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

    <!-- 发送活动消息弹窗 -->
    <el-dialog
      title="发送活动消息"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form :model="messageForm" :rules="rules" ref="messageForm" label-width="100px">
        <el-form-item label="消息内容" prop="content">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入活动消息内容"
            v-model="messageForm.content"
          ></el-input>
        </el-form-item>
        <el-form-item label="背景图片" prop="bgUrl">
          <el-upload
            class="upload-demo"
            action="http://img.codesocean.top/upload/img"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :file-list="fileList"
            list-type="picture"
            :limit="1"
            name="img"
            :headers="{'apikey': 'iSnMUQ9OLZpCVY3p7E3T5b2YwC39TS'}"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="router">
          <el-input
            placeholder="请输入跳转链接，例如：community/circle?id=1"
            v-model="messageForm.router"
          ></el-input>
        </el-form-item>
        <el-form-item label="发送对象" prop="sendType">
          <el-radio-group v-model="messageForm.sendType">
            <el-radio :label="1">所有用户</el-radio>
            <el-radio :label="2">指定用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择用户" prop="userIds" v-if="messageForm.sendType === 2">
          <el-select
            v-model="messageForm.selectedUsers"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入用户名或ID搜索"
            :remote-method="remoteSearchUsers"
            :loading="userSearchLoading"
            style="width: 100%"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.user_id"
              :label="item.name + ' (ID: ' + item.user_id + ')'" 
              :value="item.user_id"
            >
              <div style="display: flex; align-items: center;">
                <el-avatar :size="30" :src="item.avatar_url" style="margin-right: 10px;">{{ item.name.substr(0, 1) }}</el-avatar>
                <span>{{ item.name }}</span>
                <span style="color: #999; margin-left: 10px;">(ID: {{ item.user_id }})</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">发 送</el-button>
      </span>
    </el-dialog>

    <!-- 消息详情弹窗 -->
    <el-dialog
      title="活动消息详情"
      :visible.sync="detailDialogVisible"
      width="600px"
    >
      <div class="message-detail">
        <div class="detail-item">
          <div class="detail-label">消息ID：</div>
          <div class="detail-value">{{ currentMessage.message_id }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">消息内容：</div>
          <div class="detail-value">{{ currentMessage.message_content }}</div>
        </div>
        <div class="detail-item" v-if="currentMessage.bg_url">
          <div class="detail-label">背景图片：</div>
          <div class="detail-value">
            <el-image 
              :src="currentMessage.bg_url" 
              style="width: 100%; max-height: 200px;" 
              fit="contain"
              :preview-src-list="[currentMessage.bg_url]"
            ></el-image>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-label">跳转链接：</div>
          <div class="detail-value">{{ currentMessage.router || '无' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">发送时间：</div>
          <div class="detail-value">{{ formatDate(currentMessage.time) }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">已读/总数：</div>
          <div class="detail-value">{{ currentMessage.read_count }}/{{ currentMessage.total_count }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'ActivityMessagesManage',
  data() {
    return {
      messages: [],
      loading: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      searchKeyword: '',
      dialogVisible: false,
      detailDialogVisible: false,
      submitting: false,
      currentMessage: {},
      userOptions: [],
      userSearchLoading: false,
      messageForm: {
        content: '',
        bgUrl: '',
        router: '',
        sendType: 1,
        userIds: '',
        selectedUsers: []
      },
      fileList: [],
      rules: {
        content: [
          { required: true, message: '请输入消息内容', trigger: 'blur' },
          { max: 1000, message: '消息内容不能超过1000个字符', trigger: 'blur' }
        ],
        router: [
          { max: 1000, message: '跳转链接不能超过1000个字符', trigger: 'blur' }
        ],
        userIds: [
          { required: true, message: '请选择用户', trigger: 'change', validator: (rule, value, callback) => {
            if (this.messageForm.sendType === 2 && (!this.messageForm.selectedUsers || this.messageForm.selectedUsers.length === 0)) {
              callback(new Error('请选择至少一个用户'));
            } else {
              callback();
            }
          }}
        ]
      }
    };
  },
  created() {
    this.fetchMessages();
  },
  methods: {
    // 获取活动消息列表
    fetchMessages() {
      this.loading = true;
      axios.get(this.$baseUrl + '/manage/community/activity-messages', {
        params: {
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.searchKeyword
        }
      }).then(response => {
        this.messages = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      }).catch(error => {
        console.error('获取活动消息列表失败', error);
        this.$message.error('获取活动消息列表失败');
        this.loading = false;
      });
    },
    
    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.fetchMessages();
    },
    
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchMessages();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchMessages();
    },
    
    // 创建活动消息
    handleCreate() {
      this.dialogVisible = true;
      this.messageForm = {
        content: '',
        bgUrl: '',
        router: '',
        sendType: 1,
        userIds: '',
        selectedUsers: []
      };
      this.fileList = [];
      this.userOptions = [];
    },
    
    // 远程搜索用户
    remoteSearchUsers(query) {
      if (query !== '') {
        this.userSearchLoading = true;
        axios.get(this.$baseUrl + '/manage/community/users/list', {
          params: {
            keyword: query,
            limit: 20
          }
        }).then(response => {
          this.userOptions = response.data;
          this.userSearchLoading = false;
        }).catch(error => {
          console.error('搜索用户失败', error);
          this.$message.error('搜索用户失败');
          this.userSearchLoading = false;
        });
      } else {
        this.userOptions = [];
      }
    },
    
    // 查看详情
    handleDetail(row) {
      this.currentMessage = row;
      this.detailDialogVisible = true;
    },
    
    // 删除活动消息
    handleDelete(row) {
      this.$confirm('确认删除该活动消息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(this.$baseUrl + `/manage/community/activity-messages/${row.message_id}`).then(() => {
          this.$message.success('删除成功');
          this.fetchMessages();
        }).catch(error => {
          console.error('删除活动消息失败', error);
          this.$message.error('删除活动消息失败');
        });
      }).catch(() => {});
    },
    
    // 上传相关方法
    handleUploadSuccess(response, file, fileList) {
      console.log(response);
      this.messageForm.bgUrl = response.url;
      this.fileList = fileList;
    },
    handleUploadError() {
      this.$message.error('上传图片失败');
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    
    // 提交表单
    submitForm() {
      this.$refs.messageForm.validate(valid => {
        if (valid) {
          this.submitting = true;
          
          const params = {
            content: this.messageForm.content,
            bgUrl: this.messageForm.bgUrl,
            router: this.messageForm.router,
            sendType: this.messageForm.sendType
          };
          
          if (this.messageForm.sendType === 2) {
            params.userIds = this.messageForm.selectedUsers;
          }
          
          axios.post(this.$baseUrl + '/manage/community/activity-messages', params).then(() => {
            this.$message.success('发送活动消息成功');
            this.dialogVisible = false;
            this.fetchMessages();
            this.submitting = false;
          }).catch(error => {
            console.error('发送活动消息失败', error);
            this.$message.error('发送活动消息失败');
            this.submitting = false;
          });
        }
      });
    },
    
    // 格式化日期
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>

<style scoped>
.activity-messages-manage {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-input {
  width: 300px;
  margin-right: 15px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.message-info {
  display: flex;
  flex-direction: column;
}

.message-content {
  font-size: 14px;
  margin-bottom: 5px;
  word-break: break-all;
}

.message-detail {
  padding: 10px;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.detail-value {
  word-break: break-all;
}
</style>