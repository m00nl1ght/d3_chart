<template>
  <div class="box">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {},

  computed: {}
}
</script>

<style scoped>
.box {
  position: absolute;
  margin: 0;
  padding: 4px 8px;
  inset: auto auto 0px 0px;
  border-radius: 8px;
  background: #282828;
  color: white;
}

.box::before {
  position: absolute;
  content: '';
  top: 93%;
  left: 45%;
  transform: rotate(45deg);
  background-color: #282828;

  padding: 5px;
}
</style>
