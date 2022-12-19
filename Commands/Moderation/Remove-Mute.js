const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setName(`remove-mute`)
        .setDescription(`Remove the mute from a user on the Discord server.`)
        .addUserOption(option =>
            option.setName(`user`)
                .setDescription(`Select the user you wish to remove the mute from.`)
                .setRequired(true)
        ),

    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser(`user`);
        const member = guild.members.cache.get(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`Something went wrong. Please try again later.`)
            .setColor(0xc72c3b)

        const succesEmbed = new EmbedBuilder()
            .setTitle(`**:white_check_mark: Unmuted**`)
            .setDescription(`Succesfully unmuted ${user}.`)
            .setColor(0x5fb041)
            .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true }); // this if statement is optional (but recommended)

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(null);

            interaction.reply({ embeds: [succesEmbed], ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    }
}