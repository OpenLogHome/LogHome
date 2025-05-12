import ElTable from '../../../packages/table';

import VirtualTableBodyRender from './virtual-table-body-render.js';

const ElTableBody = ElTable.components.TableBody; // 表体

// 改变表格数据流
const oldDataComputed = ElTableBody.computed.data
ElTableBody.computed.data = function () {
  const { table } = this
  const tableData = oldDataComputed.call(this)
  if (table.useVirtual) {
    return tableData.slice(table.start, table.end)
  } else {
    return tableData
  }
}

// const oldHoverRowHandler = ElTableBody.watch && ElTableBody.watch['store.states.hoverRow']
// if (oldHoverRowHandler) {
//   ElTableBody.watch['store.states.hoverRow'] = function (newVal, oldVal) {
//     if (!this.table.useVirtual) {
//       oldHoverRowHandler && oldHoverRowHandler.call(this, newVal, oldVal)
//     }
//   }
// }

// 表体行索引
ElTableBody.methods.getIndex = function (index) {
  return this.table.start + index;
}

// 添加表格行样式
const oldGetRowClassHandler = ElTableBody.methods.getRowClass
ElTableBody.methods.getRowClass = function (row, rowIndex) {
  let classes = oldGetRowClassHandler.call(this, row, rowIndex)
  // 当表格行被禁止，添加不透明度
  if (row.disabled) {
    classes.push('pl-disabled')
  }
  // if (this.table.useVirtual && rowIndex === this.store.states.hoverRow && (this.table.rightFixedColumns.length || this.table.fixedColumns.length)) {
  //   // 兼容element-ui低版本
  //   if (Object.prototype.toString.call(classes) === '[object Array]') {
  //     classes.push('hover-row')
  //   } else if (typeof classes === 'string') {
  //     classes += ' hover-row'
  //   }
  // }
  return classes
}


// 修改ele表体源码 （进行重新渲染）
const oldRender = ElTableBody.render
ElTableBody.render = function (h) {
  if (this.table.useVirtual) {
    return VirtualTableBodyRender.call(this, h)
  } else {
    return oldRender.call(this, h)
  }
}
