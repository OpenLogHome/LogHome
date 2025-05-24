<template>
  <div class="outer">
    <div class="imgBlock" v-show="filterForm.isValid == '1'">
        <div class="inner">
            <el-carousel trigger="click" height="210px" indicator-position="outside">
                <el-carousel-item v-for="item in displayedList.filter(item=>item.isValid)" :key="item.id">
                    <el-image
                        :src="item.image"
                        fit="cover">
                    </el-image>
                    <p class="title">{{item.title}}</p>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
    <div class="block">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
            <el-form-item label="是否启用">
                <el-select v-model="filterForm.isValid" placeholder="全部" clearable @change="handleFilter">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已启用" :value="1"></el-option>
                    <el-option label="未启用" :value="0"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <el-table
            :data="displayedList"
            style="width: 100%">
            <el-table-column
                prop="id"
                label="ID"
                width="80">
            </el-table-column>
            <el-table-column
                prop="order"
                label="顺序"
                width="80">
                <template slot-scope="scope">
                    <el-input-number 
                        v-model="scope.row.order" 
                        @change="changeOrder(scope.row)"
                        :min="0"
                        :controls="false"
                        size="small"
                        style="width: 40px;">
                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column
                label="图片"
                width="180">
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.image"
                        fit="contain"></el-image>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题">
            </el-table-column>
            <el-table-column
                prop="navigate_to"
                label="跳转地址">
            </el-table-column>
                <el-table-column
                    label="是否启用"
                    width="100">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.isValid"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="rgb(234,112,52)"
                            inactive-color="#B9B9B9"
                            @change="changeSwitch(scope.row)"/>
                    </template>
                </el-table-column>
            <el-table-column
                label="操作"
                width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle @click="editRow(scope.$index)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="deleteRow(scope.row)"></el-button>
                    </template>
            </el-table-column>
        </el-table>
        
        <div class="pagination-container">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.page"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
        
        <div style="height:50px;"></div>
        <el-button type="primary" @click="addImage">新增轮播图</el-button>
    </div>

    <el-dialog
        title="轮播图编辑"
        :visible.sync="dialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="handleDialogClosed">
        <roulousChartForm :formData="formData" @submit-success="handleSubmitSuccess"/>
    </el-dialog>

    <el-dialog
        title="提示"
        :visible.sync="deleteDialogVisible"
        width="30%">
        <span>确定要删除这个轮播图吗？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmDelete">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import roulousChartForm from "../../components/forms/roulousChartForm.vue"
export default {
    components:{
        roulousChartForm
    },
    data() {
        return {
            chartList: [],
            displayedList: [],
            dialogVisible: false,
            deleteDialogVisible: false,
            deleteId: null,
            filterForm: {
                isValid: ''
            },
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            formData: {
                id: undefined,
                name: undefined,
                navigate_to: undefined,
                title: undefined,
                image: null,
                order: 0,
            },
        }
    },
    mounted(){
        this.fetchData();
    },
    methods:{
        fetchData() {
            let _this = this;
            const params = {
                page: this.pagination.page,
                pageSize: this.pagination.pageSize
            };
            
            if (this.filterForm.isValid !== '') {
                params.isValid = this.filterForm.isValid;
            }
            
            this.axios.get(this.$baseUrl + '/manage/library/get_library_roulous_chart', { params })
            .then((res) => {
                this.chartList = res.data.data;
                this.displayedList = [...this.chartList];
                this.pagination.total = res.data.pagination.total;
                console.log('获取到的轮播图数据:', this.chartList);
            }).catch(function (error) {
                _this.$message({
                    showClose: true,
                    message: '无权限或数据获取失败',
                    type: 'error'
                });
            });
        },
        handleFilter() {
            this.pagination.page = 1;
            this.fetchData();
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.fetchData();
        },
        handleCurrentChange(val) {
            this.pagination.page = val;
            this.fetchData();
        },
        editRow(index){
            this.formData = JSON.parse(JSON.stringify(this.displayedList[index]));
            this.dialogVisible = true;
        },
        addImage(){
            this.formData = {
                id: undefined,
                name: undefined,
                navigate_to: undefined,
                title: undefined,
                image: null,
                order: 0,
            };
            this.dialogVisible = true;
        },
        changeSwitch(row){
            let _this = this;
            this.axios.post(this.$baseUrl + '/manage/library/edit_library_roulous_chart', {id: row.id, isValid: row.isValid})
            .then(function (response) {
                _this.$message({
                    showClose: true,
                    message: '状态切换成功',
                    type: 'success'
                });
            })
            .catch(function (error) {
                if(error) {
                    _this.$message({
                        showClose: true,
                        message: '状态切换出错',
                        type: 'error'
                    });
                }
            });
        },
        changeOrder(row) {
            let _this = this;
            this.axios.post(this.$baseUrl + '/manage/library/update_roulous_chart_order', {id: row.id, order: row.order})
            .then(function (response) {
                _this.$message({
                    showClose: true,
                    message: '顺序更新成功',
                    type: 'success'
                });
                _this.fetchData();
            })
            .catch(function (error) {
                if(error) {
                    _this.$message({
                        showClose: true,
                        message: '顺序更新出错',
                        type: 'error'
                    });
                }
            });
        },
        deleteRow(row) {
            this.deleteId = row.id;
            this.deleteDialogVisible = true;
        },
        confirmDelete() {
            let _this = this;
            this.axios.post(this.$baseUrl + '/manage/library/delete_library_roulous_chart', {id: this.deleteId})
            .then(function (response) {
                _this.$message({
                    showClose: true,
                    message: '删除成功',
                    type: 'success'
                });
                _this.deleteDialogVisible = false;
                _this.fetchData();
            })
            .catch(function (error) {
                if(error) {
                    _this.$message({
                        showClose: true,
                        message: '删除出错',
                        type: 'error'
                    });
                }
            });
        },
        handleDialogClosed() {
            // 不再需要在这里重复获取数据，由submit-success事件处理
        },
        handleSubmitSuccess() {
            this.fetchData();
        }
    }
}
</script>

<style lang="scss" scoped>
    .outer{
        width:100%;
        height:100%;
        display:block;
        div.block{
            margin:50px;
        }
        div.imgBlock{
            margin:50px;
            display:flex;
            justify-content: center;
            position:relative;
            transform: scale(1.1);
            .inner{
                width:375px;
                height:210px;
                .el-image{
                    width:375px;
                    height:210px;
                }
                p.title{
                    position:absolute;
                    bottom:-10px;
                    left:10px;
                    width:100%;
                    color:white;
                }
            }
        }
    }
    .pagination-container {
        margin-top: 20px;
        text-align: right;
    }
</style>