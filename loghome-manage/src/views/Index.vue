<template>
  <div class="outer">
    <admin-sidebar ref="sidebar" />
    <div class="rightAside">
        <div class="header">
            <div class="naviInfo">
                <el-tooltip content="搜索菜单" placement="bottom">
                  <button class="menu-search-trigger" type="button" aria-label="搜索菜单" @click="$refs.sidebar.focusSearch()">
                    <i class="el-icon-search" aria-hidden="true"></i>
                  </button>
                </el-tooltip>
                  <!--面包屑-->
                  <el-breadcrumb class="breadcrumb" separator="/">
                    <!--面包屑列表-->
                    <el-breadcrumb-item
                      v-for='(item,index) in breadList'
                      :key='index'
                      @click.native="breadcrumbClick(item)"
                      v-show="item.name" style="cursor: pointer">
                     {{item.name}}
                    </el-breadcrumb-item>
                  </el-breadcrumb>
            </div>
            <div class="headPortrait">
                <el-dropdown trigger="click" @command="handleDropDownCommand">
                    <span class="el-dropdown-link">
                        <el-avatar shape="square" :size="35" :src="user.avatar_url"></el-avatar>
                        <i class="el-icon-caret-bottom" style="color:rgb(111,115,116)"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item>账户设置</el-dropdown-item>
                        <el-dropdown-item command="logout">注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../components/AdminSidebar.vue'

export default {
  name: 'Index',
  components: { AdminSidebar },
  data(){
      return {
            squareUrl:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            breadList:[],
            user:{avatar_url:""}
      }
  },
  props: {},
  methods: {
    // 面包屑数据处理
    getBreadcrumb () {
      let breadNumber = typeof (this.$route.meta.breadNumber) !== 'undefined' ? this.$route.meta.breadNumber : 0;
      let newBread = {name: this.$route.name, path: this.$route.fullPath,parentName:this.$route.meta.parentName};
      console.log(this.$route);
      if(breadNumber >= 0){
          if (breadNumber - 1 <= this.breadList.length) {
            this.breadList.splice(breadNumber - this.breadList.length, this.breadList.length - breadNumber + 1);
          }
          if (breadNumber - 1 >= this.breadList.length) {
            this.breadList.push(newBread);
          }
      }
      
    },
    breadcrumbClick (item) {
      this.$router.push({
        path: item.path
      })
      this.getBreadcrumb();
    },
    handleDropDownCommand(command){
        let _this = this;
        if(command == "logout"){
            this.$confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                window.localStorage.removeItem('token');
                _this.$router.push({name:"登录"});
            }).catch(() => {
    
            });
        }
	},
  },
  watch: {
        $route () {
          this.getBreadcrumb();
        }
    },
    mounted() {
        let _this = this;
        this.getBreadcrumb();

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

    }
}
</script>

<style lang="scss" scoped>
.outer {
    display: flex;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
}
.rightAside{
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    flex: 1;
    overflow: hidden;
    .header{
        display: flex;
        align-items: center;
        height: 60px;
        flex-shrink: 0;
        width: 100%;
        box-shadow: 1px 1px 4px 2px rgba(154, 158, 165,.8);
        z-index: 9;
        .naviIcon{
            margin-top: -1px;
            margin-right: 10px;
        }
        .naviInfo{
            margin-left: 20px;
            display: flex;
            align-items: center;
        }
        .menu-search-trigger {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            margin-right: 10px;
            border: 0;
            border-radius: 5px;
            background: transparent;
            color: #795548;
            font-size: 18px;
            cursor: pointer;
            &:hover,
            &:focus-visible {
                background: #f5efec;
            }
        }
        .headPortrait{
            position: absolute;
            right: 40px;
            margin-top: 5px;
            .naviIcon{
                font-size: 20px;
                font-weight: bolder;
                position: relative;
                bottom: 8px;
                right: 5px;
                color: rgb(255, 255, 255);
            }
        }
    }
    .main{
        flex: 1;
        min-height: 0;
        width: 100%;
        overflow: auto;
    }

}
</style>
