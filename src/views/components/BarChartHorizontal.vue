<template>
  <div>
    <div style="position: relative">
      <svg :width="width" :height="elementHeight" :viewBox="viewBox">
        <g v-for="(rect, idx) in rects" :key="`rect_${idx}`">
          <rect
            :fill="color"
            :x="rect.x"
            :y="rect.y"
            :width="rect.width"
            :height="rect.height"
            :opacity="isFocused && rect.y !== focusedElem.y ? 0.4 : 1"
            @mouseover="(event) => onMouseover(event, rect)"
            @mouseleave="onMouseleave"
          />

          <text :x="rect.textX" :y="rect.textY" dy="0.35em" dx="5">{{ rect.text }}</text>
        </g>

        <g fill="none" v-axis:x="{ x, elementHeight }" :transform="`translate(0, ${elementHeight - marginBottom})`"></g>

        <g fill="none" v-axis:y="{ y, elementHeight }" :transform="`translate(${marginLeft}, 0)`"></g>
      </svg>

      <BarCharHover v-if="isFocused && focusedElem" :style="`top: ${focusedElem.tooltipYPos}; left: ${focusedElem.tooltipXPos};`">
        <div :style="{ maxWidth: `${focusedElem.width}px` }">
          <div>{{ focusedElem.raw }}</div>
        </div>
      </BarCharHover>
    </div>
    <div ref="test"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import BarCharHover from '@/views/components/hoverDialogs/BarCharHover.vue'

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    width: {
      default: 500,
      type: Number
    },
    barHeight: {
      default: 25,
      type: Number
    },
    color: {
      type: String,
      default: '#87BCEC'
    }
  },

  components: {
    BarCharHover
  },

  data() {
    return {
      marginTop: 30,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 100,

      isFocused: false,
      focusedElem: undefined
    }
  },

  methods: {
    onMouseover(event, item) {
      this.focusedElem = item
      this.isFocused = true
    },

    onMouseleave() {
      // this.isFocused = false
      // this.focusedElem = undefined
    }
  },

  directives: {
    axis(el, binding) {
      const axis = binding.arg
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis]
      const methodArg = binding.value[axis]
      const height = binding.value['height']

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(d3.axisBottom(methodArg).tickFormat((y) => (y * 1).toFixed()))
          .call((g) => g.select('.domain').remove())
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg).ticks(height / 80, '%'))
          .call((g) => g.select('.domain').remove())
      }
    }
  },

  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.elementHeight}`
    },

    elementHeight() {
      return Math.ceil((this.items.length + 0.1) * this.barHeight) + this.marginTop + this.marginBottom
    },

    x() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.items, (d) => d.value)])
        .range([this.marginLeft, this.width - this.marginRight])
    },

    y() {
      return d3
        .scaleBand()
        .domain(d3.sort(this.items, (d) => d.value).map((d) => d.key))
        .rangeRound([this.marginTop, this.elementHeight - this.marginBottom])
        .padding(0.1)
    },

    rects() {
      let result = []

      this.items.forEach((d) => {
        const width = this.x(d.value) - this.x(0)
        const height = this.y.bandwidth()
        const y = this.y(d.key)
        const x = this.x(0)

        result.push({
          raw: d,
          x: x,
          y: y,
          width: width,
          height: height,

          textX: this.x(d.value),
          textY: y + height / 2,
          text: d.value,

          tooltipYPos: `${y + height + 5}px`,
          tooltipXPos: `${x}px`
        })
      })

      return result
    }
  }
}
</script>
