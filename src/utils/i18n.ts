import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import translationVN from "./../resources/locales/vi/translation.json";
import translationEN from "./../resources/locales/en/translation.json";
import LocalStorage from "./localStorage";
import {LANGUAGE_LIST} from "./constants";

const localLanguage = LocalStorage.getInstance().read('language') || LANGUAGE_LIST[0]?.value;

// the translations
const resources = {
    en: {
        translation: translationEN,
    },
    vi: {
        translation: translationVN,
    },
};

export default i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: localLanguage,
        fallbackLng: localLanguage,
        interpolation: {
            escapeValue: false,
        },
    });
