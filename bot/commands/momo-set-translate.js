const { SlashCommandBuilder } = require("discord.js");
const { SetTranslationTask } = require("../tasks/set-translation-task");
const {
  serverStatesHandler,
  LanguageSettings,
} = require("../states/serverStates");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("momo-set-translate")
    .setDescription("configure translation"),
  async execute(interaction) {
    const t = new SetTranslationTask(interaction);
    t.init();
  },
};
