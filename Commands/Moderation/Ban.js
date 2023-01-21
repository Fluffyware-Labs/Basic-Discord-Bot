const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ban`)
        .setDescription(`Ban a member from the Discord server.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName(`member`)
                .setDescription(`Member to be banned.`)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(`reason`)
                .setDescription(`Reason for the ban.`)
                .setRequired(true)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser(`member`);
        const reason = options.getString(`reason`) || `No reason provided.`;

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`You can't take action on ${user.username} since they have a higher role.`)
            .setColor(0xc72c3b);

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        await member.ban({ reason });

        const embed = new EmbedBuilder()
            .setColor(`Red`)
            .setTitle(`Banned!`)
            .setDescription(`Succesfully banned ${user} with reason: ${reason}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
