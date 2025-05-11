<template>
  <div class="plTableBox" :class="{beautifyTableClass: beautifyTable}" :style="[plTableHeight]">
    <el-table ref="singleTable"
              class="singleTable"
              :data="data"
              :max-height="newMaxHeight"
              :height="newHeight"
              :select-tr-class="selectTrClass"
              :use-virtual="height && parseInt(height) > 0 || maxHeight && parseInt(maxHeight) > 0? useVirtual : false"
              :excess-rows="excessRows"
              :border="border"
              :indent="indent"
              :lazy="lazy"
              :load="load"
              :data-changes-scroll-top="dataChangesScrollTop"
              :stripe="stripe"
              :row-key="rowKey"
              :row-id="rowId"
              :fixed-columns-roll="fixedColumnsRoll"
              :fit="fit"
              :show-header="showHeader"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName"
              :header-row-class-name="headerRowClassName"
              :header-row-style="headerRowStyle"
              :header-cell-class-name="headerCellClassName"
              :header-cell-style="headerCellStyle"
              :row-style="rowStyle"
              :cell-style="cellStyle"
              :big-data-checkbox="bigDataCheckbox"
              :show-header-overflow="showHeaderOverflow"
              :show-body-overflow="showBodyOverflow"
              :size="size"
              :default-sort="defaultSort"
              :default-expand-all="defaultExpandAll"
              :expand-row-keys="expandRowKeys"
              :tree-props="treeProps"
              :tree-config="treeConfig"
              :select-on-indeterminate="selectOnIndeterminate"
              :span-method="arraySpanMethod"
              :rowHeight="rowHeight"
              :tooltipEffect="tooltipEffect"
              :current-row-key="currentRowKey"
              :tooltipPlacement="tooltipPlacement"
              :header-drag-style="headerDragStyle"
              @row-click="rowClick"
              @row-dblclick="rowDblclick"
              @expand-change="expChang"
              @tableBodyScroll="tableBodyScroll"
              :highlight-current-row="highlightCurrentRow"
              :show-summary="showSummary"
              @header-dragend="headerDragend"
              :summary-method="getSummaries"
              @cell-mouse-enter="cellMouseEnter"
              @cell-mouse-leave="cellMouseLeave"
              @cell-click="cellClick"
              @cell-dblclick="cellDblclick"
              @row-contextmenu="rowContextmenu"
              @header-contextmenu="headerContextmenu"
              @header-click="headerClick"
              @select="plSelect"
              @select-all="selectAll"
              @selection-change="handleSelectionChange"
              @filter-change="filterChange"
              @current-change="currentChange"
              @toggle-tree-expand="toggleTreeExpands"
              @sort-change="sortChange">
      <!--无数据布局-->
      <template slot="empty">
        <slot name="empty">{{ emptyText }}</slot>
      </template>
      <!--列的数组-->
      <slot/>
    </el-table>
    <div class="myPagination" v-if="paginationShow" ref="myPagination">
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="newcurrentPage"
              :pager-count="pagerCount"
              :page-sizes="pageSizes"
              :page-size="newPageSize"
              :layout="layout"
              :total="total"/>
    </div>
    <div class="plDialog" ref="plDialog">
      <div style="width: 100%;height: 100%;" v-if="plDialogFals">
        <div class="table-cus-header">{{ fieldTitle }}</div>
        <div class="checkListBox">
          <draggable tag="ul"
                     :options="{disabled: !fieldSort}"
                     v-model="newDialogData">
            <li v-for="(item, index) in newDialogData" :key="index">
              <el-checkbox v-model="item.state" :disabled="item.disabled">{{ item.name }}</el-checkbox>
              <template v-if="showDialogIcon">
                <i class="iconfont"
                   :class="[moveDownIcon || 'el-icon-bottom']"
                   @click="handleField('下移', index, newDialogData)"
                   v-if="index !== newDialogData.length - 1"/>
                <i class="iconfont"
                   :class="[moveUpIcon || 'el-icon-top']"
                   @click="handleField('上移', index, newDialogData)"
                   v-if="index !== 0"/>
              </template>
              <i class="iconfont"
                 :class="[amendBtnIcon || 'el-icon-edit']"
                 v-if="showAmend"
                 @click="amendField(item, index)"/>
            </li>
          </draggable>
        </div>
        <div class="table-cus-footer">
          <el-button @click="closeModal()">取消</el-button>
          <el-button type="primary" @click="confirmField">确定</el-button>
          <el-button type="warning" @click="reset">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import Vue from 'vue'
  import draggable from 'vuedraggable'
  import ElTable from 'umy-table/packages/table'
  import ElPagination from 'umy-table/packages/pagination'
  import ElCheckbox from 'umy-table/packages/checkbox'
  import ElButton from 'umy-table/packages/button'
  import uTableMixin from '../u-table-mixins'
  import { parseHeight, isArrayFn } from '../../../utils/common'
  export default {
      name:'UTable',
      mixins: [uTableMixin],
      components: {draggable, ElTable, ElPagination, ElCheckbox, ElButton},
      data () {
          return {
              _times: '', // 弹框定时器
              plDialogFals: false, // 侧滑弹框是否开启
              newDialogData: [], // 新自定义字段的数据
              aBox: '', // 蒙层节点
              tableSelectData: [], // 整个表格勾选项（含分页）
              position: {}, // 当前滚动的位置
              newTableStore: '', // 表格的store
              newPageSize: '', // 每页条数
              newcurrentPage: '', // 当前页
              newHeight: null, // 表格高度
              newMaxHeight: null // 表格最大高度
          }
      },
      computed: {
          plTableHeight() {
              if (this.height) {
                  return {
                      height: this.height + 'px'
                  };
              } else if (this.maxHeight) {
                  const maxHeight = parseHeight(this.maxHeight);
                  if (typeof maxHeight === 'number') {
                      return {
                          'max-height': this.maxHeight + 'px'
                      };
                  }
              }
              return {};
          }
      },
      created () {
          this.newPageSize = this.pageSize
          this.newcurrentPage = this.currentPage
      },
      mounted () {
          this.$ready = true
      },
      methods: {
          // 自定义字段按钮事件
          handleField (name, index, arr) {
              switch (name) {
                  case '上移':
                      arr = this.swapItems(arr, index, index - 1)
                      break
                  case '下移':
                      arr = this.swapItems(arr, index, index + 1)
                      break
                  default:
                      break
              }
              this.$emit('handle-field', name, index)
          },
          // 交换后的数据
          swapItems(arr, index1, index2) {
              arr[index1] = arr.splice(index2, 1, arr[index1])[0];
              return arr;
          },
          // 设置表格高度
          setHeight () {
              if (!this.$ready && this.paginationShow) return Vue.nextTick(() => this.setHeight());
              const { myPagination } = this.$refs;
              if (this.height) {
                  this.newHeight = parseHeight(this.height) - (myPagination ? myPagination.offsetHeight : 0)
                  this.newMaxHeight = null
              } else if (this.maxHeight) {
                  this.newMaxHeight = parseHeight(this.maxHeight) - (myPagination ? myPagination.offsetHeight : 0)
                  this.newHeight = null
              }
          },
          // 设置表格数据
          reloadData (data) {
              if (!isArrayFn(data)) {
                  throw new Error('表格数据需要的是数组格式，请检查你的数据格式');
              } else {
                  return this.$refs.singleTable.reloadData(data)
              }
          },
          // 返回一个el-table实例
          tableExample () {
              if (this.$refs.singleTable) {
                  return this.$refs.singleTable
              }
          },
          // 返回虚拟树的table数据,他常用于虚拟树复选框的勾选
          getUTreeData () {
              if (this.$refs.singleTable) {
                  return this.$refs.singleTable.plTreeData
              }
          },
          // 返回表格的列
          getTableColumn () {
              if (this.$refs.singleTable) {
                  return this.$refs.singleTable.columns
              }
          },
          // 获取选中的列
          getCheckboxRecords () {
              if (this.$refs.singleTable) {
                  return this.$refs.singleTable.selection
              }
          }
      }
  }
</script>
