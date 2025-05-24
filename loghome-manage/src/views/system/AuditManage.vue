<template>
  <div class="outer" >
    <el-form ref="filterForm" :model="filterForm" class="search">
      <div class="infoName">文章标题:</div>
      <el-input
        v-model="filterForm.title"
        placeholder="请输入文章标题"
        class="inputBox"
        size="small"
        @keyup.enter.native="handleSearch"
      ></el-input>
      <div class="infoName">作者:</div>
      <el-input
        v-model="filterForm.author"
        placeholder="请输入作者名称"
        class="inputBox"
        size="small"
        @keyup.enter.native="handleSearch"
      ></el-input>
      <div class="buttonGroup">
        <el-button @click="handleSearch" class="infoButton" size="small" style="background-color: rgb(63, 180, 174);">
          <i class="el-icon-search" ></i>
          搜索
        </el-button>
        <el-button @click="resetFilter" class="infoButton reset" size="small">
          重置
        </el-button>
      </div>
    </el-form>
    <div class="userMsg">
      <div class="msgTable">
        <el-table :data="tableData" style="width: 100%"
        :row-class-name="tableRowClassName">
          <el-table-column label="ID" width="100" fixed="left">
                <template slot-scope="scope">
                    <div style="display:flex">
                        <p :style="{'color':scope.row.user_id < 0 ? '#1989FA':'black'}">{{scope.row.article_id}}</p>
                    </div>
                </template>
          </el-table-column>
          <el-table-column prop="title" label="章节标题" width="250" fixed="left">
          </el-table-column>
          <el-table-column prop="novel_name" label="小说名" width="250" fixed="left">
          </el-table-column>
          <el-table-column prop="author_id" label="作者ID" width="100">
          </el-table-column>
          <el-table-column prop="author_name" label="作者" width="150">
          </el-table-column>
          <el-table-column prop="text_count" label="字数">
          </el-table-column>
          <el-table-column label="机审结果">
                <template slot-scope="scope">
                    <p>{{scope.row.audit_status}}</p>
                </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <i
                class="el-icon-coordinate editIcon"
                @click="article_id=scope.row.article_id;ansMsgDialog=true;"
                v-if="!scope.row.solved"
                >&nbsp;审核</i>
            </template>
          </el-table-column>
        </el-table>
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
        title="章节审核"
        :visible.sync="ansMsgDialog"
        width="80%"
        :close-on-click-modal="false">
        <auditForm :article_id="article_id" @audit-success="handleAuditSuccess"/>
    </el-dialog>
  </div>
</template>


<script>
import auditForm from "../../components/forms/auditForm.vue"
export default {
    name:"UserManage",
    components:{
        auditForm
    },
    data(){
        return{
            filterForm: {
                author: "",
                title: ""
            },
            currentPage: 1,
            totalFaqs: 0,
            tableData: [],
            ansMsgDialog: false,
            article_id: undefined,
            refreshInterval: undefined,
            searchParams: {
                author: "",
                title: ""
            }
        }
    },
    methods:{
        handleSearch() {
            this.searchParams = JSON.parse(JSON.stringify(this.filterForm));
            this.currentPage = 1;
            this.refresh_article_audit_amount();
        },
        resetFilter() {
            this.filterForm = {
                author: "",
                title: ""
            };
            this.handleSearch();
        },
        handleFilterChange() {
            this.handleSearch();
        },
        handleAuditSuccess() {
            // 关闭对话框
            this.ansMsgDialog = false;
            // 刷新数据
            this.getFaqsData(this.currentPage);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getFaqsData(val);
        },
        getFaqsData(page){
            let _this = this;
            
            // 构建参数
            let params = {
                page: page
            };
            
            // 添加标题筛选
            if (this.searchParams.title) {
                params.title = this.searchParams.title;
            }
            
            // 添加作者筛选
            if (this.searchParams.author) {
                params.author = this.searchParams.author;
            }
            
            this.axios.get(this.$baseUrl + '/manage/audit/get_articles_to_audit', { params })
            .then((res) => {
                this.tableData = res.data;
                console.log(res.data);
            }).catch(function (error) {
                _this.$message({
                    showClose: true,
                    message: '无权限或数据获取失败',
                    type: 'error'
                });
            });
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
            // 可以基于审核状态设置不同行的样式
            if (row.audit_status && row.audit_status.includes('敏感')) {
                return 'warning-row';
            }
            return '';
        },
        showMoreInfo(article_id){
            window.open(`http://loghome.codesocean.top/#/pages/articles/detail?id=${article_id}`, '_blank');
        },
        refresh_article_audit_amount(){
            let _this = this;
            
            // 构建参数
            let params = {};
            
            // 添加标题筛选
            if (this.searchParams.title) {
                params.title = this.searchParams.title;
            }
            
            // 添加作者筛选
            if (this.searchParams.author) {
                params.author = this.searchParams.author;
            }
            
            this.axios.get(this.$baseUrl + '/manage/audit/get_articles_to_audit_amount', { params })
            .then((res) => {
                this.totalFaqs = res.data[0].count;
                this.getFaqsData(1);
            }).catch(function (error) {
                _this.$message({
                    showClose: true,
                    message: '无权限或数据获取失败',
                    type: 'error'
                });
            });
        }
    },
    mounted(){
        this.refresh_article_audit_amount();
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
  margin-bottom: 20px;
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

/* 表格行样式 */
:deep(.el-table .warning-row) {
  background-color: #fdf5e6;
}

:deep(.el-table .success-row) {
  background-color: #f0f9eb;
}
</style>