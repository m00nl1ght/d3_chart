<template>
  <div>
    <svg v-if="series && series.length > 0" :width="width" :height="height" :viewBox="viewBox" class="chart">
      <g v-for="item in series" :key="`key_${colors(item.key)}`" :fill="colors(item.key)">
        <rect
          v-for="(r, idx) in item"
          :key="idx"
          :x="xScale(r.data[0])"
          :y="yScale(r[1])"
          :height="yScale(r[0]) - yScale(r[1])"
          :width="xScale.bandwidth()"
          :area-data="r.data[0]"
        ></rect>
      </g>

      <g v-axis:x="{ x: xScale }" fill="none" :transform="`translate(0, ${height - marginBottom})`"></g>
      <g v-axis:y="{ y: yScale }" fill="none" :transform="`translate(${marginLeft}, 0)`"></g>
    </svg>

    <div id="chart"></div>
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

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(d3.axisBottom(methodArg).tickSizeOuter(0))
          .call((g) => g.selectAll('.domain').remove())
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg).ticks(null, 's'))
          .call((g) => g.selectAll('.domain').remove())
      }
    }
  },

  props: {
    // items: {
    //   type: Array,
    //   default: () => [],
    // },
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
      marginTop: 10,
      marginRight: 10,
      marginBottom: 20,
      marginLeft: 40,

      items: [
        {
          count: 1,
          lastdate: '2023-07-24',
          text_value: '0'
        },
        {
          count: 1,
          lastdate: '2023-07-24',
          text_value: '1'
        },
        {
          count: 2,
          lastdate: '2023-07-24',
          text_value: '2'
        },
        {
          count: 7,
          lastdate: '2023-07-24',
          text_value: '3'
        },
        {
          count: 12,
          lastdate: '2023-07-24',
          text_value: '4'
        },
        {
          count: 6,
          lastdate: '2023-07-24',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-07-26',
          text_value: '1'
        },
        {
          count: 2,
          lastdate: '2023-07-26',
          text_value: '2'
        },
        {
          count: 10,
          lastdate: '2023-07-26',
          text_value: '3'
        },
        {
          count: 9,
          lastdate: '2023-07-26',
          text_value: '4'
        },
        {
          count: 5,
          lastdate: '2023-07-26',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-07-27',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-07-31',
          text_value: '1'
        },
        {
          count: 2,
          lastdate: '2023-07-31',
          text_value: '2'
        },
        {
          count: 8,
          lastdate: '2023-07-31',
          text_value: '3'
        },
        {
          count: 11,
          lastdate: '2023-07-31',
          text_value: '4'
        },
        {
          count: 5,
          lastdate: '2023-07-31',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-08-02',
          text_value: '4'
        },
        {
          count: 3,
          lastdate: '2023-08-04',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-08-09',
          text_value: '1'
        },
        {
          count: 3,
          lastdate: '2023-08-09',
          text_value: '2'
        },
        {
          count: 5,
          lastdate: '2023-08-09',
          text_value: '3'
        },
        {
          count: 11,
          lastdate: '2023-08-09',
          text_value: '4'
        },
        {
          count: 3,
          lastdate: '2023-08-09',
          text_value: '5'
        },
        {
          count: 3,
          lastdate: '2023-08-10',
          text_value: '4'
        },
        {
          count: 7,
          lastdate: '2023-08-14',
          text_value: '3'
        },
        {
          count: 12,
          lastdate: '2023-08-14',
          text_value: '4'
        },
        {
          count: 7,
          lastdate: '2023-08-14',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-08-15',
          text_value: '4'
        },
        {
          count: 1,
          lastdate: '2023-08-15',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-08-16',
          text_value: '2'
        },
        {
          count: 6,
          lastdate: '2023-08-16',
          text_value: '3'
        },
        {
          count: 10,
          lastdate: '2023-08-16',
          text_value: '4'
        },
        {
          count: 5,
          lastdate: '2023-08-16',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-08-17',
          text_value: '4'
        },
        {
          count: 2,
          lastdate: '2023-08-17',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-08-21',
          text_value: '0'
        },
        {
          count: 1,
          lastdate: '2023-08-21',
          text_value: '1'
        },
        {
          count: 2,
          lastdate: '2023-08-21',
          text_value: '2'
        },
        {
          count: 6,
          lastdate: '2023-08-21',
          text_value: '3'
        },
        {
          count: 11,
          lastdate: '2023-08-21',
          text_value: '4'
        },
        {
          count: 11,
          lastdate: '2023-08-21',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-08-22',
          text_value: '3'
        },
        {
          count: 1,
          lastdate: '2023-08-23',
          text_value: '0'
        },
        {
          count: 2,
          lastdate: '2023-08-23',
          text_value: '2'
        },
        {
          count: 6,
          lastdate: '2023-08-23',
          text_value: '3'
        },
        {
          count: 8,
          lastdate: '2023-08-23',
          text_value: '4'
        },
        {
          count: 8,
          lastdate: '2023-08-23',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-08-25',
          text_value: '5'
        },
        {
          count: 2,
          lastdate: '2023-08-28',
          text_value: '0'
        },
        {
          count: 2,
          lastdate: '2023-08-28',
          text_value: '1'
        },
        {
          count: 1,
          lastdate: '2023-08-28',
          text_value: '2'
        },
        {
          count: 6,
          lastdate: '2023-08-28',
          text_value: '3'
        },
        {
          count: 11,
          lastdate: '2023-08-28',
          text_value: '4'
        },
        {
          count: 5,
          lastdate: '2023-08-28',
          text_value: '5'
        },
        {
          count: 4,
          lastdate: '2023-08-30',
          text_value: '4'
        },
        {
          count: 6,
          lastdate: '2023-08-31',
          text_value: '3'
        },
        {
          count: 2,
          lastdate: '2023-09-01',
          text_value: '3'
        },
        {
          count: 1,
          lastdate: '2023-09-04',
          text_value: '4'
        },
        {
          count: 1,
          lastdate: '2023-11-20',
          text_value: '1'
        },
        {
          count: 5,
          lastdate: '2023-11-20',
          text_value: '3'
        },
        {
          count: 10,
          lastdate: '2023-11-20',
          text_value: '4'
        },
        {
          count: 8,
          lastdate: '2023-11-20',
          text_value: '5'
        },
        {
          count: 2,
          lastdate: '2023-11-21',
          text_value: '3'
        },
        {
          count: 1,
          lastdate: '2023-11-21',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-11-22',
          text_value: '0'
        },
        {
          count: 1,
          lastdate: '2023-11-22',
          text_value: '1'
        },
        {
          count: 1,
          lastdate: '2023-11-22',
          text_value: '2'
        },
        {
          count: 7,
          lastdate: '2023-11-22',
          text_value: '3'
        },
        {
          count: 8,
          lastdate: '2023-11-22',
          text_value: '4'
        },
        {
          count: 5,
          lastdate: '2023-11-22',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-11-23',
          text_value: '3'
        },
        {
          count: 3,
          lastdate: '2023-11-24',
          text_value: '2'
        },
        {
          count: 4,
          lastdate: '2023-11-24',
          text_value: '3'
        },
        {
          count: 10,
          lastdate: '2023-11-24',
          text_value: '4'
        },
        {
          count: 8,
          lastdate: '2023-11-24',
          text_value: '5'
        },
        {
          count: 2,
          lastdate: '2023-11-27',
          text_value: '3'
        },
        {
          count: 1,
          lastdate: '2023-11-27',
          text_value: '4'
        },
        {
          count: 3,
          lastdate: '2023-12-01',
          text_value: '3'
        },
        {
          count: 8,
          lastdate: '2023-12-01',
          text_value: '4'
        },
        {
          count: 10,
          lastdate: '2023-12-01',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-12-03',
          text_value: '3'
        },
        {
          count: 3,
          lastdate: '2023-12-04',
          text_value: '2'
        },
        {
          count: 9,
          lastdate: '2023-12-04',
          text_value: '3'
        },
        {
          count: 10,
          lastdate: '2023-12-04',
          text_value: '4'
        },
        {
          count: 4,
          lastdate: '2023-12-04',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-12-05',
          text_value: '5'
        },
        {
          count: 3,
          lastdate: '2023-12-06',
          text_value: '2'
        },
        {
          count: 4,
          lastdate: '2023-12-06',
          text_value: '3'
        },
        {
          count: 8,
          lastdate: '2023-12-06',
          text_value: '4'
        },
        {
          count: 6,
          lastdate: '2023-12-06',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-12-07',
          text_value: '4'
        },
        {
          count: 1,
          lastdate: '2023-12-08',
          text_value: '0'
        },
        {
          count: 5,
          lastdate: '2023-12-08',
          text_value: '3'
        },
        {
          count: 10,
          lastdate: '2023-12-08',
          text_value: '4'
        },
        {
          count: 6,
          lastdate: '2023-12-08',
          text_value: '5'
        },
        {
          count: 3,
          lastdate: '2023-12-11',
          text_value: '2'
        },
        {
          count: 7,
          lastdate: '2023-12-11',
          text_value: '3'
        },
        {
          count: 8,
          lastdate: '2023-12-11',
          text_value: '4'
        },
        {
          count: 4,
          lastdate: '2023-12-11',
          text_value: '5'
        },
        {
          count: 7,
          lastdate: '2023-12-12',
          text_value: '4'
        },
        {
          count: 2,
          lastdate: '2023-12-13',
          text_value: '2'
        },
        {
          count: 11,
          lastdate: '2023-12-13',
          text_value: '3'
        },
        {
          count: 13,
          lastdate: '2023-12-13',
          text_value: '4'
        },
        {
          count: 5,
          lastdate: '2023-12-13',
          text_value: '5'
        },
        {
          count: 1,
          lastdate: '2023-12-14',
          text_value: '2'
        },
        {
          count: 1,
          lastdate: '2023-12-14',
          text_value: '3'
        },
        {
          count: 1,
          lastdate: '2023-12-14',
          text_value: '4'
        },
        {
          count: 2,
          lastdate: '2023-12-15',
          text_value: '4'
        }
      ]
    }
  },

  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },

    series() {
      let series = d3
        .stack()
        .keys(d3.union(this.items.map((d) => d.text_value))) // distinct series keys, in input order
        .value(([, D], key) => {
          return D.get(key) ? D.get(key)['count'] : 0
        })(
        d3.index(
          this.items,
          (d) => d.lastdate,
          (d) => d.text_value
        )
      ) // group by stack then series key

      const res = series.map((D) => {
        const resultArr = D.map((d) => {
          return (d.key = D.key), d
        })
        resultArr.key = D.key
        return resultArr
      })

      return res
    },

    xScale() {
      return d3
        .scaleBand()
        .domain(this.items.map((d) => d.lastdate))
        .range([this.marginLeft, this.width - this.marginRight])
        .padding(0.1)
    },

    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.series, (d) => d3.max(d, (d) => d[1]))])
        .range([this.height - this.marginBottom, this.marginTop])
    },

    colors() {
      return d3
        .scaleOrdinal()
        .domain(this.series.map((d) => d.key))
        .range(d3.schemeSpectral[this.series.length])
        .unknown('#ccc')
    }
  }
}
</script>
