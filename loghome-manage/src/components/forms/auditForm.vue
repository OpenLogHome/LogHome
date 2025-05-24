<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="审核目标">
          请着重检查此文是否存在<span style="color:red">{{article.audit_status}}</span>等情况
      </el-form-item>
      <el-form-item label="标题">
          {{article.title}}
      </el-form-item>
      <el-form-item label="内容">
          <div v-if="contentBlocks.length > 0" class="rich-content-container">
            <div v-for="(block, index) in contentBlocks" :key="'block-' + index" class="content-block">
              <!-- 文本块 -->
              <div v-if="block.type === 'text'" class="text-block">{{ block.value }}</div>
              <!-- 图片块 -->
              <div v-else-if="block.type === 'image'" class="image-block">
                <el-image 
                  :src="block.url" 
                  :preview-src-list="[block.url]"
                  fit="contain"
                  style="max-width: 100%; max-height: 400px;"
                ></el-image>
              </div>
              <!-- 未知类型块 -->
              <div v-else class="unknown-block">
                未知内容类型: {{ block.type }}
              </div>
            </div>
          </div>
          <div v-else style="white-space: pre-wrap;">{{ article.content }}</div>
      </el-form-item>
      <el-form-item label="处理方式">
            <el-select v-model="formData.handleMethod" placeholder="请选择">
                <el-option
                v-for="item in auditOptions"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
      </el-form-item>
        <el-form-item label="灰色警示" v-show="formData.handleMethod=='通过'">
            <el-select v-model="formData.warnInfo" placeholder="请选择">
                <el-option
                v-for="item in warnOptions"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["article_id"],
  data() {
    return {
      formData: {
        handleMethod:"通过",
        warnInfo:"None"
      },
      rules: {
        answer: [{
          required: true,
          message: '请输入回复内容',
          trigger: 'blur'
        }],
      },
      article:{},
      contentBlocks: [],
      me_id:-1,
      auditOptions:['通过','打回草稿'],
      warnOptions:['None','疑似存在来源不明的信息','疑似存在惊悚片段','疑似存在暴力情节'
      ,'疑似存在令人不适的内容','疑似存在争议或偏激的观点']
    }
  },
  computed: {},
  watch: {
      article_id(newVal,oldVal){
          this.refresh_article_id(newVal)
      }
  },
  created() {},
  mounted() {
      this.refresh_article_id(this.article_id);
      let tk = JSON.parse(window.localStorage.getItem('token'));
      if(tk) tk=tk.id;
      this.me_id = tk;
  },
  methods: {
    submitForm() {
      let _this = this;
      this.$refs['elForm'].validate(valid => {
        if (!valid) return;
        this.formData.article_id = this.article_id;
        this.axios.post(this.$baseUrl + '/manage/audit/submit_result', this.formData)
        .then(function (response) {
            _this.$message({
                showClose: true,
                message: '提交成功',
                type: 'success'
            });
            // 发送事件通知父组件审核成功
            _this.$emit('audit-success');
        })
        .catch(function (error) {
            if(error) {
                _this.$message({
                    showClose: true,
                    message: '提交失败',
                    type: 'error'
                });
            }
        });
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    parseContent(content) {
      try {
        // 尝试解析JSON格式的内容
        const parsedContent = JSON.parse(content);
        if (Array.isArray(parsedContent) && parsedContent.length > 0) {
          this.contentBlocks = parsedContent;
          return true;
        }
      } catch (e) {
        console.log('不是有效的JSON格式内容，将按纯文本处理', e);
      }
      // 解析失败或不是数组，返回false以使用原始文本显示
      this.contentBlocks = [];
      return false;
    },
    refresh_article_id(newVal){
        let _this = this;
        this.axios.get(this.$baseUrl + '/manage/audit/get_article_by_id?id=' + newVal, {}).then((res) => {
            _this.article = res.data[0];
            // 尝试解析内容为富文本JSON格式
            if (_this.article && _this.article.content) {
              _this.parseContent(_this.article.content);
            }
        }).catch(function (error) {
            _this.$message({
                showClose: true,
                message: '无权限或数据获取失败',
                type: 'error'
            });
        });
        
        this.formData = {
            handleMethod:"通过",
            warnInfo:"None"
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
.rich-content-container {
  max-width: 100%;
  overflow-x: auto;
}
.content-block {
  margin-bottom: 10px;
}
.text-block {
  white-space: pre-wrap;
  line-height: 1.6;
}
.image-block {
  text-align: center;
  margin: 20px 0;
}
.unknown-block {
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  color: #999;
}
</style>
