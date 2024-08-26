<template>
  <div class="d-flex align-center flex-column">
    <ul class="legend">
      <li v-for="(item, idx) in titles" :key="`inf_${idx}`" class="legend__box">
        <div class="legend__dot" :style="{'background-color': colors[idx]}"></div>
        {{ item }}
      </li>
    </ul>

    <svg :width="width" :height="height" :viewBox="viewBox" class="chart">
      <g v-for="(item, idx) in series" :key="`item_${idx}`">
        <path
          :d="createLinePath(item)"
          style="fill: none"
          :stroke="colors[idx] || '#47D3DE'"
          stroke-width="2"
        ></path>
        <circle
          v-for="(circle, i) in item[1]"
          :key="`${item[0]}_${i}`"
          r="6"
          class="dot"
          :cx="xScale(circle.cycle)"
          :cy="yScale(circle.count)"
          :color="colors[idx] || '#47D3DE'"
        ></circle>
      </g>

      <g
        v-axis:x="{x: xScale, height, ticks}"
        fill="none"
        :transform="`translate(0, ${height - marginBottom})`"
      ></g>
      <g v-axis:y="{y: yScale, height}" fill="none" :transform="`translate(${marginLeft}, 0)`"></g>
    </svg>
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
      const ticks = binding.value['ticks'];

      // const height = binding.value['height'];
      // console.log('axis', axis);
      // console.log('axisMethod', axisMethod);
      // console.log('methodArg', methodArg);

      if (axisMethod === 'axisBottom') {
        d3.select(el).call(d3.axisBottom(methodArg).ticks(ticks));
      } else {
        d3.select(el).call(d3.axisLeft(methodArg));
        // .call((g) => g.select('.domain').remove())
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
      default: 370,
      type: Number,
    },
  },

  data() {
    return {
      AVALIABLE_FIELDS: [
        'depersonalization',
        'emotional_burnout',
        'professional_efficiency',
        'sum_score',
      ],
      titles: [
        this.$t('analyticMetadata.depersonalizationBurnout'),
        this.$t('analyticMetadata.emotionalBurnout'),
        this.$t('analyticMetadata.professionalEfficiency'),
        this.$t('analyticMetadata.summary'),
      ],

      marginLeft: 70,
      marginTop: 30,
      marginBottom: 20,
      marginRight: 20,
    };
  },

  computed: {
    colors() {
      return ['#f9d45c', '#ef8c8c', '#88bf4d', '#4269d0']; //colors from metabase
    },

    parsedItems() {
      const defaultItem = {
        depersonalization: 0,
        emotional_burnout: 0,
        professional_efficiency: 0,
        sum_score: 0,
      };
      const result = {};

      this.items.forEach((item) => {
        if (!(item.cycle in result)) result[item.cycle] = {...defaultItem};
        for (let key in item) {
          if (key in result[item.cycle])
            result[item.cycle][key] = result[item.cycle][key] + item[key];
        }
      });
      let res = [];

      this.AVALIABLE_FIELDS.forEach((group) => {
        for (let key in result) {
          res.push({cycle: key, group, count: result[key][group]});
        }
      });

      return res;
    },

    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },

    xDomain() {
      const domain = d3.extent(this.parsedItems, (d) => d.cycle);
      return [Number(domain[0]) - 0.5, Number(domain[1]) + 0.5];
    },

    ticks() {
      return this.xDomain[1] - this.xDomain[0];
    },

    xScale() {
      return d3
        .scaleLinear()
        .domain(this.xDomain)
        .nice()
        .range([this.marginLeft, this.width - this.marginRight]);
    },

    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.parsedItems, (d) => d.count) + this.marginTop])
        .nice()
        .range([this.height - this.marginBottom, this.marginTop]);
    },

    series() {
      return d3.group(this.parsedItems, (d) => d.group);
    },
  },

  methods: {
    createLinePath(d) {
      let res = d3
        .line()
        .x((d) => this.xScale(d.cycle))
        .y((d) => this.yScale(d.count))
        .curve(d3.curveCardinal)(d[1]);
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
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
}

.legend__dot {
  height: 12px;
  width: 12px;
  border-radius: 6px;
  margin-right: 12px;
}
</style>
