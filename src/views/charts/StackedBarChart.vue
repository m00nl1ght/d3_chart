<template>
  <div class="d-flex flex-column align-center">
    <div class="mb-2">
      <ul class="d-flex">
        <li v-for="item in itemsByKey" :key="item.color" class="d-flex align-center">
          <div class="cyrcle-box mr-1 ml-3" :style="`background-color: ${item.color}`"></div>
          {{ item.title }}
        </li>
      </ul>
    </div>

    <div>
      <svg
        v-if="series && series.length > 0"
        :width="width"
        :height="height"
        :viewBox="viewBox"
        class="chart"
        style="max-width: 100%; height: auto; font: 10px sans-serif"
      >
        <g v-axis:x="{ x: xScale }" fill="none" :transform="`translate(0, ${height - marginBottom})`"></g>
        <g v-axis:y="{ y: yScale, lineWidth: width - marginLeft - marginRight }" fill="none" :transform="`translate(${marginLeft}, 0)`"></g>

        <g @mouseover="onMouseover" @mouseleave="onMouseleave">
          <g v-for="item in chartData.items" :key="item.key" :fill="item.color">
            <rect
              v-for="r in item.rects"
              :key="r.key"
              :x="r.x"
              :y="r.y"
              :height="r.height"
              :width="r.width"
              :aria-label="`${r.xValue};${r.yValue}`"
              :opacity="isFocused && r.xValue !== focusedElem[0] ? 0.2 : 1"
            ></rect>
          </g>
        </g>
      </svg>
    </div>

    <BarCharHover
      v-if="isFocused && focusedElem && tooltipPos"
      :position="{
        left: tooltipPos[0],
        top: tooltipPos[1]
      }"
      style="transform: translate(0, -100%)"
    >
      <AnswersChartTooltip
        :title="$t('analyticMetadata.participation.contentment')"
        :selected="tooltipSelected"
        :items="tooltipItems"
        :total="tooltipTotal"
      />
    </BarCharHover>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { colorMapStackedBar } from './composable/colorsMapping'

import BarCharHover from './components/ChartTooltipBox.vue'
import AnswersChartTooltip from './components/tooltips/AnswersChartTooltip.vue'

// example items
// [
//   { count: 1, lastdate: '2023-07-24', text_value: '0' },
//   { count: 1, lastdate: '2023-07-24', text_value: '1' },
// ]

export default {
  directives: {
    axis(el, binding) {
      const axis = binding.arg
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis]
      const methodArg = binding.value[axis]
      const lineWidth = binding.value['lineWidth']

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(d3.axisBottom(methodArg))
          .call((g) => g.select('.domain').remove())
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('transform', 'rotate(-65)')
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg))
          .call((g) => g.select('.domain').remove())
          .call((g) => g.selectAll('.tick line').attr('stroke-opacity', 0.5).attr('x2', lineWidth).attr('stroke-dasharray', 5, 5))
      }
    }
  },

  props: {
    items: {
      type: Array,
      default: () => []
    },
    width: {
      default: 900,
      type: Number
    },
    height: {
      default: 470,
      type: Number
    },
    countKey: {
      type: String,
      default: 'count'
    },
    xValueKey: {
      type: String,
      default: 'lastdate'
    },
    yValueKey: {
      type: String,
      default: 'text_value'
    }
  },

  components: {
    BarCharHover,
    AnswersChartTooltip
  },

  data() {
    return {
      colorMapStackedBar,

      marginTop: 10,
      marginRight: 10,
      marginBottom: 60,
      marginLeft: 30,

      isFocused: false,
      focusedElem: [undefined, undefined], // [xValue, yValue]
      tooltipPos: [undefined, undefined]
    }
  },

  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },

    itemsByKey() {
      return {
        0: {
          color: colorMapStackedBar.RED_DEEP,
          title: 'Очень тревожное'
        },
        1: {
          color: colorMapStackedBar.RED,
          title: '1'
        },
        2: {
          color: colorMapStackedBar.ORANGE,
          title: '2'
        },
        3: {
          color: colorMapStackedBar.YELLOW,
          title: '3'
        },
        4: {
          color: colorMapStackedBar.GREEN_LIGHT,
          title: '4'
        },
        5: {
          color: colorMapStackedBar.GREEN,
          title: 'Отличное'
        }
      }
    },

    series() {
      let series = d3
        .stack()
        .keys(d3.union(this.items.map((d) => d[this.yValueKey]))) // distinct series keys, in input order
        .value(([, D], key) => (D.get(key) ? D.get(key)[this.countKey] : 0))(
        d3.index(
          this.items,
          (d) => d[this.xValueKey],
          (d) => d[this.yValueKey]
        )
      ) // group by stack then series key

      const res = series.map((D) => {
        const resultArr = D.map((d) => {
          return (d.key = D.key), d
        })
        resultArr.key = D.key
        return resultArr
      })

      return res
    },

    chartData() {
      if (!this.series || this.series.length === 0) return { item: [] }

      let total = {}
      const items = this.series.map((s) => {
        const color = this.getColor(s.key)
        return {
          key: `key_${color}`,
          color,
          rects: s.map((r, idx) => {
            if (!total[idx] || r[1] > total[idx]) total[idx] = r[1]

            const xPos = this.xScale(r.data[0])
            return {
              x: xPos,
              y: this.yScale(r[1]),
              height: this.yScale(r[0]) - this.yScale(r[1]),
              width: this.xScale.bandwidth(),
              key: `column_${color}_${xPos}`,
              xValue: r.data[0],
              yValue: r.key
            }
          })
        }
      })

      return {
        items,
        total
      }
    },

    xScale() {
      // return d3
      //   .scaleTime()
      //   .domain([new Date('2023-11-10'), new Date('2023-12-25')])
      //   .range([this.marginLeft, this.width - this.marginRight])
      return d3
        .scaleBand()
        .domain(this.items.map((d) => d[this.xValueKey]))
        .range([this.marginLeft, this.width - this.marginRight])
        .padding(0.2)
    },

    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.series, (d) => d3.max(d, (d) => d[1]))])
        .range([this.height - this.marginBottom, this.marginTop])
    },

    colors() {
      return d3
        .scaleOrdinal()
        .domain(this.series.map((d) => d.key))
        .range(d3.schemeSpectral[this.series.length])
        .unknown('#ccc')
    },

    groupedByColumn() {
      let result = {}

      this.items.forEach((item) => {
        const xValue = item[this.xValueKey]
        if (xValue in result) result[xValue].push(item)
        else result[xValue] = [item]
      })

      return result
    },

    tooltipItemsRaw() {
      if (this.focusedElem && this.focusedElem[0]) return this.groupedByColumn[this.focusedElem[0]]
      return []
    },

    tooltipItems() {
      return this.tooltipItemsRaw.map((_) => this.getTooltipValue(_))
    },

    tooltipSelected() {
      if (this.focusedElem && this.focusedElem[0] && this.focusedElem[1]) {
        const selected = this.tooltipItemsRaw.find((item) => item[this.yValueKey] === this.focusedElem[1])
        if (selected) return this.getTooltipValue(selected)
      }
      return undefined
    },

    tooltipTotal() {
      return this.tooltipItemsRaw.reduce((acc, item) => acc + item[this.countKey], 0)
    }
  },

  methods: {
    getColor(key) {
      if (key && key in this.itemsByKey) return this.itemsByKey[key].color
      return this.colors(key)
    },

    onMouseover(evt) {
      const valueString = evt.target.getAttribute('aria-label')
      if (evt.target.tagName === 'rect') {
        this.focusedElem = valueString.split(';')
        this.tooltipPos = d3.pointer(evt)
        this.isFocused = true
      }
    },

    onMouseleave() {
      this.isFocused = false
      this.focusedElem = undefined
      this.tooltipPos = [undefined, undefined]
    },

    getTooltipValue(item) {
      return {
        title: this.$te(`analyticMetadata.chartsData.${item[this.yValueKey]}`)
          ? this.$t(`analyticMetadata.chartsData.${item[this.yValueKey]}`)
          : item[this.yValueKey],
        value: item[this.countKey],
        color: this.getColor(item[this.yValueKey]),
        raw: item
      }
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  pointer-events: auto;
  stroke-width: 1;
}

.cyrcle-box {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
</style>
