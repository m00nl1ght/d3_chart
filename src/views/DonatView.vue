<template>
  <v-row>
    <v-col cols="12">
      <DonatChart :items="donatData" :valueKey="valueKey" :total="total" showDonatTooltip>
        <template #donatTooltip="{ items, selected }">
          <div>
            <AnswersChartTooltip :title="$t('analyticMetadata.participation.contentment')" :selected="selected" :items="items" :total="total" />
          </div>
        </template>
      </DonatChart>
    </v-col>
  </v-row>
</template>

<script>
import DonatChart from '@/views/charts/DonatChart.vue'
import AnswersChartTooltip from '@/views/charts/components/tooltips/AnswersChartTooltip.vue'
import { donatData } from '@/mockData.js'

export default {
  components: {
    DonatChart,
    AnswersChartTooltip
  },

  data() {
    return {
      donatData,
      valueKey: 'contentment',
      countKey: 'count'
    }
  },

  computed: {
    total() {
      let result = 0
      this.donatData.map((item) => (result += item[this.countKey]))
      return result
    }
  }
}
</script>
