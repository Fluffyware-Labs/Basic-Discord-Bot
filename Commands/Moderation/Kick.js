const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`kick`)
        .setDescription(`Kick a member from the Discord server.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName(`member`)
                .setDescription(`Member to be kicked.`)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(`reason`)
                .setDescription(`Reason for the kick.`)
                .setRequired(true)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser(`member`);
        const reason = options.getString(`reason`) || `No reason provided`;

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setColor(`Red`)
            .setDescription(`You can't take action on ${user.username} since they have a higher role.`)
            .setFooter({
                iconURL: `https://i.imgur.com/9G8N5zu.png`,
                text: `Powered by Fluffy Code =^_^=`
            });

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setColor(`Red`)
            .setTitle(`Kicked!`)
            .setDescription(`Succesfully kicked ${user} with reason: ${reason}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
