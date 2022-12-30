const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);
const welcomeSchema = require(`../../Models/Welcome`);
const { model, Schema } = require(`mongoose`);

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName(`setup-welcome`)
        .setDescription(`Set up your welcome message for the discord bot.`)
        .addChannelOption(option =>
            option.setName(`channel`)
                .setDescription(`Channel for welcome messages.`)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(`welcome-message`)
                .setDescription(`Enter your welcome message.`)
                .setRequired(true)
        ),

    async execute(interaction) {
        const { channel, guildId, options } = interaction;

        const welcomeChannel = options.getChannel(`channel`) || channel;
        const welcomeMessage = options.getString(`welcome-message`);
        const embed = new EmbedBuilder();

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: `I don't have permissions for this.`, ephemeral: true });
        }

        welcomeSchema.findOne({ Guild: guildId }, async (err, data) => {
            if (!data) {
                const newWelcome = await welcomeSchema.create({
                    Guild: guildId,
                    Channel: welcomeChannel.id,
                    Msg: welcomeMessage
                });

                embed.setDescription(`Data was succesfully sent to the database.`)
                    .setColor(`Green`)
                    .setTimestamp();
            } else if (data) {
                welcomeSchema.findOneAndUpdate({ Guild: guildId });
                await welcomeSchema.updateOne({
                    Guild: guildId,
                    Channel: welcomeChannel.id,
                    Msg: welcomeMessage
                });

                embed.setDescription(`Old data was succesfully replaced with the new data.`)
                    .setColor(`DarkGreen`)
                    .setTimestamp();
            }

            if (err) {
                embed.setDescription(`Something went wrong. Please contact the developers`)
                    .setColor(`Red`)
                    .setTimestamp();
            }

            return interaction.reply({ embeds: [embed], ephemeral: true });
        })
    }
}