<template>
  <div class="hint">
    <div class="hint__title mb-3">{{ title }}</div>
    <div class="d-flex justify-space-between">
      <span class="hint__range">TODO_Средний:</span>
      <span class="hint__range-count">{{ count }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    count: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hint {
  min-width: 308px;
  // min-height: 60px;
}

.hint__title {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  /* identical to box height, or 100% */

  /* Black */
  color: #222529;
}

.hint__range {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  /* identical to box height, or 14px */

  /* Black */
  color: #222529;

  opacity: 0.7;
}

.hint__range-count {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;

  /* Black */
  color: #222529;
}
</style>
