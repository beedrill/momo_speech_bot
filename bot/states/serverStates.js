const serverStates = {};

const LanguageSettings = {
  zh: {
    languageCode: "zh",
    locale: "zh-CN",
    voiceName: "zh-CN-YunxiNeural",
    name: "Chinese",
    label: "中文",
  },
  ja: {
    languageCode: "ja",
    locale: "ja-JP",
    voiceName: "ja-JP-NanamiNeural",
    name: "Japanese",
    label: "日本語",
  },
  en: {
    name: "English",
    locale: "en-US",
    voiceName: "en-US-JennyNeural",
    languageCode: "en",
    label: "English",
  },
  es: {
    name: "Spanish",
    locale: "es-ES",
    voiceName: "es-ES-ElviraNeural",
    languageCode: "es",
    label: "Español",
  },
};

function initState() {
  return {
    translation: {
      startingLang: LanguageSettings.en.locale,
      targetLang: LanguageSettings.ja.languageCode,
      voiceName: LanguageSettings.ja.voiceName,
    },
  };
}

function setTranslationTargetLanguage(serverId, languageCode) {
  var state = serverStates[serverId];
  if (!state) {
    throw "no serverState found";
  }
  state.translation.targetLang = languageCode;
  state.translation.voiceName = LanguageSettings[languageCode].voiceName;
  setServerState(serverId, state);
}
function setTranslationStartingLanguage(serverId, languageCode) {
  var state = serverStates[serverId];
  if (!state) {
    throw "no serverState found";
  }
  state.translation.startingLang = LanguageSettings[languageCode].locale;
  setServerState(serverId, state);
}

function setServerState(serverId, newState) {
  serverStates[serverId] = newState;
  // push to database here:
}

function getServerState(serverId) {
  //get from database if you need to
  var state = serverStates[serverId];
  if (!state) {
    state = initState();
    setServerState(serverId, state);
  }
  return state;
}

module.exports = {
  getServerState,
  setServerState,
  LanguageSettings,
  setTranslationTargetLanguage,
  setTranslationStartingLanguage,
};
