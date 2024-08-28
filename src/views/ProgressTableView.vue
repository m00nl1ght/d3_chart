<template>
  <v-row>
    <v-col cols="12">
      <ProgressTable :items="batChartHorizontal" />
    </v-col>
  </v-row>
</template>

<script>
import ProgressTable from '@/views/tables/ProgressTable.vue'
import { batChartHorizontal } from '@/mockData.js'

export default {
  components: {
    ProgressTable
  },

  data() {
    return {
      batChartHorizontal
    }
  },

  computed: {
    // items() {
    //   return this.stackedAreaData.sort((a, b) => a.cycle - b.cycle)
    // }
    // totalValue() {
    //   return this.items.reduce((acc, a) => acc + a.value, 0)
    // }
  }
}
</script>
