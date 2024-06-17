<template>
  <div>
    <ul class="legend">
      <li class="legend__box" v-for="(arc, idx) in areas" :key="`inf_${idx}`" @mouseover="() => onMouseover(arc)" @mouseleave="onMouseleave">
        <div class="legend__dot" :style="{ 'background-color': colors(arc.title) }"></div>
        {{ arc.title }}
      </li>
    </ul>

    <svg :width="width" :height="height" :viewBox="viewBox">
      <g>
        <path
          v-for="item in areas"
          :fill="item.fill"
          :d="item.d"
          :key="item.fill"
          :opacity="isFocused && item.title !== focusedElem.title ? 0.4 : 1"
          @mouseover="() => onMouseover(item)"
          @mouseleave="onMouseleave"
        ></path>
      </g>

      <g fill="none" v-axis:x="{ x, height }" :transform="`translate(0, ${height - marginBottom})`"></g>
      <g fill="none" v-axis:y="{ y, height }" :transform="`translate(${marginLeft}, 0)`"></g>
    </svg>

    <div ref="test"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

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
    height: {
      default: 270,
      type: Number
    }
  },

  data() {
    return {
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 40,

      isFocused: false,
      focusedElem: undefined
    }
  },

  computed: {
    viewBox() {
      // return [-this.width / 2, -this.height / 2, this.width, this.height];
      return `0 0 ${this.width} ${this.height}`
    },

    x() {
      return d3
        .scaleUtc()
        .domain(d3.extent(this.items, (d) => d.cycle))
        .range([this.marginLeft, this.width - this.marginRight])
    },

    y() {
      return d3.scaleLinear().rangeRound([this.height - this.marginBottom, this.marginTop])
    },

    series() {
      // if(!this.items) return []
      return d3
        .stack()
        .offset(d3.stackOffsetExpand)
        .keys(d3.union(this.items.map((d) => d.format))) // distinct series keys, in input order
        .value(([, D], key) => D.get(key).value)(
        // get value for each series key and stack
        d3.index(
          this.items,
          (d) => d.cycle,
          (d) => d.format
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
        .x((d) => this.x(d.data[0]))
        .y0((d) => this.y(d[0]))
        .y1((d) => this.y(d[1]))
    },

    areas() {
      let result = []

      this.series.forEach((elem) => {
        result.push({
          d: this.area(elem),
          fill: this.colors(elem.key),
          title: elem.key
        })
      })

      return result
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

  methods: {
    onMouseover(item) {
      this.focusedElem = item
      this.isFocused = true
    },

    onMouseleave() {
      this.isFocused = false
      this.focusedElem = undefined
    }
  }
}
</script>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
}

.legend__box {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.legend__dot {
  height: 12px;
  width: 12px;
  border-radius: 6px;
  margin-right: 12px;
}
</style>
