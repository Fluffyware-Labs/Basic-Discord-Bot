const { EmbedBuilder } = require("@discordjs/builders");
const { GuildMember, Embed, InteractionCollector } = require("discord.js");
const Schema = require("../../Models/Welcome");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        Schema.findOne({ Guild: member.guild.id }, async (err, data) => {
            if (!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";

            const { user, guild } = member;
            const welcomeChannel = member.guild.channels.cache.get(data.Channel);

            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x037821)
                .setTitle("**New member!**")
                .setThumbnail(member.user.displayAvatarURL())
                .setDescription(`${member.user}` + data.Msg + `\n\n(USER TAG:\`${member.user.tag}\`)\n(USER ID:\`${member.user.id}\`)`)
                .addFields({ name: 'Total members', value: `${guild.memberCount}` })
                .setTimestamp();

            welcomeChannel.send({ embeds: [welcomeEmbed] });
        })
    }
}
