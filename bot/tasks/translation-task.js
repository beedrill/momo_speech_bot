const { checkAndJoinVoiceChannel } = require("../utils/voiceChannel");
const { Task } = require("./task");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { VoiceConnectionStatus } = require("@discordjs/voice");
const { playStream, receiveAudioToWav } = require("../utils/voiceChannel");
const { translateFromFile } = require("../../speech/speech-translation.js");
const { synthesizeSpeech } = require("../../speech/speech-synthesis.js");
const { serverStatesHandler } = require("../states/serverStates");
const {
  getLanguageNameFromLanguageCode,
  getLanguageNameFromLocale,
} = require("../utils/translation");
class TranslationTask extends Task {
  constructor(interaction) {
    super(interaction);
    this.status = "beforeCreated";
  }
  async init() {
    var { connection, player } = await checkAndJoinVoiceChannel(
      this.interaction,
      {
        selfDeaf: false,
      },
      true //noCleanup
    );
    if (!connection) {
      return;
    }
    this.status = "ready";
    this.connection = connection;
    this.connection.on(VoiceConnectionStatus.Disconnected, () => {
      this.destroy("I am disconnected, thank you!");
    });
    this.connection.on(VoiceConnectionStatus.Destroyed, () => {
      this.destroy("I am disconnected, thank you!");
    });
    this.receiver = connection.receiver;
    const startButton = new ButtonBuilder()
      .setCustomId("start")
      .setLabel("Start")
      .setStyle(ButtonStyle.Primary);
    const endButton = new ButtonBuilder()
      .setCustomId("end")
      .setLabel("End")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(startButton, endButton);
    const startingLocale = serverStatesHandler.getServerState(
      this.interaction.guildId
    ).translation.startingLang;
    const startingLangName = getLanguageNameFromLocale(startingLocale);
    const targetCode = serverStatesHandler.getServerState(
      this.interaction.guildId
    ).translation.targetLang;
    const targetLangName = getLanguageNameFromLanguageCode(targetCode);
    var msg = await this.interaction.reply({
      content: `Click "Start" button to start recording, the recording will stop automatically when you pause. You need to speak in **${startingLangName}**, it will be translated in **${targetLangName}**..`,
      ephemeral: true,
      components: [row],
      fetchReply: true,
    });
    // console.log(msg)
    var collector = msg.createMessageComponentCollector({
      time: 600_000,
    });
    collector.on("collect", async (i) => {
      switch (i.customId) {
        case "end":
          this.destroy(
            "It has been nice to serve you, looking forward to meet you again!"
          );
          break;
        case "start":
          this.status = "busy";
          row.components[0].setDisabled(true);
          row.components[1].setDisabled(true);
          // await wait(10000);
          i.deferUpdate();
          this.interaction.editReply({
            content: "Recording...You can talk now...",
            components: [row],
          });
          var wavData = await receiveAudioToWav(
            this.receiver,
            this.interaction.member.id
          );
          this.interaction.editReply({
            content: "Recording done, translating, one moment...",
            components: [row],
          });
          var translation = await translateFromFile(
            wavData,
            this.interaction.serverState.translation
          );

          var lang = this.interaction.serverState.translation.voiceName;
          // var lang = "en-US-JennyNeural";
          var x = await synthesizeSpeech(translation, lang);
          await playStream(x, connection, player);
          row.components[0].setDisabled(false);
          row.components[1].setDisabled(false);
          this.status = "ready";
          this.interaction.editReply({
            content: `Click "Start" button to start recording, the recording will stop automatically when you pause...`,
            ephemeral: true,
            components: [row],
            fetchReply: true,
          });
          break;
      }
    });
    collector.on("end", async (collected) => {
      this.destroy(
        "Reaching session time limit, call '/momo-translate' again to resume. It has been nice to serve you, looking forward to meet you again!"
      );
    });
  }
}

module.exports = { TranslationTask };
