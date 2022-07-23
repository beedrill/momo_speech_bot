const { SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder, SelectMenuBuilder, ComponentType } = require("discord.js");
const { serverStatesHandler, LanguageSettings } = require("../states/serverStates");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("momo-set-translate")
    .setDescription("configure translation"),
  async execute(interaction) {
    options = [];
    for (const languageCode in LanguageSettings) {
      options.push({
        label: LanguageSettings[languageCode].label,
        description: LanguageSettings[languageCode].name,
        value: LanguageSettings[languageCode].languageCode,
      });
    }
    const startingLangSelector = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("startingLangSelector")
        .setPlaceholder("Select starting language")
        .addOptions(options)
    );
    const targetLangSelector = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("targetLangSelector")
        .setPlaceholder("Select target language")
        .addOptions(options)
    );
    var msg = await interaction.reply({
      content: "Please select the language you want to translate...",
      components: [startingLangSelector, targetLangSelector],
      fetchReply: true,
      ephemeral: true,
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.SelectMenu,
      time: 60000,
    });
    collector.on("collect", (i) => {
      i.deferUpdate();
      console.log(i)
      var newLangCode = i.values[0];
      if (i.customId == "startingLangSelector") {
        serverStatesHandler.setTranslationStartingLanguage(
          interaction.guildId,
          newLangCode
        );
      } else if (i.customId == "targetLangSelector") {
        serverStatesHandler.setTranslationTargetLanguage(
          interaction.guildId,
          newLangCode
        );
      }
      interaction.editReply(
        `You have successfully set **${
          i.customId == "startingLangSelector"
            ? "Starting Language"
            : "Target Language"
        }** to **${LanguageSettings[newLangCode].name}**.`
      );
    });

    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} interactions.`);
    });
  },
};
