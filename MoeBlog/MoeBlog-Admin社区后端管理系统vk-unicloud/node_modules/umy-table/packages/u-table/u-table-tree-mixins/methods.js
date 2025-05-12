import XEUtils from 'xe-utils/ctor'
import {typeIs} from '../../../utils/common'
// 方法
export default {
    // 暴露相关方法
    /**
     * 设置展开树形节点，二个参数设置这一行展开与否
     * 支持单行
     * 支持多行
     * @param {Array/Row} rows 行数据
     * @param {Boolean} expanded 是否展开
     */
    setTreeExpansion (rows, expanded) {
        let { treeOpts, plTreeData } = this
        let { accordion } = treeOpts
        if (rows) {
            if (!XEUtils.isArray(rows)) {
                rows = [rows]
            }
            if (rows.length) {
                rows.forEach(row => {
                    // 节点已经展开 或者关闭，再去展开获取关闭 直接返回
                    if ((row.pl_table_expand || false) === expanded) return
                    row.pl_table_expand = expanded
                    // 当前row在数据中的索引值(非常重要)
                    const index = plTreeData.findIndex(item => item[this.rowId] === row[this.rowId])
                    // 获取当前节点下面的展开的子节点
                    const treeExpandeds = this.eachTreeExpand(row)
                    // 大于等于0才代表是展开的表格中可见的节点。不大于等于0代表是展开的 不可见的子节点
                    if (index >= 0) {
                        // 展开节点
                        if (expanded) {
                            // 插入节点
                            plTreeData.splice(index + 1, 0, ...treeExpandeds)
                            // 添加当前展开节点到 ->展开节点数组中
                            this.treeExpandeds.push(row)
                        } else {
                            // 关闭节点
                            // 删除所有子层级数据（删除的子节点其实很简单，就是删除当前节点下面的子节点数量）
                            plTreeData.splice(index + 1, treeExpandeds.length)
                            // 删除展开节点数组的row
                            XEUtils.remove(this.treeExpandeds, item => item[this.rowId] === row[this.rowId])
                        }
                    }
                })
                // 载入数据
                this.setTreeTableData()
            }
        }
    },
    // 判断行是否为树形节点展开状态
    isTreeExpandByRow (row) {
        if (!this.rowId) {
            return false
        } else {
            const rowInfo = this.plTreeData.filter(item=> item[this.rowId] === row[this.rowId])[0]
            return typeIs(rowInfo.pl_table_expand) === 'boolean' ? rowInfo.pl_table_expand : false
        }
    },
    // 展开所有
    setAllTreeExpansion () {
        let data = JSON.parse(JSON.stringify(this.copyPlTreeData))
        let treeExpandeds = []
        this.treeExpandeds = []
        XEUtils.eachTree(data, row => {
            if (row[this.treeOpts.children]) {
                row.pl_table_expand = true
                // 添加进入展开节点中
                this.treeExpandeds.push(row)
            }
            treeExpandeds.push(row)
        }, this.treeOpts)
        this.plTreeData = treeExpandeds
        // 设置数据
        this.setTreeTableData()
    },
    // 关闭所有
    clearTreeExpand () {
        this.plTreeData = JSON.parse(JSON.stringify(this.copyPlTreeData))
        this.treeExpandeds = []
        // 设置数据
        this.setTreeTableData()
    },
    // 获取已展开的节点
    getTreeExpandRecords () {
        let newData = JSON.parse(JSON.stringify(this.treeExpandeds))
        newData.forEach(item=> {
            delete item.pl_table_expand
            delete item.pl_table_level
        })
        return newData.slice(0)
    },
    // 设置树的节点展开与否
    setPlTreeExpansion (rows, expanded) {
        if (!rows) return
        const {children} = this.treeOpts
        // 根据rowId, 获取当前数据中的row，不改变表格数据，改变复制的数据
        let row = this.plTreeData.filter(item => item[this.rowId] === rows[this.rowId])[0]
        // row || children无子节点。不存在就返回
        if (!row || !row[children]) return
        // 设置节点
        this.setTreeExpansion(row, expanded)
    },
    // 切换展开树形节点的状态
    toggleTreeExpansion (rows) {
        if (!rows) return
        const {children} = this.treeOpts
        // 根据rowId, 获取当前数据中的row，不改变表格数据，改变复制的数据
        let row = this.plTreeData.filter(item => item[this.rowId] === rows[this.rowId])[0]
        // row || children无子节点。不存在就返回
        if (!row || !row[children]) return
        // 设置节点
        this.setTreeExpansion(row, !this.isTreeExpandByRow(row))
    }
}
