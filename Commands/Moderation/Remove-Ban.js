const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setName(`remove-ban`)
        .setDescription(`Remove the ban from a user on the Discord server.`)
        .addStringOption(option =>
            option.setName(`userid`)
                .setDescription(`Discord ID of the user you want to remove the ban from.`)
                .setRequired(true)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const userId = options.getString(`userid`);

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setDescription(`Succesfully unbanned id ${userId} from the guild.`)
                .setColor(0x5fb041)
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
            });
        } catch (err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription(`Please provide a valid member's ID.`)
                .setColor(0xc72c3b);

            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}