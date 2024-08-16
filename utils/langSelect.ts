// utils/langSelect.ts

import i18n from "@/i18n";

const getLanguage = () => {
  const language = i18n.locale || "en";
  return language;
};

const getAvailableLanguages = () => {
  return Object.keys(i18n.translations);
};

const setLanguage = (language: string) => {
  i18n.locale = language;
};

export { getLanguage, getAvailableLanguages, setLanguage };
