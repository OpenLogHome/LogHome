<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="ID" prop="title">
        <span>{{ post_id != -1 ? post_id : "新增" }}</span>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="内容">
            <div id="e" >
            </div>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import E from "wangeditor"
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        title: undefined,
        content:undefined
      },
      rules: {
        title: [{
          required: true,
          message: '请输入单行文本标题',
          trigger: 'blur'
        }],
      },
      editor:undefined
    }
  },
  props:["post_id"],
  mounted() {
      this.initE();
      this.refresh_post_id(this.post_id);
  },
  watch: {
      post_id(newVal,oldVal){
          this.refresh_post_id(newVal)
      }
  },
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if(!valid) return;
        let _this = this;
        this.formData.content = this.editor.txt.html();
        if(this.post_id != -1) {
            this.formData.post_id = this.post_id;
        }
        this.axios.post(this.$baseUrl + '/manage/posts/edit_post', this.formData)
        .then(function (response) {
            _this.$message({
                showClose: true,
                message: '提交成功',
                type: 'success'
            });
            location.reload();
        })
        .catch(function (error) {
            //console.log(error);
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
    initE() {
      this.editor = new E('#e')
      //这里各位小伙伴可以查询官网，根据自己的需求进行菜单栏调整
      this.editor.config.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'undo',  // 撤销
        'redo'  // 重复
      ]
      this.editor.config.uploadFileName = 'img'
      this.editor.config.uploadImgServer = 'http://img.codesocean.top/upload/img'  // 你的服务器上传地址
      this.editor.config.uploadImgHooks = {
        before: function (xhr, editor, files) {
        },
        success: function (xhr, editor, result) {
        },
        fail: function (xhr, editor, result) {
        },
        error: function (xhr, editor) {
        },
        timeout: function (xhr, editor) {
        },
        customInsert: function (insertImg, result, editor) {
          insertImg("http://img.codesocean.top" + result.data);
        }
      }
      this.editor.create()
    },
    refresh_post_id(newVal){
        let _this = this;
        if(newVal == -1){
            _this.formData = {
                title: undefined,
                content:undefined
            };
            _this.editor.txt.html("")
            return;
        }
        this.axios.get(this.$baseUrl + '/manage/posts/get_post_by_id?post_id=' + newVal, {}).then((res) => {
            _this.formData.title = res.data[0].title
            _this.editor.txt.html(res.data[0].content)
        }).catch(function (error) {
            _this.$message({
                showClose: true,
                message: '无权限或数据获取失败',
                type: 'error'
            });
        }).then(function(){
            
        })
    },
  }
}

</script>
<style>
</style>
