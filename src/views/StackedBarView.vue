<template>
  <v-row>
    <v-col cols="12">
      <StackedBarChart :items="stackedBarData" />
    </v-col>
  </v-row>
</template>

<script>
import { stackedBarData } from '@/mockData.js'
import StackedBarChart from '@/views/charts/StackedBarChart.vue'

export default {
  components: {
    StackedBarChart
  },

  data() {
    return {
      stackedBarData
    }
  }
}
</script>

<style lang="scss" scoped></style>
