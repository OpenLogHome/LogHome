<template>
  <div class="outer" >
    <el-form ref="form" :model="form" class="search" v-show="false">
      <div class="infoName">昵称:</div>
      <el-input
        v-model="form.name"
        placeholder="请输入用户名"
        class="inputBox"
        size="small"
      ></el-input>
      <div class="buttonGroup">
        <el-button @click="onSubmit" class="infoButton" size="small" style="background-color: rgb(63, 180, 174);">
          <i class="el-icon-search" ></i>
          搜索
        </el-button>
        <input type="reset" class="infoButton reset" />
        <!-- <el-button type="primary" size="small" class="infoButton" @click="addUserFormVisible = true" style="width:110px;">新增系统用户</el-button> -->
      </div>
    </el-form>
    <div class="userMsg">
      <div class="msgTable">
        <el-table :data="tableData" style="width: 100%"
        :row-class-name="tableRowClassName">
          <el-table-column label="ID" width="100" fixed="left">
                <template slot-scope="scope">
                    <div style="display:flex">
                        <p>{{scope.row.post_id}}</p>
                    </div>
                </template>
          </el-table-column>
          <el-table-column prop="name" label="楼主昵称" width="150" fixed="left">
          </el-table-column>
          <el-table-column prop="title" label="标题">
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <i
                class="el-icon-edit editIcon"
                @click="post_id=scope.row.post_id;postDialog=true;"
                >&nbsp;编辑</i>
              <i
                class="el-icon-view editIcon"
                @click="clipBoard(scope.row.post_id)"
                >&nbsp;复制跳转地址</i>
            </template>
          </el-table-column>
        </el-table>
        <div style="height:50px;"></div>
        <el-button type="primary" @click="addPost">新增帖子</el-button>
      </div>
      <div class="pageManage">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="totalFaqs"
        >
        </el-pagination>
      </div>
    </div>

    <div style="height:100px"></div>
    <el-dialog
        title="编辑帖子"
        :visible.sync="postDialog"
        width="80%"
        :close-on-click-modal="false">
        <postForm :post_id="post_id"/>
    </el-dialog>

  </div>
</template>


<script>
import postForm from "../../components/forms/postForm.vue"
export default {
    name:"UserManage",
    components:{
        postForm
    },
    data(){
        return {
            form:{
                name:""
            },
            currentPage: 1,
            totalFaqs:0,
            tableData: [],
            postDialog:false,
            post_id:undefined,
            copyText:"123456"
        }
    },
    methods:{
        onSubmit() {
            console.log('submit!');
        },
        handleTypical(id,is_typical) {
             this.$confirm('确认' +( is_typical == 1 ? '设置为常见' :'取消设置为常见' )+ '问题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let _this = this;
                this.axios.post(this.$baseUrl + '/manage/faqs/set_typical',{faq_id:id,is_typical:is_typical})
                .then(function (response) {
                    _this.$message({
                        showClose: true,
                        message: '操作成功',
                        type: 'success'
                    });
                    location.reload();
                })
                .catch(function (error) {
                    //console.log(error);
                    if(error) {
                        _this.$message({
                            showClose: true,
                            message: '操作失败',
                            type: 'error'
                        });
                    }
                });
            }).catch(() => {    
            });
        },
        handleCurrentChange(val) {
            this.getFaqsData(val);
        },
        getFaqsData(page){
            let _this = this;
            this.axios.get(this.$baseUrl + '/manage/posts/get_all_posts?page=' + page , {}).then((res) => {
                this.tableData = res.data;
                console.log(res.data);
            }).catch(function (error) {
                _this.$message({
                    showClose: true,
                    message: '无权限或数据获取失败',
                    type: 'error'
                });
            }).then(function(){
                
            })
        },
        utc2beijing(utc_datetime) {
            try{
                // 转为正常的时间格式 年-月-日 时:分:秒
                var T_pos = utc_datetime.indexOf('T');
                var Z_pos = utc_datetime.indexOf('Z');
                var year_month_day = utc_datetime.substr(0,T_pos);
                var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
                var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
            
                // 处理成为时间戳
                timestamp = new Date(Date.parse(new_datetime));
                timestamp = timestamp.getTime();
                timestamp = timestamp/1000;
            
                // 增加8个小时，北京时间比utc时间多八个时区
                var timestamp = timestamp+8*60*60;
            
                // 时间戳转为时间
                var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString("chinese",{ hour12: false }).replace(/年|月/g, "-").replace(/日/g, " ");
                return beijing_datetime; // 2017-03-31 16:02:06
            }catch(e){
                return "";
            }
            
        },
        tableRowClassName({row, rowIndex}) {
            // if (!row.solved) {
            //     return 'warning-row';
            // } else {
            //     return 'success-row';
            // }
            return '';
        },
        clipBoard(post_id){
            let _this = this;
            this.copyText = "community/postView?id=" + post_id;
            this.$copyText(this.copyText).then(function (e) {
                _this.$message({
                    showClose: true,
                    message: '复制成功',
                    type: 'success'
                });
            }, function (e) {
                _this.$message({
                    showClose: true,
                    message: '复制失败',
                    type: 'warn'
                });
            })

        },
        addPost(){
            this.post_id = -1;
            this.postDialog = true;
        }
    },
    mounted(){
        let _this = this;
        this.axios.get(this.$baseUrl + '/manage/posts/get_posts_amount', {}).then((res) => {
            this.totalFaqs = res.data[0].count;
            this.getFaqsData(1);
            console.log(res.data);
        }).catch(function (error) {
            _this.$message({
                showClose: true,
                message: '无权限或数据获取失败',
                type: 'error'
            });
        }).then(function(){
            
        })
    }
};
</script>

<style scoped lang="scss">
.outer{
    width:100%;
    height: 100%;
}
.search {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
  padding-left: 20px;
  border-bottom: 1px solid rgba(154, 158, 165, 0.8);
  .infoName {
    display: flex;
    height: 40px;
    align-items: center;
    margin-left: 20px;
    font-size: 15px;
  }
  .inputBox {
    margin-left: 15px;
    width: 200px;
    height: 40px;
    align-items: center;
    margin-top: 6px;
  }
  .buttonGroup {
    width: 30%;
    margin-top: 10px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    .infoButton {
      margin-left: 20px;
      height: 35px;
      width: 110px;
      color: #fff;
      font-size: 14px !important;
      font-family: "思源黑体", Arial, Helvetica, sans-serif, "宋体" !important;
      border: none;
    }
    input {
      background: none;
      outline: none;
    }
    input:focus {
      border: none;
    }
    .reset {
      border: 1px solid rgb(154, 158, 165);
      border-radius: 4px;
      background-color: #fff;
      cursor: pointer;
      color: black;
      font-size: 12px;
    }
  }
}
.operButtonGroup {
  margin-top: 20px;
  margin-left: 40px;
  width: 100%;
  height: 50px;
  .operButton {
    width: 80px;
  }
}


.userMsg {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  .msgTable {
    width: 100%;
  }
  .pageManage {
    margin-top: 30px;
    margin-right: 10px;
  }
}
.editIcon {
  margin-left: 10px;
  color: rgb(78, 174, 247);
  cursor: pointer;
}
.editIcon:hover {
  margin-left: 10px;
  color: rgb(10, 136, 233);
  cursor: pointer;
}


</style>