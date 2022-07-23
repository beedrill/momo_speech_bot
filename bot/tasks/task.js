class Task {
  constructor(interaction) {
    this.interaction = interaction;
  }
  destroy(content) {
    // console.log(this.connection)
    if (this.status !== "destroyed" && this.interaction) {
      try {
        this.interaction.editReply({
          content,
          components: [],
        });
      } catch (err) {
        console.error(err);
      }
    }

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

module.exports = {
  Task,
};
