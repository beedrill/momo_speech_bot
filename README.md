# Momo Bot - A Text-To-Speech (TTS) Discord Robot
This is a simple bot that joins your voice channel and pronounce speech from your text. This bot is based on [Azure Cognitive Service](https://azure.microsoft.com/en-us/services/cognitive-services/#overview). One can quickly deploy a TTS bot based on this source code.

## Deploy Guide
### Create a Discord Bot
Follow [this tutorial](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) to create your bot, remember to copy your token.

After creating your Bot, you can follow [this tutorial](https://v12.discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links) to get the link to add your bot. Note that the client_id in the link needs to be changed to your `application id` from your Discord developer portal.

### Create Azure Subscription and Resource
1. [create an Azure subscription](https://azure.microsoft.com/en-us/free/cognitive-services/)
2.  [create a speech resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices)
3.  Get the resource key and region. After your Speech resource is deployed, select Go to resource to view and manage keys. For more information about Cognitive Services resources, see [Get the keys for your resource](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Cwindows#get-the-keys-for-your-resource).

### Install Dependency and prerequirement
To run this bot, you'll need:
- [NodeJS (16 or newer)](https://nodejs.org/)

After you install NodeJS, you can install all project dependency:
```bash
npm i
``` 

### Create config.json file
You'll need to create a `config.json` file to contain all your personalized informations, a config.json file looks like this:
```json
{
    "discordToken": "OTk1ND**********************WyI",
    "discordClientId": "9954************************",
    "azureResourceKey": "bf8dc3***********************",
    "azureRegion": "eastus"
}
```
where you can find your **discordClientId** and **discordToken** from the [discord developer portal](https://discord.com/developers). The Azure resource key and region can be found from [this link](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Cwindows#get-the-keys-for-your-resource).

put your config.json file at the root directory of this project.

### Start the bot
Now you can start your bot by:
```bash
node index.js
```

### Personalize your language preference
By default, the bot is using `en-US-JennyNeural` voice and English language. You can specify your own by modifying the `config.json` file's **'speechSynthesisVoiceName'** field. You can find the list of different voice here.