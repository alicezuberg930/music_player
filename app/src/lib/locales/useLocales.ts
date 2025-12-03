import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@/redux/store'
import { setLanguage } from '@/redux/slices/app'
// components
import { allLangs, defaultLang } from './config-lang'

export default function useLocales() {
  const { i18n, t: translate } = useTranslation()
  const dispatch = useDispatch()
  const { language } = useSelector(state => state.app)

  const currentLang = allLangs.find((_lang) => _lang.value === language) || defaultLang

  const handleChangeLanguage = (newlang: string) => {
    i18n.changeLanguage(newlang)
    dispatch(setLanguage(newlang))
  }

  return {
    onChangeLang: handleChangeLanguage,
    translate: (text: any, options?: any) => translate(text, options) as string,
    currentLang,
    allLangs,
  }
}
