export const COLOR_MAPPING = {
  GREEN: '#48CD9D',
  YELLOW: '#FFD466',
  ORANGE: '#FFA740',
  ORANGE_SECONDARY: '#FFAE95',
  RED: '#FF764C',
  RED_DEEP: '#DE3400',

  GREY: '#F3F6F9',
  GREY_SECONDARY: '#E9E9E9',

  // light colors
  GREEN_LIGHT: '#DAF5EB',
  GREEN_LIGHT_SECONDARY: '#C0F7E3',
  YELLOW_LIGHT: '#FFE6A5',
  ORANGE_LIGHT: '#FB987A',
  RED_LIGHT: '#FF764B'
}

export const colorMapStackedBar = {
  GREEN: COLOR_MAPPING.GREEN,
  GREEN_LIGHT: COLOR_MAPPING.GREEN_LIGHT_SECONDARY,
  YELLOW: COLOR_MAPPING.YELLOW,
  ORANGE: COLOR_MAPPING.ORANGE_SECONDARY,
  RED: COLOR_MAPPING.RED,
  RED_DEEP: COLOR_MAPPING.RED_DEEP
}

export const colorMapProgressTable = {
  GREY: COLOR_MAPPING.GREY_SECONDARY,
  RED: COLOR_MAPPING.RED,
  GREEN: COLOR_MAPPING.GREEN,
  YELLOW: COLOR_MAPPING.YELLOW
}

export const colorMapLineWithArea = {
  GREEN: COLOR_MAPPING.GREEN
}

export const colorMapDonat = {
  empty: COLOR_MAPPING.GREY,

  positive_answer: COLOR_MAPPING.GREEN,
  loyal_answer: COLOR_MAPPING.YELLOW,
  skeptic_answer: COLOR_MAPPING.ORANGE,
  negative_answer: COLOR_MAPPING.RED,

  supporters: COLOR_MAPPING.GREEN,
  loyal: COLOR_MAPPING.YELLOW,
  skeptics: COLOR_MAPPING.ORANGE,
  critics: COLOR_MAPPING.RED,

  extremely_low_expression: COLOR_MAPPING.GREEN,
  low_expression: COLOR_MAPPING.YELLOW,
  medium_expression: COLOR_MAPPING.ORANGE,
  high_expression: COLOR_MAPPING.RED,

  emotionalDeperson: {
    extremely_high_expression: COLOR_MAPPING.RED,
    low_expression: COLOR_MAPPING.GREEN,
    medium_expression: COLOR_MAPPING.YELLOW,
    high_expression: COLOR_MAPPING.ORANGE
  },

  efficiency: {
    extremely_high_prof_efficiency: COLOR_MAPPING.GREEN,
    high_prof_efficiency: COLOR_MAPPING.YELLOW,
    medium_prof_efficiency: COLOR_MAPPING.ORANGE,
    low_prof_efficiency: COLOR_MAPPING.RED
  }
}

export const colorMapStackedArea = {
  positive_answer: COLOR_MAPPING.GREEN_LIGHT,
  loyal_answer: COLOR_MAPPING.YELLOW_LIGHT,
  skeptic_answer: COLOR_MAPPING.ORANGE_LIGHT,
  neutral_answer: COLOR_MAPPING.ORANGE_LIGHT,
  negative_answer: COLOR_MAPPING.RED_LIGHT,

  extremely_low_expression: COLOR_MAPPING.GREEN_LIGHT,
  low_expression: COLOR_MAPPING.YELLOW_LIGHT,
  medium_expression: COLOR_MAPPING.ORANGE_LIGHT,
  high_expression: COLOR_MAPPING.RED_LIGHT,
  extremely_high_expression: '#ef5350',

  extremely_high_prof_efficiency: COLOR_MAPPING.GREEN_LIGHT,
  medium_prof_efficiency: COLOR_MAPPING.YELLOW_LIGHT,
  high_prof_efficiency: COLOR_MAPPING.ORANGE_LIGHT,
  low_prof_efficiency: COLOR_MAPPING.RED_LIGHT
}

export const colorMapStackedAreaLine = {
  positive_answer: COLOR_MAPPING.GREEN,
  loyal_answer: COLOR_MAPPING.YELLOW,
  skeptic_answer: COLOR_MAPPING.RED,
  neutral_answer: COLOR_MAPPING.RED,
  negative_answer: COLOR_MAPPING.RED_DEEP,

  extremely_low_expression: COLOR_MAPPING.GREEN,
  low_expression: COLOR_MAPPING.YELLOW,
  medium_expression: COLOR_MAPPING.RED,
  high_expression: COLOR_MAPPING.RED_DEEP,
  extremely_high_expression: '#ef5350',

  extremely_high_prof_efficiency: COLOR_MAPPING.GREEN,
  medium_prof_efficiency: COLOR_MAPPING.YELLOW,
  high_prof_efficiency: COLOR_MAPPING.RED,
  low_prof_efficiency: COLOR_MAPPING.RED_DEEP
}
