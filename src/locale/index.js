import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

export function prepare(locale) {
  const fallbackLng = "en";

  const resources = {};
  locale.languageList.forEach(({id, active}) => {
    if (active) {
      resources[id] = {translation: require(`./${id}/translation.json`)};
    };
  })
  
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng,
      supportedLngs: ["en", "pt"],
      interpolation: {
        escapeValue: false
      }
    });  
}

export default i18n;