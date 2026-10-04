<template>
  <div class="user-manage">
    <div class="page-header">
      <div>
        <h2>用户管理</h2>
        <p>搜索与筛选社区用户，管理账号状态并向用户发送站内消息。</p>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="keyword"
          clearable
          class="filter-item keyword-input"
          placeholder="搜索用户ID / 昵称 / 账号"
          @keyup.enter.native="handleSearch"
          @clear="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-select
          v-model="statusFilter"
          class="filter-item"
          placeholder="账号状态"
          @change="handleSearch"
        >
          <el-option label="全部状态" value="" />
          <el-option label="正常" value="1" />
          <el-option label="已封禁" value="0" />
        </el-select>
        <el-select
          v-model="roleFilter"
          class="filter-item"
          placeholder="用户身份"
          @change="handleSearch"
        >
          <el-option label="全部身份" value="" />
          <el-option label="管理员" value="1" />
          <el-option label="普通用户" value="0" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
      </div>
    </el-card>

    <el-table
      v-loading="loading"
      :data="list"
      stripe
      border
      style="width: 100%"
      max-height="calc(100vh - 300px)"
    >
      <el-table-column label="ID" width="90">
        <template slot-scope="scope">
          <div style="display: flex">
            <i
              class="el-icon-s-tools"
              style="color: #1989fa"
              v-show="scope.row.user_id < 0"
            ></i>
            <p :style="{ color: scope.row.user_id < 0 ? '#1989FA' : 'black' }">
              {{ scope.row.user_id }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户" min-width="170">
        <template slot-scope="scope">
          <div class="user-cell">
            <el-avatar :size="36" :src="scope.row.avatar_url">
              {{ (scope.row.name || '').charAt(0) }}
            </el-avatar>
            <span class="user-name">{{ scope.row.name || "--" }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账号" min-width="140" show-overflow-tooltip />
      <el-table-column label="用户组" width="100">
        <template slot-scope="scope">{{ scope.row.user_group || "--" }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.activated ? 'success' : 'danger'" size="small">
            {{ scope.row.activated ? "正常" : "已封禁" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="管理员" width="85">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_admin" type="warning" size="small">管理员</el-tag>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="165">
        <template slot-scope="scope">
          <p>{{ utc2beijing(scope.row.register_time) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="上次登录时间" width="165">
        <template slot-scope="scope">
          <p>{{ utc2beijing(scope.row.online_time) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            style="color: #f56c6c"
            @click="handleDeactivate(scope.row.user_id, 0)"
            v-if="scope.row.activated && scope.row.user_id >= 0"
            >封禁</el-button
          >
          <el-button
            type="text"
            size="small"
            style="color: #5cb87a"
            @click="handleDeactivate(scope.row.user_id, 1)"
            v-if="!scope.row.activated && scope.row.user_id >= 0"
            >解禁</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="to_id = scope.row.user_id; sendMsgDialog = true"
            v-if="scope.row.user_id >= 0"
            >发消息</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="发送消息" :visible.sync="sendMsgDialog" width="50%">
      <sendMsgForm :to_id="to_id" />
    </el-dialog>
  </div>
</template>


<script>
import sendMsgForm from "../../components/forms/sendMsgForm.vue";
export default {
  name: "UserManage",
  components: {
    sendMsgForm,
  },
  data() {
    return {
      keyword: "",
      statusFilter: "",
      roleFilter: "",
      list: [],
      loading: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      sendMsgDialog: false,
      to_id: undefined,
    };
  },
  methods: {
    fetchUsers() {
      let _this = this;
      this.loading = true;
      this.axios
        .get(this.$baseUrl + "/manage/users/get_users_page", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            keyword: this.keyword.trim(),
            activated: this.statusFilter,
            isAdmin: this.roleFilter,
          },
        })
        .then((res) => {
          this.list = res.data.list || [];
          this.total = res.data.total || 0;
          // 删除末页数据后回退一页，避免停留在空页
          const maxPage = Math.max(1, Math.ceil(this.total / this.pageSize));
          if (this.currentPage > maxPage) {
            this.currentPage = maxPage;
            this.fetchUsers();
          }
        })
        .catch(function () {
          _this.$message({
            showClose: true,
            message: "无权限或数据获取失败",
            type: "error",
          });
        })
        .then(() => {
          this.loading = false;
        });
    },
    handleSearch() {
      this.currentPage = 1;
      this.fetchUsers();
    },
    handleReset() {
      this.keyword = "";
      this.statusFilter = "";
      this.roleFilter = "";
      this.currentPage = 1;
      this.fetchUsers();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.fetchUsers();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchUsers();
    },
    handleDeactivate(id, activate) {
      this.$confirm(
        "确认" + (activate == 1 ? "解封" : "封禁") + "该用户?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let _this = this;
          this.axios
            .post(this.$baseUrl + "/manage/users/user_activating_set", {
              user_id: id,
              activate: activate,
            })
            .then(function () {
              _this.$message({
                showClose: true,
                message: "操作成功",
                type: "success",
              });
              _this.fetchUsers();
            })
            .catch(function (error) {
              if (error) {
                _this.$message({
                  showClose: true,
                  message: "操作失败",
                  type: "error",
                });
              }
            });
        })
        .catch(() => {});
    },
    utc2beijing(utc_datetime) {
      try {
        if (!utc_datetime) return "";
        var str = String(utc_datetime);
        // 数据库零日期（如从未登录过的用户）显示占位符
        if (str.indexOf("0000-00-00") === 0) return "--";
        // 后端直接返回 "YYYY-MM-DD HH:MM:SS" 字符串时无需时区转换
        if (str.indexOf("T") === -1) return str;
        // 转为正常的时间格式 年-月-日 时:分:秒
        var T_pos = utc_datetime.indexOf("T");
        var Z_pos = utc_datetime.indexOf("Z");
        var year_month_day = utc_datetime.substr(0, T_pos);
        var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
        var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06

        // 处理成为时间戳
        timestamp = new Date(Date.parse(new_datetime));
        timestamp = timestamp.getTime();
        timestamp = timestamp / 1000;

        // 增加8个小时，北京时间比utc时间多八个时区
        var timestamp = timestamp + 8 * 60 * 60;

        // 时间戳转为时间
        var beijing_datetime = new Date(parseInt(timestamp) * 1000)
          .toLocaleString("chinese", { hour12: false })
          .replace(/年|月/g, "-")
          .replace(/日/g, " ");
        return beijing_datetime; // 2017-03-31 16:02:06
      } catch (e) {
        return "";
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped lang="scss">
.user-manage {
  padding: 20px;
}

// 表格体强制内部竖向滚动：主题默认 .el-table__body-wrapper 为 overflow:hidden，
// 仅当根元素带 el-table--scrollable-y 类时才放开；此处强制放开并兜底限高，
// 保证表格限高后表体可滚动，分页器常驻可见
::v-deep .el-table__body-wrapper {
  overflow-y: auto;
  max-height: calc(100vh - 345px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px;
  }

  p {
    margin: 0;
    color: #8c8c8c;
  }
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-item {
  width: 150px;
}

.keyword-input {
  width: 280px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .user-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
