const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`clear`)
        .setDescription(`Clear a specific amount of messages from a member or channel.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName(`amount`)
                .setDescription(`Amount of messages to clear.`)
                .setMinValue(1)
                .setMaxValue(99)
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName(`member`)
                .setDescription(`Select a member to clear their messages.`)
                .setRequired(false)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const amount = options.getInteger(`amount`);
        const target = options.getUser(`member`);

        const messages = await channel.messages.fetch({
            limit: amount + 1,
        });

        const embed = new EmbedBuilder()

        if (target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                embed
                    .setColor(`Green`)
                    .setTitle(`The mess has been cleaned!`)
                    .setDescription(`Succesfully deleted ${messages.size} messages from ${target}.`)
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            });
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                embed
                    .setColor(`DarkGreen`)
                    .setTitle(`The mess has been cleaned!`)
                    .setDescription(`Succesfully deleted ${messages.size} messages from the channel.`)
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            });
        }
    }
}
