const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  checkAndJoinVoiceChannel,
  playStream,
} = require("../utils/voiceChannel");
const { translateFromFile } = require("../../speech/speech-translation.js");
const { EndBehaviorType } = require("@discordjs/voice");
const { PassThrough } = require("stream");
const wavConverter = require("wav-converter");
const { createWriteStream, readFileSync, writeFileSync } = require("fs");
const prism = require("prism-media");
const path = require("path");
const { synthesizeSpeech } = require("../../speech/speech-synthesis.js");
const { streamToBuffer } = require("../utils/stream");
// const { synthesizeSpeech } = require("../../speech/speech-synthesis.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("momo-translate")
    .setDescription("ask momo to translate"),
  async execute(interaction) {
    var { connection, player } = await checkAndJoinVoiceChannel(interaction, {
      selfDeaf: false,
    });
    if (!connection) {
      return;
    }
    await interaction.reply({
      content: `You can start talking now`,
      ephemeral: true,
    });
    var receiver = connection.receiver;
    const opusStream = receiver.subscribe(interaction.member.id, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 1000,
      },
    });
    const opusDecoder = new prism.opus.Decoder({
      frameSize: 960,
      channels: 2,
      rate: 48000,
    });
    var ms = opusStream.pipe(opusDecoder);
    //   .pipe(createWriteStream("./recording.pcm"));
    // ms.on("finish", async () => {
    //   console.timeEnd('decoding')
    //   console.time('reading')
    //   console.log("finished recording");
    //   var pcmData = readFileSync("./recording.pcm");
    //   console.timeEnd('reading')
    //   console.time('convert')
    //   var wavData = wavConverter.encodeWav(pcmData, {
    //     numChannels: 2,
    //     sampleRate: 48000,
    //     byteRate: 16,
    //   });
    var pcmData = await streamToBuffer(ms);
    var wavData = wavConverter.encodeWav(pcmData, {
      numChannels: 2,
      sampleRate: 48000,
      byteRate: 16,
    });

    var translation = await translateFromFile(wavData);
    var lang = "ja-JP-NanamiNeural";
    // var lang = ""en-US-JennyNeural""
    var x = await synthesizeSpeech(translation, lang);
    await playStream(x, connection, player);
  },
};
