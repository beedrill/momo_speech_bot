const { LanguageSettings } = require("../states/serverStates");
function getLanguageNameFromLanguageCode(langCode) {
  return LanguageSettings[langCode].name;
}

function getLanguageNameFromLocale(locale) {
  var langCode = locale.split("-")[0];
  return getLanguageNameFromLanguageCode(langCode);
}

module.exports = {
  getLanguageNameFromLanguageCode,
  getLanguageNameFromLocale,
};
