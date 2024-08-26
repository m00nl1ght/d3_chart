<template>
  <div>
    <div class="d-flex justify-center app-text-family--bold">
      {{ $t('analyticMetadata.answers').toUpperCase() }}
    </div>
    <ul class="legend pl-0 justify-center">
      <li
        v-for="(arc, idx) in areas"
        :key="`inf_${idx}`"
        class="legend__box"
        @mouseover="() => onMouseover(arc)"
        @mouseleave="onMouseleave"
      >
        <div class="legend__dot" :style="{'background-color': getColor(arc.value)}"></div>
        {{ arc.title }}
      </li>
    </ul>
    <div class="d-flex justify-center">
      <svg :width="width" :height="height" :viewBox="viewBox" class="chart">
        <g v-for="item in areas" :key="item.fill">
          <path :fill="item.fill" :d="item.d"></path>
        </g>

        <g v-for="item in areas" :key="`key_${item.fill}`">
          <path :d="item.linePath" style="fill: none" :stroke="'#47D3DE'" stroke-width="3"></path>
          <circle
            v-for="(circle, i) in item.lineDots"
            :key="`${item[0]}_${i}`"
            r="6"
            class="dot"
            :cx="circle.cx"
            :cy="circle.cy"
            :color="'#47D3DE'"
          ></circle>
        </g>
        <g
          v-axis:x="{x: xScale, height, ticks}"
          fill="none"
          :transform="`translate(0, ${height - marginBottom})`"
        ></g>

        <g
          v-axis:y="{y: yScale, height, lineWidth: width - marginLeft - marginRight}"
          fill="none"
          :transform="`translate(${marginLeft}, 0)`"
        ></g>
      </svg>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3';

/* <path
          :fill="item.fill"
          :d="item.d"
          :opacity="isFocused && item.title !== focusedElem.title ? 0.4 : 1"
        ></path> */
export default {
  directives: {
    axis(el, binding) {
      const axis = binding.arg;
      const axisMethod = {x: 'axisBottom', y: 'axisLeft'}[axis];
      const methodArg = binding.value[axis];
      const height = binding.value['height'];
      const ticks = binding.value['ticks'];
      const lineWidth = binding.value['lineWidth'];

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(d3.axisBottom(methodArg).ticks(ticks))
          .call((g) => g.select('.domain').remove());
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg).ticks(height / 80, '%'))
          .call((g) =>
            g
              .selectAll('.tick line')
              .clone()
              .attr('x2', lineWidth)
              .attr('stroke-opacity', 0.3)
              .attr('stroke-dasharray', 5, 5)
          )
          .call((g) => g.select('.domain').remove());
      }
    },
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    width: {
      default: 500,
      type: Number,
    },
    height: {
      default: 270,
      type: Number,
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    countKey: {
      type: String,
      default: 'count',
    },
  },

  data() {
    return {
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 40,

      isFocused: false,
      focusedElem: undefined,

      colorMap: {
        positive_answer: '#88bf4d',
        loyal_answer: '#f9d45c',
        skeptic_answer: '#f2a86f',
        neutral_answer: '#f2a86f',
        negative_answer: '#ef8c8c',

        extremely_low_expression: '#88bf4d',
        low_expression: '#f9d45c',
        medium_expression: '#f2a86f',
        high_expression: '#ef8c8c',
        extremely_high_expression: '#ef5350',

        extremely_high_prof_efficiency: '#88bf4d',
        high_prof_efficiency: '#f2a86f',
        medium_prof_efficiency: '#f9d45c',
        low_prof_efficiency: '#ef8c8c',
      },
      // colorMap: {
      //   positive_answer: '#dcecca',
      //   loyal_answer: '#fef3cf',
      //   skeptic_answer: '#fce5d4',
      //   negative_answer: '#fadcdc',
      // },
    };
  },

  computed: {
    viewBox() {
      // return [-this.width / 2, -this.height / 2, this.width, this.height];
      return `0 0 ${this.width} ${this.height}`;
    },

    xDomain() {
      const domain = d3.extent(this.items, (d) => d.cycle);
      return [domain[0] - 0.5, domain[1] + 0.5];
    },

    ticks() {
      return this.xDomain[1] - this.xDomain[0];
    },

    xScale() {
      return d3
        .scaleLinear()
        .domain(this.xDomain)
        .range([this.marginLeft, this.width - this.marginRight]);
    },

    yScale() {
      return d3.scaleLinear().rangeRound([this.height - this.marginBottom, this.marginTop]);
    },

    series() {
      // if(!this.items) return []
      return d3
        .stack()
        .offset(d3.stackOffsetExpand)
        .keys(
          d3.union(
            this.items.map((d) => {
              return d[this.valueKey];
            })
          )
        ) // distinct series keys, in input order
        .value(([, D], key) => {
          return D.get(key) ? D.get(key)[this.countKey] : 0;
        })(
        // get value for each series key and stack
        d3.index(
          this.items,
          (d) => d.cycle,
          (d) => d[this.valueKey]
        )
      ); // group by stack then series key
    },

    colors() {
      return d3
        .scaleOrdinal()
        .domain(this.series.map((d) => d.key))
        .range(d3.schemeTableau10);
    },

    area() {
      return d3
        .area()
        .x((d) => this.xScale(d.data[0]))
        .y0((d) => this.yScale(d[0]))
        .y1((d) => this.yScale(d[1]));
    },

    line() {
      return d3
        .line()
        .x((d) => this.xScale(d.data[0]))
        .y((d) => this.yScale(d[1]));
    },

    areas() {
      let result = [];

      this.series.forEach((elem) => {
        result.push({
          d: this.area(elem),
          fill: this.getColor(elem.key),
          title: this.$t(`analyticMetadata.chartsData.${elem.key}`),
          value: elem.key,
          linePath: this.line(elem),
          lineDots: elem.map((el) => {
            return {
              cx: this.xScale(el.data[0]),
              cy: this.yScale(el[1]),
            };
          }),
        });
      });

      return result;
    },
  },

  methods: {
    onMouseover(item) {
      console.log(item);
      this.focusedElem = item;
      this.isFocused = true;
    },

    onMouseleave() {
      this.isFocused = false;
      this.focusedElem = undefined;
    },

    getColor(key) {
      if (key && key in this.colorMap) return this.colorMap[key];
      return this.colors(key);
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
  pointer-events: auto;
  stroke-width: 1;
}

.chart::v-deep .dot {
  cursor: pointer;
  /* r: 3.5px !important; */
  stroke-width: 3px;
  stroke: currentColor;
  fill: white;
}

.legend {
  display: flex;
  flex-wrap: wrap;
}

.legend__box {
  display: flex;
  align-items: center;
  margin-right: 12px;
  // cursor: pointer;
}

.legend__dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  margin-right: 12px;
}
</style>
