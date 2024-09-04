<template>
  <v-row>
    <v-col cols="12">
      <h4 class="tooltip-title mb-3">{{ title }}</h4>

      <table class="table-tooltip">
        <tbody>
          <tr v-for="item in items" :key="item.group" class="table-row_common">
            <td>
              <div class="cyrcle-box_small mr-2" :style="`background-color: ${item.color}`"></div>
            </td>
            <td class="table-cell__title">{{ item.title }}</td>
            <td class="table-cell__value">{{ item.value }}</td>
          </tr>

          <tr>
            <td colspan="4">
              <div class="mb-1"></div>
            </td>
          </tr>

          <tr class="table-row__result">
            <td></td>
            <td class="table-cell__title">{{ $t('analyticMetadata.all') }}</td>
            <td class="table-cell__value">{{ total }}</td>
          </tr>
        </tbody>
      </table>
    </v-col>
  </v-row>
</template>

<script>
// interface IItem {
//   color: string
//   title: string
//   value: string | number
// }
export default {
  props: {
    items: {
      // type: IItem[]
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    total: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.cyrcle-box_small {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.table-tooltip {
  border-collapse: collapse;
  & .table-cell__value {
    padding: 0 8px;
  }

  & .table-cell__percent {
    padding: 0 6px;
  }

  & .table-row_common td {
    padding-bottom: 8px;
  }
}

.tooltip-title {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  /* identical to box height, or 100% */

  /* Black */
  color: #222529;
}

.table-cell__title {
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

.table-cell__value {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  /* identical to box height, or 14px */
  text-align: right;

  /* Black */
  color: #222529;
}

.table-cell__percent {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  /* identical to box height, or 14px */
  text-align: right;

  /* Black */
  color: #222529;

  opacity: 0.5;
}

.table-row__result {
  /* Grey */
  background: #f3f6f9;
  border-radius: 2px;

  & td {
    padding: 6px 0;
    // border: 1px solid red;
  }
}
</style>
