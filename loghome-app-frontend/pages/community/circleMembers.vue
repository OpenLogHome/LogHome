<!-- 圈子成员列表页面 -->
<template>
  <view class="members-container">
    <!-- 顶部标签页 -->
    <view class="tabs">
      <view class="tab" :class="{ active: currentTab === 'members' }" @tap="switchTab('members')">成员列表</view>
      <view class="tab" :class="{ active: currentTab === 'banned' }" @tap="switchTab('banned')" v-if="userRole === 1 || userRole === 2">禁言名单</view>
    </view>
    
    <!-- 加入申请列表 - 只对圈主和管理员可见 -->
    <view class="join-requests" v-if="(userRole === 1 || userRole === 2) && joinRequests.length > 0 && currentTab === 'members'">
      <view class="role-group">
        <view class="role-title">入圈申请 ({{joinRequests.length}})</view>
        <view class="member-list">
          <view class="member-item" v-for="(request, index) in joinRequests" :key="'req-'+index">
            <view class="member-info" @tap="navigateToUser(request.user_id)">
              <log-image class="member-avatar" :src="request.avatar_url" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
              <view class="member-details">
                <text class="member-name">{{request.name}}</text>
                <text class="member-motto" v-if="request.verification_info">{{request.verification_info}}</text>
                <text class="request-time">{{formatTime(request.create_time)}}</text>
              </view>
            </view>
            <view class="request-actions">
              <view class="request-btn approve" @tap="reviewJoinRequest(request.request_id, 1)">
                <uni-icons type="checkmarkempty" size="16" color="#fff"></uni-icons>
              </view>
              <view class="request-btn reject" @tap="reviewJoinRequest(request.request_id, 2)">
                <uni-icons type="closeempty" size="16" color="#fff"></uni-icons>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 成员列表 -->
    <view class="members-list" v-if="currentTab === 'members'">
      <!-- 角色分组：管理组（包括圈主和管理员） -->
      <view class="role-group" v-if="managementMembers.length > 0">
        <view class="role-title">管理组</view>
        <view class="member-list">
          <view class="member-item" v-for="(member, index) in managementMembers" :key="index" @tap="navigateToUser(member.user_id)">
            <view class="member-info">
              <log-image class="member-avatar" :src="member.avatar_url" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
              <view class="member-details">
                <text class="member-name">{{member.name}}</text>
                <text class="member-motto" v-if="member.motto">{{member.motto}}</text>
              </view>
            </view>
            <view class="member-actions">
              <view class="member-role-tag" :class="member.role === 2 ? 'owner' : 'admin'">{{member.role === 2 ? '圈主' : '管理员'}}</view>
              <!-- 圈主可以取消管理员 -->
              <view v-if="isOwner && member.role === 1" class="action-btn" @tap.stop="showAdminActionSheet(member)">
                <uni-icons type="more-filled" size="20" color="#666"></uni-icons>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 角色分组：普通成员 -->
      <view class="role-group" v-if="normalMembers.length > 0">
        <view class="role-title">成员</view>
        <view class="member-list">
          <view class="member-item" v-for="(member, index) in normalMembers" :key="index" @tap="navigateToUser(member.user_id)">
            <view class="member-info">
              <log-image class="member-avatar" :src="member.avatar_url" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
              <view class="member-details">
                <text class="member-name">{{member.name}}</text>
                <text class="member-motto" v-if="member.motto">{{member.motto}}</text>
              </view>
            </view>
            <!-- 圈主可以设置管理员 -->
            <view v-if="isOwner" class="action-btn" @tap.stop="showMemberActionSheet(member)">
              <uni-icons type="more-filled" size="20" color="#666"></uni-icons>
            </view>
            <!-- 管理员可以踢出普通成员 -->
            <view v-else-if="userRole === 1" class="action-btn" @tap.stop="showMemberKickActionSheet(member)">
              <uni-icons type="more-filled" size="20" color="#666"></uni-icons>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view class="load-more-wrapper">
        <uni-load-more :status="loadingStatus"></uni-load-more>
      </view>
    </view>
    
    <!-- 禁言名单 -->
    <view class="banned-list" v-if="currentTab === 'banned' && (userRole === 1 || userRole === 2)">
      <view class="role-group">
        <view class="role-title">禁言成员</view>
        <view class="member-list">
          <view class="member-item" v-for="(member, index) in bannedMembers.filter(m => m.ban_type === 0)" :key="'ban-'+index">
            <view class="member-info" @tap="navigateToUser(member.user_id)">
              <log-image class="member-avatar" :src="member.avatar_url" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
              <view class="member-details">
                <text class="member-name">{{member.name}}</text>
                <text class="member-motto" v-if="member.motto">{{member.motto}}</text>
                <!-- 禁言名单中的显示问题 -->
                <text class="ban-info">
                  禁言中 · 
                  {{member.end_time ? formatBanEndTime(member.end_time) : '永久'}}
                </text>
                <text class="ban-reason" v-if="member.reason">原因：{{member.reason}}</text>
              </view>
            </view>
            <view class="member-actions">
              <view class="action-btn unban" @tap="unbanMember(member)">
                <text>解除禁言</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="role-group" style="margin-top: 20rpx;">
        <view class="role-title">踢出成员</view>
        <view class="member-list">
          <view class="member-item" v-for="(member, index) in bannedMembers.filter(m => m.ban_type === 1)" :key="'kick-'+index">
            <view class="member-info" @tap="navigateToUser(member.user_id)">
              <log-image class="member-avatar" :src="member.avatar_url" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
              <view class="member-details">
                <text class="member-name">{{member.name}}</text>
                <text class="member-motto" v-if="member.motto">{{member.motto}}</text>
                <text class="ban-info">已被踢出</text>
                <text class="ban-reason" v-if="member.reason">原因：{{member.reason}}</text>
                <text class="ban-time">踢出时间：{{formatTime(member.create_time)}}</text>
              </view>
            </view>
            <view class="member-actions">
              <view class="action-btn unban" @tap="cancelKick(member)">
                <text>取消踢出</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="bannedMembers.length === 0">
        <image src="../../static/nothing.png" mode="aspectFit" class="empty-image"></image>
        <text class="empty-text">暂无禁言或踢出成员</text>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-if="allMembers.length === 0 && joinRequests.length === 0 && !isLoading && currentTab === 'members'">
      <image src="../../static/nothing.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无成员</text>
    </view>
  </view>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  data() {
    return {
      circleId: null,
      circleName: '',
      members: [],
      joinRequests: [], // 加入申请列表
      page: 1,
      pageSize: 20,
      loadingStatus: 'more',
      hasMore: true,
      isLoading: false,
      userInfo: null,
      userRole: -1, // -1: 未知, 0: 普通成员, 1: 管理员, 2: 圈主
      currentTab: 'members',
      bannedMembers: [],
      banDurations: [
        { label: '1小时', value: 60 },
        { label: '6小时', value: 360 },
        { label: '12小时', value: 720 },
        { label: '1天', value: 1440 },
        { label: '3天', value: 4320 },
        { label: '7天', value: 10080 },
        { label: '永久', value: 0 }
      ]
    }
  },
  computed: {
    // 按角色分组成员
    managementMembers() {
      // 合并圈主和管理员为管理组
      return this.members.filter(member => member.role === 2 || member.role === 1);
    },
    normalMembers() {
      return this.members.filter(member => member.role === 0);
    },
    allMembers() {
      return this.members;
    },
    // 判断当前用户是否是圈主
    isOwner() {
      return this.userRole === 2;
    }
  },
  onLoad(options) {
    if (options.id) {
      this.circleId = options.id;
      if (options.name) {
        this.circleName = decodeURIComponent(options.name);
        uni.setNavigationBarTitle({
          title: this.circleName + ' - 成员'
        });
      }
      this.getUserInfo();
      this.loadMembers();
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  onShow() {
    // 如果是管理员或圈主，加载入圈申请
    if (this.userRole === 1 || this.userRole === 2) {
      this.loadJoinRequests();
    }
  },
  onPullDownRefresh() {
    this.page = 1;
    this.members = [];
    this.hasMore = true;
    
    const promises = [this.loadMembers()];
    
    // 如果是管理员或圈主，刷新入圈申请
    if (this.userRole === 1 || this.userRole === 2) {
      promises.push(this.loadJoinRequests());
    }
    
    Promise.all(promises).finally(() => {
      uni.stopPullDownRefresh();
    });
  },
  onReachBottom() {
    if (this.hasMore && !this.isLoading) {
      this.loadMoreMembers();
    }
  },
  methods: {
    // 获取当前用户信息
    async getUserInfo() {
      try {
        // 获取用户在圈子中的角色
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.get(this.$baseUrl + `/community/circles/my-circles`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        if (res.data && res.data.length > 0) {
          const circle = res.data.find(c => c.circle_id == this.circleId);
          if (circle) {
            this.userRole = circle.role;
            
            // 如果是管理员或圈主，加载入圈申请
            if (this.userRole === 1 || this.userRole === 2) {
              this.loadJoinRequests();
            }
          }
        }
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    },
    // 加载入圈申请列表
    async loadJoinRequests() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.get(this.$baseUrl + `/community/circles/${this.circleId}/join-requests`, {
          headers: {
            'Authorization': 'Bearer ' + token
          },
          params: {
            status: 0, // 待审核的申请
            pageSize: 100 // 最多显示100条
          }
        });
        
        if (res.data && res.data.list) {
          this.joinRequests = res.data.list;
        }
      } catch (error) {
        console.error('加载入圈申请失败', error);
      }
    },
    // 审核入圈申请
    async reviewJoinRequest(requestId, status) {
      try {
        uni.showLoading({ title: status === 1 ? '通过中...' : '拒绝中...' });
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        
        let comment = '';
        if (status === 2) {
          // 如果是拒绝，可以输入拒绝原因
          const result = await new Promise((resolve) => {
            uni.showModal({
              title: '拒绝原因',
              content: '',
              editable: true,
              placeholderText: '请输入拒绝原因（可选）',
              success: (res) => {
                if (res.confirm) {
                  resolve(res.content);
                } else {
                  resolve('');
                }
              }
            });
          });
          comment = result;
        }
        
        const res = await axios.post(this.$baseUrl + `/community/circles/${this.circleId}/review-join`, {
          request_id: requestId,
          status: status,
          comment: comment
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        uni.hideLoading();
        
        if (res.data) {
          uni.showToast({
            title: status === 1 ? '已通过申请' : '已拒绝申请',
            icon: 'success'
          });
          
          // 从申请列表中移除
          this.joinRequests = this.joinRequests.filter(req => req.request_id !== requestId);
          
          // 如果是通过申请，重新加载成员列表
          if (status === 1) {
            this.page = 1;
            this.members = [];
            this.hasMore = true;
            this.loadMembers();
          }
        }
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.response?.data?.msg || '操作失败',
          icon: 'none'
        });
        console.error('审核申请失败', error);
      }
    },
    async loadMembers() {
      this.isLoading = true;
      this.loadingStatus = 'loading';
      
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize
        };
        
        const res = await axios.get(this.$baseUrl + `/community/circles/${this.circleId}/members`, { params });
        
        if (res.data && res.data.list) {
          this.members = res.data.list;
          this.page++;
          this.hasMore = this.members.length < res.data.total;
          this.loadingStatus = this.hasMore ? 'more' : 'noMore';
        } else {
          this.loadingStatus = 'noMore';
        }
      } catch (error) {
        console.error('加载圈子成员失败', error);
        this.loadingStatus = 'more';
      } finally {
        this.isLoading = false;
      }
    },
    async loadMoreMembers() {
      if (!this.hasMore || this.isLoading) return;
      
      this.isLoading = true;
      this.loadingStatus = 'loading';
      
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize
        };
        
        const res = await axios.get(this.$baseUrl + `/community/circles/${this.circleId}/members`, { params });
        
        if (res.data && res.data.list) {
          this.members = [...this.members, ...res.data.list];
          this.page++;
          this.hasMore = this.members.length < res.data.total;
          this.loadingStatus = this.hasMore ? 'more' : 'noMore';
        } else {
          this.loadingStatus = 'noMore';
        }
      } catch (error) {
        console.error('加载更多成员失败', error);
        this.loadingStatus = 'more';
      } finally {
        this.isLoading = false;
      }
    },
    navigateToUser(userId) {
      uni.navigateTo({
        url: `/pages/users/personalPage?id=${userId}`
      });
    },
    // 显示普通成员操作菜单
    showMemberActionSheet(member) {
      uni.showActionSheet({
        itemList: ['设为管理员', '禁言', '移出圈子'],
        success: res => {
          if (res.tapIndex === 0) {
            this.setAdmin(member.user_id, true);
          } else if (res.tapIndex === 1) {
            this.showBanDurationDialog(member);
          } else if (res.tapIndex === 2) {
            this.confirmKickMember(member);
          }
        }
      });
    },
    // 显示管理员操作菜单
    showAdminActionSheet(member) {
      uni.showActionSheet({
        itemList: ['取消管理员', '移出圈子'],
        success: res => {
          if (res.tapIndex === 0) {
            this.setAdmin(member.user_id, false);
          } else if (res.tapIndex === 1) {
            this.confirmKickMember(member);
          }
        }
      });
    },
    // 显示踢出成员操作菜单
    showMemberKickActionSheet(member) {
      uni.showActionSheet({
        itemList: ['移出圈子'],
        success: res => {
          if (res.tapIndex === 0) {
            this.confirmKickMember(member);
          }
        }
      });
    },
    // 确认踢出成员
    confirmKickMember(member) {
      uni.showModal({
        title: '移出圈子',
        content: `确定要将 ${member.name} 移出圈子吗？`,
        success: res => {
          if (res.confirm) {
            this.promptKickReason(member.user_id);
          }
        }
      });
    },
    // 提示输入踢出原因
    promptKickReason(userId) {
      uni.showModal({
        title: '移出原因',
        content: '',
        editable: true,
        placeholderText: '请输入移出原因（可选）',
        success: res => {
          if (res.confirm) {
            this.kickMember(userId, res.content);
          }
        }
      });
    },
    // 踢出成员
    async kickMember(userId, reason) {
      try {
        uni.showLoading({ title: '处理中...' });
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.post(this.$baseUrl + `/community/circles/${this.circleId}/kick-user`, {
          user_id: userId,
          reason: reason
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        uni.hideLoading();
        
        if (res.data) {
          uni.showToast({
            title: '已移出圈子',
            icon: 'success'
          });
          
          // 重新加载成员列表
          this.page = 1;
          this.members = [];
          this.hasMore = true;
          this.loadMembers();
        }
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.response?.data?.msg || '操作失败',
          icon: 'none'
        });
        console.error('移出成员失败', error);
      }
    },
    // 设置或取消管理员
    async setAdmin(userId, isAdmin) {
      try {
        uni.showLoading({ title: isAdmin ? '设置中...' : '取消中...' });
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.post(this.$baseUrl + `/community/circles/set-admin`, {
          circle_id: this.circleId,
          user_id: userId,
          is_admin: isAdmin
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        uni.hideLoading();
        
        if (res.data) {
          uni.showToast({
            title: isAdmin ? '已设为管理员' : '已取消管理员',
            icon: 'success'
          });
          
          // 重新加载成员列表
          this.page = 1;
          this.members = [];
          this.hasMore = true;
          this.loadMembers();
        }
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.response?.data?.msg || '操作失败',
          icon: 'none'
        });
        console.error('设置管理员失败', error);
      }
    },
    // 格式化时间
    formatTime(time) {
      const now = moment();
      const postTime = moment(time);
      const diff = now.diff(postTime, 'minutes');
      
      if (diff < 1) return '刚刚';
      if (diff < 60) return `${diff}分钟前`;
      
      const hourDiff = now.diff(postTime, 'hours');
      if (hourDiff < 24) return `${hourDiff}小时前`;
      
      const dayDiff = now.diff(postTime, 'days');
      if (dayDiff < 30) return `${dayDiff}天前`;
      
      return postTime.format('YYYY-MM-DD');
    },
    
    // 切换标签页
    switchTab(tab) {
      this.currentTab = tab;
      if (tab === 'banned') {
        this.loadBannedMembers();
      }
    },
    
    // 加载禁言名单
    async loadBannedMembers() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.get(this.$baseUrl + `/community/circles/${this.circleId}/banned-users`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (res.data && res.data.list) {
          this.bannedMembers = res.data.list;
        }
      } catch (error) {
        console.error('加载禁言名单失败', error);
      }
    },
    
    // 显示禁言对话框
    showBanDialog(member) {
      uni.showActionSheet({
        itemList: ['禁言', '移出圈子'],
        success: res => {
          if (res.tapIndex === 0) {
            this.showBanDurationDialog(member);
          } else if (res.tapIndex === 1) {
            this.confirmKickMember(member);
          }
        }
      });
    },
    
    // 显示禁言时长选择
    showBanDurationDialog(member) {
      uni.showActionSheet({
        itemList: this.banDurations.map(d => d.label),
        success: res => {
          const duration = this.banDurations[res.tapIndex].value;
          this.promptBanReason(member.user_id, duration);
        }
      });
    },
    
    // 提示输入禁言原因
    promptBanReason(userId, duration) {
      uni.showModal({
        title: '禁言原因',
        content: '',
        editable: true,
        placeholderText: '请输入禁言原因（可选）',
        success: res => {
          if (res.confirm) {
            this.banMember(userId, duration, res.content);
          }
        }
      });
    },
    
    // 禁言成员
    async banMember(userId, duration, reason) {
      try {
        uni.showLoading({ title: '处理中...' });
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.post(this.$baseUrl + `/community/circles/${this.circleId}/ban-user`, {
          user_id: userId,
          duration: parseInt(duration), // 确保转换为整数
          reason: reason
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        uni.hideLoading();
        
        if (res.data) {
          uni.showToast({
            title: '已禁言该成员',
            icon: 'success'
          });
          
          // 重新加载成员列表和禁言名单
          this.page = 1;
          this.members = [];
          this.hasMore = true;
          this.loadMembers();
          this.loadBannedMembers();
        }
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.response?.data?.msg || '操作失败',
          icon: 'none'
        });
        console.error('禁言成员失败', error);
      }
    },
    
    // 解除禁言
    async unbanMember(member) {
      try {
        uni.showModal({
          title: '解除禁言',
          content: `确定要解除 ${member.name} 的禁言吗？`,
          success: async res => {
            if (res.confirm) {
              uni.showLoading({ title: '处理中...' });
              const token = JSON.parse(window.localStorage.getItem('token')).tk;
              const res = await axios.post(this.$baseUrl + `/community/circles/${this.circleId}/unban-user`, {
                user_id: member.user_id
              }, {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
              
              uni.hideLoading();
              
              if (res.data) {
                uni.showToast({
                  title: '已解除禁言',
                  icon: 'success'
                });
                
                // 重新加载禁言名单
                this.loadBannedMembers();
              }
            }
          }
        });
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.response?.data?.msg || '操作失败',
          icon: 'none'
        });
        console.error('解除禁言失败', error);
      }
    },
    
    // 取消踢出
    async cancelKick(member) {
      try {
        uni.showModal({
          title: '取消踢出',
          content: `确定要允许 ${member.name} 重新加入圈子吗？`,
          success: async res => {
            if (res.confirm) {
              uni.showLoading({ title: '处理中...' });
              const token = JSON.parse(window.localStorage.getItem('token')).tk;
              const res = await axios.post(this.$baseUrl + `/community/circles/${this.circleId}/cancel-kick`, {
                user_id: member.user_id
              }, {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
              
              uni.hideLoading();
              
              if (res.data) {
                uni.showToast({
                  title: '已取消踢出',
                  icon: 'success'
                });
                
                // 重新加载禁言名单
                this.loadBannedMembers();
              }
            }
          }
        });
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.response?.data?.msg || '操作失败',
          icon: 'none'
        });
        console.error('取消踢出失败', error);
      }
    },
    
    // 修改成员操作菜单
    showMemberActionSheet(member) {
      uni.showActionSheet({
        itemList: ['设为管理员', '禁言', '移出圈子'],
        success: res => {
          if (res.tapIndex === 0) {
            this.setAdmin(member.user_id, true);
          } else if (res.tapIndex === 1) {
            setTimeout(() => {
              this.showBanDurationDialog(member);
            }, 500);
          } else if (res.tapIndex === 2) {
            this.confirmKickMember(member);
          }
        }
      });
    },
    // 格式化禁言结束时间
    formatBanEndTime(time) {
      if (!time) return '永久';
      
      const endTime = moment(time);
      const now = moment();
      
      // 如果结束时间已经过了，显示"已解除"
      if (endTime.isBefore(now)) {
        return '已解除';
      }
      
      // 计算剩余时间
      const diffMinutes = endTime.diff(now, 'minutes');
      
      if (diffMinutes < 60) {
        return `${diffMinutes}分钟后解除`;
      }
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `${diffHours}小时后解除`;
      }
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) {
        return `${diffDays}天后解除`;
      }
      
      // 如果时间太长，直接显示具体日期
      return endTime.format('YYYY-MM-DD HH:mm') + ' 解除';
    }
  }
}
</script>

<style lang="scss" scoped>
.members-container {
  padding: 20rpx;
}

.members-list {
  padding-bottom: 40rpx;
}

.role-group {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.role-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-left: 10rpx;
  border-left: 6rpx solid #EA7034;
}

.member-list {
  display: flex;
  flex-direction: column;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.member-item:last-child {
  border-bottom: none;
}

.member-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.member-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.member-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.member-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.member-motto {
  font-size: 24rpx;
  color: #999;
  width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.request-time {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}

.member-actions {
  display: flex;
  align-items: center;
}

.member-role-tag {
  font-size: 24rpx;
  border-radius: 6rpx;
  padding: 4rpx 12rpx;
}

.owner {
  background-color: #FFD700;
  color: #333;
}

.admin {
  background-color: #EA7034;
  color: #fff;
}

.action-btn {
  margin-left: 20rpx;
  padding: 10rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.load-more-wrapper {
  padding: 20rpx 0;
  background-color: transparent;
}

/* 入圈申请样式 */
.join-requests {
  margin-bottom: 20rpx;
}

.request-actions {
  display: flex;
  align-items: center;
}

.request-btn {
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-left: 10rpx;
  width: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.approve {
  background-color: #4CAF50;
  color: #fff;
}

.reject {
  background-color: #F44336;
  color: #fff;
}

.tabs {
  display: flex;
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.tab {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 10rpx 0;
  position: relative;
}

.tab.active {
  color: #EA7034;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #EA7034;
  border-radius: 2rpx;
}

.ban-info {
  font-size: 24rpx;
  color: #f44336;
  margin-top: 4rpx;
}

.ban-reason {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.unban {
  background-color: #4CAF50;
  color: #fff;
  font-size: 24rpx;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
}
</style> 