import i18n from 'i18next';
import ICU from 'i18next-icu';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next  } from 'react-i18next';
import { i18nextPlugin } from 'translation-check'

import translation_en from "../../locales/en/translation.json";
import translation_pl from "../../locales/pl/translation.json";

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(i18nextPlugin)
  .init({
    fallbackLng: 'en',
    lng: "en",
    debug: true,
    resources: {
        en: {
            translation: translation_en
        },
        pl: {
          translation: translation_pl
        }
    },
  });


export default i18n;