<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="发送者" prop="from_id">
        <el-select v-model="formData.from_id" placeholder="请选择发送者" clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in from_idOptions" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接收者">
          {{to_user.name}}
      </el-form-item>
      <el-form-item label="消息内容" prop="msg">
        <el-input v-model="formData.msg" type="textarea" placeholder="请输入消息内容"
          :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="跳转链接" prop="navigate_to">
        <el-input v-model="formData.navigate_to" placeholder="请输入跳转链接" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props:{
      to_id:{
          default:undefined
      }
  },
  data() {
    return {
      to_user:{},
      me_id:-1,
      formData: {
        from_id: undefined,
        msg: undefined,
        navigate_to: "None",
      },
      rules: {
        from_id: [{
          required: true,
          message: '请选择发送者',
          trigger: 'change'
        }],
        msg: [{
          required: true,
          message: '请输入消息内容',
          trigger: 'blur'
        }],
        navigate_to: [{
          required: true,
          message: '请输入跳转链接',
          trigger: 'blur'
        }],
      },
      from_idOptions: [{
        "label": "我",
        "value": "me"
      }, {
        "label": "系统消息",
        "value": -1
      }],

    }
  },
  computed: {},
  watch: {
      to_id(newVal,oldVal){
          this.refresh_to_id(newVal)
      }
  },
  created() {},
  mounted() {
      this.refresh_to_id(this.to_id);
      let tk = JSON.parse(window.localStorage.getItem('token'));
      if(tk) tk=tk.id;
      this.me_id = tk;
        this.from_idOptions=[{
            "label": "我",
            "value": tk
        }, {
            "label": "系统消息",
            "value": -1
        }]
  },
  methods: {
    submitForm() {
      let _this = this;
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.formData.to_id=this.to_id;
        this.axios.post(this.$baseUrl + '/manage/users/send_message', this.formData)
        .then(function (response) {
            _this.$message({
                showClose: true,
                message: '发送成功',
                type: 'success'
            });
            location.reload();
        })
        .catch(function (error) {
            //console.log(error);
            if(error) {
                _this.$message({
                    showClose: true,
                    message: '发送出错',
                    type: 'error'
                });
            }
        
        });
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    refresh_to_id(newVal){
        this.axios.get(this.$baseUrl + '/manage/users/get_user_by_id?user_id=' + newVal, {}).then((res) => {
            this.to_user = res.data[0]
        }).catch(function (error) {
            _this.$message({
                showClose: true,
                message: '无权限或数据获取失败',
                type: 'error'
            });
        }).then(function(){
            
        })
    }
  }
}

</script>
<style>
</style>
