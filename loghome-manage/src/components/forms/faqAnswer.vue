<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="标题">
          {{faq.faq_title}}
      </el-form-item>
        <el-form-item label="内容">
          {{faq.faq_content}}
      </el-form-item>
      <el-form-item label="回复内容" prop="answer">
        <el-input v-model="formData.answer" type="textarea" placeholder="请输入回复内容"
          :autosize="{minRows: 5, maxRows: 8}" :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="快速回复">
            <el-tag type="success" @click="quickAnswer(2)">重要反馈</el-tag>
            <el-tag type="info" @click="quickAnswer(1)">待评估</el-tag>
            <el-tag type="warning" @click="quickAnswer(0)">不重要反馈</el-tag>
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
  props: ["faq_id"],
  data() {
    return {
      formData: {
        answer: "",
      },
      rules: {
        answer: [{
          required: true,
          message: '请输入回复内容',
          trigger: 'blur'
        }],
      },
      faq:{},
      me_id:-1
    }
  },
  computed: {},
  watch: {
      faq_id(newVal,oldVal){
          this.refresh_faq_id(newVal)
      }
  },
  created() {},
  mounted() {
      this.refresh_faq_id(this.faq_id);
      let tk = JSON.parse(window.localStorage.getItem('token'));
      if(tk) tk=tk.id;
      this.me_id = tk;
  },
  methods: {
    submitForm() {
      let _this = this;
      this.$refs['elForm'].validate(valid => {
        if (!valid) return;
        this.formData.faq_id = this.faq.faq_id;
        this.formData.me_id = this.me_id;
        this.axios.post(this.$baseUrl + '/manage/faqs/submit_answer', this.formData)
        .then(function (response) {
            _this.$message({
                showClose: true,
                message: '回复成功',
                type: 'success'
            });
            _this.$emit('answer-success');
        })
        .catch(function (error) {
            if(error) {
                _this.$message({
                    showClose: true,
                    message: '回复出错',
                    type: 'error'
                });
            }
        
        });
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    refresh_faq_id(newVal){
        let _this = this;
        this.axios.get(this.$baseUrl + '/manage/faqs/get_faq_by_id?faq_id=' + newVal, {}).then((res) => {
            _this.faq = res.data[0]
        }).catch(function (error) {
            _this.$message({
                showClose: true,
                message: '无权限或数据获取失败',
                type: 'error'
            });
        }).then(function(){
            
        })
    },
    quickAnswer(rate){
        switch(rate){
            case 2:
                this.formData.answer="你好，非常感谢你的反馈/建议，我们将尽快讨论落实！";
                break;
            case 1:
                this.formData.answer="你好，感谢你的反馈/建议，我们将交由工程师进行评估。";
                break;
            case 0:
                this.formData.answer="你好，请尽量详细、准确地描述问题，以便我们进一步评估。";
                break;
        }
    }
  }
}

</script>
<style scoped>
.el-tag{
    margin-right:20px;
    cursor:pointer;
}
</style>
