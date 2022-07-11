const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs")
const speechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(
  "bf8dc37b5fb84168b4e9e361ba1edb77",
  "eastus"
);
speechTranslationConfig.speechRecognitionLanguage = "zh-CN";

var language = "ja";
speechTranslationConfig.addTargetLanguage(language);

function translateFromFile(wavData) {
  let audioConfig = sdk.AudioConfig.fromWavFileInput(wavData);
  let translationRecognizer = new sdk.TranslationRecognizer(
    speechTranslationConfig,
    audioConfig
  );
  return new Promise((resolve, reject) => {
    translationRecognizer.recognizeOnceAsync((result) => {
      switch (result.reason) {
        case sdk.ResultReason.TranslatedSpeech:
          console.log(`RECOGNIZED: Text=${result.text}`);
          console.log(
            "Translated into [" +
              language +
              "]: " +
              result.translations.get(language)
          );
          resolve(result.translations.get(language));
          break;
        case sdk.ResultReason.NoMatch:
          console.log("NOMATCH: Speech could not be recognized.");
          reject("NOMATCH: Speech could not be recognized.");
          break;
        case sdk.ResultReason.Canceled:
          const cancellation = sdk.CancellationDetails.fromResult(result);
          console.log(`CANCELED: Reason=${cancellation.reason}`);

          if (cancellation.reason == sdk.CancellationReason.Error) {
            console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
            console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
            console.log(
              "CANCELED: Did you set the speech resource key and region values?"
            );
          }
          reject(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
          break;
      }
      translationRecognizer.close();
    });
  });
}

module.exports = { translateFromFile };
