<template>
  <div style="position: relative">
    <ul class="legend">
      <li v-for="item in AVALIABLE_FIELDS" :key="`inf_${item}`" class="legend__box mr-4">
        <div class="legend__dot" :style="{ 'background-color': colors[item] }"></div>
        <span class="legend__title">{{ titles[item] }}</span>
      </li>
    </ul>

    <svg :width="width" :height="height" :viewBox="viewBox" class="chart">
      <g @mouseover="(evt) => onMouseenter(evt)" @mouseleave="onMouseleave">
        <g v-for="item in series" :key="`item_${item[0]}`">
          <path :d="createLinePath(item)" style="fill: none" :stroke="colors[item[0]] || '#47D3DE'" stroke-width="2"></path>
          <circle
            v-for="(circle, i) in item[1]"
            :key="`${item[0]}_${i}`"
            r="4"
            class="dot"
            :cx="xScale(circle[xValueKey])"
            :cy="yScale(circle[yCountKey])"
            :fill="colors[item[0]] || '#47D3DE'"
            :aria-label="`${circle[xValueKey]};${circle[yValueKey]}`"
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

    <BarCharHover
      v-if="isFocused && focusedElem && tooltipPos"
      :position="{
        left: tooltipPos[0],
        top: tooltipPos[1] - 15
      }"
      style="transform: translate(-50%, -100%)"
    >
      <LineDotChartTooltip :items="tooltipItems" :total="tooltipTotal" :title="`Цикл ${focusedElem[0]}`" />
    </BarCharHover>
  </div>
</template>

<script>
import * as d3 from 'd3'
import BarCharHover from './components/ChartTooltipBox.vue'
import LineDotChartTooltip from '@/views/charts/components/tooltips/LineDotChartTooltip.vue'
// data example
// { cycle: 2, depersonalization: 22, emotional_burnout: 29, professional_efficiency: 15, sum_score: 66 },

export default {
  directives: {
    axis(el, binding) {
      const axis = binding.arg
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis]
      const methodArg = binding.value[axis]
      const ticks = binding.value['ticks']
      const lineWidth = binding.value['lineWidth']

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(d3.axisBottom(methodArg).ticks(ticks))
          .call((g) => g.selectAll('.tick line').remove())
          .call((g) => g.select('.domain').remove())
      } else {
        // d3.select(el).call(d3.axisLeft(methodArg))
        // .call((g) => g.select('.domain').remove())
        d3.select(el)
          .call(d3.axisLeft(methodArg))
          .call((g) => g.selectAll('.tick line').attr('stroke-opacity', 0.2).attr('x2', lineWidth).attr('stroke-dasharray', 5, 5))
          .call((g) => g.select('.domain').remove())
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
      default: 370,
      type: Number
    },
    xValueKey: {
      type: String,
      default: 'cycle'
    },
    yValueKey: {
      type: String,
      default: 'group'
    },
    yCountKey: {
      type: String,
      default: 'count'
    }
  },

  components: {
    BarCharHover,
    LineDotChartTooltip
  },

  data() {
    return {
      AVALIABLE_FIELDS: ['depersonalization', 'emotional_burnout', 'professional_efficiency', 'sum_score'],

      marginLeft: 70,
      marginTop: 30,
      marginBottom: 20,
      marginRight: 20,

      isFocused: false,
      focusedElem: [undefined, undefined], // [cycle, group]
      tooltipPos: [undefined, undefined]
    }
  },

  computed: {
    colors() {
      return {
        depersonalization: '#f9d45c',
        emotional_burnout: '#ef8c8c',
        professional_efficiency: '#88bf4d',
        sum_score: '#4269d0'
      }
    },

    titles() {
      return {
        depersonalization: this.$t('analyticMetadata.depersonalizationBurnout'),
        emotional_burnout: this.$t('analyticMetadata.emotionalBurnout'),
        professional_efficiency: this.$t('analyticMetadata.professionalEfficiency'),
        sum_score: this.$t('analyticMetadata.summary')
      }
    },

    parsedItems() {
      const defaultItem = {
        depersonalization: 0,
        emotional_burnout: 0,
        professional_efficiency: 0,
        sum_score: 0
      }
      const result = {}

      this.items.forEach((item) => {
        if (!(item[this.xValueKey] in result)) result[item[this.xValueKey]] = { ...defaultItem }
        for (let key in item) {
          if (key in result[item[this.xValueKey]]) result[item[this.xValueKey]][key] = result[item[this.xValueKey]][key] + item[key]
        }
      })
      let res = []

      this.AVALIABLE_FIELDS.forEach((group) => {
        for (let key in result) {
          res.push({ [this.xValueKey]: key, [this.yValueKey]: group, count: result[key][group] })
        }
      })

      return res
    },

    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },

    xDomain() {
      const domain = d3.extent(this.parsedItems, (d) => d[this.xValueKey])
      return [domain[0], domain[1]]
    },

    ticks() {
      return this.xDomain[1] - this.xDomain[0]
    },

    xScale() {
      return d3
        .scaleLinear()
        .domain(this.xDomain)
        .nice()
        .range([this.marginLeft, this.width - this.marginRight])
    },

    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.parsedItems, (d) => d[this.yCountKey]) + this.marginTop])
        .nice()
        .range([this.height - this.marginBottom, this.marginTop])
    },

    series() {
      return d3.group(this.parsedItems, (d) => d[this.yValueKey])
    },

    tooltipItems() {
      if (this.focusedElem && this.focusedElem[0])
        return this.parsedItems
          .filter((item) => item[this.xValueKey] === this.focusedElem[0] && item[this.yValueKey] !== 'sum_score')
          .map((_) => this.getTooltipValue(_))
      return []
    },

    tooltipTotal() {
      return this.tooltipItems.reduce((acc, item) => acc + item.value, 0)
    }
  },

  methods: {
    createLinePath(d) {
      let res = d3
        .line()
        .x((d) => this.xScale(d[this.xValueKey]))
        .y((d) => this.yScale(d[this.yCountKey]))(
        // .curve(d3.curveCardinal)(d[1]);
        d[1]
      )
      return res
    },

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
      this.focusedElem = [undefined, undefined]
      this.tooltipPos = [undefined, undefined]
    },

    getTooltipValue(item) {
      return {
        title: this.titles[item[this.yValueKey]],
        value: item[this.yCountKey],
        color: this.colors[item[this.yValueKey]],
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

.legend {
  display: flex;
  flex-wrap: wrap;
}

.legend__box {
  display: flex;
  align-items: center;
}

.legend__dot {
  height: 12px;
  width: 12px;
  border-radius: 6px;
  margin-right: 12px;
}

.legend__title {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  /* Black */
  color: #222529;
}
</style>
