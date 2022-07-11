const {
  joinVoiceChannel,
  createAudioPlayer,
  demuxProbe,
  createAudioResource,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
const {
  ConsoleLoggingListener,
} = require("microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.browser/ConsoleLoggingListener");

async function probeAndCreateResource(readableStream) {
  const { stream, type } = await demuxProbe(readableStream);
  return createAudioResource(stream, { inputType: type });
}

async function checkAndJoinVoiceChannel(interaction, options = {}) {
  const author = interaction.member;
  const voice = author.guild.voiceStates.cache;
  // if (voice.get(author.id) == undefined || voice.get(author.id) == null) {
  if (!author.voice.channel) {
    await interaction.reply({
      content: "You need to be in a voice channel first",
      ephemeral: true,
    });
    return {
      connection: null,
      player: null,
    };
  } else {
    var channel = author.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      ...options,
    });
    connection.on("stateChange", (oldState, newState) => {
      //   console.log(
      //     `Connection transitioned from ${oldState.status} to ${newState.status}`
      //   );
      if (newState.status == "disconnected") {
        connection.destroy();
      }
    });
    var cleanupInterval = setInterval(function () {
      console.log("start cleaning up resources");
      if (
        player.state.status == "playing" ||
        player.state.status == "buffering"
      ) {
        return;
      }
      try {
        connection.destroy();
        player.stop();
      } catch (err) {
        console.error(err);
        clearInterval(cleanupInterval);
      }
      clearInterval(cleanupInterval);
    }, 60000);
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    return {
      player,
      connection,
    };
  }
}

async function playStream(dataStream, connection, player) {
  const r = await probeAndCreateResource(dataStream);
  player.play(r);
  connection.subscribe(player);
  player.on("stateChange", (oldState, newState) => {
    // console.log(
    //   `Audio player transitioned from ${oldState.status} to ${newState.status}`
    // );
  });
}

module.exports = {
  checkAndJoinVoiceChannel,
  playStream,
};
