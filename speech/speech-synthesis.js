const { azureResourceKey, azureRegion, speechSynthesisVoiceName } = require("../config.json");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const { PassThrough } = require("stream");

function synthesizeSpeech(text, voiceName=null) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    azureResourceKey,
    azureRegion
  );
  // speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
  speechConfig.speechSynthesisVoiceName = voiceName || speechSynthesisVoiceName || "en-US-JennyNeural";
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
  return new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        const { audioData } = result;

        synthesizer.close();

        // convert arrayBuffer to stream
        // return stream
        const bufferStream = new PassThrough();
        bufferStream.end(Buffer.from(audioData));
        resolve(bufferStream);
      },
      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}

module.exports = { synthesizeSpeech };
