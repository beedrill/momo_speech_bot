const { SlashCommandBuilder } = require("discord.js");
const {
  checkAndJoinVoiceChannel,
  playStream,
} = require("../utils/voiceChannel");
const { synthesizeSpeech } = require("../../speech/speech-synthesis.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("momo-say")
    .setDescription("ask momo to say something")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("the text you want to pronounce")
        .setRequired(true)
    ),
  async execute(interaction) {
    var { connection, player } = await checkAndJoinVoiceChannel(interaction);
    if (!connection) {
      return;
    }
    var x = await synthesizeSpeech(interaction.options.getString("input"));
    await playStream(x, connection, player);
    await interaction.reply({
      content: `ok!`,
      ephemeral: true,
    });
  },
};
