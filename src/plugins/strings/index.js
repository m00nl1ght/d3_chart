import en from './en';
import ru from './ru';

import enAnalytics from './enAnalytics';
import ruAnalytics from './ruAnalytics';

const messages = {
  en: {
    ...en,
    ...enAnalytics,
  },
  ru: {
    ...ru,
    ...ruAnalytics,
  },
};
/* Ключи в компонентах приоритетны. Если там записи нет а здесь есть -
   будет сообщение отсюда, иначе из компонента */
export default messages;
