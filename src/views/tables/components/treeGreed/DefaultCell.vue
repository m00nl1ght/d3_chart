<template>
  <span
    :class="`zk-table--level-${row._level}-cell`"
    :style="{ marginLeft: `${(row._level - 1) * 24}px`, paddingLeft: row._childrenLen === 0 ? '20px' : '' }"
  >
    {{ row[column.prop] ? row[column.prop] : '' }}
  </span>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => ({})
    },

    column: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped></style>
