const {
  ActionRowBuilder,
  SelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const {
  serverStatesHandler,
  LanguageSettings,
} = require("../states/serverStates");
const {
  getLanguageNameFromLanguageCode,
  getLanguageNameFromLocale,
} = require("../utils/translation");
const { Task } = require("./task");

class SetTranslationTask extends Task {
  constructor(interaction) {
    super(interaction);
    this.status = "beforeCreated";
  }
  async init() {
    //building options:
    var options = [];
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
    const startingLocale = serverStatesHandler.getServerState(
      this.interaction.guildId
    ).translation.startingLang;
    const startingLangName = getLanguageNameFromLocale(startingLocale);
    const targetCode = serverStatesHandler.getServerState(
      this.interaction.guildId
    ).translation.targetLang;
    const targetLangName = getLanguageNameFromLanguageCode(targetCode);
    var msg = await this.interaction.reply({
      content: `Current Starting Language is **${startingLangName}**, current Target Language is **${targetLangName}**. Please select the language you want to translate...`,
      components: [startingLangSelector, targetLangSelector],
      fetchReply: true,
      ephemeral: true,
    });
    this.status = "ready";

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.SelectMenu,
      time: 60_000,
    });
    collector.on("collect", (i) => {
      i.deferUpdate();
      var newLangCode = i.values[0];
      if (i.customId == "startingLangSelector") {
        let originalLangCode = serverStatesHandler
          .getServerState(this.interaction.guildId)
          .translation.startingLang.split("-")[0];
        if (originalLangCode == newLangCode) {
          this.interaction.editReply("You are already using this language.");
          return;
        }
        serverStatesHandler.setTranslationStartingLanguage(
          this.interaction.guildId,
          newLangCode
        );
      } else if (i.customId == "targetLangSelector") {
        let originalLangCode = serverStatesHandler.getServerState(
          this.interaction.guildId
        ).translation.targetLang;
        if (originalLangCode == newLangCode) {
          this.interaction.editReply("You are already using this language.");
          return;
        }
        serverStatesHandler.setTranslationTargetLanguage(
          this.interaction.guildId,
          newLangCode
        );
      }
      this.interaction.editReply(
        `You have successfully set **${
          i.customId == "startingLangSelector"
            ? "Starting Language"
            : "Target Language"
        }** to **${LanguageSettings[newLangCode].name}**.`
      );
    });

    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} interactions.`);
      this.destroy(
        "setting time up,  you can call the command again to continue setting..."
      );
    });
  }
}

module.exports = { SetTranslationTask };
