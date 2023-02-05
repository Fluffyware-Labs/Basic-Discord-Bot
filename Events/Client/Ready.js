const { Client, ActivityType } = require('discord.js');
const config = require("../../config.json");
const mongoose = require('mongoose');
const Levels = require(`discord.js-leveling`);

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(config.mongodb || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            console.log('MongoDB connection succesful.')
        }

        Levels.setURL(config.mongodb);

        console.log("Logged in as " + client.user.tag)

        // Set the bot's presence (activity and status)
        client.user.setPresence({
            status: "online",
            activities: [{
                type: ActivityType.Playing,
                name: "with my SENPAI."
            }]
        })
    }
}
