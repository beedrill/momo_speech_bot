const { SlashCommandBuilder } = require("discord.js");
const { checkAndJoinVoiceChannel } = require("../utils/voiceChannel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("momo")
    .setDescription("Join the user voice channel"),
  async execute(interaction) {
    var { connection } = await checkAndJoinVoiceChannel(interaction);
    if (!connection) {
      return;
    } else {
      await interaction.reply({
        content: "I'm here",
        ephemeral: true,
      });
    }
  },
};
