<template>
  <div class="box" :style="styleString">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    styleString() {
      const top = this.position.top ? `top: ${this.getCoordinate(this.position.top)};` : '';
      const bottom = this.position.bottom
        ? `bottom: ${this.getCoordinate(this.position.bottom)};`
        : '';
      const left = this.position.top ? `left: ${this.getCoordinate(this.position.left)};` : '';
      const right = this.position.top ? `right: ${this.getCoordinate(this.position.right)};` : '';
      return `${top}${bottom}${left}${right}`;
    },
  },

  methods: {
    getCoordinate(item) {
      if (!item) return undefined;
      if (typeof item === 'string') return item;
      if (typeof item === 'number') return `${item}px`;
    },
  },
};
</script>

<style scoped>
.box {
  position: absolute;
  z-index: 1;

  margin: 0;
  padding: 8px;

  border: 1px solid rgba(34, 37, 41, 0.05);
  box-shadow: 0px 4px 10px rgba(102, 102, 102, 0.09);
  border-radius: 4px;

  background: #fcfcfc;
}

/* hint_02 */

/* .box::before {
  position: absolute;
  content: '';
  top: 50%;
  left: -4px;
  transform: rotate(45deg);
  background-color: #282828;

  padding: 5px;
} */
</style>
