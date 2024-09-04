<template>
  <v-row>
    <v-col cols="12">
      <LineDotChart :items="lineDotData" />
    </v-col>
  </v-row>
</template>

<script>
import { lineDotData } from '@/mockData.js'
import LineDotChart from '@/views/charts/LineDotChart.vue'

export default {
  components: {
    LineDotChart
  },

  data() {
    return {
      lineDotData
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
