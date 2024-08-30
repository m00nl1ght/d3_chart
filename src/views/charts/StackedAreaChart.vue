<template>
  <div style="position: relative">
    <div class="d-flex justify-center app-text-family--bold">
      {{ $t('analyticMetadata.answers').toUpperCase() }}
    </div>

    <ul class="legend pl-0 justify-center">
      <li v-for="(arc, idx) in areas" :key="`inf_${idx}`" class="legend__box">
        <div class="legend__dot" :style="{ 'background-color': getColorLine(arc.value) }"></div>
        {{ arc.title }}
      </li>
    </ul>

    <div class="d-flex justify-center">
      <svg :width="width" :height="height" :viewBox="viewBox" class="chart">
        <g>
          <text class="x-legend">
            <tspan>TODO_rename_количество</tspan>
          </text>

          <text class="y-legend">
            <tspan>TODO_rename_цикл</tspan>
          </text>
        </g>

        <g v-for="item in areas" :key="item.fill" :opacity="isFocused && focusedElem[1] !== item.value ? 0.2 : 1">
          <path :fill="item.fill" :d="item.d"></path>
        </g>

        <g @mouseover="onMouseover" @mouseleave="onMouseleave">
          <g v-for="item in areas" :key="`key_${item.fill}`" :opacity="isFocused && focusedElem[1] !== item.value ? 0.2 : 1">
            <path :d="item.linePath" style="fill: none" :stroke="item.lineColor" stroke-width="3"></path>
            <circle
              v-for="(circle, i) in item.lineDots"
              :key="`${item[0]}_${i}`"
              r="4"
              class="dot"
              :cx="circle.cx"
              :cy="circle.cy"
              :fill="item.lineColor"
              :aria-label="`${circle.xValue};${item.value}`"
            ></circle>
          </g>
        </g>

        <g v-axis:x="{ x: xScale, height, ticks }" fill="none" :transform="`translate(0, ${height - marginBottom})`" class="letters"></g>
        <g
          v-axis:y="{ y: yScale, height, lineWidth: width - marginLeft - marginRight }"
          fill="none"
          :transform="`translate(${marginLeft}, 0)`"
          class="letters"
        ></g>
      </svg>
    </div>

    <BarCharHover
      v-if="isFocused && focusedElem && tooltipPos"
      :position="{
        left: tooltipPos[0],
        top: tooltipPos[1] + 15
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
/* eslint-disable */
import * as d3 from 'd3'
import { colorMapStackedArea, colorMapStackedAreaLine } from './composable/colorsMapping'

import BarCharHover from './components/ChartTooltipBox.vue'
import AnswersChartTooltip from './components/tooltips/AnswersChartTooltip.vue'

export default {
  directives: {
    axis(el, binding) {
      const axis = binding.arg
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis]
      const methodArg = binding.value[axis]
      const height = binding.value['height']
      const ticks = binding.value['ticks']
      const lineWidth = binding.value['lineWidth']

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(d3.axisBottom(methodArg).ticks(ticks))
          .call((g) => g.selectAll('.tick line').remove())
          .call((g) => g.select('.domain').remove())
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg).ticks(height / 80, '%'))
          .call((g) => g.selectAll('.tick line').attr('stroke-opacity', 0.2).attr('x2', lineWidth).attr('stroke-dasharray', 5, 5))
          .call((g) => g.select('.domain').remove())
      }
    }
  },

  props: {
    items: {
      // TODO sort by cycle
      type: Array,
      default: () => []
    },
    width: {
      default: 700,
      type: Number
    },
    height: {
      default: 270,
      type: Number
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    countKey: {
      type: String,
      default: 'count'
    }
  },

  components: {
    BarCharHover,
    AnswersChartTooltip
  },

  data() {
    return {
      marginTop: 20,
      marginRight: 20,
      marginBottom: 40,
      marginLeft: 60,

      isFocused: false,
      focusedElem: [undefined, undefined], // [cycle, yValueKey]
      tooltipPos: [undefined, undefined],

      colorMapStackedArea,
      colorMapStackedAreaLine
    }
  },

  computed: {
    viewBox() {
      // return [-this.width / 2, -this.height / 2, this.width, this.height];
      return `0 0 ${this.width} ${this.height}`
    },

    xDomain() {
      const domain = d3.extent(this.items, (d) => d.cycle)
      return [domain[0], domain[1]]
    },

    ticks() {
      return this.xDomain[1] - this.xDomain[0]
    },

    xScale() {
      return d3
        .scaleLinear()
        .domain(this.xDomain)
        .range([this.marginLeft, this.width - this.marginRight])
    },

    yScale() {
      return d3.scaleLinear().rangeRound([this.height - this.marginBottom, this.marginTop])
    },

    series() {
      // if(!this.items) return []
      return d3
        .stack()
        .offset(d3.stackOffsetExpand)
        .keys(
          d3.union(
            this.items.map((d) => {
              return d[this.valueKey]
            })
          )
        ) // distinct series keys, in input order
        .value(([, D], key) => {
          return D.get(key) ? D.get(key)[this.countKey] : 0
        })(
        // get value for each series key and stack
        d3.index(
          this.items,
          (d) => d.cycle,
          (d) => d[this.valueKey]
        )
      ) // group by stack then series key
    },

    colors() {
      return d3
        .scaleOrdinal()
        .domain(this.series.map((d) => d.key))
        .range(d3.schemeTableau10)
    },

    area() {
      return d3
        .area()
        .x((d) => this.xScale(d.data[0]))
        .y0((d) => this.yScale(d[0]))
        .y1((d) => this.yScale(d[1]))
        .curve(d3.curveCardinal)
    },

    line() {
      return d3
        .line()
        .x((d) => this.xScale(d.data[0]))
        .y((d) => this.yScale(d[1]))
        .curve(d3.curveCardinal)
    },

    areas() {
      let result = []

      this.series.forEach((elem) => {
        result.push({
          d: this.area(elem),
          fill: this.getColor(elem.key),
          title: this.$t(`analyticMetadata.chartsData.${elem.key}`),
          value: elem.key,
          linePath: this.line(elem),
          lineDots: elem.map((el) => {
            return {
              xValue: el.data[0],
              cx: this.xScale(el.data[0]),
              cy: this.yScale(el[1])
            }
          }),
          lineColor: this.getColorLine(elem.key)
        })
      })

      return result
    },

    tooltipItems() {
      if (this.focusedElem && this.focusedElem[0])
        return this.items.filter((item) => item.cycle === Number(this.focusedElem[0])).map((_) => this.getTooltipValue(_))
      return []
    },

    tooltipSelected() {
      if (this.focusedElem && this.focusedElem[0] && this.focusedElem[1]) {
        const selected = this.items.find((item) => item.cycle === Number(this.focusedElem[0]) && item[this.valueKey] === this.focusedElem[1])
        if (selected) return this.getTooltipValue(selected)
      }
      return undefined
    },

    tooltipTotal() {
      return this.tooltipItems.reduce((acc, item) => acc + item.value, 0)
    }
  },

  methods: {
    onMouseover(evt) {
      const valueString = evt.target.getAttribute('aria-label')
      if (evt.target.tagName === 'circle' && valueString) {
        this.focusedElem = valueString.split(';')
        this.tooltipPos = d3.pointer(evt)
        this.isFocused = true
      }
    },

    onMouseleave() {
      this.isFocused = false
      this.focusedElem = [undefined, undefined]
      this.tooltipPos = [undefined, undefined]
    },

    getColor(key) {
      if (key && key in this.colorMapStackedArea) return this.colorMapStackedArea[key]
      return this.colors(key)
    },

    getColorLine(key) {
      if (key && key in this.colorMapStackedAreaLine) return this.colorMapStackedAreaLine[key]
      return this.colors(key)
    },

    getTooltipValue(item) {
      return {
        title: this.$te(`analyticMetadata.chartsData.${item[this.valueKey]}`)
          ? this.$t(`analyticMetadata.chartsData.${item[this.valueKey]}`)
          : item[this.valueKey],
        value: item[this.countKey],
        color: this.getColorLine(item[this.valueKey]),
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

.chart::v-deep .dot {
  cursor: pointer;
  /* r: 3.5px !important; */
  // stroke-width: 3px;
  // stroke: currentColor;
  // fill: white;
}

.legend {
  display: flex;
  flex-wrap: wrap;
}

.legend__box {
  display: flex;
  align-items: center;
  margin-right: 12px;
  // cursor: pointer;
}

.legend__dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  margin-right: 12px;
}

.letters {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  text-align: right;

  /* Black */
  color: #222529;

  opacity: 0.5;
}

.y-legend {
  transform: translate(16px, 75%) rotate(270deg);

  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;

  color: #000000;
}

.x-legend {
  transform: translate(50%, 100%);

  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;

  color: #000000;
}
</style>
