const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require(`discord.js`);
const welcomeSchema = require(`../../Models/Welcome`);
const { model, Schema } = require(`mongoose`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`setup-welcome`)
        .setDescription(`Set up your welcome message for the discord bot.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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

                embed
                    .setColor(`Green`)
                    .setDescription(`Data was succesfully sent to the database.`)
                    .setTimestamp();

            } else if (data) {
                logSchema.findOneAndUpdate({ Guild: guildId });
                await logSchema.updateOne({
                    Guild: guildId,
                    Channel: logChannel.id
                });

                embed
                    .setColor(`DarkGreen`)
                    .setDescription(`Old data was succesfully replaced with the new data.`)
                    .setTimestamp();
            }

            if (err) {
                console.log(err);
                embed
                    .setColor(`Red`)
                    .setDescription(`Something went wrong. Please contact my Senpai <@344340142431141890>`)
                    .setTimestamp();
            }

            return interaction.reply({ embeds: [embed], ephemeral: true });
        })
    }
}
