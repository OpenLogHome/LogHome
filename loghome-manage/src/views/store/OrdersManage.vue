<template>
  <div class="orders-manage">
    <div class="toolbar">
      <el-button @click="loadList">刷新</el-button>
    </div>
    <el-table :data="list" border v-loading="loading">
      <el-table-column prop="id" label="订单ID" width="100"></el-table-column>
      <el-table-column prop="order_no" label="订单号" width="220"></el-table-column>
      <el-table-column prop="user_id" label="用户ID" width="100"></el-table-column>
      <el-table-column prop="product_title" label="商品名称" min-width="180"></el-table-column>
      <el-table-column prop="product_type" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.product_type === 'physical' ? 'warning' : 'success'">
            {{ scope.row.product_type === 'physical' ? '实物' : '虚拟' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="statusType(scope.row.status)">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tracking_number" label="快递单号/兑换码" min-width="180"></el-table-column>
      <el-table-column label="收货信息" min-width="260">
        <template slot-scope="scope">
          <div v-if="scope.row.product_type === 'physical'">
            <div>{{ scope.row.receiver_name || '-' }} {{ scope.row.receiver_phone || '' }}</div>
            <div>
              {{ formatAddress(scope.row) }}
            </div>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="260">
        <template slot-scope="scope">
          创建：{{ format(scope.row.created_at) }}<br/>
          发货：{{ format(scope.row.shipped_at) }}<br/>
          完成：{{ format(scope.row.completed_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.product_type === 'physical' && scope.row.status === 'pending'"
            size="mini" type="primary" @click="openShip(scope.row)">发货</el-button>
          <el-button size="mini" @click="copyTracking(scope.row)">复制单号/兑换码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handlePage"
        :current-page="page"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
      />
    </div>

    <el-dialog title="填写发货信息" :visible.sync="shipDialogVisible" width="520px">
      <el-form :model="shipForm" label-width="120px">
        <el-form-item label="订单号">
          <span>{{ shipForm.order_no }}</span>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="shipForm.tracking_number" placeholder="请输入快递单号" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitShip" :loading="submitLoading">确 认 发 货</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OrdersManage',
  data() {
    return {
      list: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      shipDialogVisible: false,
      submitLoading: false,
      shipForm: {
        id: null,
        order_no: '',
        tracking_number: ''
      }
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    getToken() {
      let tk = JSON.parse(window.localStorage.getItem('token'))
      if (tk) tk = tk.tk
      return tk
    },
    loadList() {
      this.loading = true
      axios.get(this.$baseUrl + '/manage/store/orders', {
        params: { page: this.page, pageSize: this.pageSize },
        headers: { Authorization: this.getToken() }
      }).then(res => {
        if (res.data && res.data.code === 200) {
          this.list = res.data.data.list || []
          this.total = res.data.data.total || 0
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handlePage(p) {
      this.page = p
      this.loadList()
    },
    statusText(s) {
      if (s === 'pending') return '待发货'
      if (s === 'shipped') return '已发货'
      if (s === 'completed') return '已完成'
      if (s === 'canceled' || s === 'cancelled') return '已取消'
      return s
    },
    statusType(s) {
      if (s === 'pending') return 'warning'
      if (s === 'shipped') return 'info'
      if (s === 'completed') return 'success'
      if (s === 'canceled' || s === 'cancelled') return ''
      return ''
    },
    formatAddress(row) {
      return [
        row.receiver_province || '',
        row.receiver_city || '',
        row.receiver_district || '',
        row.receiver_detail || ''
      ].join('') || '-'
    },
    format(t) {
      if (!t) return '-'
      const d = new Date(t)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const h = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${y}-${m}-${dd} ${h}:${mm}`
    },
    openShip(row) {
      this.shipForm = { id: row.id, order_no: row.order_no, tracking_number: '' }
      this.shipDialogVisible = true
    },
    submitShip() {
      if (!this.shipForm.tracking_number) {
        this.$message.error('请输入快递单号')
        return
      }
      this.submitLoading = true
      axios.post(this.$baseUrl + `/manage/store/orders/${this.shipForm.id}/ship`, {
        tracking_number: this.shipForm.tracking_number
      }, {
        headers: { Authorization: this.getToken() }
      }).then(res => {
        if (res.data && res.data.code === 200) {
          this.$message.success('已发货')
          this.shipDialogVisible = false
          this.loadList()
        } else {
          this.$message.error(res.data.msg || '发货失败')
        }
      }).finally(() => {
        this.submitLoading = false
      })
    },
    copyTracking(row) {
      const code = row.tracking_number || ''
      if (!code) {
        this.$message.warning('暂无单号/兑换码')
        return
      }
      this.$copyText(code).then(() => {
        this.$message.success('已复制')
      })
    }
  }
}
</script>

<style scoped>
.orders-manage {
  padding: 20px;
}
.toolbar {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
