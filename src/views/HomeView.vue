<template>
  <div>
    <h1>This is an HOME page</h1>

    <LineDotChart />
    <!-- <StackedAreaСhart :items="items" /> -->
  </div>
</template>

<script>
import StackedAreaСhart from './components/StackedAreaСhart.vue'
import LineDotChart from './components/LineDotChart.vue'

export default {
  components: {
    StackedAreaСhart,
    LineDotChart
  },

  data() {
    return {
      // items: [
      //   { key: '-опрос 1 🚀', value: 45 },
      //   { key: '-опрос 2 🚀', value: 40 },
      //   { key: '-опрос 3 🚀', value: 40 },
      //   { key: '-опрос 4 🚀', value: 41 },
      //   { key: '-опрос 5 🚀', value: 43 },
      //   { key: '-опрос 6 🚀', value: 40 },
      //   { key: '-опрос 7 🚀', value: 41 },
      //   { key: '-опрос 8 🚀', value: 36 },
      //   { key: '-опрос 9 🚀', value: 39 },
      //   { key: 'опрос 10 🚀', value: 37 },
      //   { key: 'опрос 11 🚀', value: 40 }
      // ]
      items: [
        { format: 'Отрицательные ответы', value: 3, cycle: 1 },
        { format: 'Нейтральные ответы', value: 17, cycle: 1 },
        { format: 'Лояльные ответы', value: 32, cycle: 1 },
        { format: 'Положительные ответы', value: 275, cycle: 1 },
        { format: 'Отрицательные ответы', value: 4, cycle: 2 },
        { format: 'Лояльные ответы', value: 15, cycle: 2 },
        { format: 'Нейтральные ответы', value: 27, cycle: 2 },
        { format: 'Положительные ответы', value: 248, cycle: 2 },
        { format: 'Отрицательные ответы', value: 4, cycle: 3 },
        { format: 'Нейтральные ответы', value: 12, cycle: 3 },
        { format: 'Лояльные ответы', value: 35, cycle: 3 },
        { format: 'Положительные ответы', value: 316, cycle: 3 }
      ]
      // items: [
      //   { date: 2000, industry: 'Wholesale and Retail Trade', unemployed: 1000 },
      //   // { date: 2001, industry: 'Manufacturing', unemployed: 734 }
      //   // {date: 2020, industry: "Leisurehospitality", unemployed: 782},
      //   // {date: '2000-01-01', industry: "Leisurehospitality1", unemployed: 782},
      //   // { date: '2000-01-01', industry: 'Leisurehospitality12', unemployed: 600 },
      //   // { date: '2000-01-01', industry: 'Leisurehospitality13', unemployed: 700 },
      //   // { date: '2000-02-01', industry: 'Wholesale and Retail Trade', unemployed: 1023 }
      //   // {date: '2000-02-01', industry: "Manufacturing", unemployed: 694},
      //   // {date: '2000-02-01', industry: "Leisure and hospitality", unemployed: 779},
      //   //  {date: '2000-02-01', industry: "Business services", unemployed: 587}
      //   // //  {date: '2000-02-01', industry: "Construction", unemployed: 812},
      //   // //  {date: '2000-02-01', industry: "Education and Health", unemployed: 349},
      //   // //  {date: '2000-02-01', industry: "Government", unemployed: 409},
      //   // //  {date: '2000-02-01', industry: "Finance", unemployed: 240},
      //   // //  {date: '2000-02-01', industry: "Self-employed", unemployed: 262},
      //   // //  {date: '2000-02-01', industry: "Other", unemployed: 232},
      //   // //  {date: '2000-02-01', industry: "Transportation and Utilities", unemployed: 223},
      //   // //  {date: '2000-02-01', industry: "Information", unemployed: 112},
      //   // //  {date: '2000-02-01', industry: "Agriculture", unemployed: 173},
      //   // //  {date: '2000-02-01', industry: "Mining and Extraction", unemployed: 25},
      //   // //  {date: '2000-03-01', industry: "Wholesale and Retail Trade", unemployed: 983},
      //   // //  {date: '2000-03-01', industry: "Manufacturing", unemployed: 739},
      //   // //  {date: '2000-03-01', industry: "Leisure and hospitality", unemployed: 789},
      //   // //  {date: '2000-03-01', industry: "Business services", unemployed: 623},
      //   // //  {date: '2000-03-01', industry: "Construction", unemployed: 669},
      //   // //  {date: '2000-03-01', industry: "Education and Health", unemployed: 381},
      //   // //  {date: '2000-03-01', industry: "Government", unemployed: 311},
      //   // //  {date: '2000-03-01', industry: "Finance", unemployed: 226},
      //   // //       {date: '2000-03-01', industry: "Self-employed", unemployed: 213},
      //   // //       {date: '2000-03-01', industry: "Other", unemployed: 247},
      //   // //       {date: '2000-03-01', industry: "Transportation and Utilities", unemployed: 192},
      //   // //       {date: '2000-03-01', industry: "Information", unemployed: 140}
      // ]
    }
  }
}
</script>
