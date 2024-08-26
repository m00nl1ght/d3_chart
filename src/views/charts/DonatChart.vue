<template>
  <v-row no-gutters>
    <v-col cols="6" class="d-flex flex-column justify-space-between">
      <h3 class="chart-title">{{ title }}</h3>

      <ul v-if="hasData" class="pl-0 d-flex justify-center mb-3 flex-column">
        <li v-for="(arc, idx) in arcs" :key="`inf_${idx}`" class="d-flex align-center mb-4 legend-label">
          <div class="legend-cyrcle mr-4" :style="`background-color: ${arc.color}`"></div>
          {{ arc.title }}
        </li>
      </ul>
    </v-col>

    <v-col cols="6" style="position: relative">
      <div class="d-flex justify-center">
        <svg :width="width" :height="height" :viewBox="viewBox">
          <path v-if="!hasData" :d="arcCircle({ endAngle: 2 * Math.PI, startAngle: 0 })" :fill="colorMapDonat.empty"></path>

          <g v-for="(arc, idx) in arcs" :key="idx">
            <g>
              <path
                :d="arc.path"
                :fill="arc.color || '#5f5'"
                :opacity="isFocused && arc.data[valueKey] !== focusedElem.data[valueKey] ? 0.4 : 1"
                @mouseenter="() => onMouseenter(arc)"
                @mouseleave="onMouseleave"
                @mousemove="onMousemove"
              />

              <text
                v-if="hasData"
                :key="`text_${idx}`"
                font-family="manrope"
                font-size="12"
                text-anchor="middle"
                alignment-baseline="middle"
                :transform="`translate(${arc.label})`"
              >
                <tspan>{{ getPersentValue(arc.value) }}</tspan>
              </text>
            </g>
          </g>

          <g font-family="Manrope" font-size="14" text-anchor="middle">
            <text v-if="hasData">
              <tspan y="0.2em" class="center-info__title">
                {{ focusedElem ? focusedElem.data[countKey] : total }}
              </tspan>
              <tspan x="0" y="2.0em" class="center-info__subtitle">
                {{ focusedElem ? focusedElem.title : $t('analyticMetadata.all') }}
              </tspan>
            </text>

            <text v-else>
              <tspan x="0" y="0.4em" class="center-info__subtitle">
                {{ $t('analyticMetadata.noData') }}
              </tspan>
            </text>
          </g>
        </svg>
      </div>

      <BarCharHover
        v-if="isFocused && focusedElem && tooltipPos && showDonatTooltip"
        :position="{
          left: tooltipPos[0] + width / 2,
          top: tooltipPos[1] + 10 + height / 2
        }"
      >
        <slot name="donatTooltip" :selected="focusedElem" :items="arcs"></slot>
      </BarCharHover>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable */
// пример анимации
// https://codepen.io/thibautg/pen/dJVNwm
import BarCharHover from './components/ChartTooltipBox.vue'

import { scaleOrdinal, pie, arc, schemeObservable10, pointer } from 'd3'
import { colorMapDonat } from './composable/colorsMapping'

export default {
  components: {
    BarCharHover
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    width: {
      default: 255,
      type: Number
    },
    height: {
      default: 255,
      type: Number
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    countKey: {
      type: String,
      default: 'count'
    },
    burnoutBlock: {
      type: String,
      default: 'common'
    },
    showDonatTooltip: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      padAngle: (1.5 / 180) * Math.PI,
      labelRadius: 115, // magic
      paddingForLabel: 50, // magic

      isFocused: false,
      focusedElem: undefined,
      tooltipPos: [undefined, undefined],

      colorMapDonat
    }
  },

  computed: {
    hasData() {
      return this.items.length !== 0
    },

    viewBox() {
      return [-this.width / 2, -this.height / 2, this.width, this.height]
    },

    radius() {
      return Math.min(this.width - this.paddingForLabel, this.height - this.paddingForLabel) / 2
    },

    colors() {
      return scaleOrdinal(schemeObservable10)
    },

    arcCircle() {
      return arc()
        .innerRadius(this.radius * 0.69)
        .outerRadius(this.radius - 1)
    },

    arcs() {
      const d3Pie = pie()
        .value((d) => d[this.countKey])
        .padAngle(this.padAngle)
        .sort(null)(this.items)

      d3Pie.forEach((d, i) => {
        d.path = this.arcCircle.cornerRadius(5)({
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          padAngle: this.padAngle
        })

        d.color = this.getColor(d.data[this.valueKey], i, this.burnoutBlock)
        d.label = this.getLadelPosition(d)

        d.title = this.$te(`analyticMetadata.chartsData.${d.data[this.valueKey]}`)
          ? this.$t(`analyticMetadata.chartsData.${d.data[this.valueKey]}`)
          : d.data[this.valueKey]
      })
      return d3Pie
    }
  },

  methods: {
    onMouseenter(item) {
      this.focusedElem = item
      this.isFocused = true
    },

    onMouseleave() {
      this.isFocused = false
      this.focusedElem = undefined
      this.tooltipPos = undefined
    },

    onMousemove(event) {
      this.tooltipPos = pointer(event)
    },

    getPersentValue(val) {
      if (!val) return ''
      if (!this.total) return val
      return `${((val / this.total) * 100).toFixed(2)}%`
    },

    getColor(key, idx, block) {
      if (block === 'emotionalDeperson' || block === 'efficiency') {
        if (key && key in this.colorMapDonat[block]) return this.colorMapDonat[block][key]
      }

      if (key && key in this.colorMapDonat) return this.colorMapDonat[key]
      return this.colors(idx)
    },

    getLadelPosition(d) {
      const pos = this.arcCircle.centroid(d)

      const x = pos[0]
      const y = pos[1]
      const h = Math.sqrt(x * x + y * y)

      const newPos = [(x / h) * this.labelRadius, (y / h) * this.labelRadius]
      return newPos
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-title {
  /* Вовлеченность */

  font-family: 'Manrope';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
  /* identical to box height, or 24px */

  /* Black */
  color: #222529;
}

svg {
  pointer-events: auto;
}

.legend-label {
  //styleName: Button_regular;
  font-family: Manrope;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
}

.legend-cyrcle {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  margin-right: 12px;
}

.center-info__title {
  font-size: 40px;
  font-weight: 700;
  line-height: 40px;
  color: #222529;
}

.center-info__subtitle {
  font-size: 14px;
  color: #222529;
}
</style>
