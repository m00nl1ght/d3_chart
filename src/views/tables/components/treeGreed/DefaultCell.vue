<template>
  <span>
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
