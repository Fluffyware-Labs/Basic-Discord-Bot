# Basic Discord Bot
The files to create a basic Discord bot.

You will need to type "npm i" in terminal before proceeding, so all the packages will be installed automatically.

Input the relvant infomation into the files...

**config.json**
- token
- mongodb

**../Commands/General/Suggest.js**
- Line #31 const channel = guild.channels.cache.get\`**put your suggestion channel id here**\`); // Replace `Channel_ID_#` with your channel ID# eg. `1234567890`

**../Commands/General/Update.js**
- Line #61 client.user.setActivity(activity, { type: ActivityType.Streaming, url: `your twitch url` }); // replace `your twitch url` with your Twitch URL eg. `https://www.twitch.tv/username`
