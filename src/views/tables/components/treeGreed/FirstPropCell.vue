<template>
  <span
    :class="`${this.prefixCls}--level-${row._level}-cell`"
    :style="{ marginLeft: `${(row._level - 1) * 24}px`, paddingLeft: row._childrenLen === 0 ? '20px' : '' }"
  >
    <v-icon
      v-if="row._childrenLen > 0"
      small
      @click="($event) => $emit('handleEvent', $event, 'icon', { row, rowIndex, column, columnIndex }, { isFold: row._isFold })"
      >{{ row._isFold ? 'mdi-plus' : 'mdi-minus' }}</v-icon
    >
    <!-- <i v-if="row._childrenLen > 0" :class="`zk-table--tree-icon zk-icon zk-icon-${row._isFold ? 'plus' : 'minus'}-square-o`"></i> -->
    {{ row[column.prop] ? row[column.prop] : '' }}
  </span>
</template>

<script>
import mixins from '../../utils/treeGridMixin.js'

export default {
  mixins: [mixins],

  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    rowIndex: Number,

    column: {
      type: Object,
      default: () => ({})
    },
    columnIndex: Number
  }
}
</script>

<style lang="scss" scoped></style>
