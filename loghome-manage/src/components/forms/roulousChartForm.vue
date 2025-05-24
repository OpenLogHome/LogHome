<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24">
          <el-form-item label="ID" prop="id">
              <span>{{formData.id?formData.id:"新增"}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="顺序" prop="order">
            <el-input-number v-model="formData.order" :min="0" :step="10" placeholder="请输入顺序" :style="{width: '100%'}">
            </el-input-number>
            <div class="el-form-item__description">数字越小，排序越靠前</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="跳转地址" prop="navigate_to">
            <el-input v-model="formData.navigate_to" placeholder="请输入跳转地址" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
           <p style="margin-left:50px;">提示：无跳转请使用"None"</p>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入标题" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="轮播图图片" prop="image" required>
            <el-image
                        style="width: 100px; height: 100px"
                        :src="formData.image"
                        fit="contain"></el-image>
            <el-upload ref="image" :file-list="imagefileList" :action="imageAction" name="img"
              :before-upload="imageBeforeUpload" list-type="picture-card" accept="image/*"
              :on-success="uploadOver" :limit="1" :headers="{'apikey': 'iSnMUQ9OLZpCVY3p7E3T5b2YwC39TS'}">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">建议图片比例：1920×1080，只能上传不超过 5MB 的图片文件</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["formData"],
  data() {
    return {
      rules: {
        name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        navigate_to: [{
          required: true,
          message: '请输入跳转地址',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }],
        order: [{
          required: true,
          message: '请输入顺序',
          trigger: 'blur'
        }],
      },
      imageAction: 'http://img.codesocean.top/upload/img',
      imagefileList: [],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
        let _this = this;
        this.$refs['elForm'].validate(valid => {
            if (!valid) return;
            this.axios.post(this.$baseUrl + '/manage/library/edit_library_roulous_chart', this.formData)
            .then(function (response) {
                _this.$message({
                    showClose: true,
                    message: '轮播图修改成功',
                    type: 'success'
                });
                _this.$emit('submit-success');
                _this.$parent.$parent.dialogVisible = false;
            })
            .catch(function (error) {
                //console.log(error);
                if(error) {
                    _this.$message({
                        showClose: true,
                        message: '轮播图修改出错',
                        type: 'error'
                    });
                }
            
            });
      })
    },
    imageBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 5
      if (!isRightSize) {
        this.$message.error('文件大小超过 5MB')
      }
      let isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择image/*类型的文件')
      }
      return isRightSize && isAccept
    },
    uploadOver(response, file, fileList){
        console.log(response);
        this.formData.image = response.url;
    }
  }
}

</script>
<style scoped>
.el-upload__tip {
  line-height: 1.2;
}

</style>
