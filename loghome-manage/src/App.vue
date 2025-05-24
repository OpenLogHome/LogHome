<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.aside .el-submenu__title:hover,
.el-menu-item:hover {
    background: #D7CCC8 !important;
    color: #757575 !important;
}
.aside .el-menu-item {
    min-width: none !important;
    font-size: 15px !important;
}

.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.router-link-active:visited,
a:visited {
    color: rgb(8, 143, 231);
}
.router-link-active,
a {
    color: #fff;
    text-decoration: none;
}
.el-popover {
    min-width: 0px !important;
    padding-left: 5px;
    padding-right: 5px;
}
.el-menu-item {
    font-size: 15px !important;
}
.el-submenu__title {
    font-size: 15px !important;
}
@font-face {
    font-family: "思源黑体";
    src: url("./assets/Source Han Sans CN Regular.ttf");
}
body {
    margin: 0;
    font-family: "思源黑体", Arial, Helvetica, sans-serif, "宋体" !important;
    -webkit-user-drag: none;
}
.el-table__cell{
    font-family: "思源黑体", Arial, Helvetica, sans-serif, "宋体" !important;
    font-size: 15px !important;
}
.operButtonGroup .el-button--small{
    font-size: 15px !important;
    font-family: "思源黑体", Arial, Helvetica, sans-serif, "宋体" !important;
}

.constraintGroup .el-checkbox__label{
    font-size: 16px !important;
    font-family: "思源黑体", Arial, Helvetica, sans-serif, "宋体" !important;
}
.constraintGroup .el-checkbox__inner{
    width: 18px;
    height: 18px;
}
.el-dialog{
    transition:all .5s;
}

.el-table .warning-row {
    background: oldlace !important;
}

.el-table .success-row {
    background: #f0f9eb !important;
}

</style>
