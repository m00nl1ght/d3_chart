<template>
  <div class="d-flex flex-column align-center">
    <div class="mb-2">
      <ul class="d-flex">
        <li v-for="item in colorMapping" :key="item.color" class="d-flex align-center">
          <div class="cyrcle-box mr-1 ml-3" :style="`background-color: ${item.color}`"></div>
          {{ item.title }}
        </li>
      </ul>
    </div>

    <div>
      <svg
        v-if="series && series.length > 0"
        :width="width"
        :height="height"
        :viewBox="viewBox"
        class="chart"
        style="max-width: 100%; height: auto; font: 10px sans-serif"
      >
        <g v-for="item in chartData.items" :key="item.key" :fill="item.color">
          <rect
            v-for="(r, idx) in item.rects"
            :key="`${item.key}_rect_${idx}`"
            :x="r.x"
            :y="r.y"
            :height="r.height"
            :width="r.width"
          ></rect>

          <text
            v-for="(r, idx) in item.rects"
            :key="`${item.key}_text_${idx}`"
            :x="r.x"
            :y="yScale(chartData.total[idx])"
          >
            {{ chartData.total ? chartData.total[idx] : 0 }}
          </text>
        </g>

        <g
          v-axis:x="{x: xScale}"
          fill="none"
          :transform="`translate(0, ${height - marginBottom})`"
        ></g>

        <g
          v-axis:y="{y: yScale, lineWidth: width - marginLeft - marginRight}"
          fill="none"
          :transform="`translate(${marginLeft}, 0)`"
          style="font: 10px sans-serif"
        ></g>
      </svg>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3';

export default {
  directives: {
    axis(el, binding) {
      const axis = binding.arg;
      const axisMethod = {x: 'axisBottom', y: 'axisLeft'}[axis];
      const methodArg = binding.value[axis];
      const lineWidth = binding.value['lineWidth'];

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(d3.axisBottom(methodArg))
          .call((g) => g.select('.domain').remove())
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('transform', 'rotate(-65)');
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg).ticks(null, 's').tickSizeOuter(0))
          .call((g) =>
            g
              .selectAll('.tick line')
              .clone()
              .attr('x2', lineWidth)
              .attr('stroke-opacity', 0.1)
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
      default: 900,
      type: Number,
    },
    height: {
      default: 470,
      type: Number,
    },
  },

  data() {
    return {
      marginTop: 10,
      marginRight: 10,
      marginBottom: 60,
      marginLeft: 30,

      colorMapping: {
        0: {
          color: '#E75454',
          title: 'Очень тревожное',
        },
        1: {
          color: '#EF8C8C',
          title: '1',
        },
        2: {
          color: '#F2A86F',
          title: '2',
        },
        3: {
          color: '#FBE499',
          title: '3',
        },
        4: {
          color: '#A7D07C',
          title: '4',
        },
        5: {
          color: '#689636',
          title: 'Отличное',
        },
      },
    };
  },

  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },

    series() {
      let series = d3
        .stack()
        .keys(d3.union(this.items.map((d) => d.text_value))) // distinct series keys, in input order
        .value(([, D], key) => (D.get(key) ? D.get(key)['count'] : 0))(
        d3.index(
          this.items,
          (d) => d.lastdate,
          (d) => d.text_value
        )
      ); // group by stack then series key

      const res = series.map((D) => {
        const resultArr = D.map((d) => {
          return (d.key = D.key), d;
        });
        resultArr.key = D.key;
        return resultArr;
      });

      return res;
    },

    chartData() {
      if (!this.series || this.series.length === 0) return {item: []};

      let total = {};
      const items = this.series.map((s) => {
        return {
          key: `key_${this.getColor(s.key)}`,
          color: this.getColor(s.key),
          rects: s.map((r, idx) => {
            if (!total[idx] || r[1] > total[idx]) total[idx] = r[1];

            return {
              x: this.xScale(r.data[0]),
              y: this.yScale(r[1]),
              height: this.yScale(r[0]) - this.yScale(r[1]),
              width: this.xScale.bandwidth(),
            };
          }),
        };
      });

      return {
        items,
        total,
      };
    },

    xScale() {
      return d3
        .scaleBand()
        .domain(this.items.map((d) => d.lastdate))
        .range([this.marginLeft, this.width - this.marginRight])
        .padding(0.1);
    },

    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.series, (d) => d3.max(d, (d) => d[1]))])
        .range([this.height - this.marginBottom, this.marginTop]);
    },

    colors() {
      return d3
        .scaleOrdinal()
        .domain(this.series.map((d) => d.key))
        .range(d3.schemeSpectral[this.series.length])
        .unknown('#ccc');
    },
  },

  methods: {
    getColor(key) {
      if (key && key in this.colorMapping) return this.colorMapping[key].color;
      return this.colors(key);
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
  stroke-width: 1;
}

.cyrcle-box {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
</style>
