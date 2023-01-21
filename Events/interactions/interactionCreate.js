const { CommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const { customId, values, guild, member } = interaction;
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({ content: "outdated command" });
      }
      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      {
        const [name, ...params] = interaction.customId.split("-")

        const button = client.buttons.get(name)

        if (!button) return
        button.run(client, interaction, params)
      }
    } else if (interaction.isStringSelectMenu()) {
      if (customId == "reaction-roles") {
        for (let i = 0; i < values.length; i++) {
          const roleId = values[i];

          const role = guild.roles.cache.get(roleId);
          const hasRole = member.roles.cache.has(roleId);

          switch (hasRole) {
            case true:
              member.roles.remove(roleId);
              break;
            case false:
              member.roles.add(roleId);
              break;
          }
        }

        interaction.reply({ content: "Roles updated.", ephemeral: true });
      }
    } else {
      return;
    }
  }
}
