import Vue from 'vue';
import VueI18n from 'vue-i18n';
import strings from './strings';

const defaultLanguage = 'ru-RU';

const availableLanguages = {
  'en-us': 'en',
  'en-gb': 'en',
  'ru-ru': 'ru',
  ru: 'ru',
  en: 'en',
  default: 'ru',
};

function getLocale() {
  return availableLanguages[defaultLanguage.toLowerCase()];
  // const navLanguage = navigator.language
  //   ? navigator.language.toLocaleLowerCase()
  //   : defaultLanguage.toLocaleLowerCase();
  // let langVal = availableLanguages[navLanguage];
  // if (!langVal) {
  //   console.log(`Using fallback locale ${defaultLanguage}`);
  //   return defaultLanguage;
  // }
  // console.log(`Locale selected: ${langVal}`);
  // return langVal;
}

function tf(key, fallbackString) {
  return this.$t && this.$te
    ? this.$te(key)
      ? this.$t(key)
      : fallbackString
    : fallbackString
    ? fallbackString
    : key;
}

Vue.use(VueI18n);

export default new VueI18n({
  locale: getLocale(),
  silentFallbackWarn: true, // Разобраться, что за варнинги
  fallbackLocale: {
    'ru-RU': ['ru'],
    'ru-ru': ['ru'],
    'en-US': ['en'],
    'en-us': ['en'],
    'en-GB': ['en'],
    'en-gb': ['en'],
    default: ['ru'],
  },
  messages: strings,
});

Vue.prototype.$tf = tf;
