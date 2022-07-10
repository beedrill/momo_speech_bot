const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  checkAndJoinVoiceChannel,
  playStream,
} = require("../utils/voiceChannel");
const { synthesizeSpeech } = require("../../speech/speech-synthesis.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("momo-translate")
    .setDescription("ask momo to translate"),
  async execute(interaction) {
    var { connection, player } = await checkAndJoinVoiceChannel(interaction);
    if (!connection) {
      return;
    }
    await interaction.reply({
      content: `To be implemented`,
      ephemeral: true,
    });
  },
};
