import { useTranslation } from 'react-i18next'
import { allLangs, defaultLang } from './config-lang'

export default function useLocales() {
  const { i18n, t } = useTranslation()

  const currentLang = allLangs.find((_lang) => _lang.value === localStorage.getItem('i18nextLng')) || defaultLang

  const handleChangeLanguage = (newlang: string) => {
    i18n.changeLanguage(newlang)
    localStorage.setItem('i18nextLng', newlang)
  }

  return {
    onChangeLang: handleChangeLanguage,
    translate: (text: any, options?: any) => t(text, options) as string,
    currentLang,
    allLangs,
  }
}
