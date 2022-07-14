const {
  joinVoiceChannel,
  createAudioPlayer,
  demuxProbe,
  createAudioResource,
  NoSubscriberBehavior,
  EndBehaviorType,
} = require("@discordjs/voice");
const wavConverter = require("wav-converter");
const prism = require("prism-media");
const { streamToBuffer } = require("./stream");

async function probeAndCreateResource(readableStream) {
  const { stream, type } = await demuxProbe(readableStream);
  return createAudioResource(stream, { inputType: type });
}

async function checkAndJoinVoiceChannel(
  interaction,
  options = {},
  noCleanup = false
) {
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
        console.log(
          `Connection transitioned from ${oldState.status} to ${newState.status}`
        );
      if (newState.status == "disconnected") {
        connection.destroy();
      }
    });
    if (!noCleanup) {
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
    }
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

async function receiveAudioToWav(receiver, userId) {
  const opusStream = receiver.subscribe(userId, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 1000,
    },
  });
  const opusDecoder = new prism.opus.Decoder({
    frameSize: 960,
    channels: 2,
    rate: 48000,
  });
  var ms = opusStream.pipe(opusDecoder);
  var pcmData = await streamToBuffer(ms);
  console.log('recording done')
  var wavData = wavConverter.encodeWav(pcmData, {
    numChannels: 2,
    sampleRate: 48000,
    byteRate: 16,
  });
  return wavData;
}

module.exports = {
  checkAndJoinVoiceChannel,
  playStream,
  receiveAudioToWav,
};
