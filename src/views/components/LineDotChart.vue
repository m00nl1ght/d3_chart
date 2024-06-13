<template>
  <div style="width: 100%">
    <svg ref="test" :width="width" :height="height" :viewBox="viewBox"></svg>
    <div></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  props: {
    width: {
      default: 700,
      type: Number
    },
    height: {
      default: 350,
      type: Number
    }
  },

  data() {
    return {
      items: [
        { year: 2016, media: 'Digital', spending: 72.2 },
        { year: 2017, media: 'Digital', spending: 90.39 },
        { year: 2018, media: 'Digital', spending: 107.3 },
        { year: 2019, media: 'Digital', spending: 125.75 },
        { year: 2020, media: 'Digital', spending: 142.23 },
        { year: 2021, media: 'Digital', spending: 156.43 },
        { year: 2022, media: 'Digital', spending: 170.48 },
        { year: 2016, media: 'TV', spending: 71.29 },
        { year: 2017, media: 'TV', spending: 70.22 },
        { year: 2018, media: 'TV', spending: 69.87 },
        { year: 2019, media: 'TV', spending: 69.17 },
        { year: 2020, media: 'TV', spending: 69.52 },
        { year: 2021, media: 'TV', spending: 68.82 },
        { year: 2022, media: 'TV', spending: 68.13 },
        { year: 2016, media: 'Print', spending: 25.49 },
        { year: 2017, media: 'Print', spending: 22.81 },
        { year: 2018, media: 'Print', spending: 20.05 },
        { year: 2019, media: 'Print', spending: 17.29 },
        { year: 2020, media: 'Print', spending: 15.19 },
        { year: 2021, media: 'Print', spending: 13.56 },
        { year: 2022, media: 'Print', spending: 12.38 },
        { year: 2016, media: 'Radio', spending: 14.33 },
        { year: 2017, media: 'Radio', spending: 14.33 },
        { year: 2018, media: 'Radio', spending: 14.41 },
        { year: 2019, media: 'Radio', spending: 14.43 },
        { year: 2020, media: 'Radio', spending: 14.46 },
        { year: 2021, media: 'Radio', spending: 14.49 },
        { year: 2022, media: 'Radio', spending: 14.52 },
        { year: 2016, media: 'Out-of-home', spending: 7.6 },
        { year: 2017, media: 'Out-of-home', spending: 7.75 },
        { year: 2018, media: 'Out-of-home', spending: 7.87 },
        { year: 2019, media: 'Out-of-home', spending: 7.95 },
        { year: 2020, media: 'Out-of-home', spending: 8.03 },
        { year: 2021, media: 'Out-of-home', spending: 8.11 },
        { year: 2022, media: 'Out-of-home', spending: 8.19 },
        { year: 2016, media: 'Directories', spending: 2.35 },
        { year: 2017, media: 'Directories', spending: 1.83 },
        { year: 2018, media: 'Directories', spending: 1.47 },
        { year: 2019, media: 'Directories', spending: 1.19 },
        { year: 2020, media: 'Directories', spending: 0.99 },
        { year: 2021, media: 'Directories', spending: 0.84 },
        { year: 2022, media: 'Directories', spending: 0.74 }
      ],

      leftMargin: 70,
      topMargin: 30
    }
  },

  computed: {
    parsedItems() {
      let parseTime = d3.timeParse('%Y')

      return this.items.map((d) => {
        return {
          ...d,
          year: parseTime(d.year)
        }
      })
    },
    //     var ;

    // data.forEach(function (d) {
    //     d.year = parseTime(d.year);
    // });
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },

    xScale() {
      return d3
        .scaleTime()
        .domain(d3.extent(this.parsedItems, (d) => d.year))
        .range([this.leftMargin, 900])
    },

    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.parsedItems, (d) => d.spending) + this.topMargin])
        .range([this.height - 50, 0])
    },

    series() {
      return d3.group(this.parsedItems, (d) => d.media)
    },
    // series() {
    //   return d3
    //     .stack()
    //     .offset(d3.stackOffsetExpand)
    //     .keys(d3.union(this.items.map((d) => d.media))) // distinct series keys, in input order
    //     .value(([, D], key) => D.get(key).spending)(
    //     // get value for each series key and stack
    //     d3.index(
    //       this.items,
    //       (d) => d.spending,
    //       (d) => d.media
    //     )
    //   ) // group by stack then series key
    // },

    colors() {
      return ['#f9d45c', '#ef8c8c', '#88bf4d', '#4269d0'] //colors from metabase
      // return d3
      //   .scaleOrdinal()
      //   .domain(this.series.map((d) => d.key))
      //   .range(colorbrewer.Set2[6])
    }
  },

  methods: {
    createLinePath(d) {
      let res = d3
        .line()
        .x((d) => this.xScale(d.year))
        .y((d) => this.yScale(d.spending))
        .curve(d3.curveCardinal)(d[1])

      return res
    }
  },

  mounted() {
    let xAxis = d3.axisBottom().scale(this.xScale)

    d3.select(this.$refs.test)
      .append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,320)')
      .call(xAxis)
      .append('text')
      .attr('x', (900 + 70) / 2) //middle of the xAxis
      .attr('y', '50') // a little bit below xAxis
      .text('Year')

    let yAxis = d3.axisLeft().scale(this.yScale).ticks(10)

    d3.select(this.$refs.test)
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${this.leftMargin},20)`) //use variable in translate
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', '-150')
      .attr('y', '-50')
      .attr('text-anchor', 'end')
      .text('US Media Ad Spending (Billions)')

    d3.select(this.$refs.test)
      .selectAll('.line')
      .append('g')
      .attr('class', 'line')
      .data(this.series)
      .enter()
      .append('path')
      .attr('d', (d) => this.createLinePath(d))
      .attr('fill', 'none')
      .attr('stroke', this.colors[1])
      .attr('stroke-width', 2)

    //append circle
    d3.select(this.$refs.test)
      .selectAll('circle')
      .append('g')
      .data(this.parsedItems)
      .enter()
      .append('circle')
      .attr('r', 6)
      .attr('cx', (d) => this.xScale(d.year))
      .attr('cy', (d) => this.yScale(d.spending))
      .style('fill', (d) => this.colors[2])
  }
}
</script>

<style scoped>
.axis path {
  stroke: black;
  stroke-width: 2px;
}

.axis line {
  stroke: black;
  stroke-width: 1.5px;
}

.axis text {
  fill: black;
  font-weight: bold;
  font-size: 14px;
  font-family: 'Arial Black', Gadget, sans-serif;
}

.legend text {
  fill: black;
  font-family: 'Arial Black', Gadget, sans-serif;
}
</style>
