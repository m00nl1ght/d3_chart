<template>
  <v-row>
    <v-col cols="12">
      <StackedAreaChart :items="items" valueKey="involvement" />
    </v-col>
  </v-row>
</template>

<script>
import StackedAreaChart from '@/views/charts/StackedAreaChart.vue'
import { stackedAreaData } from '@/mockData.js'

export default {
  components: {
    StackedAreaChart
  },

  data() {
    return {
      stackedAreaData
    }
  },

  computed: {
    items() {
      return this.stackedAreaData.sort((a, b) => a.cycle - b.cycle)
    }
    // totalValue() {
    //   return this.items.reduce((acc, a) => acc + a.value, 0)
    // }
  }
}
</script>
