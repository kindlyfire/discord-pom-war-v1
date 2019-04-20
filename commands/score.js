//

const Discord = require('discord.js')

module.exports = (bot) => {
    bot.addCommand('warboard', async ({ channel }) => {
        return channel.send({
            embed: await embeds.StatsEmbed()
        })
    })
}

const embeds = {
    DefaultEmbed() {
        return new Discord.RichEmbed()
            .setColor(0xff0000)
            .setTitle('🍅  PC-KOA Pomodoro War  🍅')
    },

    async StatsEmbed() {
        let guilds = CONFIG().guilds

        let embed = this.DefaultEmbed().setDescription(
            `Statistics for the current Pomodoro Event between ${guilds
                .slice(0, -1)
                .map((g) => g.name)
                .join(', ')} and ${guilds[guilds.length - 1].name}:`
        )

        for (let guild of guilds) {
            let profiles = await MODELS().Profile.findAll({
                where: {
                    guildId: guild.id
                },
                attributes: ['userId', 'pomCount']
            })
            let guildPomCount = profiles.reduce((p, c) => p + c.pomCount, 0)

            embed.addField(
                `${guild.slug} Pomodoros`,
                `**${guildPomCount}** pomodoros by ${
                    profiles.filter((p) => p.pomCount > 0).length
                } members`,
                true
            )
        }

        return embed
    }
}
