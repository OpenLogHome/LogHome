// 扩展el-table成为pl-table
import Vue from "vue";

export default {
    props: {
        rowHeight: {
            type: Number,
            default: 60
        },
        excessRows: {
            type: Number,
            default: 3
        },
        rowId: String,
        headerDragStyle: {
            type: Boolean,
            default: false
        },
        tooltipPlacement: {
            default: 'top',
            type: String
        },
        useVirtual: {
            type: Boolean,
            default: false
        },
        // 大数据下是否更改全选框，单选框卡顿问题
        bigDataCheckbox: {
            type: Boolean,
            default: false
        },
        fixedColumnsRoll: {
            type: Boolean,
            default: false
        },
        showHeaderOverflow: { type: [Boolean, String], default: null }, // 设置表头所有内容过长时显示为省略号
        showBodyOverflow: { type: [Boolean, String], default: null }, // 设置表体所有内容过长时显示为省略号
        selectTrClass: String, //  如果当前行被选中了 type类型为selection，就给当前行给个类样式
        dataChangesScrollTop: Boolean, // 数据变化滚动到顶部
    },
    data () {
        return {
            scrollTop: 0,
            scrollLeft: 0,
            innerTop: 0,
            start: 0,
            end: 0,
            judgeFlse: false
        }
    },
    computed: {
        visibleCount () {
            return Math.ceil(parseFloat(this.height || this.maxHeight) / this.rowHeight)
        },

        virtualBodyHeight () {
            const {data} = this.store.states
            return data ? data.length * this.rowHeight : 0
        }
    },
    watch: {
        scrollTop: {
            immediate: true,
            handler (top) {
                if (parseFloat(top) <= 0) {
                    this.scrollTop = 0
                }
                this.computeScrollToRow(top)
            }
        },

        useVirtual: {
            immediate: true,
            handler(newVal) {
                // 把当前状态存入store.states里面
                this.store.states.useVirtual = newVal
                this.computeScrollToRow(this.scrollTop)
            }
        },

        bigDataCheckbox: {
            immediate: true,
            handler(newVal) {
                // 把当前状态存入store.states里面
                this.store.states.bigDataCheckbox = newVal
            }
        },

        virtualBodyHeight () {
            if (this.useVirtual) setTimeout(this.doLayout, 10)
        },

        height: {
            immediate: true,
            handler(value) {
                if (this.useVirtual) {
                    this.layout.setHeight(value);
                    this.computeScrollToRow(this.scrollTop)
                }
            }
        },

        maxHeight: {
            immediate: true,
            handler(value) {
                if (this.useVirtual) {
                    this.layout.setMaxHeight(value);
                    this.computeScrollToRow(this.scrollTop)
                }
            }
        },

        data: {
            immediate: true,
            handler(value) {
                if (this.useVirtual) {
                    if (this.rowId) {
                        this.plTreeInit(value)
                    } else {
                        this.store.commit('setData', value);
                    }
                    if (this.dataChangesScrollTop) {
                        this.pagingScrollTop(0, this.scrollLeft)
                    }
                }
            }
        }
    },
    mounted () {
        // 暴露store对象对pl-table
        this.$parent.newTableStore = this.store
        this.bindEvent('bind')
    },
    methods: {
        bindEvent (action) {
            const tableBodyWrapper = this.$el.querySelector('.el-table__body-wrapper')
            if (!this.binded && action === 'bind') {
                tableBodyWrapper.addEventListener('scroll', this.handleScroll)
                this.binded = true
            } else if (this.binded && action === 'unbind') {
                tableBodyWrapper.removeEventListener('scroll', this.handleScroll)
                this.binded = false
            }
        },

        scrollBottom () {
            const {data} = this.store.states
            this.pagingScrollTop(data.length * this.rowHeight)
        },
        // 表体滚动到什么位置
        pagingScrollTop (top = 0, left = 0, type) {
            if (!this.$refs.bodyWrapper) return Vue.nextTick(() => this.pagingScrollTop(top, left));
            if (this.$refs.bodyWrapper) {
                if (type && type === '不倒计时') {
                  this.$nextTick(() => {
                      this.$refs.bodyWrapper.scrollTop = top
                      this.$refs.bodyWrapper.scrollLeft = left || this.scrollLeft
                      const bodyScrollHeight = this.visibleCount * this.rowHeight
                      if (this.virtualBodyHeight < top + bodyScrollHeight) {
                          top = this.virtualBodyHeight - bodyScrollHeight
                      }
                      this.scrollTop = top
                      this.scrollLeft = left || this.scrollLeft
                  })
                } else {
                    setTimeout(() => {
                        this.$refs.bodyWrapper.scrollTop = top
                        this.$refs.bodyWrapper.scrollLeft = left || this.scrollLeft
                        const bodyScrollHeight = this.visibleCount * this.rowHeight
                        if (this.virtualBodyHeight < top + bodyScrollHeight) {
                            top = this.virtualBodyHeight - bodyScrollHeight
                        }
                        this.scrollTop = top
                        this.scrollLeft = left || this.scrollLeft
                    }, 10)
                }
            } else {
                throw new Error('表格还没加载完毕');
            }
        },

        computeScrollToRow (scrollTop) {
            if (!this.useVirtual) return
            let startIndex = parseInt(scrollTop / this.rowHeight)

            const { start, end } = this.getVisibleRange(startIndex)

            this.$parent.position = {
                start: start,
                end: end
            }
            this.start = start
            this.end = end
            this.innerTop = this.start * this.rowHeight
        },

        getVisibleRange (expectStart) {
            const start = expectStart - this.excessRows
            return {
                start: start >= 0 ? start : 0,
                end: expectStart + this.visibleCount + this.excessRows
            }
        },

        handleScroll (e) {
            const ele = e.srcElement || e.target
            let { scrollTop, scrollLeft } = ele
            if (this.useVirtual) {
                const bodyScrollHeight = this.visibleCount * this.rowHeight
                // 解决 滚动时 行hover高亮的问题
                this.store.states.hoverRow = null
                if (this.virtualBodyHeight < scrollTop + bodyScrollHeight) {
                    scrollTop = this.virtualBodyHeight - bodyScrollHeight
                    this.judgeFlse = true
                } else {
                    this.judgeFlse = false
                }
            }
            this.scrollTop = scrollTop
            this.scrollLeft = scrollLeft
            // 当表格滚动暴露滚动事件
            let copyTop =  parseFloat(this.scrollTop <= 0) ? 0 : this.scrollTop
            const obj = { scrollTop: copyTop, scrollLeft: this.scrollLeft, table: this, judgeFlse: this.judgeFlse}
            this.$emit('tableBodyScroll', obj, e)
        },
        // 设置表格数据
        reloadData (data) {
            if (this.rowId && this.useVirtual) {
               return this.plTreeInit(data)
            } else {
                this.store.commit('setData', data);
            }
            if (this.dataChangesScrollTop) {
                this.pagingScrollTop(0, this.scrollLeft)
            }
            return this.$nextTick()
        }
    },
    activated () {
        if (this.useVirtual) {
            this.bindEvent('bind')
            if (this.scrollTop || this.scrollLeft) {
                if (this.judgeFlse) {
                    this.scrollBottom()
                } else {
                    this.pagingScrollTop(this.scrollTop)
                }
            }
        }
    },
    deactivated () {
        if (this.useVirtual) {
            this.bindEvent('unbind')
        }
    },
    beforeDestroy () {
        if (this.useVirtual) {
            this.bindEvent('unbind')
        }
    }
}
