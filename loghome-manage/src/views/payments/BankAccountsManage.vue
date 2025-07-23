<template>
  <div class="bank-accounts-container">
    <div class="search-container">
      <el-input
        placeholder="请输入用户ID、用户名或账号"
        v-model="searchKeyword"
        class="search-input"
        clearable
        @keyup.enter.native="handleSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <el-table
      :data="bankAccounts"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column prop="user_id" label="用户ID" width="80"></el-table-column>
      <el-table-column label="头像" width="80">
        <template slot-scope="scope">
          <el-avatar :size="40" :src="scope.row.avatar_url"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名" width="120"></el-table-column>
      <el-table-column prop="account" label="账号" width="180"></el-table-column>
      <el-table-column prop="log" label="原木余额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.log || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="apple" label="苹果余额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.apple || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cropped_log" label="去皮原木余额" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cropped_log || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)"
          >修改余额</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 修改余额对话框 -->
    <el-dialog title="修改用户余额" :visible.sync="dialogVisible" width="500px">
      <el-form :model="editForm" label-width="120px" :rules="rules" ref="editForm">
        <el-form-item label="用户ID">
          <span>{{ editForm.user_id }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{ editForm.name }}</span>
        </el-form-item>
        <el-form-item label="操作类型" prop="operationType">
          <el-radio-group v-model="editForm.operationType">
            <el-radio label="add">增加</el-radio>
            <el-radio label="subtract">减少</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物品类型" prop="itemType">
          <el-select v-model="editForm.itemType" placeholder="请选择物品类型">
            <el-option label="原木" value="log"></el-option>
            <el-option label="苹果" value="apple"></el-option>
            <el-option label="去皮原木" value="cropped_log"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input-number v-model="editForm.amount" :min="1" :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="消息" prop="message">
          <el-input type="textarea" v-model="editForm.message" placeholder="请输入要发送给用户的消息"></el-input>
          <div class="tip-text">此消息将发送给用户，告知余额变动原因</div>
        </el-form-item>
        <el-form-item label="发送消息">
          <el-switch v-model="editForm.send_message" active-text="是" inactive-text="否"></el-switch>
          <div class="tip-text">选择"是"将发送消息通知用户</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit" :loading="submitLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BankAccountsManage',
  data() {
    return {
      bankAccounts: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchKeyword: '',
      dialogVisible: false,
      submitLoading: false,
      editForm: {
        user_id: '',
        name: '',
        operationType: 'add',
        itemType: 'log',
        amount: 1,
        message: '',
        send_message: true
      },
      rules: {
        operationType: [
          { required: true, message: '请选择操作类型', trigger: 'change' }
        ],
        itemType: [
          { required: true, message: '请选择物品类型', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        message: [
          { required: true, message: '请输入要发送给用户的消息', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getBankAccountsAmount()
    this.getBankAccounts()
  },
  methods: {
    // 获取银行账户总数
    getBankAccountsAmount() {
      axios.get(this.$baseUrl + '/manage/bank/get_bank_accounts_amount', {
        params: {
          keyword: this.searchKeyword
        }
      }).then(response => {
        // 后端返回的是数组，需要取第一个元素的count属性
        this.total = response.data[0].count
      }).catch(error => {
        console.error('获取银行账户总数失败:', error)
        this.$message.error('获取银行账户总数失败')
      })
    },
    // 获取银行账户列表
    getBankAccounts() {
      this.loading = true
      axios.get(this.$baseUrl + '/manage/bank/get_bank_accounts', {
        params: {
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.searchKeyword
        }
      }).then(response => {
        this.bankAccounts = response.data
        this.loading = false
      }).catch(error => {
        console.error('获取银行账户列表失败:', error)
        this.$message.error('获取银行账户列表失败')
        this.loading = false
      })
    },
    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.getBankAccountsAmount()
      this.getBankAccounts()
    },
    // 重置搜索
    resetSearch() {
      this.searchKeyword = ''
      this.handleSearch()
    },
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val
      this.getBankAccounts()
    },
    // 处理每页显示数量变化
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getBankAccounts()
    },
    // 处理编辑
    handleEdit(row) {
      this.editForm = {
        user_id: row.user_id,
        name: row.name,
        operationType: 'add',
        itemType: 'log',
        amount: 1,
        message: '',
        send_message: true
      }
      this.dialogVisible = true
    },
    // 提交编辑
    submitEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          axios.post(this.$baseUrl + '/manage/bank/update_bank_account', {
            user_id: this.editForm.user_id,
            item_name: this.editForm.itemType,
            operation: this.editForm.operationType,
            amount: this.editForm.amount,
            message: this.editForm.message,
            send_message: this.editForm.send_message
          }).then(response => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.getBankAccounts()
            this.submitLoading = false
          }).catch(error => {
            console.error('操作失败:', error)
            this.$message.error('操作失败: ' + (error.response.data.msg || '未知错误'))
            this.submitLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.tip-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
.bank-accounts-container {
  padding: 20px;
  height: calc(100% - 40px);
  overflow-y: auto;
}
.search-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.search-input {
  width: 300px;
  margin-right: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>