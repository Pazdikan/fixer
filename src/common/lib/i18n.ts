import i18n from "i18next";
import ICU from "i18next-icu";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { i18nextPlugin } from "translation-check";

import translation_en_messages from "../../../locales/en/messages.json";
import translation_pl_messages from "../../../locales/pl/messages.json";

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(i18nextPlugin)
  .init({
    fallbackLng: "en",
    lng: "en",
    debug: true,
    resources: {
      en: {
        translation: translation_en_messages,
      },
      pl: {
        translation: translation_pl_messages,
      },
    },
  });

export default i18n;
