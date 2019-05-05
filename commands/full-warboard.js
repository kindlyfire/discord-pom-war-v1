//

const Discord = require('discord.js')

module.exports = async (bot) => {
    const handler = async ({ guild, channel, member, args }) => {
        const g = CONFIG().guilds.find((g) => g.id === guild.id)

        if (!g.managerRoleIds.some((rId) => member.roles.has(rId))) {
            return
        }

        if (args.length === 0) {
            return channel.send(
                '<:error:570673749934997515> Usage: `!full-warboard <server> [page]`'
            )
        }

        const targetGuild = CONFIG().guilds.find(
            (g) => g.slug.toLowerCase() === args[0].toLowerCase()
        )

        if (!targetGuild) {
            return channel.send(
                `<:error:570673749934997515> Couldn't find server \`${
                    args[0]
                }\`.`
            )
        }

        const profiles = await MODELS().Profile.findAll({
            where: {
                guildId: targetGuild.id
            },
            order: [['pomCount', 'DESC']],
            attributes: ['pomCount', 'tag']
        })

        const pageNumber = args.length > 1 ? parseInt(args[1]) : 1
        const pageCount = Math.ceil(profiles.length / 10)

        if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > pageCount) {
            return channel.send(
                `<:error:570673749934997515> That page number couldn't be found. It currently needs to be between **1** and **${pageCount}**`
            )
        }

        const startIndex = (pageNumber - 1) * 10

        return channel.send({
            embed: new Discord.RichEmbed()
                .setColor(0xff0000)
                .setTitle('\\🍅  PC-KOA Pomodoro War Leaderboard  \\🍅')
                .setDescription(
                    `Leaderboard for all pomodoros in ${
                        targetGuild.name
                    }, page ${pageNumber}.\n\n` +
                        profiles
                            .slice(startIndex, startIndex + 10)
                            .map(
                                (p, i) =>
                                    `\`${startIndex +
                                        i +
                                        1}.\` ${UTILS().formatTag(p.tag)} (${
                                        p.pomCount
                                    })`
                            )
                            .join('\n')
                )
                .setFooter(`Page ${pageNumber}/${pageCount}`)
        })
    }

    bot.addCommand('full-warboard', handler)
}
