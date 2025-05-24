<template>
    <div class="outer">
        <div class="subtitle">原木社区罗盘系统</div>
        <div class="title">{{getHello()}}</div>
        <div class="content">
            <el-card class="box-card" shadow="hover" :body-style="{fontSize:'50px'}">
                <div slot="header" class="clearfix" >
                    <span>实时在线用户数量</span>
                </div>
                    {{onlineAmount}}个
            </el-card>
            <el-card class="box-card" shadow="hover" :body-style="{fontSize:'50px'}">
                <div slot="header" class="clearfix" >
                    <span>待解决反馈数量</span>
                </div>
                    {{totalFaqs}}个
            </el-card>
            <el-card class="box-card" shadow="hover" :body-style="{fontSize:'50px'}">
                <div slot="header" class="clearfix" >
                    <span>待复审文本数量</span>
                </div>
                    {{totalArticles}}个
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            user:{name:"admin"},
            menuData:[],
            operationToFill:false,
            onlineAmount:0,
            refreshInterval:undefined,
            totalFaqs:0,
            totalArticles:0
        }
    },
    mounted(){
        let user = JSON.parse(window.localStorage.getItem("UserInfo"));
        this.user = user;
        let _this = this;
        _this.axios.get( this.$baseUrl + '/users/userprofile').then((res) => {
            _this.user = JSON.parse(JSON.stringify(res.data));
        }).catch(function(error) {
            if(error.message == "Request failed with status code 401"){
                window.localStorage.removeItem('token');
                _this.$message({
                    showClose: true,
                    message: '登录信息过期，请重新登录',
                    type: 'error'
                });
            }
        })


        function get_online_amount(e){
            _this.axios.get( _this.$baseUrl + '/get_online_amount').then((res) => {
                _this.onlineAmount = res.data;
            }).catch(function(error) {
                _this.$message({
                    showClose: true,
                    message: '获取在线用户数量失败',
                    type: 'error'
                });
            })
        }

        function get_faqs_to_solve(){
            _this.axios.get(_this.$baseUrl + '/manage/faqs/get_faqs_amount_to_solve', {}).then((res) => {
                _this.totalFaqs = res.data[0].count;
            }).catch(function (error) {
                _this.$message({
                    showClose: true,
                    message: '无权限或数据获取失败',
                    type: 'error'
                });
            }).then(function(){
                
            })
        }

        function refresh_article_audit_amount(){
            _this.axios.get(_this.$baseUrl + '/manage/audit/get_articles_to_audit_amount', {}).then((res) => {
                _this.totalArticles = res.data[0].count;
            }).catch(function (error) {
                _this.$message({
                    showClose: true,
                    message: '无权限或数据获取失败',
                    type: 'error'
                });
            }).then(function(){
                
            })
        }

        function allWorks(){
            get_online_amount();
            get_faqs_to_solve();
            refresh_article_audit_amount();
        }

        allWorks()
        this.refreshInterval = setInterval(allWorks,5000)
        
    },
    beforeDestroy(){
        clearInterval(this.refreshInterval);
    },
    methods:{
        getHello(){
             var h = new Date().getHours();
            // 3. 判断小时数改变文字信息
            if(h < 6){
                return this.user.name + '，夜深了，早点休息哦。';
            }else if (h < 9){
                return this.user.name + '，美好的一天从清晨开始。';
            }else if (h < 12){
                return this.user.name + '，上午好！';
            }else if (h < 14){
                return this.user.name + '，中午好，别忘了吃午饭哦。';
            }else if (h < 17){
                return this.user.name + '，下午好！';
            }else if (h < 19){
                return this.user.name + '，下午好！';
            }else if (h < 22){
                return this.user.name + '，晚上好！';
            }else {
                return this.user.name + '，夜深了，早点休息哦。';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    div.outer{
        margin:50px;
        display:block;
        div.subtitle{
            font-size:20px;
            font-weight: bold;
            color:rgb(122, 122, 122);
        }
        div.title{
            font-weight: bold;
            font-size:35px;
        }
        div.content{
            display:flex;
        }
    }

    div.outer.mobile{
        display:block;
        margin:5vw;
        width:90vw;
        div.subtitle{
            font-size:15px;
            font-weight: bold;
            color:rgb(122, 122, 122);
        }
        div.title{
            font-weight: bold;
            font-size:20px;
        }
    }

    .box-card{
        margin-top:10px;
        margin-right:10px;
    }
</style>