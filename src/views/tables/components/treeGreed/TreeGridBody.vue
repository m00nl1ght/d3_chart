<template>
  <table cellspacing="0" cellpadding="0" border="0">
    <colgroup>
      <col v-for="(column, idx) in tableColumns" :key="`col_${idx}`" :width="column.computedWidth || column.minWidth || column.width" />
    </colgroup>

    <tbody>
      <tr
        v-for="(row, rowIndex) in bodyData"
        v-show="!row._isHide"
        :key="rowIndex"
        @on-click="($event) => this.handleEvent($event, 'row', { row, rowIndex })"
        @on-dblclick="($event) => this.handleEvent($event, 'row', { row, rowIndex })"
        @on-contextmenu="($event) => this.handleEvent($event, 'row', { row, rowIndex })"
        @on-mouseenter="($event) => this.handleEvent($event, 'row', { row, rowIndex }, { hover: true })"
        @on-mouseleave="($event) => this.handleEvent($event, 'row', { row, rowIndex }, { hover: false })"
      >
        <td
          v-for="(column, columnIndex) in tableColumns"
          @on-click="($event) => this.handleEvent($event, 'cell', { row, rowIndex, column, columnIndex })"
          @on-dblclick="($event) => this.handleEvent($event, 'cell', { row, rowIndex, column, columnIndex })"
          @on-contextmenu="($event) => this.handleEvent($event, 'cell', { row, rowIndex, column, columnIndex })"
          @on-mouseenter="($event) => this.handleEvent($event, 'cell', { row, rowIndex, column, columnIndex })"
          @on-mouseleave="($event) => this.handleEvent($event, 'cell', { row, rowIndex, column, columnIndex })"
        >
          <div>
            <component
              :is="renderCell(row, rowIndex, column, columnIndex)"
              :firstProp="firstProp"
              :row="row"
              :rowIndex="rowIndex"
              :column="column"
              :columnIndex="columnIndex"
              @handleEvent="handleEvent"
            ></component>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
// import Vue from 'vue'
import FirstPropCell from './FirstPropCell.vue'
import DefaultCell from './DefaultCell.vue'

// :style="getStyle('row', row, rowIndex)"
// :class="getClassName('row', row, rowIndex)"

//   :style="getStyle('cell', row, rowIndex, column, columnIndex)"
//   :class="getClassName('cell', row, rowIndex, column, columnIndex)"

// :class="getClassName('inner', row, rowIndex, column, columnIndex)"
export default {
  props: {
    bodyData: {
      type: Array,
      default: () => []
    },

    tableColumns: {
      type: Array,
      default: () => []
    }
  },

  components: {
    FirstPropCell,
    DefaultCell
  },

  computed: {
    firstProp() {
      return this.tableColumns[0].prop
    }
  },

  methods: {
    // isExpandCell(table, columnIndex) {
    //   return table.expandType && ((table.showIndex && columnIndex === 1) || (!table.showIndex && columnIndex === 0))
    // },

    validateType(type, validTypes, funcName, isReturn = true) {
      if (validTypes.indexOf(type) < 0) throw new Error(`${funcName}'s type must is ${validTypes.join(' or ')}.`)
      if (isReturn) {
        const certainType = {}
        validTypes.forEach((item) => {
          certainType[item] = item === type
        })
        return certainType
      }
      return true
    },

    handleEvent($event, type, data, others) {
      console.log('where')

      const certainType = this.validateType(type, ['cell', 'row', 'checkbox', 'icon'], 'handleEvent')
      const eventType = $event ? $event.type : ''
      const { row, rowIndex, column, columnIndex } = data
      const latestData = this.bodyData

      console.log('where2')

      // Checkbox
      if (certainType.checkbox) {
        const { isChecked } = others
        this.toggleStatus('Checked', row, rowIndex, isChecked)
        if (row._childrenLen > 0) {
          const childrenIndex = this.getChildrenIndex(row._level, rowIndex, false)
          for (let i = 0; i < childrenIndex.length; i++) {
            this.toggleStatus('Checked', latestData[childrenIndex[i]], childrenIndex[i], isChecked)
          }
        }
        return this.table.$emit('checkbox-click', latestData[rowIndex], column, columnIndex, $event)
      }

      // Tree's icon
      if (certainType.icon) {
        console.log('certainType.icon')

        $event.stopPropagation()
        this.toggleStatus('Fold', row, rowIndex)
        const childrenIndex = this.getChildrenIndex(row._level, rowIndex)
        for (let i = 0; i < childrenIndex.length; i++) {
          this.toggleStatus('Hide', latestData[childrenIndex[i]], childrenIndex[i])
        }
        return this.table.$emit('tree-icon-click', latestData[rowIndex], column, columnIndex, $event)
      }

      if (certainType.cell && eventType === 'click') {
        // 点击扩展单元格
        if (this.isExpandCell(this.table, columnIndex)) {
          this.toggleStatus('Expanded', row, rowIndex)
          return this.table.$emit('expand-cell-click', latestData[rowIndex], column, columnIndex, $event)
        }
      }

      // 行：Hover
      if (certainType.row && (eventType === 'mouseenter' || eventType === 'mouseleave')) {
        const { hover } = others
        const target = latestData[rowIndex]
        latestData.splice(rowIndex, 1, {
          ...target,
          _isHover: hover
        })
      }

      if (certainType.cell) {
        return this.table.$emit(`${type}-${eventType}`, latestData[rowIndex], rowIndex, column, columnIndex, $event)
      }

      return this.table.$emit(`${type}-${eventType}`, latestData[rowIndex], rowIndex, $event)
    },

    renderCell(row, rowIndex, column, columnIndex) {
      // return 'FirstPropCell'
      // console.log('column.prop', column.prop)
      // console.log('this.firstProp', this.firstProp)

      if (this.firstProp === column.prop) return 'FirstPropCell'
      return 'DefaultCell'

      // // ExpandType
      // if (this.isExpandCell(this.table, columnIndex)) {
      //   return <i class='zk-icon zk-icon-angle-right'></i>;
      // }
      // // SelectionType's Checkbox
      // if (this.isSelectionCell(this.table, columnIndex)) {
      //   let allCheck;
      //   let childrenIndex;
      //   const hasChildren = row._childrenLen > 0;
      //   if (hasChildren) {
      //     childrenIndex = this.getChildrenIndex(row._level, rowIndex, false);
      //     allCheck = true;
      //     for (let i = 0; i < childrenIndex.length; i++) {
      //       if (!this.table.bodyData[childrenIndex[i]]._isChecked) {
      //         allCheck = false;
      //         break;
      //       }
      //     }
      //   } else {
      //     allCheck = row._isChecked;
      //   }
      //   let indeterminate = false;
      //   if (hasChildren && !allCheck) {
      //     for (let i = 0; i < childrenIndex.length; i++) {
      //       if (this.table.bodyData[childrenIndex[i]]._isChecked) {
      //         indeterminate = true;
      //         break;
      //       }
      //     }
      //   }
      //   return <Checkbox
      //     indeterminate={ indeterminate }
      //     value={ allCheck }
      //     onOn-change={ isChecked => this.handleEvent(null, 'checkbox', { row, rowIndex, column, columnIndex }, { isChecked }) }>
      //     </Checkbox>;
      // }
      // // Tree's firstProp
      // if (this.table.treeType && this.table.firstProp === column.prop) {
      //   return <span
      //     class={ `${this.prefixCls}--level-${row._level}-cell` }
      //     style={{
      //       marginLeft: `${(row._level - 1) * 24}px`,
      //       paddingLeft: row._childrenLen === 0 ? '20px' : '',
      //     }}>
      //       { row._childrenLen > 0 &&
      //         <i
      //           class={ `${this.prefixCls}--tree-icon zk-icon zk-icon-${row._isFold ? 'plus' : 'minus'}-square-o`}
      //           on-click={ $event => this.handleEvent($event, 'icon', { row, rowIndex, column, columnIndex }, { isFold: row._isFold }) }></i>
      //       }
      //       { row[column.prop] ? row[column.prop] : '' }
      //   </span>;
      // }
      // // TreeType children's index
      // if (this.table.showIndex && this.table.treeType && column.prop === '_normalIndex' && row._level > 1) {
      //   return '';
      // }
      // if (column.type === undefined || column.type === 'custom') {
      //   return row[column.prop];
      // } else if (column.type === 'template') {
      //   return this.table.$scopedSlots[column.template]
      //   ? this.table.$scopedSlots[column.template]({ row, rowIndex, column, columnIndex })
      //   : '';
      // }
      // return '';
    }

    // getStyle(type, row, rowIndex, column, columnIndex) {
    //   const certainType = this.validateType(type, ['cell', 'row'], 'getStyle')
    //   const style = this.table[`${type}Style`]
    //   if (typeof style === 'function') {
    //     if (certainType.row) {
    //       return style.call(null, row, rowIndex)
    //     }
    //     if (certainType.cell) {
    //       return style.call(null, row, rowIndex, column, columnIndex)
    //     }
    //   }
    //   return style
    // },

    // // className
    // getClassName(type, row, rowIndex, column, columnIndex) {
    //   const certainType = this.validateType(type, ['cell', 'row', 'inner'], 'getClassName')
    //   const classList = []
    //   if (certainType.row || certainType.cell) {
    //     const className = this.table[`${type}ClassName`]
    //     if (typeof className === 'string') {
    //       classList.push(className)
    //     } else if (typeof className === 'function') {
    //       if (certainType.row) {
    //         classList.push(className.call(null, row, rowIndex) || '')
    //       }
    //       if (certainType.cell) {
    //         classList.push(className.call(null, row, rowIndex, column, columnIndex) || '')
    //       }
    //     }
    //     if (certainType.row) {
    //       classList.push(`${this.prefixCls}__body-row`)
    //       if (this.table.stripe && rowIndex % 2 !== 0) {
    //         classList.push(`${this.prefixCls}--stripe-row`)
    //       }
    //       if (this.table.showRowHover && row._isHover) {
    //         classList.push(`${this.prefixCls}--row-hover`)
    //       }
    //     }
    //     if (certainType.cell) {
    //       classList.push(`${this.prefixCls}__body-cell`)
    //       if (this.table.border) {
    //         classList.push(`${this.prefixCls}--border-cell`)
    //       }
    //       const align = column.align
    //       if (['center', 'right'].indexOf(align) > -1) {
    //         classList.push(`${this.prefixCls}--${align}-cell`)
    //       }
    //     }
    //   }
    //   if (certainType.inner) {
    //     classList.push(`${this.prefixCls}__cell-inner`)
    //     if (this.isExpandCell(this.table, columnIndex)) {
    //       classList.push(`${this.prefixCls}--expand-inner`)
    //       if (row._isExpanded) {
    //         classList.push(`${this.prefixCls}--expanded-inner`)
    //       }
    //     }
    //   }
    //   return classList.join(' ')
    // }
  }
}
</script>

<style lang="scss" scoped></style>
