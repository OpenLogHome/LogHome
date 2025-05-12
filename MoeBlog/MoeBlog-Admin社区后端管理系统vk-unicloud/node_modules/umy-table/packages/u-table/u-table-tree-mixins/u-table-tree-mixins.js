// 扩展el-table和pl-table
import { isArrayFn, typeIs } from '../../../utils/common'
import methods from './methods'
import XEUtils from 'xe-utils/ctor'
export default {
    props: {
        treeConfig: [Boolean, Object],// 树形结构配置项
    },
    data () {
        return {
            treeExpandeds: [], // 已经展开的节点
            copyPlTreeData: [], // 复制处理后的数据，这是有层级的
            plTreeloading: false,
            plTreeData: [] // 对原始数据进行操作的数组
        }
    },
    computed: {
        // pl-table树节点的配置
        treeOpts () {
            return Object.assign({
                children: 'children',
                hasChildren: 'hasChildren',
                indent: 20,
                trigger: 'default',
                lazy: false,
                load: null,
                expandAll: false
            },this.treeConfig)
        }
    },
    methods: {
        ...methods,
        /**
         * 默认行为只允许执行一次
         */
        handleDefaults () {
            if (this.treeConfig) {
                this.handleDefaultTreeExpand()
            } else {
                this.setTreeTableData()
            }
        },
        /**
         * 处理默认展开树节点
         */
        handleDefaultTreeExpand () {
            let { treeConfig, treeOpts, plTreeData, rowId } = this
            if (treeConfig) {
                let { expandAll, expandRowKeys } = treeOpts
                if (expandAll) {
                    this.setAllTreeExpansion()
                } else if (isArrayFn(expandRowKeys) && expandRowKeys.length) {
                    let defExpandeds = []
                    expandRowKeys.forEach(rowid => {
                        let matchObj = XEUtils.findTree(plTreeData, item => rowid === XEUtils.get(item, rowId), treeOpts)
                        if (matchObj) {
                            defExpandeds.push(matchObj.item)
                        }
                    })
                    // 设置节点
                    this.setTreeExpansion(defExpandeds, true)
                } else {
                    // 重新加载数据
                    this.setTreeTableData()
                }
            }
        },
        // 初始化树形数据（只会在数据变化调用一次）
        plTreeInit (data) {
            // 深拷贝数据
            this.plTreeData =  XEUtils.clone(data, true)
            // 设置数据级别，计算第一列的左侧空间距
            this.plTreeData.forEach(item => {
                this.setDataLevel(item, 0);
            })
            this.copyPlTreeData = XEUtils.clone(this.plTreeData, true)
            // 初始化方法
            this.handleDefaults()
            return this.$nextTick()
        },
        //展开变化
        triggerTreeExpandEvent (tabItem, type, event) {
            const {trigger, children, hasChildren, lazy, load} = this.treeOpts
            if (trigger === type && this.useVirtual && this.rowId) {
                // 是否属于懒加载节点
                if (tabItem[hasChildren] && lazy && typeIs(load) === 'function') {
                    // 开启旋转
                    this.plTreeloading = true
                    load(tabItem, data => {
                        // 关闭旋转
                        this.plTreeloading = false
                        // 关闭当前节点的加载状态
                        tabItem[hasChildren] = false
                        data.forEach(item => {
                            this.setDataLevel(item, tabItem.pl_table_level + 1)
                        })
                        tabItem[this.treeOpts.children] = data
                        // 根据rowId, 获取当前数据中的row，不改变表格数据，改变复制的数据
                        let row = this.plTreeData.filter(item => item[this.rowId] === tabItem[this.rowId])[0]
                        // row || children无子节点。不存在就返回
                        if (!row || !row[children]) return
                        // 设置节点
                        this.setTreeExpansion(row, !row.pl_table_expand)
                        // 当树节点展开收起时会触发这个事件
                        this.$emit('toggle-tree-expand', tabItem, this.treeExpandeds, event)
                    })
                } else {
                    // 根据rowId, 获取当前数据中的row，不改变表格数据，改变复制的数据
                    let row = this.plTreeData.filter(item => item[this.rowId] === tabItem[this.rowId])[0]
                    // row || children无子节点。不存在就返回
                    if (!row || !row[children]) return
                    // 设置节点
                    this.setTreeExpansion(row, !row.pl_table_expand)
                    // 当树节点展开收起时会触发这个事件
                    this.$emit('toggle-tree-expand', tabItem, this.treeExpandeds, event)
                }
            }
        },
        //迭代：设置数据级别
        setDataLevel(data, level){
            //自定义数据的级别
            data.pl_table_level = level;
            if(isArrayFn(data[this.treeOpts.children])){
                data[this.treeOpts.children].forEach(childData => {
                    this.setDataLevel(childData, level + 1);
                })
            }
        },
        // 获取当前row对应的层级level
        getTreeLevel (row) {
            const rowInfo = this.plTreeData.filter(item=> item[this.rowId] === row[this.rowId])[0]
            return rowInfo.pl_table_level || 0
        },
        // 从树结构中遍历数据（杜绝大量数据遍历）
        eachTreeExpand (data) {
            let treefullData = []
            if (!data) return treefullData
            let hasChildren = (obj) => obj[this.treeOpts.children] !== undefined && obj[this.treeOpts.children] !== null
            let recursionFiltra = (arr) => arr.forEach(obj => {
                treefullData.push(obj)
                // 子节点存在展开，那么继续遍历(非常重要)
                if (hasChildren(obj) && obj.pl_table_expand) {
                    recursionFiltra(obj[this.treeOpts.children])
                }
            })
            if (hasChildren(data)) {
                recursionFiltra(data[this.treeOpts.children])
            }
            return treefullData
        },
        // 设置表格数据
        setTreeTableData () {
            this.store.commit('setData', this.plTreeData)
        }
    }
}
