<template>
  <div>
    <TreeGridBody :bodyData="bodyData" :tableColumns="columns" />
  </div>
</template>

<script>
import TreeGridBody from './components/treeGreed/TreeGridBody.vue'

function getBodyData(data, isTreeType, childrenProp, isFold, level = 1) {
  let bodyData = []
  data.forEach((row, index) => {
    const children = row[childrenProp]
    console.log('children', children)

    const childrenLen = children && children.length ? children.length : 0
    bodyData.push({
      _isHover: false,
      _isExpanded: false,
      _isChecked: false,
      _level: level,
      _isHide: isFold ? level !== 1 : false,
      _isFold: isFold,
      _childrenLen: childrenLen,
      _normalIndex: index + 1,
      ...row
    })
    if (isTreeType) {
      if (childrenLen > 0) {
        bodyData = bodyData.concat(getBodyData(children, true, childrenProp, isFold, level + 1))
      }
    }
  })
  return bodyData
}

function initialState(table) {
  return {
    bodyHeight: 'auto',
    firstProp: table.columns[0].prop,
    bodyData: getBodyData(table.items, table.treeType, table.childrenProp, table.isFold)
  }
}

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    childrenProp: {
      type: String,
      default: 'children'
    },
    treeType: {
      // складывается
      type: Boolean,
      default: true
    },
    isFold: {
      // сложена по дефолту
      type: Boolean,
      default: true
    }
  },

  components: {
    TreeGridBody
  },

  data() {
    return {
      ...initialState(this)
    }
  },

  methods: {},

  watch: {
    $props: {
      deep: true,
      handler() {
        Object.assign(this.$data, initialState(this))
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
