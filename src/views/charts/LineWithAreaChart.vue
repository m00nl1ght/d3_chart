<template>
  <div style="position: relative">
    <svg :width="width" :height="height" :viewBox="viewBox" class="chart">
      <g v-if="parsedData && parsedData.length !== 0">
        <g fill="none">
          <path opacity="0.2" :d="areaPath" :fill="COLOR_MAPPING.GREEN"></path>
          <path :d="line(parsedData)" style="fill: none" :stroke="COLOR_MAPPING.GREEN" :stroke-width="LINE_STROKE_WIDTH"></path>
        </g>

        <g @mouseover="(evt) => onMouseenter(evt)" @mouseleave="onMouseleave">
          <circle
            v-for="(item, idx) in parsedData"
            :key="`tick_${idx}`"
            :r="CIRCLE_RADIUS"
            :cy="yScale(item.yVal)"
            :cx="xScale(item.xVal)"
            :style="`fill: ${COLOR_MAPPING.GREEN}`"
            :aria-label="`${item.xVal};${item.yVal}`"
          ></circle>
        </g>
      </g>

      <EmptyBee v-else :transform="`translate(${(width - marginLeft - marginRight) / 2}, ${(height - marginBottom - marginTop) / 2})`" />

      <g v-axis:x="{ x: xScale, height }" fill="none" :transform="`translate(0, ${height - marginBottom})`" class="letters"></g>

      <g
        v-axis:y="{ y: yScale, height, lineWidth: width - marginLeft - marginRight }"
        fill="none"
        :transform="`translate(${marginLeft}, 0)`"
        class="letters"
      ></g>
    </svg>

    <BarCharHover
      v-if="isFocused && focusedElem && tooltipPos"
      :position="{
        left: tooltipPos[0],
        top: tooltipPos[1] - 15
      }"
      style="transform: translate(-50%, -100%)"
    >
      <LineWithAreaChartTooltip :title="focusedElem[0]" :count="focusedElem[1]" />
    </BarCharHover>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'
// import { getFormattedDate } from '@/helpers/utils'
import { COLOR_MAPPING } from './composable/colorsMapping'
import BarCharHover from './components/ChartTooltipBox.vue'
import LineWithAreaChartTooltip from './components/tooltips/LineWithAreaChartTooltip.vue'
import EmptyBee from './components/EmptyBee.vue'

export default {
  directives: {
    axis(el, binding) {
      const axis = binding.arg
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis]
      const methodArg = binding.value[axis]
      const lineWidth = binding.value['lineWidth']

      // const formatTime = d3.utcFormat('%B %d, %Y');
      // const parseTime = d3.timeParse('%Y-%m-%d');

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(
            d3
              .axisBottom(methodArg)
              // .tickFormat((y) => getFormattedDate(y))
              .tickFormat((y) => y)
              .ticks(5)
          )
          // .call((g) => g.select('.domain').attr('stroke-dasharray', 2, 2).attr('stroke-opacity', 0.5))
          .call((g) => g.select('.domain').remove())
          .call((g) => g.selectAll('.tick line').remove())

          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('transform', 'rotate(-45)')
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg).ticks(10))
          .call((g) => g.select('.domain').attr('stroke-dasharray', 2, 2).attr('stroke-opacity', 0.5))
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
      default: 350,
      type: Number
    }
  },

  components: {
    BarCharHover,
    LineWithAreaChartTooltip,
    EmptyBee
  },

  data() {
    return {
      COLOR_MAPPING,
      LINE_STROKE_WIDTH: 4,
      CIRCLE_RADIUS: '7px',

      marginLeft: 50,
      marginTop: 30,
      marginBottom: 80,
      marginRight: 20,

      isFocused: false,
      focusedElem: undefined,
      tooltipPos: [undefined, undefined]
    }
  },

  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },

    parsedData() {
      // return []
      // const parseTime = d3.timeParse('%Y-%m-%d');

      return this.items.map((item) => ({
        // xVal: parseTime(item.lastdate),
        xVal: item.lastdate,
        yVal: item.avg
      }))
    },

    xScale() {
      return d3
        .scalePoint()
        .domain(
          this.parsedData.map((d) => d.xVal),
          [0, 960]
        )
        .rangeRound([this.marginLeft, this.width - this.marginRight])
      // return d3
      //   .scaleTime()
      //   .domain(d3.extent(this.parsedData, (v) => v.xVal))
      //   .range([this.marginLeft, this.width - this.marginRight]);
    },

    yScale() {
      return d3
        .scaleLinear()
        .domain([0, 5])
        .range([this.height - this.marginBottom, this.marginTop])
    },

    line() {
      return d3
        .line()
        .x((d) => {
          return this.xScale(d.xVal)
        })
        .y((d) => this.yScale(d.yVal))
        .curve(d3.curveCatmullRom.alpha(0.5))
    },

    dLine() {
      if (!this.line(this.parsedData)) return ''

      const lineValues = this.line(this.parsedData).slice(1)
      const splitedValues = lineValues.split(',')
      return `M0,${this.height},${lineValues},l0,${this.height - splitedValues[splitedValues.length - 1]}`
    },

    area() {
      return d3
        .area()
        .x((d) => this.xScale(d.xVal))
        .y0(this.yScale(0))
        .y1((d) => this.yScale(d.yVal))
        .curve(d3.curveCatmullRom.alpha(0.5))
    },

    areaPath() {
      return this.area(this.parsedData)
    }
  },

  methods: {
    onMouseenter(evt) {
      const valueString = evt.target.getAttribute('aria-label')
      if (valueString) {
        this.focusedElem = valueString.split(';')
        this.tooltipPos = d3.pointer(evt)
        this.isFocused = true
      }
    },

    onMouseleave() {
      this.isFocused = false
      this.focusedElem = undefined
      this.tooltipPos = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  stroke-width: 1;
}

.letters {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  /* identical to box height */
  text-align: right;

  /* Black */
  color: #222529;

  opacity: 0.5;
}
</style>
