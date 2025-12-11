import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
//
import { defaultLang } from './config-lang'
//
import enLocales from './langs/en'
import frLocales from './langs/fr'
import viLocales from './langs/vi'
import cnLocales from './langs/cn'

const lng = localStorage.getItem('i18nextLng') || defaultLang.value

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: enLocales },
      fr: { translations: frLocales },
      vi: { translations: viLocales },
      cn: { translations: cnLocales },
    },
    lng,
    fallbackLng: defaultLang.value,
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18next