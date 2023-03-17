import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import words from './index.json';
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

export function prepare(locale) {
  const fallbackLng = "en";
  const wordsByLanguages = {};
  Object.entries(words).forEach(([key, value]) => {
    Object.entries(value).forEach(([language, word]) => {
      if (Object.keys(wordsByLanguages).includes(language)) {
        wordsByLanguages[language][key] = word;
      }
      else {
        wordsByLanguages[language] = {
          [key]: word
        }
      }
    })
  })
  console.log({ wordsByLanguages })
  const resources = {};
  locale.languageList.forEach(({ id, active }) => {
    if (active) {
      console.log({ id })
      resources[id] = { translation: wordsByLanguages[id] };
    };
  });

  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng,
      supportedLngs: Object.keys(resources).map((el) => el),
      interpolation: {
        escapeValue: false
      }
    });
}

export default i18n;