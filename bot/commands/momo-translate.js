const { SlashCommandBuilder } = require("discord.js");
const { TranslationTask } = require('../tasks/translation-task')
// const { synthesizeSpeech } = require("../../speech/speech-synthesis.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("momo-translate")
    .setDescription("ask momo to translate"),
  async execute(interaction) {
    var t = new TranslationTask(interaction)
    await t.init()
  },
};
