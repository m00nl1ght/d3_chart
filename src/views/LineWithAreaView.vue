<template>
  <v-row>
    <v-col cols="12">
      <LineWithAreaChart :items="lineWithAreaData" />
    </v-col>
  </v-row>
</template>

<script>
import { lineWithAreaData } from '@/mockData.js'
import LineWithAreaChart from '@/views/charts/LineWithAreaChart.vue'

export default {
  components: {
    LineWithAreaChart
  },

  data() {
    return {
      lineWithAreaData
    }
  },

  computed: {
    // total() {
    //   let result = 0
    //   this.donatData.map((item) => (result += item[this.countKey]))
    //   return result
    // }
  }
}
</script>
