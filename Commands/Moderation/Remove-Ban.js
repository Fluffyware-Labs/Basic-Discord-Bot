const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`remove-ban`)
        .setDescription(`Remove the ban from a user in the Discord server.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option.setName(`userid`)
                .setDescription(`Discord ID of the user you want to unban.`)
                .setRequired(true)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const userId = options.getString(`userid`);

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Ban removed!`)
                .setDescription(`Succesfully unbanned id ${userId} from the guild.`)
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
            });
        } catch (err) {
            console.log(err);
            embed
            .setColor(`Red`)
            .setDescription(`Something went wrong. Please contact my Senpai <@344340142431141890>`)
            .setTimestamp();

            const errEmbed = new EmbedBuilder()
                .setColor(`Red`)
                .setTitle(`Kicked!`)
                .setDescription(`Please provide a valid member's ID.`)
                .setTimestamp();

            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}
