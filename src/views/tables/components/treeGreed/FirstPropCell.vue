<template>
  <div
    class="d-flex align-center"
    :class="`${this.prefixCls}--level-${row._level}-cell`"
    :style="{ marginLeft: `${(row._level - 1) * 24}px`, paddingLeft: row._childrenLen === 0 ? '20px' : '' }"
  >
    <div
      v-if="row._childrenLen > 0"
      @click="($event) => $emit('handleEvent', $event, 'icon', { row, rowIndex, column, columnIndex }, { isFold: row._isFold })"
      class="icon-box"
    >
      <component :is="row._isFold ? 'ArrowRight' : 'ArrowDown'"></component>
    </div>
    {{ row[column.prop] ? row[column.prop] : '' }}
  </div>
</template>

<script>
import mixins from '../../utils/treeGridMixin.js'

import ArrowDown from '../icons/ArrowDown.vue'
import ArrowRight from '../icons/ArrowRight.vue'

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
  },

  components: {
    ArrowDown,
    ArrowRight
  }
}
</script>

<style lang="scss" scoped>
.icon-box {
  height: 16px;
  margin-right: 12px;
  cursor: pointer;
}
</style>
