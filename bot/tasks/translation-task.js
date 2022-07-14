const { checkAndJoinVoiceChannel } = require("../utils/voiceChannel");
const { Task } = require("./task");
const { MessageActionRow, MessageButton } = require("discord.js");
const { VoiceConnectionStatus } = require("@discordjs/voice");
const { playStream, receiveAudioToWav } = require("../utils/voiceChannel");
const { translateFromFile } = require("../../speech/speech-translation.js");
const { synthesizeSpeech } = require("../../speech/speech-synthesis.js");
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
      true
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
    const startButton = new MessageButton()
      .setCustomId("start")
      .setLabel("Start")
      .setStyle("PRIMARY");
    const endButton = new MessageButton()
      .setCustomId("end")
      .setLabel("End")
      .setStyle("SECONDARY");
    const row = new MessageActionRow().addComponents(startButton, endButton);

    var msg = await this.interaction.reply({
      content: `Click "Start" button to start recording, the recording will stop automatically when you pause...`,
      ephemeral: true,
      components: [row],
      fetchReply: true,
    });
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
          var translation = await translateFromFile(wavData);
          // var lang = "ja-JP-NanamiNeural";
          var lang = "en-US-JennyNeural";
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
  destroy(content) {
    this.interaction.editReply({
      content,
      components: [],
    });
    // console.log(this.connection)
    if (this.connection && this.connection.state.status != "destroyed") {
      try {
        this.connection.destroy();
      } catch (err) {
        console.error(err);
      }
    }
    this.status = "destroyed";
  }
}

module.exports = { TranslationTask };
