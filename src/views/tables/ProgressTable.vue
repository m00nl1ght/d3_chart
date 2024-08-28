<template>
  <div>
    <v-simple-table fixed-header height="600px">
      <template v-slot:default>
        <!-- <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Calories</th>
          </tr>
        </thead> -->
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.title }}</td>
            <td>
              <div class="d-flex align-center">
                <v-progress-linear
                  height="16"
                  :value="item.count"
                  :color="getColor(item.count)"
                  :background-color="EMPTY_COLOR"
                  :background-opacity="0.5"
                  class="v-progress-linear--fixed-width"
                ></v-progress-linear>
                <!-- <div class="progress-box">
                  <div class="progress-box__line"></div>
                </div> -->
                <span class="ml-1 progress-box__text">{{ item.count }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { COLOR_MAPPING } from '../charts/composable/colorsMapping'
// count: 26,
// id: 1012333,
// title: 'Благополучие сотрудников в компании "БОБДЕЙ СОФТ". Пульс-опрос 11 🚀'
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      TODO_total: 100,
      COLOR_MAPPING,
      EMPTY_COLOR: COLOR_MAPPING.GREY_SECONDARY
    }
  },

  methods: {
    getColor(value) {
      if (value <= 20) return COLOR_MAPPING.RED
      else if (value >= 61) return COLOR_MAPPING.GREEN
      return COLOR_MAPPING.YELLOW
    }
  }
}
</script>

<style lang="scss" scoped>
.v-progress-linear--fixed-width {
  width: 278px;
  border-radius: 23px;
}

.progress-box {
  // position: absolute;
  width: 278px;
  height: 16px;

  background: #e9e9e9;
  opacity: 0.5;
  border-radius: 23px;
}

.progress-box__line {
  width: 211px;
  height: 16px;
  left: 0px;
  top: 0px;

  background: #48cd9d;
  border-radius: 23px 0px 0px 23px;
}

.progress-box__text {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;

  /* Black */
  color: #222529;
}
</style>
