<template>
  <div class="outer" >
    <el-form ref="filterForm" :model="filterForm" class="search">
      <div class="infoName">筛选问题:</div>
      <el-select v-model="filterForm.filter" placeholder="筛选条件" class="inputBox" size="small" @change="handleFilterChange">
        <el-option label="全部问题" value="all"></el-option>
        <el-option label="未解决问题" value="unsolved"></el-option>
        <el-option label="常见问题" value="typical"></el-option>
      </el-select>
      <div class="infoName">提问者:</div>
      <el-input
        v-model="filterForm.name"
        placeholder="请输入提问者昵称"
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
                        <p :style="{'color':scope.row.user_id < 0 ? '#1989FA':'black'}">{{scope.row.faq_id}}</p>
                    </div>
                </template>
          </el-table-column>
          <el-table-column prop="user_id" label="提问者ID" width="100" fixed="left">
          </el-table-column>
          <el-table-column prop="name" label="提问者昵称" width="150" fixed="left">
          </el-table-column>
          <el-table-column prop="faq_title" label="标题">
          </el-table-column>
          <el-table-column label="创建时间">
                <template slot-scope="scope">
                    <p>{{utc2beijing(scope.row.create_time)}}</p>
                </template>
          </el-table-column>
          <el-table-column label="是否解决"  width="100">
                <template slot-scope="scope">
                    <p>{{scope.row.solved?"是":"否"}}</p>
                </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <i
                class="el-icon-edit editIcon"
                @click="faq_id=scope.row.faq_id;ansMsgDialog=true;"
                v-if="!scope.row.solved"
                >&nbsp;回复</i>
              <i
                class="el-icon-view editIcon"
                @click="showMoreInfo(scope.row.faq_id)"
                v-if="scope.row.solved"
                >&nbsp;查看详情</i>
              <i
                class="el-icon-star-off editIcon"
                @click="handleTypical(scope.row.faq_id,1)"
                v-if="scope.row.solved && !scope.row.is_typical"
                style="color:#FB532F"
                >&nbsp;设置为常见问题</i>
              <i
                class="el-icon-star-off editIcon"
                @click="handleTypical(scope.row.faq_id,0)"
                v-if="scope.row.solved && scope.row.is_typical"
                style="color:#888888"
                >&nbsp;取消设置为常见问题</i>
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
        title="回复"
        :visible.sync="ansMsgDialog"
        width="50%"
        :close-on-click-modal="false"
        @closed="handleDialogClosed">
        <faqAnswerForm :faq_id="faq_id" @answer-success="handleAnswerSuccess"/>
    </el-dialog>
  </div>
</template>


<script>
import faqAnswerForm from "../../components/forms/faqAnswer.vue"
export default {
    name:"UserManage",
    components:{
        faqAnswerForm
    },
    data(){
        return{
            filterForm:{
                name: "",
                filter: "all"
            },
            currentPage: 1,
            totalFaqs: 0,
            tableData: [],
            ansMsgDialog: false,
            faq_id: undefined,
            searchParams: {
                name: "",
                filter: "all"
            }
        }
    },
    methods:{
        handleSearch() {
            this.searchParams = JSON.parse(JSON.stringify(this.filterForm));
            this.currentPage = 1;
            this.updateFaqsAmount();
            this.getFaqsData(1);
        },
        resetFilter() {
            this.filterForm = {
                name: "",
                filter: "all"
            };
            this.handleSearch();
        },
        handleFilterChange() {
            this.handleSearch();
        },
        handleTypical(id, is_typical) {
            this.$confirm('确认' + (is_typical == 1 ? '设置为常见' : '取消设置为常见') + '问题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let _this = this;
                this.axios.post(this.$baseUrl + '/manage/faqs/set_typical', {faq_id: id, is_typical: is_typical})
                .then(function (response) {
                    _this.$message({
                        showClose: true,
                        message: '操作成功',
                        type: 'success'
                    });
                    // 不再使用location.reload()刷新整个页面
                    _this.getFaqsData(_this.currentPage);
                })
                .catch(function (error) {
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
            this.currentPage = val;
            this.getFaqsData(val);
        },
        getFaqsData(page) {
            let _this = this;
            let params = {
                page: page
            };
            
            // 添加筛选参数
            if (this.searchParams.filter !== 'all') {
                params.filter = this.searchParams.filter;
            }
            
            // 添加搜索姓名参数
            if (this.searchParams.name) {
                params.name = this.searchParams.name;
            }
            
            this.axios.get(this.$baseUrl + '/manage/faqs/get_all_faqs', { params: params })
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
        updateFaqsAmount() {
            let _this = this;
            let params = {};
            
            if (this.searchParams.filter !== 'all') {
                params.filter = this.searchParams.filter;
            }
            
            if (this.searchParams.name) {
                params.name = this.searchParams.name;
            }
            
            this.axios.get(this.$baseUrl + '/manage/faqs/get_faqs_amount', { params: params })
            .then((res) => {
                this.totalFaqs = res.data[0].count;
            }).catch(function (error) {
                _this.$message({
                    showClose: true,
                    message: '数据获取失败',
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
            if (!row.solved) {
                return 'warning-row';
            } else {
                return 'success-row';
            }
            return '';
        },
        showMoreInfo(faq_id){
            window.open('http://loghome.ink/#/pages/apps/faqs/feedback?id=' + faq_id,'_blank');
        },
        handleDialogClosed() {
            // 对话框关闭后的处理
        },
        handleAnswerSuccess() {
            // 回复成功后刷新数据
            this.ansMsgDialog = false;
            this.getFaqsData(this.currentPage);
        }
    },
    mounted(){
        this.updateFaqsAmount();
        this.getFaqsData(1);
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
    margin-top: 20px;
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