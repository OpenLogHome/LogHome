<template>
  <div class="banner-manage">
    <div class="page-header">
      <h2>横幅广告管理</h2>
      <el-button type="primary" @click="handleAdd">添加横幅广告</el-button>
    </div>
    
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>横幅广告列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleRefresh">刷新</el-button>
      </div>
      
      <el-table :data="banners" style="width: 100%" v-loading="loading" border>
        <el-table-column label="ID" prop="banner_id" min-width="80"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="图片" min-width="150">
          <template slot-scope="scope">
            <el-image 
              style="width: 100px; height: 40px" 
              :src="scope.row.image_url" 
              fit="cover"
              :preview-src-list="[scope.row.image_url]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="页面位置" prop="page_location" min-width="120"></el-table-column>
        <el-table-column label="链接地址" prop="link_url" min-width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_active ? 'success' : 'info'">
              {{ scope.row.is_active ? '激活' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="有效期" min-width="280">
          <template slot-scope="scope">
            <div v-if="scope.row.start_time || scope.row.end_time">
              {{ scope.row.start_time || '无限制' }} 至 {{ scope.row.end_time || '无限制' }}
            </div>
            <div v-else>无限制</div>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="order" min-width="80"></el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleToggleStatus(scope.row)">
              {{ scope.row.is_active ? '禁用' : '启用' }}
            </el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)" class="text-danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="90%" max-width="600px" @close="resetForm">
      <el-form :model="form" :rules="rules" ref="bannerForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image_url">
          <image-upload-field
            v-model="form.image_url"
            button-text="上传 Banner"
            :preview-width="400"
            :preview-height="180"
            tip="建议尺寸: 750px × 320px (21:9比例)，大小不超过 5MB"
          />
        </el-form-item>
        <el-form-item label="链接地址" prop="link_url">
          <el-input v-model="form.link_url" placeholder="请输入链接地址"></el-input>
        </el-form-item>
        <el-form-item label="页面位置" prop="page_location">
          <el-select v-model="form.page_location" placeholder="请选择页面位置">
            <el-option label="书库页面" value="library"></el-option>
            <el-option label="书架页面" value="bookcase"></el-option>
            <el-option label="社区页面" value="community"></el-option>
            <el-option label="个人页面" value="user"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.is_active"
            :active-value="1"
            :inactive-value="0"
            active-text="激活"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleDateRangeChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="999"></el-input-number>
          <div class="el-upload__tip">数字越小越靠前显示</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImageUploadField from '../../components/ImageUploadField.vue'

export default {
  name: "BannerManage",
  components: {
    ImageUploadField
  },
  data() {
    return {
      banners: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: "添加横幅广告",
      submitLoading: false,
      form: {
        banner_id: null,
        title: "",
        image_url: "",
        link_url: "",
        page_location: "library",
        is_active: 1,
        start_time: null,
        end_time: null,
        order: 0
      },
      dateRange: [],
      rules: {
        image_url: [
          { required: true, message: "请上传 Banner 图片", trigger: "change" }
        ],
        page_location: [
          { required: true, message: "请选择页面位置", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取横幅广告数据
    fetchData() {
      this.loading = true;
      this.axios
        .get(this.$baseUrl + "/manage/banners")
        .then(response => {
          this.banners = response.data;
          this.loading = false;
        })
        .catch(error => {
          this.$message.error("获取横幅广告数据失败");
          console.error("Error fetching banner data:", error);
          this.loading = false;
        });
    },
    
    // 添加横幅广告
    handleAdd() {
      this.dialogTitle = "添加横幅广告";
      this.form = {
        banner_id: null,
        title: "",
        image_url: "",
        link_url: "",
        page_location: "library",
        is_active: 1,
        start_time: null,
        end_time: null,
        order: 0
      };
      this.dateRange = [];
      this.dialogVisible = true;
    },
    
    // 编辑横幅广告
    handleEdit(row) {
      this.dialogTitle = "编辑横幅广告";
      this.form = { ...row };
      if (this.form.start_time && this.form.end_time) {
        this.dateRange = [this.form.start_time, this.form.end_time];
      } else {
        this.dateRange = [];
      }
      this.dialogVisible = true;
    },
    
    // 切换横幅广告状态
    handleToggleStatus(row) {
      this.$confirm(`确定要${row.is_active ? '禁用' : '启用'}该横幅广告吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newStatus = row.is_active ? 0 : 1;
        this.axios
          .put(this.$baseUrl + `/manage/banners/${row.banner_id}/status`, { is_active: newStatus })
          .then(() => {
            row.is_active = newStatus;
            this.$message.success(`${newStatus ? '启用' : '禁用'}成功`);
          })
          .catch(error => {
            this.$message.error(`操作失败: ${error.message}`);
          });
      }).catch(() => {});
    },
    
    // 删除横幅广告
    handleDelete(row) {
      this.$confirm('确定要删除该横幅广告吗? 此操作不可逆', '警告', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.axios
          .delete(this.$baseUrl + `/manage/banners/${row.banner_id}`)
          .then(() => {
            this.banners = this.banners.filter(item => item.banner_id !== row.banner_id);
            this.$message.success('删除成功');
          })
          .catch(error => {
            this.$message.error(`删除失败: ${error.message}`);
          });
      }).catch(() => {});
    },
    
    // 提交表单
    submitForm() {
      this.$refs.bannerForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          
          const method = this.form.banner_id ? 'put' : 'post';
          const url = this.form.banner_id
            ? this.$baseUrl + `/manage/banners/${this.form.banner_id}`
            : this.$baseUrl + '/manage/banners';
          
          this.axios[method](url, this.form)
            .then(response => {
              this.$message.success(`${this.form.banner_id ? '更新' : '添加'}成功`);
              this.dialogVisible = false;
              this.fetchData();
              this.submitLoading = false;
            })
            .catch(error => {
              this.$message.error(`提交失败: ${error.message}`);
              this.submitLoading = false;
            });
        }
      });
    },
    
    // 重置表单
    resetForm() {
      if (this.$refs.bannerForm) {
        this.$refs.bannerForm.resetFields();
      }
    },
    
    // 处理日期范围变化
    handleDateRangeChange(val) {
      if (val) {
        [this.form.start_time, this.form.end_time] = val;
      } else {
        this.form.start_time = null;
        this.form.end_time = null;
      }
    },
    
    // 刷新数据
    handleRefresh() {
      this.fetchData();
    }
  }
};
</script>

<style scoped>
.banner-manage {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.image-preview {
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #eee;
  padding: 5px;
  text-align: center;
}
.text-danger {
  color: #F56C6C;
}
.text-danger:hover {
  color: #f78989;
}
.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style> 
