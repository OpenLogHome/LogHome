<template>
  <div class="payment-orders-container">
    <div class="search-container">
      <el-input
        placeholder="请输入订单ID或用户ID"
        v-model="searchKeyword"
        class="search-input"
        clearable
        @keyup.enter.native="handleSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      <el-select v-model="statusFilter" placeholder="订单状态" clearable class="status-select">
        <el-option label="待支付" value="created"></el-option>
        <el-option label="已支付" value="paid"></el-option>
        <el-option label="已取消" value="cancelled"></el-option>
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <el-table
      :data="paymentOrders"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column prop="payment_id" label="订单ID" width="220"></el-table-column>
      <el-table-column prop="log_amount" label="原木数量" width="100"></el-table-column>
      <el-table-column prop="pay_amount" label="支付金额(元)" width="120">
        <template slot-scope="scope">
          <span>{{ (scope.row.pay_amount ).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="用户ID" width="80"></el-table-column>
      <el-table-column label="用户信息" width="180">
        <template slot-scope="scope">
          <div class="user-info">
            <el-avatar :size="30" :src="scope.row.avatar_url"></el-avatar>
            <span class="user-name">{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="180">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.update_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleView(scope.row)"
          >查看</el-button>
          <el-button
            v-if="scope.row.status === 'created'"
            size="mini"
            type="success"
            @click="handleMarkAsPaid(scope.row)"
          >标记为已支付</el-button>
          <el-button
            v-if="scope.row.status === 'created'"
            size="mini"
            type="danger"
            @click="handleCancel(scope.row)"
          >取消订单</el-button>
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

    <!-- 查看订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="detailDialogVisible" width="600px">
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-item">
          <span class="label">订单ID:</span>
          <span class="value">{{ currentOrder.payment_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">原木数量:</span>
          <span class="value">{{ currentOrder.log_amount }}</span>
        </div>
        <div class="detail-item">
          <span class="label">支付金额:</span>
          <span class="value">{{ (currentOrder.pay_amount ).toFixed(2) }}元</span>
        </div>
        <div class="detail-item">
          <span class="label">用户ID:</span>
          <span class="value">{{ currentOrder.user_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">用户名:</span>
          <span class="value">{{ currentOrder.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态:</span>
          <span class="value">
            <el-tag :type="getStatusType(currentOrder.status)">{{ getStatusText(currentOrder.status) }}</el-tag>
          </span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间:</span>
          <span class="value">{{ formatDate(currentOrder.create_time) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">更新时间:</span>
          <span class="value">{{ formatDate(currentOrder.update_time) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">备注:</span>
          <span class="value">{{ currentOrder.remark || '无' }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
        <el-button 
          v-if="currentOrder && currentOrder.status === 'created'"
          type="success" 
          @click="handleMarkAsPaid(currentOrder)"
        >标记为已支付</el-button>
        <el-button 
          v-if="currentOrder && currentOrder.status === 'created'"
          type="danger" 
          @click="handleCancel(currentOrder)"
        >取消订单</el-button>
      </span>
    </el-dialog>

    <!-- 标记为已支付对话框 -->
    <el-dialog title="标记订单为已支付" :visible.sync="markAsPaidDialogVisible" width="500px">
      <el-form :model="markAsPaidForm" label-width="120px" :rules="markAsPaidRules" ref="markAsPaidForm">
        <el-form-item label="订单ID">
          <span>{{ markAsPaidForm.payment_id }}</span>
        </el-form-item>
        <el-form-item label="原木数量">
          <span>{{ markAsPaidForm.log_amount }}</span>
        </el-form-item>
        <el-form-item label="支付金额">
          <span>{{ (markAsPaidForm.pay_amount).toFixed(2) }}元</span>
        </el-form-item>
        <el-form-item label="用户ID">
          <span>{{ markAsPaidForm.user_id }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="markAsPaidForm.remark" placeholder="请输入操作备注"></el-input>
        </el-form-item>
        <el-form-item label="发送消息">
          <el-switch v-model="markAsPaidForm.send_message" active-text="是" inactive-text="否"></el-switch>
          <div class="tip-text">选择"是"将发送消息通知用户</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markAsPaidDialogVisible = false">取 消</el-button>
        <el-button type="success" @click="submitMarkAsPaid" :loading="submitLoading">确认标记为已支付</el-button>
      </span>
    </el-dialog>

    <!-- 取消订单对话框 -->
    <el-dialog title="取消订单" :visible.sync="cancelDialogVisible" width="500px">
      <el-form :model="cancelForm" label-width="120px" :rules="cancelRules" ref="cancelForm">
        <el-form-item label="订单ID">
          <span>{{ cancelForm.payment_id }}</span>
        </el-form-item>
        <el-form-item label="原木数量">
          <span>{{ cancelForm.log_amount }}</span>
        </el-form-item>
        <el-form-item label="支付金额">
          <span>{{ (cancelForm.pay_amount).toFixed(2) }}元</span>
        </el-form-item>
        <el-form-item label="用户ID">
          <span>{{ cancelForm.user_id }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="cancelForm.remark" placeholder="请输入取消原因"></el-input>
        </el-form-item>
        <el-form-item label="发送消息">
          <el-switch v-model="cancelForm.send_message" active-text="是" inactive-text="否"></el-switch>
          <div class="tip-text">选择"是"将发送消息通知用户</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="submitCancel" :loading="submitLoading">确认取消订单</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'PaymentOrdersManage',
  data() {
    return {
      paymentOrders: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchKeyword: '',
      statusFilter: '',
      detailDialogVisible: false,
      markAsPaidDialogVisible: false,
      cancelDialogVisible: false,
      submitLoading: false,
      currentOrder: null,
      markAsPaidForm: {
        payment_id: '',
        log_amount: 0,
        pay_amount: 0,
        user_id: '',
        remark: '',
        send_message: true
      },
      markAsPaidRules: {
        remark: [
          { required: true, message: '请输入操作备注', trigger: 'blur' }
        ]
      },
      cancelForm: {
        payment_id: '',
        log_amount: 0,
        pay_amount: 0,
        user_id: '',
        remark: '',
        send_message: true
      },
      cancelRules: {
        remark: [
          { required: true, message: '请输入取消原因', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getPaymentOrdersAmount()
    this.getPaymentOrders()
  },
  methods: {
    // 获取充值订单总数
    getPaymentOrdersAmount() {
      axios.get(this.$baseUrl + '/manage/bank/get_payment_orders_amount', {
        params: {
          keyword: this.searchKeyword,
          status: this.statusFilter
        }
      }).then(response => {
        // 后端返回的是数组，需要取第一个元素的count属性
        this.total = response.data[0].count
      }).catch(error => {
        console.error('获取充值订单总数失败:', error)
        this.$message.error('获取充值订单总数失败')
      })
    },
    // 获取充值订单列表
    getPaymentOrders() {
      this.loading = true
      axios.get(this.$baseUrl + '/manage/bank/get_payment_orders', {
        params: {
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.searchKeyword,
          status: this.statusFilter
        }
      }).then(response => {
        this.paymentOrders = response.data
        this.loading = false
      }).catch(error => {
        console.error('获取充值订单列表失败:', error)
        this.$message.error('获取充值订单列表失败')
        this.loading = false
      })
    },
    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.getPaymentOrdersAmount()
      this.getPaymentOrders()
    },
    // 重置搜索
    resetSearch() {
      this.searchKeyword = ''
      this.statusFilter = ''
      this.handleSearch()
    },
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val
      this.getPaymentOrders()
    },
    // 处理每页显示数量变化
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getPaymentOrders()
    },
    // 获取状态类型
    getStatusType(status) {
      switch (status) {
        case 'created':
          return 'warning'
        case 'paid':
          return 'success'
        case 'cancelled':
          return 'danger'
        default:
          return 'info'
      }
    },
    // 获取状态文本
    getStatusText(status) {
      switch (status) {
        case 'created':
          return '待支付'
        case 'paid':
          return '已支付'
        case 'cancelled':
          return '已取消'
        default:
          return '未知'
      }
    },
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return ''
      return moment(dateStr).format('YYYY-MM-DD HH:mm:ss')
    },
    // 查看订单详情
    handleView(row) {
      this.currentOrder = row
      this.detailDialogVisible = true
    },
    // 标记为已支付
    handleMarkAsPaid(row) {
      this.markAsPaidForm = {
        payment_id: row.payment_id,
        log_amount: row.log_amount,
        pay_amount: row.pay_amount,
        user_id: row.user_id,
        remark: '管理员手动标记为已支付',
        send_message: true
      }
      this.markAsPaidDialogVisible = true
      this.detailDialogVisible = false
    },
    // 提交标记为已支付
    submitMarkAsPaid() {
      this.$refs.markAsPaidForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          axios.post(this.$baseUrl + '/manage/bank/update_payment_order_status', {
            payment_id: this.markAsPaidForm.payment_id,
            status: 'paid',
            remark: this.markAsPaidForm.remark,
            send_message: this.markAsPaidForm.send_message
          }).then(response => {
            this.$message.success('操作成功')
            this.markAsPaidDialogVisible = false
            this.getPaymentOrders()
            this.submitLoading = false
          }).catch(error => {
            console.error('操作失败:', error)
            this.$message.error('操作失败: ' + (error.response.data.msg || '未知错误'))
            this.submitLoading = false
          })
        }
      })
    },
    // 取消订单
    handleCancel(row) {
      this.cancelForm = {
        payment_id: row.payment_id,
        log_amount: row.log_amount,
        pay_amount: row.pay_amount,
        user_id: row.user_id,
        remark: '管理员手动取消订单',
        send_message: true
      }
      this.cancelDialogVisible = true
      this.detailDialogVisible = false
    },
    // 提交取消订单
    submitCancel() {
      this.$refs.cancelForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          axios.post(this.$baseUrl + '/manage/bank/update_payment_order_status', {
            payment_id: this.cancelForm.payment_id,
            status: 'cancelled',
            remark: this.cancelForm.remark,
            send_message: this.cancelForm.send_message
          }).then(response => {
            this.$message.success('操作成功')
            this.cancelDialogVisible = false
            this.getPaymentOrders()
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
.payment-orders-container {
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
.status-select {
  width: 150px;
  margin-right: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.user-info {
  display: flex;
  align-items: center;
}
.user-name {
  margin-left: 10px;
}
.order-detail {
  padding: 10px;
}
.detail-item {
  margin-bottom: 15px;
  display: flex;
}
.detail-item .label {
  width: 100px;
  font-weight: bold;
  color: #606266;
}
.detail-item .value {
  flex: 1;
}
.tip-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>