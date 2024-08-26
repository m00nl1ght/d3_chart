export const COLOR_MAPPING = {
  GREEN: '#48CD9D',
  YELLOW: '#FFD466',
  ORANGE: '#FFA740',
  RED: '#FF764C',
  GREY: '#F3F6F9',
};

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
    high_expression: COLOR_MAPPING.ORANGE,
  },

  efficiency: {
    extremely_high_prof_efficiency: COLOR_MAPPING.GREEN,
    high_prof_efficiency: COLOR_MAPPING.YELLOW,
    medium_prof_efficiency: COLOR_MAPPING.ORANGE,
    low_prof_efficiency: COLOR_MAPPING.RED,
  },
};
