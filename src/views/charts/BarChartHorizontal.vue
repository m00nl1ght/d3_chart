<template>
  <div>
    <div style="position: relative">
      <svg :width="width" :height="elementHeight" :viewBox="viewBox">
        <g v-for="(rect, idx) in rects" :key="`rect_${idx}`">
          <rect
            :x="rect.x"
            :y="rect.y"
            :fill="color"
            :width="rect.width"
            :height="rect.height"
            :opacity="isFocused && rect.y !== focusedElem.y ? 0.4 : 1"
            @mouseover="() => onMouseover(rect)"
            @mouseleave="onMouseleave"
            @mousemove="onMousemove"
          />

          <text :x="rect.textX" :y="rect.textY" dy="0.35em" dx="5">
            {{ rect.text }}
          </text>
        </g>

        <g
          v-axis:x="{x, elementHeight}"
          fill="none"
          :transform="`translate(0, ${elementHeight - marginBottom})`"
        ></g>

        <g
          v-axis:y="{y, elementHeight}"
          fill="none"
          :transform="`translate(${marginLeft}, 0)`"
          class="item-title"
        ></g>
      </svg>

      <BarCharHover
        v-if="isFocused && focusedElem"
        :position="{
          left: tooltipPos[0],
          top: tooltipPos[1],
        }"
      >
        <div>
          <div v-for="(value, key) in focusedElem.raw" :key="key">{{ `${key}: ${value}` }}</div>
        </div>
      </BarCharHover>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import BarCharHover from './components/ChartTooltipBox.vue';

export default {
  components: {
    BarCharHover,
  },

  directives: {
    axis(el, binding) {
      const axis = binding.arg;
      const axisMethod = {x: 'axisBottom', y: 'axisLeft'}[axis];
      const methodArg = binding.value[axis];
      const height = binding.value['height'];

      if (axisMethod === 'axisBottom') {
        d3.select(el)
          .call(d3.axisBottom(methodArg).tickFormat((y) => (y * 1).toFixed()))
          .call((g) => g.select('.domain').remove());
      } else {
        d3.select(el)
          .call(d3.axisLeft(methodArg).ticks(height / 80, '%'))
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
    barHeight: {
      default: 40,
      type: Number,
    },
    color: {
      type: String,
      default: '#87BCEC',
    },
  },

  data() {
    return {
      marginTop: 30,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 100,

      isFocused: false,
      focusedElem: undefined,
      tooltipPos: [undefined, undefined],
    };
  },

  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.elementHeight}`;
    },

    elementHeight() {
      return (
        Math.ceil((this.items.length + 0.1) * this.barHeight) + this.marginTop + this.marginBottom
      );
    },

    x() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.items, (d) => d.count)])
        .range([this.marginLeft, this.width - this.marginRight]);
    },

    y() {
      return (
        d3
          .scaleBand()
          // .domain(d3.sort(this.items, (d) => d.value).map((d) => d.key))
          .domain(this.items.map((d) => d.title))
          .rangeRound([this.marginTop, this.elementHeight - this.marginBottom])
          .padding(0.1)
      );
    },

    rects() {
      let result = [];

      this.items.forEach((d) => {
        const width = this.x(d.count) - this.x(0);
        const y = this.y(d.title);

        result.push({
          raw: d,
          x: this.x(0),
          y: y,
          width: width,
          height: this.y.bandwidth(),

          textX: this.x(d.count),
          textY: y + this.y.bandwidth() / 2,
          text: d.count,
        });
      });

      return result;
    },
  },

  mounted() {
    if (this.items && this.items.length > 0 && this.items[0].title) {
      this.marginLeft = this.calcYTitleWidth(this.items[0].title);
    }
  },

  methods: {
    calcYTitleWidth(txt) {
      const fontSize = '16px';

      let el = document.createElement('span');
      el.style.fontSize = fontSize;
      el.innerHTML = txt;
      document.body.appendChild(el);
      var result = el.offsetWidth;
      document.body.removeChild(el);

      return result;
    },

    onMouseover(item) {
      this.focusedElem = item;
      this.isFocused = true;
    },

    onMousemove(event) {
      this.tooltipPos = d3.pointer(event);
    },

    onMouseleave() {
      this.isFocused = false;
      this.focusedElem = undefined;
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
  pointer-events: auto;
}

.item-title {
  font-size: 12px;
}
</style>
