const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require(`discord.js`);
const logSchema = require(`../../Models/Logs`);
const { model, Schema } = require(`mongoose`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`setup-logs`)
        .setDescription(`Set up your logging channel for the audit logs.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName(`channel`)
                .setDescription(`Channel for logging messages.`)
                .setRequired(true)
        ),

    async execute(interaction) {
        const { channel, guildId, options } = interaction;

        const logChannel = options.getChannel("channel") || channel;
        const embed = new EmbedBuilder();

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: "I don't have permissions for this.", ephemeral: true });
        }

        logSchema.findOne({ Guild: guildId }, async (err, data) => {
            if (!data) {
                const newLogs = await logSchema.create({
                    Guild: guildId,
                    Channel: logChannel.id
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
