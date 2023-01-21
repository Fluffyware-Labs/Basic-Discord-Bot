const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const verifiedSchema = require(`../../Models/Verified`);
const { model, Schema } = require(`mongoose`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`setup-verify`)
        .setDescription(`Set your verification channel.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName(`channel`)
                .setDescription(`Send verification embed in this channel.`)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(`verification-message`)
                .setDescription(`Enter your verification message.`)
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("verification-role")
                .setDescription("Enter your verification role.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const { channel, guildId, options } = interaction;

        const verificationChannel = options.getChannel(`channel`) || channel;
        const verificationMessage = options.getString(`verification-message`);
        const roleId = options.getRole("verification-role");
        const embed = new EmbedBuilder();

        const verifyEmbed = new EmbedBuilder()
            .setTitle("Verification")
            .setDescription(verificationMessage)
            .setColor(`0xFF0066`);

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: `I don't have permissions for this.`, ephemeral: true });
        }

        verifiedSchema.findOne({ Guild: guildId }, async (err, data) => {
            if (!data) {
                const newVerified = await verifiedSchema.create({
                    Guild: guildId,
                    Channel: verificationChannel.id,
                    Msg: verificationMessage,
                    Role: roleId.id
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

            return interaction.reply({ embeds: [embed], ephemeral: true }),
                await verificationChannel.send({
                    embeds: [verifyEmbed],
                    components: [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel(`Verify`).setCustomId(`role-` + roleId),
                        ),
                    ],
                });
        })
    }
}
