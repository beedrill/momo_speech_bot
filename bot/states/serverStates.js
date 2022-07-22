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
class ServerStatesHandler {
  static _serverStates = {};
  constructor() {}
  static initState() {
    return {
      translation: {
        startingLang: LanguageSettings.en.locale,
        targetLang: LanguageSettings.ja.languageCode,
        voiceName: LanguageSettings.ja.voiceName,
      },
    };
  }

  setTranslationTargetLanguage(serverId, languageCode) {
    var state = this.getServerState(serverId);
    if (!state) {
      throw "no serverState found";
    }
    state.translation.targetLang = languageCode;
    state.translation.voiceName = LanguageSettings[languageCode].voiceName;
    this.setServerState(serverId, state);
  }

  setTranslationStartingLanguage(serverId, languageCode) {
    var state = this.getServerState(serverId);
    if (!state) {
      throw "no serverState found";
    }
    state.translation.startingLang = LanguageSettings[languageCode].locale;
    this.setServerState(serverId, state);
  }

  setServerState(serverId, newState) {
    ServerStatesHandler._serverStates[serverId] = newState;
    // push to database here:
  }

  getServerState(serverId) {
    //get from database if you need to
    var state = ServerStatesHandler._serverStates[serverId];
    if (!state) {
      state = ServerStatesHandler.initState();
      this.setServerState(serverId, state);
    }
    return state;
  }
}

const serverStatesHandler = new ServerStatesHandler();

module.exports = {
  LanguageSettings,
  serverStatesHandler,
};
