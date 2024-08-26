<template>
  <div>
    <!-- <div id="line-chart"></div> -->

    <svg :width="width" :height="height" :viewBox="viewBox" class="chart">
      <defs>
        <linearGradient id="gradient" :x1="0" y1="100%" :x2="0" y2="0%">
          <stop offset="0%" style="stop-color: #bbf6ca; stop-opacity: 0.05"></stop>
          <stop offset="100%" style="stop-color: #bbf6ca; stop-opacity: 0.5"></stop>
        </linearGradient>
      </defs>

      <g fill="none">
        <path :d="areaPath" style="fill: url('#gradient')"></path>
        <path :d="line(parsedData)" style="fill: none" stroke="#47D3DE" stroke-width="2"></path>
      </g>

      <circle
        v-for="(item, idx) in parsedData"
        :key="`tick_${idx}`"
        r="4px"
        :cy="yScale(item.yVal)"
        :cx="xScale(item.xVal)"
        style="fill: rgb(114, 185, 255)"
      ></circle>

      <g v-axis:x="{ x: xScale, height }" fill="none" :transform="`translate(0, ${height - marginBottom})`"></g>

      <g
        v-axis:y="{ y: yScale, height, lineWidth: width - marginLeft - marginRight }"
        fill="none"
        :transform="`translate(${marginLeft}, 0)`"
        class="item-title"
      ></g>
    </svg>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'

export default {
  directives: {
    axis(el, binding) {
      const axis = binding.arg
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis]
      const methodArg = binding.value[axis]
      const lineWidth = binding.value['lineWidth']

      const formatTime = d3.utcFormat('%B %d, %Y')
      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(
            d3
              .axisBottom(methodArg)
              .tickFormat((y) => formatTime(y))
              .ticks(5)
          )
          .selectAll('text')
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg).ticks(5))
          .call((g) => g.selectAll('.tick line').clone().attr('x2', lineWidth).attr('stroke-opacity', 0.1).attr('stroke-dasharray', 5, 5))
      }
    }
  },

  props: {
    // items: {
    //   type: Array,
    //   default: () => []
    // },
    width: {
      default: 900,
      type: Number
    },
    height: {
      default: 350,
      type: Number
    }
  },

  data() {
    return {
      marginLeft: 50,
      marginTop: 30,
      marginBottom: 60,
      marginRight: 20,

      items: [
        {
          avg: 3.59,
          lastdate: '2023-07-24'
        },
        {
          avg: 3.56,
          lastdate: '2023-07-26'
        },
        {
          avg: 3.63,
          lastdate: '2023-07-31'
        },
        {
          avg: 3.52,
          lastdate: '2023-08-09'
        },
        {
          avg: 4,
          lastdate: '2023-08-14'
        },
        {
          avg: 3.86,
          lastdate: '2023-08-16'
        },
        {
          avg: 3.81,
          lastdate: '2023-08-21'
        },
        {
          avg: 3.76,
          lastdate: '2023-08-23'
        },
        {
          avg: 3.37,
          lastdate: '2023-08-28'
        },
        {
          avg: 3,
          lastdate: '2023-08-31'
        },
        {
          avg: 4,
          lastdate: '2023-11-20'
        },
        {
          avg: 3.52,
          lastdate: '2023-11-22'
        },
        {
          avg: 3.92,
          lastdate: '2023-11-24'
        },
        {
          avg: 4.33,
          lastdate: '2023-12-01'
        },
        {
          avg: 3.58,
          lastdate: '2023-12-04'
        },
        {
          avg: 3.81,
          lastdate: '2023-12-06'
        },
        {
          avg: 3.86,
          lastdate: '2023-12-08'
        },
        {
          avg: 3.59,
          lastdate: '2023-12-11'
        },
        {
          avg: 4,
          lastdate: '2023-12-12'
        },
        {
          avg: 3.68,
          lastdate: '2023-12-13'
        }
      ]
    }
  },

  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },

    parsedData() {
      const parseTime = d3.timeParse('%Y-%m-%d')
      // const parseTime = d3.time.format("%Y-%m-%d").parse;

      return this.items.map((item) => ({
        xVal: parseTime(item.lastdate),
        yVal: item.avg
      }))
    },

    xScale() {
      return d3
        .scaleTime()
        .domain(d3.extent(this.parsedData, (v) => v.xVal))
        .range([this.marginLeft, this.width - this.marginRight])
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

  mounted() {
    const lineChartData = [
      {
        currency: 'USD',
        values: [
          {
            date: '2018/01/01',
            close: 230
          },
          {
            date: '2018/02/01',
            close: 269
          },
          {
            date: '2018/03/01',
            close: 234
          },
          {
            date: '2018/04/01',
            close: 282
          },
          {
            date: '2018/05/01',
            close: 231
          },
          {
            date: '2018/06/01',
            close: 240
          },
          {
            date: '2018/07/01',
            close: 213
          },
          {
            date: '2018/08/01',
            close: 320
          },
          {
            date: '2018/09/01',
            close: 253
          },
          {
            date: '2018/10/01',
            close: 264
          },
          {
            date: '2018/11/01',
            close: 272
          },
          {
            date: '2018/12/01',
            close: 290
          }
        ]
      }
    ]

    const margin = {
      top: 20,
      bottom: 20,
      left: 50,
      right: 20
    }

    const width = 700 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const createGradient = (select) => {
      const gradient = select
        .select('defs')
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%')

      gradient.append('stop').attr('offset', '0%').attr('style', 'stop-color:#BBF6CA;stop-opacity:0.05')

      gradient.append('stop').attr('offset', '100%').attr('style', 'stop-color:#BBF6CA;stop-opacity:.5')
    }

    const createGlowFilter = (select) => {
      const filter = select.select('defs').append('filter').attr('id', 'glow')

      filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur')

      const femerge = filter.append('feMerge')

      femerge.append('feMergeNode').attr('in', 'coloredBlur')
      femerge.append('feMergeNode').attr('in', 'SourceGraphic')
    }
    // const svg = null;

    const svg = d3
      .select('#line-chart')
      .append('svg')
      .attr('width', 700 + margin.left + margin.right)
      .attr('height', 300 + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    svg.append('defs')
    svg.call(createGradient)
    svg.call(createGlowFilter)

    const parseTime = d3.timeParse('%Y/%m/%d')

    const parsedData = lineChartData.map((company) => ({
      ticker: company.ticker,
      values: company.values.map((val) => ({
        close: val.close,
        date: parseTime(val.date)
      }))
    }))
    // console.log('parsedData', parsedData);

    const xScale = d3
      .scaleTime()
      .domain([d3.min(parsedData, (d) => d3.min(d.values, (v) => v.date)), d3.max(parsedData, (d) => d3.max(d.values, (v) => v.date))])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(parsedData, (d) => d3.min(d.values, (v) => v.close)), d3.max(parsedData, (d) => d3.max(d.values, (v) => v.close))])
      .range([height, 0])

    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.close))
      .curve(d3.curveCatmullRom.alpha(0.5))

    svg
      .selectAll('.line')
      .data(parsedData)
      .enter()
      .append('path')
      .attr('d', (d) => {
        const lineValues = line(d.values).slice(1)
        const splitedValues = lineValues.split(',')

        return `M0,${height},${lineValues},l0,${height - splitedValues[splitedValues.length - 1]}`
      })
      .style('fill', 'url(#gradient)')

    svg
      .selectAll('.line')
      .data(parsedData)
      .enter()
      .append('path')
      .attr('d', (d) => line(d.values))
      .attr('stroke-width', '2')
      .style('fill', 'none')
      .style('filter', 'url(#glow)')
      .attr('stroke', '#47D3DE')

    function setFade(selection, opacity) {
      selection.style('opacity', opacity)
    }

    const tick = svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(12))
      .selectAll('.tick')
      .style('transition', '.2s')

    tick.selectAll('line').attr('stroke-dasharray', `5, 5`).attr('stroke', '#ccc').attr('y2', `-${height}px`)

    tick
      .append('rect')
      .attr('width', `${width / 12 + 10}px`)
      .attr('x', `-${width / 24 + 5}px`)
      .attr('y', `-${height}px`)
      .attr('height', `${height + 30}px`)
      .style('cursor', 'pointer')
      .style('fill', 'transparent')

    svg
      .selectAll('.tick')
      .append('circle')
      .attr('r', '4px')
      .style('fill', '#72B9FF')
      .attr('cy', (x, i) => -height + yScale(parsedData[0].values[i].close))

    tick
      .on('mouseout', function (data, index, elements) {
        d3.selectAll(elements).call(setFade, 1)
      })
      .on('mouseover', function (data, index, elements) {
        d3.selectAll(elements).filter(':not(:hover)').call(setFade, 0.2)
      })

    svg.select('.domain').attr('stroke', '#ddd')
  }
}
</script>
