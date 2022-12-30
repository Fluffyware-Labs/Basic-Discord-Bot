const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName(`ping`)
        .setDescription(`Pong`),
        
    execute(interaction) {
        interaction.reply({ content: `Pong`, ephemeral: true })
    },
};
