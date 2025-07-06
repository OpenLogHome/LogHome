<template>
  <div class="circle-manage">
    <div class="header">
      <h2>圈子管理</h2>
      <div class="search-box">
        <el-button type="primary" @click="handleCreate" style="margin-right: 15px;">创建圈子</el-button>
        <el-input
          placeholder="请输入圈子名称或描述"
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
          <el-option label="已禁用" :value="3"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">圈子总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">待审核圈子</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.active }}</div>
            <div class="stat-label">活跃圈子</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.disabled }}</div>
            <div class="stat-label">已禁用圈子</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 圈子列表 -->
    <el-table
      :data="circles"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column
        prop="circle_id"
        label="ID"
        width="80"
      ></el-table-column>
      <el-table-column label="圈子信息" min-width="300">
        <template slot-scope="scope">
          <div class="circle-info">
            <img :src="scope.row.icon" class="circle-avatar" fit="cover" style="width: 40px; height: 40px; border-radius: 50%;">
            </img>
            <div class="circle-details">
              <div class="circle-name">{{ scope.row.name }}</div>
              <div class="circle-desc">{{ scope.row.description }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="category_name"
        label="分类"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="creator_name"
        label="创建者"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="member_count"
        label="成员数"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="post_count"
        label="帖子数"
        width="100"
      ></el-table-column>
      <el-table-column
        label="创建时间"
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
            @click="handleToggleStatus(scope.row)"
            :type="scope.row.status === 1 ? 'danger' : 'success'"
            plain
            v-if="scope.row.status === 1 || scope.row.status === 3"
          >{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
          <el-button
            size="mini"
            @click="handleMembers(scope.row)"
            type="info"
            plain
          >成员</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            type="warning"
            plain
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
      title="圈子审核"
      :visible.sync="auditDialogVisible"
      width="500px"
    >
      <div class="audit-dialog-content">
        <div class="circle-info-dialog">
          <el-avatar :size="60" :src="currentCircle.icon"></el-avatar>
          <div class="circle-details-dialog">
            <div class="circle-name">{{ currentCircle.name }}</div>
            <div class="circle-desc">{{ currentCircle.description }}</div>
            <div class="circle-meta">
              <span>分类：{{ currentCircle.category_name }}</span>
              <span>创建者：{{ currentCircle.creator_name }}</span>
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

    <!-- 禁用/启用弹窗 -->
    <el-dialog
      :title="currentCircle.status === 1 ? '禁用圈子' : '启用圈子'"
      :visible.sync="statusDialogVisible"
      width="500px"
    >
      <div class="status-dialog-content">
        <p>确定要{{ currentCircle.status === 1 ? '禁用' : '启用' }}圈子 "{{ currentCircle.name }}" 吗？</p>
        <el-form :model="statusForm" label-width="80px" class="status-form" v-if="currentCircle.status === 1">
          <el-form-item label="禁用理由">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入禁用理由"
              v-model="statusForm.reason"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitToggleStatus" :loading="statusSubmitting">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      title="圈子详情"
      :visible.sync="detailDialogVisible"
      width="700px"
    >
      <div class="detail-dialog-content" v-loading="detailLoading">
        <div class="circle-header">
          <el-image :src="circleDetail.icon" class="circle-avatar-detail" fit="cover">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="circle-details-header">
            <h3>{{ circleDetail.name }}</h3>
            <div class="circle-meta-detail">
              <el-tag>{{ getStatusText(circleDetail.status) }}</el-tag>
              <span>成员：{{ circleDetail.member_count }}</span>
              <span>帖子：{{ circleDetail.post_count }}</span>
              <span>创建时间：{{ formatDate(circleDetail.create_time) }}</span>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="圈子ID">{{ circleDetail.circle_id }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ circleDetail.category_name }}</el-descriptions-item>
          <el-descriptions-item label="创建者">{{ circleDetail.creator_name }}</el-descriptions-item>
          <el-descriptions-item label="需要验证">{{ circleDetail.need_verification ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="官方圈子">{{ circleDetail.is_official ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="最后更新时间">{{ formatDate(circleDetail.update_time) }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ circleDetail.description }}</el-descriptions-item>
          <el-descriptions-item label="规则" :span="2">{{ circleDetail.rules || '无' }}</el-descriptions-item>
          <el-descriptions-item label="公告" :span="2">{{ circleDetail.announcement || '无' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="handleViewPosts">查看圈子帖子</el-button>
      </span>
    </el-dialog>

    <!-- 创建/编辑圈子弹窗 -->
    <el-dialog
      :title="currentCircle.circle_id ? '编辑圈子' : '创建圈子'"
      :visible.sync="createDialogVisible"
      width="600px"
    >
      <div class="create-dialog-content">
        <el-form :model="createForm" :rules="createRules" ref="createForm" label-width="100px">
          <el-form-item label="圈子名称" prop="name">
            <el-input v-model="createForm.name" placeholder="请输入圈子名称"></el-input>
          </el-form-item>
          <el-form-item label="圈子描述" prop="description">
            <el-input type="textarea" v-model="createForm.description" :rows="4" placeholder="请输入圈子描述"></el-input>
          </el-form-item>
          <el-form-item label="圈子图标" prop="icon">
            <div class="avatar-uploader" @click="handleIconUpload">
              <img v-if="createForm.icon" :src="createForm.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <div class="el-upload__tip">建议上传正方形图片，大小不超过2MB</div>
          </el-form-item>
          <el-form-item label="背景图" prop="bg_url">
            <div class="bg-uploader" @click="handleBgUpload">
              <img v-if="createForm.bg_url" :src="createForm.bg_url" class="bg-image">
              <div v-else class="bg-uploader-placeholder">
                <i class="el-icon-plus"></i>
                <div>点击上传背景图</div>
              </div>
            </div>
            <div class="el-upload__tip">建议上传宽度大于高度的图片，大小不超过5MB</div>
          </el-form-item>
          <el-form-item label="圈主" prop="creator_id">
            <el-select
              v-model="createForm.creator_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入用户名或ID搜索"
              :remote-method="remoteSearchUsers"
              :loading="userSearchLoading"
              :disabled="!!currentCircle.circle_id"
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
            <div class="el-form-item__description" v-if="currentCircle.circle_id">编辑模式下不可修改圈主</div>
          </el-form-item>
          <el-form-item label="圈子分类" prop="category_id">
            <el-select v-model="createForm.category_id" placeholder="请选择圈子分类">
              <el-option
                v-for="item in categories"
                :key="item.category_id"
                :label="item.name"
                :value="item.category_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="圈子规则" prop="rules">
            <el-input type="textarea" v-model="createForm.rules" :rows="4" placeholder="请输入圈子规则"></el-input>
          </el-form-item>
          <el-form-item label="圈子公告" prop="announcement">
            <el-input type="textarea" v-model="createForm.announcement" :rows="4" placeholder="请输入圈子公告"></el-input>
          </el-form-item>
          <el-form-item label="需要验证" prop="need_verification">
            <el-switch v-model="createForm.need_verification"></el-switch>
          </el-form-item>
          <el-form-item label="官方圈子" prop="is_official">
            <el-switch v-model="createForm.is_official"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCreate" :loading="createSubmitting">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 成员管理弹窗 -->
    <el-dialog
      title="成员管理"
      :visible.sync="membersDialogVisible"
      width="800px"
    >
      <div class="members-dialog-content">
        <div class="members-header">
          <el-input
            placeholder="搜索成员"
            v-model="memberSearchKeyword"
            class="member-search"
            @keyup.enter.native="handleMemberSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleMemberSearch"></el-button>
          </el-input>
          <el-button type="primary" @click="handleAddMember">添加成员</el-button>
        </div>
        
        <el-tabs v-model="memberActiveTab" @tab-click="handleMemberTabChange">
          <el-tab-pane label="成员列表" name="members">
            <el-table :data="members" v-loading="membersLoading">
              <el-table-column label="成员信息" min-width="200">
                <template slot-scope="scope">
                  <div class="member-info">
                    <el-avatar :size="40" :src="scope.row.avatar_url"></el-avatar>
                    <div class="member-details">
                      <div class="member-name">{{ scope.row.name }}</div>
                      <div class="member-id">ID: {{ scope.row.user_id }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="post_count" label="发帖数" width="100"></el-table-column>
              <el-table-column label="角色" width="120">
                <template slot-scope="scope">
                  <el-tag :type="getMemberRoleType(scope.row.role)">{{ getMemberRoleText(scope.row.role) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="加入时间" width="180">
                <template slot-scope="scope">
                  {{ formatDate(scope.row.join_time) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleUpdateRole(scope.row)"
                    type="primary"
                    plain
                    v-if="scope.row.role !== 2"
                  >修改角色</el-button>
                  <el-button
                    size="mini"
                    @click="handleBanMember(scope.row)"
                    type="warning"
                    plain
                    v-if="scope.row.role !== 2"
                  >禁言/踢出</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination-container">
              <el-pagination
                @size-change="handleMemberSizeChange"
                @current-change="handleMemberCurrentChange"
                :current-page="memberPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="memberPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="memberTotal"
              ></el-pagination>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="禁用记录" name="bans">
            <el-table :data="bans" v-loading="bansLoading">
              <el-table-column label="用户信息" min-width="200">
                <template slot-scope="scope">
                  <div class="member-info">
                    <el-avatar :size="40" :src="scope.row.avatar_url"></el-avatar>
                    <div class="member-details">
                      <div class="member-name">{{ scope.row.user_name }}</div>
                      <div class="member-id">ID: {{ scope.row.user_id }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="类型" width="100">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.ban_type === 0 ? 'warning' : 'danger'">
                    {{ scope.row.ban_type === 0 ? '禁言' : '踢出' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="reason" label="原因" min-width="150"></el-table-column>
              <el-table-column label="操作人" width="120">
                <template slot-scope="scope">
                  {{ scope.row.operator_name }}
                </template>
              </el-table-column>
              <el-table-column label="时间" width="180">
                <template slot-scope="scope">
                  {{ formatDate(scope.row.create_time) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleRemoveBan(scope.row)"
                    type="primary"
                    plain
                  >解除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination-container">
              <el-pagination
                @size-change="handleBanSizeChange"
                @current-change="handleBanCurrentChange"
                :current-page="banPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="banPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="banTotal"
              ></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <!-- 添加成员弹窗 -->
    <el-dialog
      title="添加成员"
      :visible.sync="addMemberDialogVisible"
      width="500px"
    >
      <div class="add-member-dialog-content">
        <el-form :model="addMemberForm" :rules="addMemberRules" ref="addMemberForm" label-width="80px">
          <el-form-item label="用户" prop="user_id">
            <el-select
              v-model="addMemberForm.user_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入用户名或ID搜索"
              :remote-method="remoteSearchUsers"
              :loading="userSearchLoading"
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
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-radio-group v-model="addMemberForm.role">
              <el-radio :label="0">普通成员</el-radio>
              <el-radio :label="1">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMemberDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddMember" :loading="addMemberSubmitting">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色弹窗 -->
    <el-dialog
      title="修改成员角色"
      :visible.sync="roleDialogVisible"
      width="400px"
    >
      <div class="role-dialog-content">
        <el-form :model="roleForm" label-width="80px">
          <el-form-item label="角色">
            <el-radio-group v-model="roleForm.role">
              <el-radio :label="0">普通成员</el-radio>
              <el-radio :label="1">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateRole" :loading="roleSubmitting">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 禁言/踢出弹窗 -->
    <el-dialog
      title="禁言/踢出成员"
      :visible.sync="banDialogVisible"
      width="500px"
    >
      <div class="ban-dialog-content">
        <el-form :model="banForm" :rules="banRules" ref="banForm" label-width="80px">
          <el-form-item label="类型" prop="ban_type">
            <el-radio-group v-model="banForm.ban_type">
              <el-radio :label="0">禁言</el-radio>
              <el-radio :label="1">踢出</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时长" prop="duration" v-if="banForm.ban_type === 0">
            <el-input-number v-model="banForm.duration" :min="1" :max="43200" placeholder="请输入禁言时长（分钟）"></el-input-number>
            <div class="el-form-item__description">最长30天（43200分钟）</div>
          </el-form-item>
          <el-form-item label="原因" prop="reason">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入原因"
              v-model="banForm.reason"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="banDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBan" :loading="banSubmitting">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CircleManage',
  data() {
    return {
      // 搜索和筛选
      searchKeyword: '',
      statusFilter: -1,
      
      // 分页
      currentPage: 1,
      pageSize: 20,
      total: 0,
      
      // 数据
      circles: [],
      loading: false,
      stats: {
        total: 0,
        pending: 0,
        active: 0,
        disabled: 0
      },
      
      // 审核弹窗
      auditDialogVisible: false,
      currentCircle: {},
      auditForm: {
        status: 1,
        reason: ''
      },
      auditSubmitting: false,
      
      // 状态切换弹窗
      statusDialogVisible: false,
      statusForm: {
        reason: ''
      },
      statusSubmitting: false,
      
      // 详情弹窗
      detailDialogVisible: false,
      circleDetail: {},
      detailLoading: false,
      
      // 创建圈子
      createDialogVisible: false,
      createForm: {
        name: '',
        description: '',
        icon: '',
        bg_url: '',
        creator_id: '',
        category_id: '',
        rules: '',
        announcement: '',
        need_verification: false,
        is_official: false
      },
      createRules: {
        name: [{ required: true, message: '请输入圈子名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入圈子描述', trigger: 'blur' }],
        creator_id: [{ required: true, message: '请选择圈主', trigger: 'change' }]
      },
      createSubmitting: false,
      userSearchLoading: false,
      userOptions: [],
      categories: [],
      
      // 成员管理
      membersDialogVisible: false,
      memberActiveTab: 'members',
      memberSearchKeyword: '',
      members: [],
      membersLoading: false,
      memberPage: 1,
      memberPageSize: 20,
      memberTotal: 0,
      
      // 禁用记录
      bans: [],
      bansLoading: false,
      banPage: 1,
      banPageSize: 20,
      banTotal: 0,
      
      // 角色修改
      roleDialogVisible: false,
      roleForm: {
        role: 0
      },
      currentMember: {},
      roleSubmitting: false,
      
      // 禁言/踢出
      banDialogVisible: false,
      banForm: {
        ban_type: 0,
        duration: 60,
        reason: ''
      },
      banRules: {
        reason: [{ required: true, message: '请输入原因', trigger: 'blur' }],
        duration: [{ required: true, message: '请输入禁言时长', trigger: 'blur' }]
      },
      banSubmitting: false,
      
      // 添加成员
      addMemberDialogVisible: false,
      addMemberForm: {
        user_id: '',
        role: 0
      },
      addMemberRules: {
        user_id: [{ required: true, message: '请选择用户', trigger: 'change' }]
      },
      addMemberSubmitting: false
    }
  },
  created() {
    this.fetchCircleStats();
    this.fetchCircles();
    this.fetchCategories(); // 获取圈子分类
  },
  methods: {
    // 获取圈子统计数据
    async fetchCircleStats() {
      try {
        // 获取圈子总数
        const response = await this.axios.get(this.$baseUrl + '/manage/community/circles/count');
        if (response.data) {
          this.stats.total = response.data.count || 0;
        }
        
        // 分别获取各状态的圈子数量
        try {
          const pendingResponse = await this.axios.get(this.$baseUrl + '/manage/community/circles/list', {
            params: { status: 0, pageSize: 1 }
          });
          this.stats.pending = pendingResponse.data.total || 0;
        } catch (error) {
          console.error('获取待审核圈子数量失败', error);
          this.stats.pending = 0;
        }
        
        try {
          const activeResponse = await this.axios.get(this.$baseUrl + '/manage/community/circles/list', {
            params: { status: 1, pageSize: 1 }
          });
          this.stats.active = activeResponse.data.total || 0;
        } catch (error) {
          console.error('获取活跃圈子数量失败', error);
          this.stats.active = 0;
        }
        
        try {
          const disabledResponse = await this.axios.get(this.$baseUrl + '/manage/community/circles/list', {
            params: { status: 3, pageSize: 1 }
          });
          this.stats.disabled = disabledResponse.data.total || 0;
        } catch (error) {
          console.error('获取禁用圈子数量失败', error);
          this.stats.disabled = 0;
        }
      } catch (error) {
        console.error('获取圈子统计数据失败', error);
        this.$message.error('获取圈子统计数据失败');
      }
    },
    
    // 获取圈子列表
    async fetchCircles() {
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
        
        const response = await this.axios.get(this.$baseUrl + '/manage/community/circles/list', { params });
        
        if (response.data) {
          this.circles = response.data.list || [];
          this.total = response.data.total || 0;
        }
      } catch (error) {
        console.error('获取圈子列表失败', error);
        this.$message.error('获取圈子列表失败');
      } finally {
        this.loading = false;
      }
    },
    
    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.fetchCircles();
    },
    
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchCircles();
    },
    
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchCircles();
    },
    
    // 查看详情
    async handleDetail(row) {
      this.currentCircle = row;
      this.detailDialogVisible = true;
      this.detailLoading = true;
      
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/community/circles/detail', {
          params: { circle_id: row.circle_id }
        });
        
        if (response.data) {
          this.circleDetail = response.data;
        }
      } catch (error) {
        console.error('获取圈子详情失败', error);
        this.$message.error('获取圈子详情失败');
      } finally {
        this.detailLoading = false;
      }
    },
    
    // 查看圈子帖子
    handleViewPosts() {
      this.$router.push({
        path: '/communityPosts',
        query: { circle_id: this.circleDetail.circle_id, circle_name: this.circleDetail.name }
      });
    },
    
    // 审核
    handleAudit(row) {
      this.currentCircle = row;
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
        const response = await this.axios.post(this.$baseUrl + '/manage/community/circles/audit', {
          circle_id: this.currentCircle.circle_id,
          status: this.auditForm.status,
          reason: this.auditForm.reason
        });
        
        if (response.data) {
          this.$message.success('审核成功');
          this.auditDialogVisible = false;
          this.fetchCircleStats();
          this.fetchCircles();
        }
      } catch (error) {
        console.error('审核失败', error);
        this.$message.error('审核失败：' + (error.response?.data?.msg || '未知错误'));
      } finally {
        this.auditSubmitting = false;
      }
    },
    
    // 切换状态
    handleToggleStatus(row) {
      this.currentCircle = row;
      this.statusForm = {
        reason: ''
      };
      this.statusDialogVisible = true;
    },
    
    // 提交状态切换
    async submitToggleStatus() {
      if (this.currentCircle.status === 1 && !this.statusForm.reason) {
        this.$message.warning('请填写禁用理由');
        return;
      }
      
      this.statusSubmitting = true;
      try {
        const response = await this.axios.post(this.$baseUrl + '/manage/community/circles/toggle-status', {
          circle_id: this.currentCircle.circle_id,
          status: this.currentCircle.status === 1 ? 3 : 1, // 1: 启用, 3: 禁用
          reason: this.statusForm.reason
        });
        
        if (response.data) {
          this.$message.success(this.currentCircle.status === 1 ? '禁用成功' : '启用成功');
          this.statusDialogVisible = false;
          this.fetchCircleStats();
          this.fetchCircles();
        }
      } catch (error) {
        console.error('操作失败', error);
        this.$message.error('操作失败：' + (error.response?.data?.msg || '未知错误'));
      } finally {
        this.statusSubmitting = false;
      }
    },
    
    // 创建圈子
    handleCreate() {
      this.currentCircle = {};
      this.createForm = {
        name: '',
        description: '',
        icon: '',
        bg_url: '',
        creator_id: '',
        category_id: '',
        rules: '',
        announcement: '',
        need_verification: false,
        is_official: false
      };
      this.createDialogVisible = true;
    },
    
    // 编辑圈子
    async handleEdit(row) {
      this.currentCircle = row;
      this.detailLoading = true;
      
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/community/circles/detail', {
          params: { circle_id: row.circle_id }
        });
        
        if (response.data) {
          const circleData = response.data;
          this.createForm = {
            circle_id: circleData.circle_id,
            name: circleData.name,
            description: circleData.description,
            icon: circleData.icon || '',
            bg_url: circleData.bg_url || '',
            creator_id: circleData.creator_id,
            category_id: circleData.category_id || '',
            rules: circleData.rules || '',
            announcement: circleData.announcement || '',
            need_verification: !!circleData.need_verification,
            is_official: !!circleData.is_official
          };
          this.createDialogVisible = true;
        }
      } catch (error) {
        console.error('获取圈子详情失败', error);
        this.$message.error('获取圈子详情失败');
      } finally {
        this.detailLoading = false;
      }
    },
    
    // 图片上传
    handleIconUpload() {
      this.$confirm('请选择上传方式', '上传图标', {
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
          const isLt2M = file.size / 1024 / 1024 < 2;
          
          if (!isImage) {
            this.$message.error('上传头像图片只能是图片格式!');
            return;
          }
          
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            return;
          }
          
          // 上传文件
          this.uploadFile(file).then(res => {
            if (res && res.url) {
              this.createForm.icon = res.url;
            }
          });
        };
        
        // 触发文件选择
        input.click();
      }).catch(() => {});
    },

    // 处理背景图上传
    handleBgUpload() {
      this.$confirm('请选择上传方式', '上传背景图', {
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
            this.$message.error('上传背景图只能是图片格式!');
            return;
          }
          
          if (!isLt5M) {
            this.$message.error('上传背景图大小不能超过 5MB!');
            return;
          }
          
          // 上传文件
          this.uploadFile(file).then(res => {
            if (res && res.url) {
              this.createForm.bg_url = res.url;
            }
          });
        };
        
        // 触发文件选择
        input.click();
      }).catch(() => {});
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
    
    // 提交创建
    async submitCreate() {
      this.$refs.createForm.validate(async valid => {
        if (!valid) return;
        
        this.createSubmitting = true;
        try {
          let url, successMsg;
          
          if (this.currentCircle.circle_id) {
            // 编辑模式
            url = this.$baseUrl + '/manage/community/circles/update';
            successMsg = '更新成功';
          } else {
            // 创建模式
            url = this.$baseUrl + '/manage/community/circles/create';
            successMsg = '创建成功';
          }
          
          const response = await this.axios.post(url, this.createForm);
          
          if (response.data) {
            this.$message.success(successMsg);
            this.createDialogVisible = false;
            this.fetchCircleStats();
            this.fetchCircles();
          }
        } catch (error) {
          console.error('操作失败', error);
          this.$message.error('操作失败：' + (error.response?.data?.msg || '未知错误'));
        } finally {
          this.createSubmitting = false;
        }
      });
    },
    
    // 获取圈子分类
    async fetchCategories() {
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/community/circles/categories');
        if (response.data) {
          this.categories = response.data;
        }
      } catch (error) {
        console.error('获取圈子分类失败', error);
        this.$message.error('获取圈子分类失败');
      }
    },
    
    // 成员管理
    async handleMembers(row) {
      this.currentCircle = row;
      this.membersDialogVisible = true;
      this.memberActiveTab = 'members';
      this.memberPage = 1;
      this.banPage = 1;
      this.fetchMembers();
    },
    
    // 获取成员列表
    async fetchMembers() {
      this.membersLoading = true;
      try {
        const params = {
          circle_id: this.currentCircle.circle_id,
          page: this.memberPage,
          pageSize: this.memberPageSize
        };
        
        if (this.memberSearchKeyword) {
          params.keyword = this.memberSearchKeyword;
        }
        
        const response = await this.axios.get(this.$baseUrl + '/manage/community/circles/members', { params });
        
        if (response.data) {
          this.members = response.data.list;
          this.memberTotal = response.data.total;
        }
      } catch (error) {
        console.error('获取成员列表失败', error);
        this.$message.error('获取成员列表失败');
      } finally {
        this.membersLoading = false;
      }
    },
    
    // 获取禁用记录
    async fetchBans() {
      this.bansLoading = true;
      try {
        const response = await this.axios.get(this.$baseUrl + '/manage/community/circles/bans', {
          params: {
            circle_id: this.currentCircle.circle_id,
            page: this.banPage,
            pageSize: this.banPageSize
          }
        });
        
        if (response.data) {
          this.bans = response.data.list;
          this.banTotal = response.data.total;
        }
      } catch (error) {
        console.error('获取禁用记录失败', error);
        this.$message.error('获取禁用记录失败');
      } finally {
        this.bansLoading = false;
      }
    },
    
    // 切换标签页
    handleMemberTabChange(tab) {
      if (tab.name === 'bans') {
        this.fetchBans();
      } else {
        this.fetchMembers();
      }
    },
    
    // 搜索成员
    handleMemberSearch() {
      this.memberPage = 1;
      this.fetchMembers();
    },
    
    // 成员分页
    handleMemberSizeChange(val) {
      this.memberPageSize = val;
      this.fetchMembers();
    },
    
    handleMemberCurrentChange(val) {
      this.memberPage = val;
      this.fetchMembers();
    },
    
    // 禁用分页
    handleBanSizeChange(val) {
      this.banPageSize = val;
      this.fetchBans();
    },
    
    handleBanCurrentChange(val) {
      this.banPage = val;
      this.fetchBans();
    },
    
    // 修改角色
    handleUpdateRole(row) {
      this.currentMember = row;
      this.roleForm.role = row.role;
      this.roleDialogVisible = true;
    },
    
    // 提交角色修改
    async submitUpdateRole() {
      this.roleSubmitting = true;
      try {
        const response = await this.axios.post(this.$baseUrl + '/manage/community/circles/members/update-role', {
          circle_id: this.currentCircle.circle_id,
          user_id: this.currentMember.user_id,
          role: this.roleForm.role
        });
        
        if (response.data) {
          this.$message.success('修改成功');
          this.roleDialogVisible = false;
          this.fetchMembers();
        }
      } catch (error) {
        console.error('修改失败', error);
        this.$message.error('修改失败：' + (error.response?.data?.msg || '未知错误'));
      } finally {
        this.roleSubmitting = false;
      }
    },
    
    // 禁言/踢出
    handleBanMember(row) {
      this.currentMember = row;
      this.banForm = {
        ban_type: 0,
        duration: 60,
        reason: ''
      };
      this.banDialogVisible = true;
    },
    
    // 提交禁言/踢出
    async submitBan() {
      this.$refs.banForm.validate(async valid => {
        if (!valid) return;
        
        this.banSubmitting = true;
        try {
          const response = await this.axios.post(this.$baseUrl + '/manage/community/circles/members/ban', {
            circle_id: this.currentCircle.circle_id,
            user_id: this.currentMember.user_id,
            ...this.banForm
          });
          
          if (response.data) {
            this.$message.success(this.banForm.ban_type === 0 ? '禁言成功' : '踢出成功');
            this.banDialogVisible = false;
            this.fetchMembers();
            this.fetchBans();
          }
        } catch (error) {
          console.error('操作失败', error);
          this.$message.error('操作失败：' + (error.response?.data?.msg || '未知错误'));
        } finally {
          this.banSubmitting = false;
        }
      });
    },
    
    // 解除禁用
    async handleRemoveBan(row) {
      try {
        const response = await this.axios.post(this.$baseUrl + '/manage/community/circles/bans/remove', {
          ban_id: row.ban_id
        });
        
        if (response.data) {
          this.$message.success('解除成功');
          this.fetchBans();
          this.fetchMembers();
        }
      } catch (error) {
        console.error('解除失败', error);
        this.$message.error('解除失败：' + (error.response?.data?.msg || '未知错误'));
      }
    },
    
    // 添加成员
    handleAddMember() {
      this.addMemberForm = {
        user_id: '',
        role: 0
      };
      this.addMemberDialogVisible = true;
    },
    
    // 提交添加成员
    async submitAddMember() {
      this.$refs.addMemberForm.validate(async valid => {
        if (!valid) return;
        
        this.addMemberSubmitting = true;
        try {
          const response = await this.axios.post(this.$baseUrl + '/manage/community/circles/members/add', {
            circle_id: this.currentCircle.circle_id,
            user_id: this.addMemberForm.user_id,
            role: this.addMemberForm.role
          });
          
          if (response.data) {
            this.$message.success('添加成功');
            this.addMemberDialogVisible = false;
            this.fetchMembers();
          }
        } catch (error) {
          console.error('添加失败', error);
          this.$message.error('添加失败：' + (error.response?.data?.msg || '未知错误'));
        } finally {
          this.addMemberSubmitting = false;
        }
      });
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
        3: '已禁用'
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
    
    // 获取成员角色文本
    getMemberRoleText(role) {
      const roleMap = {
        0: '普通成员',
        1: '管理员',
        2: '圈主'
      };
      return roleMap[role] || '未知';
    },
    
    // 获取成员角色标签类型
    getMemberRoleType(role) {
      const typeMap = {
        0: '',
        1: 'success',
        2: 'danger'
      };
      return typeMap[role] || '';
    },

    // 处理圈子图标上传
    handleIconUpload() {
      this.$confirm('请选择上传方式', '上传图标', {
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
          const isLt2M = file.size / 1024 / 1024 < 2;
          
          if (!isImage) {
            this.$message.error('上传头像图片只能是图片格式!');
            return;
          }
          
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            return;
          }
          
          // 上传文件
          this.uploadFile(file).then(res => {
            if (res && res.url) {
              this.createForm.icon = res.url;
            }
          });
        };
        
        // 触发文件选择
        input.click();
      }).catch(() => {});
    },

    // 处理背景图上传
    handleBgUpload() {
      this.$confirm('请选择上传方式', '上传背景图', {
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
            this.$message.error('上传背景图只能是图片格式!');
            return;
          }
          
          if (!isLt5M) {
            this.$message.error('上传背景图大小不能超过 5MB!');
            return;
          }
          
          // 上传文件
          this.uploadFile(file).then(res => {
            if (res && res.url) {
              this.createForm.bg_url = res.url;
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
    
    // 图片预览
    previewImage(images, index) {
      // Element UI 已经有内置的图片预览功能，但如果需要手动触发，可以这样实现
      const previewImages = images.map(url => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-manage {
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
  
  .circle-info {
    display: flex;
    align-items: center;
    
    .circle-details {
      margin-left: 15px;
      
      .circle-name {
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .circle-desc {
        font-size: 12px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .circle-info-dialog {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    
    .circle-details-dialog {
      margin-left: 20px;
      
      .circle-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .circle-desc {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
      }
      
      .circle-meta {
        font-size: 12px;
        color: #999;
        
        span {
          margin-right: 15px;
        }
      }
    }
  }
  
  .circle-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .circle-details-header {
      margin-left: 20px;
      
      h3 {
        margin: 0 0 10px 0;
      }
      
      .circle-meta-detail {
        span {
          margin-left: 15px;
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}

.circle-avatar-detail {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  margin-right: 20px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
  
  &:hover {
    border-color: #409EFF;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}

.bg-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
  
  &:hover {
    border-color: #409EFF;
  }
  
  .bg-uploader-placeholder {
    width: 300px;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #8c939d;
    
    i {
      font-size: 28px;
      margin-bottom: 10px;
    }
  }
  
  .bg-image {
    width: 300px;
    height: 120px;
    object-fit: cover;
    display: block;
  }
}

.members-dialog-content {
  .members-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .member-search {
      width: 300px;
    }
  }
  
  .member-info {
    display: flex;
    align-items: center;
    
    .member-details {
      margin-left: 10px;
      
      .member-name {
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .member-id {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.add-member-dialog-content {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style> 