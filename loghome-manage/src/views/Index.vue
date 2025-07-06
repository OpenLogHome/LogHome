<template>
  <div class="outer" :style="{height : fullHeight + 'px'}">
    <div class="aside" :style="{height : fullHeight + 'px'}">
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
           background-color="#795548"
          text-color="#fff"
          active-text-color="rgb(234,112,52)"
        >
          <div class="siteTitle">
            <div class="logo">
              <img
                src="../assets/applogo_white.png"
                alt=""
              />
            </div>
            <div class="title">原木罗盘系统</div>
          </div>
          <router-link to="/">
                <el-menu-item index="0">
                    <i class="el-icon-data-analysis"></i>
                    仪表盘
                </el-menu-item>
          </router-link>
          <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-notebook-1"></i>
                <span>书库管理</span>
            </template>
            <router-link to="/libraryRoulousChart">
                <el-menu-item index="1-1">
                    <i class="el-icon-picture-outline"></i>
                    轮播图管理
                </el-menu-item>
            </router-link>
            <router-link to="/novelsManage">
                <el-menu-item index="1-2">
                    <i class="el-icon-reading"></i>
                    小说管理
                </el-menu-item>
            </router-link>
            <router-link to="/auditManage">
                <el-menu-item index="1-3">
                    <i class="el-icon-coordinate"></i>
                    文章审核
                </el-menu-item>
            </router-link>
          </el-submenu>
           <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-setting"></i>
                <span>系统管理</span>
            </template>
            <router-link to="/UserManage">
                <el-menu-item index="2-1">
                    <i class="el-icon-user"></i>
                    用户管理
                </el-menu-item>
            </router-link>
            <router-link to="/faqsManage">
                <el-menu-item index="2-2">
                    <i class="el-icon-phone-outline"></i>
                    反馈管理
                </el-menu-item>
            </router-link>
            <router-link to="/postsManage">
                <el-menu-item index="2-3">
                    <i class="el-icon-document-copy"></i>
                    帖子管理
                </el-menu-item>
            </router-link>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-chat-dot-round"></i>
                <span>社区管理</span>
            </template>
            <router-link to="/circleManage">
                <el-menu-item index="3-1">
                    <i class="el-icon-connection"></i>
                    圈子管理
                </el-menu-item>
            </router-link>
            <router-link to="/communityPosts">
                <el-menu-item index="3-2">
                    <i class="el-icon-document"></i>
                    帖子管理
                </el-menu-item>
            </router-link>
            <router-link to="/reportsManage">
                <el-menu-item index="3-3">
                    <i class="el-icon-warning-outline"></i>
                    举报管理
                </el-menu-item>
            </router-link>
          </el-submenu>
        </el-menu>
      </div>
    <div class="rightAside">
        <div class="header">
            <div class="naviInfo">
                <i class="el-icon-menu naviIcon"></i>
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
                <i class="el-icon-search naviIcon"></i>
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
export default {
  name: 'Index',
  data(){
      return {
            squareUrl:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            fullHeight: document.documentElement.clientHeight,
            breadList:[],
            user:{avatar_url:""}
      }
  },
  props: {},
  methods: {
    handleOpen(key, keyPath) {
        console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
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
        },
        fullHeight (val) {
            if(!this.timer) {
                this.fullHeight = val
                this.timer = true
                let that = this
                setTimeout(function (){
                that.timer = false
            },400)
            }
        }
    },
    mounted() {
        let _this = this;
        window.onresize = () => {
            return (() => {
                window.fullHeight = document.documentElement.clientHeight
                this.fullHeight = window.fullHeight,
                console.log(this.fullHeight)
            })()
        }
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
.outer{
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
    overflow-x:hidden;
}
.aside{
  width: 15vw;
  background-color: #795548;
  overflow: hidden;
  height: 100vh;
  .siteTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    height: 70px;
    width: 100%;
    background-color: #795548;
  }
  .logo {
    width: 20px;
    height: 40%;
    display: flex;
    justify-content: center;
    align-content: center;
    margin-left: -10px;
    img {
      margin-top: -3px;
      height: 35px;
      width: 35px;
    }
  }
  .title {
    margin-left: 15px;
    font-size: 18px;
    font-weight: bold;
  }
}
.rightAside{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 100vh;
    width: 85vw;
    .header{
        display: flex;
        align-items: center;
        height: 7vh;
        width: 85vw;
        box-shadow: 1px 1px 4px 2px rgba(154, 158, 165,.8);
        z-index: 9;
        .naviIcon{
            margin-top: -1px;
            margin-right: 10px;
        }
        .naviInfo{
            margin-left: 20px;
            display: flex;
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
        height: 93vh;
        width: 85vw;
        overflow: hidden;
    }

}
</style>
