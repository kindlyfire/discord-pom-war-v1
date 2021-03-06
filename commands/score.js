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
                order: [['pomCount', 'DESC']],
                attributes: ['pomCount', 'tag']
            })
            let guildPomCount = profiles.reduce(
                (p, c) => (c.pomCount > 2 ? p + c.pomCount : p),
                0
            )
            let profileCount = profiles.filter((p) => p.pomCount > 2).length

            embed.addField(
                `${guild.slug} Pomodoros`,
                `**${guildPomCount}** pomodoros by ${profileCount} members.\nAverage of ~${Math.round(
                    guildPomCount / profileCount
                )} poms/member.\n\nTop five pommers:\n${profiles
                    .slice(0, 5)
                    .map(
                        (p, i) =>
                            '`' +
                            (i + 1) +
                            '.`' +
                            UTILS().formatTag(p.tag) +
                            ' (' +
                            p.pomCount +
                            ')'
                    )
                    .join('\n')}`,
                true
            )
        }

        return embed
    }
}
