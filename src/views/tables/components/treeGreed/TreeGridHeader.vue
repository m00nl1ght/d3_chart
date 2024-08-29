<template>
  <table cellspacing="0" cellpadding="0" border="0" :class="`${prefixCls}__header`">
    <colgroup>
      <col v-for="column in tableColumns" :width="column.computedWidth || column.minWidth || column.width" />
    </colgroup>

    <thead>
      <tr :class="`${prefixCls}__header-row`">
        <th v-for="(column, columnIndex) in tableColumns" :class="getClassName('cell', column)">
          <div :class="getClassName('inner', column)">
            {{ renderLabel(column, columnIndex) }}
          </div>
        </th>
      </tr>
    </thead>
  </table>
</template>

<script>
import mixins from '../../utils/treeGridMixin.js'

export default {
  mixins: [mixins],

  props: {
    tableColumns: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    table() {
      return this.$parent
    }
  },

  methods: {
    toggleAllChecked(checked) {
      this.table.bodyData = this.table.bodyData.map((row) => ({
        ...row,
        _isChecked: checked
      }))
    },

    getClassName(type, { headerAlign, prop }) {
      const certainType = this.validateType(type, ['cell', 'inner'], 'getClassName')
      const classList = []
      if (certainType.cell) {
        classList.push(`${this.prefixCls}__header-cell`)
        if (this.table.border) {
          classList.push(`${this.prefixCls}--border-cell`)
        }
        if (['center', 'right'].indexOf(headerAlign) > -1) {
          classList.push(`${this.prefixCls}--${headerAlign}-cell`)
        }
      }
      if (certainType.inner) {
        classList.push(`${this.prefixCls}__cell-inner`)
        if (this.table.treeType && this.table.firstProp === prop) {
          classList.push(`${this.prefixCls}--firstProp-header-inner`)
        }
      }
      return classList.join(' ')
    },

    // 根据type渲染单元格Label
    renderLabel(column, columnIndex) {
      // if (this.isSelectionCell(this.table, columnIndex)) {
      //   const allCheck = this.table.bodyData.every((row) => row._isChecked)
      //   const indeterminate = !allCheck && this.table.bodyData.some((row) => row._isChecked)
      //   return <Checkbox indeterminate={indeterminate} value={allCheck} onOn-change={(checked) => this.toggleAllChecked(checked)}></Checkbox>
      // }
      return column.label ? column.label : ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
