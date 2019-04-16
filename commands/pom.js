//
//     !pom command
//

const Discord = require('discord.js')

module.exports = (bot) => {
    const handler = async ({
        message,
        channel,
        profile,
        args,
        guild,
        member
    }) => {
        if (args.length === 0) {
            // Statistics message
            return channel.send({
                embed: await embeds.StatsEmbed()
            })
        }

        let action = args[0]
        let g = CONFIG().guilds.find((g) => g.id === guild.id)

        if (args.length === 1 && action === '+') {
            // Add one pom to the message author
            profile.pomCount += 1
            await profile.save()

            let profiles = await MODELS().Profile.findAll({
                where: {
                    guildId: guild.id
                },
                attributes: ['userId', 'pomCount']
            })
            let guildPomCount = profiles.reduce((p, c) => p + c.pomCount, 0)

            return channel.send(
                `✅ ${g.name} now has ${guildPomCount} poms. You have tracked ${
                    profile.pomCount
                } of those.`
            )
        }

        // Reserved section: add or remove multiple poms to other users
        if (
            g.managerRoleIds.filter((rId) => member.roles.has(rId)).length === 0
        ) {
            return channel.send('❌ You may only use `!pom` and `!pom +`.')
        }

        if (message.mentions.members.size === 0) {
            return channel.send(
                '❌ Please @mention the user you would like to act on'
            )
        }

        let targetUser = message.mentions.members.random().user
        const targetUserInfo = {
            tag: targetUser.tag,
            avatarURL: targetUser.avatarURL
        }
        let [targetProfile, _] = await MODELS().Profile.findOrCreate({
            where: {
                guildId: guild.id,
                userId: targetUser.id
            },
            defaults: targetUserInfo
        })

        if (
            targetProfile.tag !== targetUserInfo.tag ||
            targetProfile.avatarURL !== targetUserInfo.avatarURL
        ) {
            targetProfile.tag = targetUserInfo.tag
            targetProfile.avatarURL = targetUserInfo.avatarURL

            await targetProfile.save()
        }

        let prev = targetProfile.pomCount
        let n = parseInt(args[0])
        targetProfile.pomCount += isNaN(n) ? 0 : n
        await targetProfile.save()
        let tagParts = targetProfile.dataValues.tag.split('#')

        return channel.send(
            `✅ Updated the pomodoro count for user **${tagParts[0]}**#${
                tagParts[1]
            } from **${prev}** to **${targetProfile.pomCount}**.`
        )
    }

    bot.addCommand('pom', handler)
}

const embeds = {
    DefaultEmbed() {
        return new Discord.RichEmbed()
            .setColor(0xbaed91)
            .setTitle('🍅  PC-KOA Pomodoro Event  🍅')
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
