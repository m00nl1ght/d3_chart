export const COLOR_MAPPING = {
  GREEN_DONAT: '#48CD9D',
  YELLOW_DONAT: '#FFD466',
  ORANGE_DONAT: '#FFA740',
  RED_DONAT: '#FF764C',
  GREY_DONAT: '#F3F6F9',
};

export const colorMapDonat = {
  empty: COLOR_MAPPING.GREY_DONAT,

  positive_answer: COLOR_MAPPING.GREEN_DONAT,
  loyal_answer: COLOR_MAPPING.YELLOW_DONAT,
  skeptic_answer: COLOR_MAPPING.ORANGE_DONAT,
  negative_answer: COLOR_MAPPING.RED_DONAT,

  supporters: COLOR_MAPPING.GREEN_DONAT,
  loyal: COLOR_MAPPING.YELLOW_DONAT,
  skeptics: COLOR_MAPPING.ORANGE_DONAT,
  critics: COLOR_MAPPING.RED_DONAT,

  extremely_low_expression: COLOR_MAPPING.GREEN_DONAT,
  low_expression: COLOR_MAPPING.YELLOW_DONAT,
  medium_expression: COLOR_MAPPING.ORANGE_DONAT,
  high_expression: COLOR_MAPPING.RED_DONAT,

  emotionalDeperson: {
    extremely_high_expression: COLOR_MAPPING.RED_DONAT,
    low_expression: COLOR_MAPPING.GREEN_DONAT,
    medium_expression: COLOR_MAPPING.YELLOW_DONAT,
    high_expression: COLOR_MAPPING.ORANGE_DONAT,
  },

  efficiency: {
    extremely_high_prof_efficiency: COLOR_MAPPING.GREEN_DONAT,
    high_prof_efficiency: COLOR_MAPPING.YELLOW_DONAT,
    medium_prof_efficiency: COLOR_MAPPING.ORANGE_DONAT,
    low_prof_efficiency: COLOR_MAPPING.RED_DONAT,
  },
};
