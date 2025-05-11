// umy-table mixins
import { isArrayFn, removal, typeIs } from '../../../utils/common'
export default {
    props: {
        data: {type: Array, default: () => []}, // 表格数据
        height: [String, Number],
        maxHeight: [String, Number],
        dialogData: {type: Array, default: () => []}, // 选择显示字段数组
        dataChangesScrollTop: {default: true, type: Boolean},  // 数据变化是否需要滚动到顶部
        stripe: {default: false, type: Boolean}, // 是否为斑马纹
        size: {default: '', type: String}, // Table 的尺寸
        fit: {default: true, type: Boolean}, // 列的宽度是否自撑开
        defaultSort: Object, // 默认的排序列的 prop 和顺序
        showHeader: {default: true, type: Boolean}, // 是否显示表头
        currentRowKey: [String, Number], // 当前行的 key，只写属性
        selectOnIndeterminate: {type: Boolean, default: true}, // 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为
        emptyText: {default: '暂无数据', type: String}, // 空数据时显示的文本内容
        indent: {type: Number, default: 16}, // 展示树形数据时，树节点的缩进
        lazy: Boolean,
        load: Function,
        border: {default: true, type: Boolean}, // 是否显示纵向边框
        showSummary: {default: false, type: Boolean}, // 是否需要合计
        defaultExpandAll: {default: false, type: Boolean}, // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
        expandRowKeys: Array,
        treeProps: { default () { return { hasChildren: 'hasChildren', children: 'children' } }, type: Object }, // 渲染嵌套数据的配置选项
        treeConfig: [Boolean, Object],// 树形结构配置项
        totalOption: { default: () => [], type: Array }, // 需要合计的选项
        sumText: { default: '合计', type: String }, // 合计行名称
        fieldSort: { default: true, type: Boolean }, // 字段排序
        rowId: String, // 长用于大数据树
        rowKey: [String, Function], // 支持树类型的数据
        highlightCurrentRow: { default: true, type: Boolean }, // 是否要高亮当前行
        inverseCurrentRow: { default: false, type: Boolean }, // 是否需要反选高亮当前行
        showDialogIcon: { default: true, type: Boolean }, // 是否显示操作字段的上下移动按钮(侧滑框)
        moveDownIcon: { default: '', type: String }, // 下移按钮的图标(侧滑框)
        moveUpIcon: { default: '', type: String }, // 上移按钮的图标(侧滑框)
        showAmend: { default: false, type: Boolean }, // 是否显示修改字段名按钮(侧滑框)
        amendBtnIcon: { default: '', type: String }, // 修改字段按钮的图标(侧滑框)
        fieldTitle: { default: '选择显示字段', type: String }, // 弹框的标题(侧滑框)
        recordTableSelect: { default: false, type: Boolean }, // 是否记录表格的选项id(必须保证行ID存在，且唯一)
        headerDragStyle: { default: false, type: Boolean }, // 是否修改表格的头部拖动样式  | Boolean | false
        useVirtual: { default: false, type: Boolean }, // 是否开启虚拟滚动 | Boolean | false
        rowHeight: { default: 60, type: Number }, // 行高(必须要设置行高，否则会导致表格计算不正确)| Number | 60
        excessRows: { default: 3, type: Number }, //	可视区域上方和下方额外渲染的行数，行数越多表格接替渲染效果越好，但越耗性能	Number	3
        spanMethod: Function, // 合并行或列的计算方法 (注意，当开启useVirtual时，无效)
        tooltipEffect: { default: 'dark', type: String }, // tooltip effect 属性	String	dark/light
        beautifyTable: { default: false, type: Boolean }, // 美化表格，修改了样式
        tooltipPlacement: { default: 'top', type: String }, // Tooltip 的出现位置	String	top
        summaryMethod: Function, // 自定义的合计计算方法
        bigDataCheckbox: { default: false, type: Boolean }, // 大量数据时候（至少数据量大于3000条每页），表格存在selection选择列表时，是否开启解决全选卡顿（缓慢）问题，开启此项可能影响table-column的selectable属性功能，最好不要使用selectable
        rowClassName: [String, Function], // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
        rowStyle: [Object, Function], // 行的 style 的回调方法
        cellClassName: [String, Function], // 行单元格的 className 的回调方法
        cellStyle: [Object, Function], // 行单元格的 style 的回调方法
        headerRowClassName: [String, Function], // 表头行的 className 的回调方法
        headerRowStyle: [Object, Function], // 表头行的 style 的回调方法
        headerCellClassName: [String, Function], // 表头单元格的 className 的回调方法
        headerCellStyle: [Object, Function], // 表头单元格的 style 的回调方法
        showHeaderOverflow: { type: [Boolean, String], default: null }, // 设置表头所有内容过长时显示为省略号
        showBodyOverflow: { type: [Boolean, String], default: null }, // 设置表体所有内容过长时显示为省略号
        fixedColumnsRoll: { default: false, type: Boolean }, // 表格有固定列,同时表格有合计,同时表格有横向滚动条，会导致固定列部分的横向滚动条不可拖动，是否需要解决此问题
        selectTrClass: String, //  如果当前行被选中了 type类型为selection，就给当前行给个类样式
        paginationShow: {default: false, type: Boolean}, // 是否需要分页器
        total: {default: 0, type: Number}, // 总条数
        pagerCount: { default: 5, type: Number }, // 页码按钮的数量，当总页数超过该值时会折叠
        pageSize:{ default: 10, type: Number }, // 每页条数
        currentPage: { default: 1, type: Number }, // 当前页
        pageSizes: { default: () => [10, 20, 30, 50], type: Array }, // 每页显示个数选择器的选项设置
        layout: { default: 'total, sizes, prev, pager, next, jumper', type: String } // 分页组件布局，子组件名用逗号分隔
    },
    methods: {
        // 分页器的事件
        handleSizeChange (val) {
            this.newPageSize = val
            this.$emit('handlePageSize', { size: this.newPageSize, page: this.newcurrentPage })
        },
        handleCurrentChange (val) {
            this.newcurrentPage = val
            this.$emit('handlePageSize', { size: this.newPageSize, page: this.newcurrentPage })
        },
        // 用于可展开表格与树形表格
        toggleRowExpansion (row, expanded) {
            this.$refs.singleTable.toggleRowExpansion(row, expanded)
        },
        // 合并行或列的计算方法
        arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
            let objs = {row, column, rowIndex, columnIndex}
            // 是否有条件开启合并列
            if (typeof this.spanMethod === 'function') {
                return this.spanMethod(objs)
            } else {
                return ''
            }
        },

        // 当用户手动勾选全选 Checkbox 时触发的事件	selection
        selectAll (selection) {
            this.$emit('select-all', selection)
            // 当用户取消全选，就去找出表格当前的数据ID,然后去删除记录选择项ID数组对应的值
            if (this.recordTableSelect && this.data.length <= 1000) {
                if (selection.length === 0) {
                    // this.data当前页的数据（当前表格数据）
                    this.data.forEach(item => {
                        this.tableSelectData.forEach((is, index) => {
                            if (item.id === is) {
                                this.tableSelectData.splice(index, 1)
                            }
                        })
                    })
                }
                // 全选 就去添加记录
                if (selection.length > 0) {
                    this.data.forEach(item => {
                        if (item.id) {
                            this.tableSelectData.push(item.id)
                        }
                    })
                }
                this.tableSelectData = JSON.parse(JSON.stringify(removal(this.tableSelectData)));
                // 这就是整个表格当前选中项（包含分页）
                this.$emit('table-select-change', this.tableSelectData)
            }
        },
        // 当用户手动勾选数据行的 Checkbox 时触发的事件
        plSelect (selection, row) {
            this.$emit('select', selection, row)
            // （执行删除选中节点操作）
            if (row.id && this.recordTableSelect && this.data.length <= 1000) {
                // 思路如下：  selection表示当前表格选中的节点数组, row表示当前点击的行节点
                // 1.如果selection中存在row ， 代表当前是勾上节点
                // 2.相反selection中不存在row ， 代表当前是在取消选中节点
                // 3.如果当前在取消选中节点，则falsData为空
                // 4.如果falsData为空，则去执行删除 -> 存放整个表格（包含分页）的数组中的值 （则 his.dats整个表格（包含分页）选中的节点数组节点ID）
                // 5. 这一步非常重要（判断当时节点是关闭，还是开启）
                let falsData = selection.filter(item => item.id === row.id)
                // 如果falsData数组为空，则代表当前节点被关闭了
                if (falsData.length === 0) {
                    this.tableSelectData.forEach((item, index) => {
                        if (item === row.id) {
                            this.tableSelectData.splice(index, 1)
                        }
                    })
                }
                // 当前节点被开启
                if (falsData.length > 0) {
                    this.tableSelectData.push(row.id);
                }
                this.tableSelectData = JSON.parse(JSON.stringify(removal(this.tableSelectData)));
                // 这就是整个表格当前选中项（包含分页）
                this.$emit('table-select-change', this.tableSelectData)
            }
        },
        // 当选择项发生变化时会触发该事件
        handleSelectionChange (val) {
            this.$emit('selection-change', val)
        },
        // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        toggleRowSelection (rows) {
            if (rows && isArrayFn(rows)) {
                if (rows.length > 0 && this.$refs.singleTable) {
                    rows.forEach(item => {
                        if (item.selected) {
                            this.$refs.singleTable.toggleRowSelection(item.row, item.selected, this.recordTableSelect)
                        } else if (item.selected === false) {
                            this.$refs.singleTable.toggleRowSelection(item.row, false, this.recordTableSelect)
                        } else if (item.selected === undefined) {
                            this.$refs.singleTable.toggleRowSelection(item.row, '', this.recordTableSelect)
                        }
                    })
                }
            } else {
                console.error('数据格式需要一个数组')
            }
        },
        // 用于多选表格，切换选中状态,适用于选中很多，取消很多
        partRowSelections (datas, state) {
            if (typeIs(state) === 'boolean' && this.useVirtual && this.bigDataCheckbox && this.rowKey) {
                this.$refs.singleTable.partRowSelections(datas, state)
            }
        },
        // 用于多选表格，切换所有行的选中状态
        toggleAllSelection () {
            if (this.$refs.singleTable) {
                this.$refs.singleTable.toggleAllSelection()
            } else {
                console.error('toggleAllSelection方法为找到，可能表格未加载完毕')
            }
        },
        // 用于多选表格，清空用户的选择
        clearSelection () {
            if (this.$refs.singleTable) {
                this.$refs.singleTable.clearSelection()
            } else {
                console.error('clearSelection方法为找到，可能表格未加载完毕')
            }
        },
        // 让表格滚动条回到顶部，和左侧
        pagingScrollTopLeft (top = 0, left = 0, type = '不倒计时') {
            this.$refs.singleTable.pagingScrollTop(top, left, type)
        },
        // 滚动表格到底部
        scrollBottom () {
            this.$refs.singleTable.scrollBottom()
        },
        // 合计的方法
        getSummaries (param) {
            if (typeof this.summaryMethod === 'function' && this.summaryMethod) {
                return this.summaryMethod(param)
            } else {
                const {columns, data} = param
                const sums = []
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = this.sumText
                        return
                    }
                    const values = data.map(item => Number(item[column.property]))
                    // 需要合并的选项
                    const flas = this.totalOption.filter(item => item.label === column.label)
                    if (!values.every(value => isNaN(value)) && flas.length > 0) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr)
                            if (!isNaN(value)) {
                                return prev + curr
                            } else {
                                return prev
                            }
                        }, 0)
                        sums[index] += flas[0].unit || ''
                    } else {
                        sums[index] = ''
                    }
                })
                // 返回一个二维数组的表尾合计
                return [sums]
            }
        },
        // 打开自定义字段框
        plDialogOpens () {
            this._times = null
            this.$refs.plDialog.style.width = 300 + 'px'
            this._times = setTimeout(() => {
                this.plDialogFals = true
            }, 200)
            // 创建节点（主要用来弹出menu窗口时，不让起点击外面）
            this.aBox = document.createElement('div')
            this.aBox.className = 'modal-backdrop'
            this.aBox.style.display = 'block'
            this.aBox.onclick = () => {
                this.closeModal()
            }
            document.body.appendChild(this.aBox)
        },
        // 关闭自定义字段框（取消选择）
        closeModal () {
            this.plDialogFals = false
            clearTimeout(this._times)
            this.$refs.plDialog.style.width = 0 + 'px'
            this.aBox.style.display = 'none'
            this.clearNode()
            this.newDialogData = JSON.parse(JSON.stringify(this.dialogData))
        },
        // 确认按钮
        confirmField () {
            this.$emit('show-field', this.newDialogData)
            this.plDialogFals = false
            clearTimeout(this._times)
            this.$refs.plDialog.style.width = 0 + 'px'
            this.aBox.style.display = 'none'
            this.clearNode()
        },
        // 重置按钮
        reset () {
            this.$emit('reset', this.newDialogData)
            this.plDialogFals = false
            clearTimeout(this._times)
            this.$refs.plDialog.style.width = 0 + 'px'
            this.aBox.style.display = 'none'
            this.clearNode()
        },
        // 当某一行被点击时会触发该事件
        rowClick (row, column, event) {
            if (this.highlightCurrentRow) {
                this.$refs.singleTable.setCurrentRow(row);
            }
            this.$emit('row-click', row, column, event)
            // 如果当前节点存在current-row，再次点击时候那么就去掉current-row效果
            if (event.path && this.highlightCurrentRow && this.inverseCurrentRow) {
                event.path.forEach(item => {
                    if (item && item.classList) {
                        item.classList.forEach(its => {
                            if (its === 'current-row') {
                                this.$refs.singleTable.setCurrentRow();
                            }
                        })
                    }
                })
            }
        },
        // 当某一行被双点击时
        rowDblclick (row, column, event) {
            this.$emit('row-dblclick', row, column, event)
        },
        // 用于单选表格，设定某一行为选中行
        setCurrentRow (row) {
            if (row) {
                this.$refs.singleTable.setCurrentRow(row);
            } else {
                this.$refs.singleTable.setCurrentRow();
            }
        },
        // 当用户对某一行展开或者关闭的时候会触发该事件
        expChang (row, expandedRows) {
            this.$emit('expand-change', row, expandedRows)
        },
        // 当某一列的表头被点击时会触发该事件
        headerClick (column, event) {
            this.$emit('header-click', column, event)
        },
        // 修改字段名按钮事件
        amendField (item, index) {
            this.$emit('amend-field', item, index)
        },
        // 表体滚动事件
        tableBodyScroll (table, event) {
            // 当表格滚动暴露滚动事件
            this.$emit('table-body-scroll', table, event)
        },
        // 当拖动表头改变了列的宽度的时候会触发该事件(newWidth, oldWidth, column, event)
        headerDragend (newWidth, oldWidth, column, event) {
            this.$emit('header-dragend', newWidth, oldWidth, column, event)
            this.doLayout('不执行滚动条')
        },
        // 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
        doLayout (type) {
            this.$refs.singleTable.doLayout()
            const {scrollTop, useVirtual, judgeFlse} = this.$refs.singleTable
            if (scrollTop && useVirtual && type !== '不执行滚动条') {
                if (judgeFlse) {
                    this.$refs.singleTable.scrollBottom()
                } else {
                    this.$refs.singleTable.pagingScrollTop(scrollTop)
                }
            }
        },
        // 删除节点
        clearNode () {
            // 删除节点
            let parent = this.aBox ? this.aBox.parentNode : ''
            parent && parent.removeChild(this.aBox)
            let doms = document.getElementsByClassName('modal-backdrop')
            if (doms.length > 0) {
                document.body.removeChild(doms[0])
            }
            this.aBox = null
        },
        // 当表格的排序条件发生变化的时候会触发该事件
        sortChange ({ column, prop, order }) {
            let objs = {column, prop, order}
            this.$emit('sort-change', objs)
        },
        // 当表格的当前行发生变化的时候会触发该事件
        currentChange (currentRow, oldCurrentRow) {
            this.$emit('current-change', currentRow, oldCurrentRow)
        },
        // 当表格的筛选条件发生变化的时候会触发该事件
        filterChange (filters) {
            this.$emit('filter-change', filters)
        },
        // 用于清空排序条件，数据会恢复成未排序的状态
        clearSort () {
            this.$refs.singleTable.clearSort()
        },
        // 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态
        clearFilter (columnKey) {
            this.$refs.singleTable.clearFilter(columnKey)
        },
        // 手动对 Table 进行排序
        sort (prop, order) {
            this.$refs.singleTable.sort(prop, order)
        },
        // 当单元格 hover 进入时会触发该事件
        cellMouseEnter (row, column, cell, event) {
            this.$emit('cell-mouse-enter', row, column, cell, event)
        },
        // 当单元格 hover 退出时会触发该事件
        cellMouseLeave (row, column, cell, event) {
            this.$emit('cell-mouse-leave', row, column, cell, event)
        },
        // 当某个单元格被点击时会触发该事件
        cellClick (row, column, cell, event) {
            this.$emit('cell-click', row, column, cell, event)
        },
        // 当某个单元格被双击击时会触发该事件
        cellDblclick (row, column, cell, event) {
            this.$emit('cell-dblclick', row, column, cell, event)
        },
        // 当某一行被鼠标右键点击时会触发该事件
        rowContextmenu (row, column, event) {
            this.$emit('row-contextmenu', row, column, event)
        },
        // 当某一列的表头被鼠标右键点击时触发该事件	column, event
        headerContextmenu (column, event) {
            this.$emit('header-contextmenu', column, event)
        },
        // 判断行是否为树形节点展开状态
        isTreeExpandByRow (row) {
            return this.$refs.singleTable.isTreeExpandByRow(row)
        },
        // 当虚拟树节点展开或收起时会触发该事件
        toggleTreeExpands (row, treeExpanded, event) {
            this.$emit('toggle-tree-expand', row, treeExpanded, event)
        },
        // 展开全部pl-table的树
        setAllTreeExpansion () {
            this.$refs.singleTable.setAllTreeExpansion()
        },
        // 关闭所有
        clearTreeExpand () {
            this.$refs.singleTable.clearTreeExpand()
        },
        // 获取已展开的节点
        getTreeExpandRecords () {
            return this.$refs.singleTable.getTreeExpandRecords()
        },
        // 设置展开树形节点
        setTreeExpansion (rows, expanded) {
            this.$refs.singleTable.setPlTreeExpansion(rows, expanded)
        },
        // 切换展开树形节点的状态
        toggleTreeExpansion (row) {
            this.$refs.singleTable.toggleTreeExpansion(row)
        }
    },
    // 生命周期结束
    beforeDestroy () {
    },
    // 如果使用了keep-alive
    deactivated () {
    },
    activated () {
    },
    watch: {
        data: {
            // 当需要监听一个对象的改变时，普通的watch方法无法监听到对象内部属性的改变，此时就需要deep属性对对象进行深度监听。
            // deep: true, // 不需要监听数组对象的变化
            immediate: true, // 如果我们需要在最初绑定值的时候也执行函数，则就需要用到immediate属性。
            handler (val) {
                if (!isArrayFn(val)) {
                    throw new Error('表格数据需要的是数组格式，请检查你的数据格式');
                }
            }
        },
        dialogData: {
            deep: true,
            immediate: true,
            handler (val) {
                this.newDialogData = JSON.parse(JSON.stringify(val))
            }
        },
        currentPage (val) {
            this.newcurrentPage = val
        },
        pageSize (val) {
            this.newPageSize = val
        },
        height: {
            immediate: true,
            handler(value) {
                this.setHeight();
            }
        },
        maxHeight: {
            immediate: true,
            handler(value) {
                this.setHeight();
            }
        }
    }
}
