<template>
  <div>
    <div>
      <ul>
        <li v-for="(arc, idx) in arcs" :key="`inf_${idx}`" @mouseover="() => onMouseover(arc)" @mouseleave="onMouseleave">{{ arc.data.format }}</li>
      </ul>
    </div>

    <div>
      <svg :width="width" :height="height" :viewBox="viewBox">
        <g v-for="(arc, idx) in arcs" :key="idx">
          <g class="pie-chart__wedge-angle" @mouseover="() => onMouseover(arc)" @mouseleave="onMouseleave">
            <path
              class="pie-chart__wedge"
              :d="arc.path"
              :fill="arc.color || '#5f5'"
              :opacity="isFocused && arc.data.format !== focusedElem.data.format ? 0.4 : 1"
            />

            <text font-family="sans-serif" font-size="12" text-anchor="middle" :transform="`translate(${arc.label})`" :key="`text_${idx}`">
              <tspan>{{ getPersentValue(arc.value) }}</tspan>
            </text>
          </g>
        </g>

        <g font-family="sans-serif" font-size="12" text-anchor="middle">
          <text>
            <tspan y="-0.4em">{{ focusedElem ? focusedElem.data.value : total }}</tspan>
            <tspan x="0" y="0.7em">{{ focusedElem ? focusedElem.data.format : 'Всего' }}</tspan>
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
// {format: 'Отрицательные ответы', value: 3, cycle: 1},
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    width: {
      default: 500,
      type: Number
    },
    height: {
      default: 270,
      type: Number
    }
  },

  data() {
    return {
      openValueEased: 1.0,
      padAngle: (1.5 / 180) * Math.PI,

      isFocused: false,
      focusedElem: undefined
    }
  },

  methods: {
    onMouseover(item) {
      this.focusedElem = item
      this.isFocused = true
    },

    onMouseleave() {
      this.isFocused = false
      this.focusedElem = undefined
    },

    arcLabel() {
      return d3
        .arc()
        .innerRadius(this.radius * 0.67)
        .outerRadius(this.radius - 1)
    },

    getPersentValue(val) {
      if (!this.total) return val

      return `${Math.round((val / this.total) * 100)}%`
    }
  },

  computed: {
    viewBox() {
      return [-this.width / 2, -this.height / 2, this.width, this.height]
    },

    radius() {
      return Math.min(this.width, this.height) / 2
    },

    colors() {
      // return ['#f9d45c', '#ef8c8c', '#88bf4d', '#4269d0'] //colors from metabase
      return d3.scaleOrdinal(d3.schemeObservable10)
    },

    arcs() {
      const d3Pie = d3
        .pie()
        .value((d) => d.value)
        .padAngle(this.padAngle)
        .sort(null)(this.items)

      d3Pie.forEach((d, i) => {
        d.path = d3.arc()({
          innerRadius: this.radius * 0.67,
          outerRadius: this.radius - 1,
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          padAngle: this.padAngle
        })

        d.color = this.colors(i)
        d.label = this.arcLabel().centroid(d)
      })
      return d3Pie
    }
  }
}
</script>
