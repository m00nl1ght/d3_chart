<template>
  <div>
    <div>
      <svg :width="width" :height="elementHeight" :viewBox="viewBox">
        <g v-for="(rect, idx) in rects" :key="`rect_${idx}`">
          <rect
            :fill="color"
            :x="rect.x"
            :y="rect.y"
            :width="rect.width"
            :height="rect.height"
            :opacity="isFocused && rect.y !== focusedElem.y ? 0.4 : 1"
            @mouseover="() => onMouseover(rect)"
            @mouseleave="() => onMouseleave(rect)"
          />

          <text :x="rect.textX" :y="rect.textY" dy="0.35em" dx="5">{{ rect.text }}</text>
        </g>

        <g fill="none" v-axis:x="{ x, elementHeight }" :transform="`translate(0, ${elementHeight - marginBottom})`"></g>

        <g fill="none" v-axis:y="{ y, elementHeight }" :transform="`translate(${marginLeft}, 0)`"></g>
      </svg>

      <BarCharHover v-if="isFocused && focusedElem" :style="`transform: translate(0px, ${focusedElem.tooltipYPos})`">
        <div>
          <div>{{ focusedElem }}</div>
          <div>elementHeight:{{ elementHeight }}</div>
          <!-- <div>x: {{ position.x }}</div>
        <div>y: {{ position.y }}</div> -->
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
      // barHeight: 50,
      marginTop: 30,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 100,

      isFocused: false,
      focusedElem: undefined
    }
  },

  methods: {
    onMouseover(item) {
      this.focusedElem = item
      this.isFocused = true
    },

    onMouseleave(item) {
      this.isFocused = false
      this.focusedElem = undefined
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

      // return d3
      //   .scaleUtc()
      //   .domain(d3.extent(this.items, (d) => d.cycle))
      //   .range([this.marginLeft, this.width - this.marginRight])
    },

    y() {
      return d3
        .scaleBand()
        .domain(d3.sort(this.items, (d) => d.value).map((d) => d.key))
        .rangeRound([this.marginTop, this.elementHeight - this.marginBottom])
        .padding(0.1)

      // return d3.scaleLinear().rangeRound([this.height - this.marginBottom, this.marginTop])
    },

    // svg
    //   .append('g')
    //   .attr('fill', 'steelblue')
    //   .selectAll()
    //   .data(alphabet)
    //   .join('rect')
    //   .attr('x', x(0))
    //   .attr('y', (d) => y(d.key))
    //   .attr('width', (d) => x(d.value) - x(0))
    //   .attr('height', y.bandwidth())
    rects() {
      let result = []

      this.items.forEach((d) => {
        result.push({
          raw: d,
          x: this.x(0),
          y: this.y(d.key),
          width: this.x(d.value) - this.x(0),
          height: this.y.bandwidth(),

          textX: this.x(d.value),
          textY: this.y(d.key) + this.y.bandwidth() / 2,
          text: d.value,

          tooltipYPos: `-${this.elementHeight - this.y(d.key) + 10}px`

          //  .attr('x', (d) => x(d.value))
          // .attr('y', (d) => y(d.key) + y.bandwidth() / 2)
          // .attr('dy', '0.35em')
          // .attr('dx', -4)
          // .text((d) => format(d.value))
        })
      })

      console.log('result', result)
      return result
    }
  },

  mounted() {
    // Specify the chart’s dimensions, based on a bar’s height.
    const barHeight = 50
    const marginTop = 30
    const marginRight = 0
    const marginBottom = 10
    const marginLeft = 30
    const width = 928
    const alphabet = this.items
    const height = Math.ceil((this.items.length + 0.1) * barHeight) + marginTop + marginBottom

    // Create the scales.
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(this.items, (d) => d.value)])
      .range([marginLeft, width - marginRight])

    const y = d3
      .scaleBand()
      .domain(d3.sort(this.items, (d) => d.value).map((d) => d.key))
      .rangeRound([marginTop, height - marginBottom])
      .padding(0.1)

    // Create a value format.
    const format = x.tickFormat(20, '%')

    // Create the SVG container.
    const svg = d3
      .create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;')

    // Append a rect for each key.
    svg
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll()
      .data(alphabet)
      .join('rect')
      .attr('x', x(0))
      .attr('y', (d) => y(d.key))
      .attr('width', (d) => x(d.value) - x(0))
      .attr('height', y.bandwidth())

    // Append a label for each key.
    svg
      .append('g')
      .attr('fill', 'white')
      .attr('text-anchor', 'end')
      .selectAll()
      .data(alphabet)
      .join('text')
      .attr('x', (d) => x(d.value))
      .attr('y', (d) => y(d.key) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('dx', -4)
      .text((d) => format(d.value))
      .call((text) =>
        text
          .filter((d) => x(d.value) - x(0) < 20) // short bars
          .attr('dx', +4)
          .attr('fill', 'black')
          .attr('text-anchor', 'start')
      )

    // Create the axes.
    svg
      .append('g')
      .attr('transform', `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(width / 80, '%'))
      .call((g) => g.select('.domain').remove())

    svg.append('g').attr('transform', `translate(${marginLeft},0)`).call(d3.axisLeft(y).tickSizeOuter(0))

    // svg.node();
    console.log('svg.node()', svg.node())
    this.$refs.test.append(svg.node())
  }
}
</script>
