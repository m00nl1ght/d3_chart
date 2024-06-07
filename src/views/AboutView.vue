<template>
  <div class="about">
    <h1>This is an about page</h1>
    <DonutChart :items="items" :total="totalValue" />
  </div>
</template>

<script>
import DonutChart from './components/DonutChart.vue'

export default {
  components: {
    DonutChart
  },

  data() {
    return {
      items: [
        { format: 'Отрицательные ответы', value: 3, cycle: 1 },
        { format: 'Нейтральные ответы', value: 17, cycle: 1 },
        { format: 'Лояльные ответы', value: 32, cycle: 1 },
        { format: 'Положительные ответы', value: 275, cycle: 1 }
      ]
    }
  },

  computed: {
    totalValue() {
      return this.items.reduce((acc, a) => acc + a.value, 0)
    }
  }
}
</script>
