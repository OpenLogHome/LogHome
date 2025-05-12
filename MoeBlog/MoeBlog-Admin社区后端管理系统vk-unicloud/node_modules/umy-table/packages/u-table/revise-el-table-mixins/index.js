import Table from 'umy-table/packages/table';

import './table-extend'
import tableMixins from './table.mixins'
import uTableTreeMixins from '../u-table-tree-mixins/u-table-tree-mixins'
if (!Table.mixins) {
  Table.mixins = []
}
Table.mixins.push(tableMixins)
Table.mixins.push(uTableTreeMixins)
