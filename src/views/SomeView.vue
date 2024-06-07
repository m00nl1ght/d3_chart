<template>
  <div>
    <h1>This is an Some page</h1>
    <BarChartHorizontal :items="items" />
  </div>
</template>

<script>
import BarChartHorizontal from './components/BarChartHorizontal.vue'
export default {
  components: {
    BarChartHorizontal
  },

  data() {
    return {
      items: [
        { key: '-опрос 1 🚀', value: 45 },
        { key: '-опрос 2 🚀', value: 40 },
        { key: '-опрос 3 🚀', value: 40 },
        { key: '-опрос 4 🚀', value: 41 },
        { key: '-опрос 5 🚀', value: 43 },
        { key: '-опрос 6 🚀', value: 40 },
        { key: '-опрос 7 🚀', value: 41 },
        { key: '-опрос 8 🚀', value: 36 },
        { key: '-опрос 9 🚀', value: 39 },
        { key: 'опрос 10 🚀', value: 37 },
        { key: 'опрос 11 🚀', value: 40 }
      ]
    }
  }
}
</script>
