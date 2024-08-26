<template>
  <div>
    <div>Вариант с равными интервалами по Х</div>
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

      <g
        v-axis:x="{x: xScale, height}"
        fill="none"
        :transform="`translate(0, ${height - marginBottom})`"
      ></g>

      <g
        v-axis:y="{y: yScale, height, lineWidth: width - marginLeft - marginRight}"
        fill="none"
        :transform="`translate(${marginLeft}, 0)`"
        class="item-title"
      ></g>
    </svg>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3';
import {getFormattedDate} from '@/helpers/utils';

export default {
  directives: {
    axis(el, binding) {
      const axis = binding.arg;
      const axisMethod = {x: 'axisBottom', y: 'axisLeft'}[axis];
      const methodArg = binding.value[axis];
      const lineWidth = binding.value['lineWidth'];

      // const formatTime = d3.utcFormat('%B %d, %Y');
      // const parseTime = d3.timeParse('%Y-%m-%d');

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(
            d3
              .axisBottom(methodArg)
              .tickFormat((y) => getFormattedDate(y))
              .ticks(5)
          )
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('transform', 'rotate(-65)');
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg).ticks(10))
          .call((g) =>
            g
              .selectAll('.tick line')
              .clone()
              .attr('x2', lineWidth)
              .attr('stroke-opacity', 0.1)
              .attr('stroke-dasharray', 5, 5)
          );
      }
    },
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    width: {
      default: 900,
      type: Number,
    },
    height: {
      default: 350,
      type: Number,
    },
  },

  data() {
    return {
      marginLeft: 50,
      marginTop: 30,
      marginBottom: 60,
      marginRight: 20,
    };
  },

  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },

    parsedData() {
      // const parseTime = d3.timeParse('%Y-%m-%d');

      return this.items.map((item) => ({
        // xVal: parseTime(item.lastdate),
        xVal: item.lastdate,
        yVal: item.avg,
      }));
    },

    xScale() {
      return d3
        .scalePoint()
        .domain(
          this.parsedData.map((d) => d.xVal),
          [0, 960]
        )
        .rangeRound([this.marginLeft, this.width - this.marginRight]);
      // return d3
      //   .scaleTime()
      //   .domain(d3.extent(this.parsedData, (v) => v.xVal))
      //   .range([this.marginLeft, this.width - this.marginRight]);
    },

    yScale() {
      return d3
        .scaleLinear()
        .domain([0, 5])
        .range([this.height - this.marginBottom, this.marginTop]);
    },

    line() {
      return d3
        .line()
        .x((d) => {
          return this.xScale(d.xVal);
        })
        .y((d) => this.yScale(d.yVal))
        .curve(d3.curveCatmullRom.alpha(0.5));
    },

    dLine() {
      if (!this.line(this.parsedData)) return '';

      const lineValues = this.line(this.parsedData).slice(1);
      const splitedValues = lineValues.split(',');
      return `M0,${this.height},${lineValues},l0,${
        this.height - splitedValues[splitedValues.length - 1]
      }`;
    },

    area() {
      return d3
        .area()
        .x((d) => this.xScale(d.xVal))
        .y0(this.yScale(0))
        .y1((d) => this.yScale(d.yVal))
        .curve(d3.curveCatmullRom.alpha(0.5));
    },

    areaPath() {
      return this.area(this.parsedData);
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
  stroke-width: 1;
}
</style>
