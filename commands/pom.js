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
            args = ['+']
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
            let guildPomCount = profiles.reduce(
                (p, c) => (c.pomCount > 2 ? p + c.pomCount : p),
                0
            )

            return channel.send(
                `${member}, **+1!**  ✅  ${
                    g.name
                } now has ${guildPomCount} poms. You've contributed ${
                    profile.pomCount
                }.`
            )
        }

        // Reserved section: add or remove multiple poms to other users
        if (
            !member.hasPermission(
                Discord.Permissions.FLAGS.ADMINISTRATOR,
                false,
                true,
                true
            ) &&
            g.managerRoleIds.filter((rId) => member.roles.has(rId)).length === 0
        ) {
            return channel.send(
                '❌ You may only add one pom at a time (`!pom`)'
            )
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

        let n = parseInt(args[0].replace('^', ''))

        if (args[0] === 'reset') {
            targetProfile.pomCount = 0
        } else if (!isNaN(n)) {
            if (args[0].charAt(0) === '^') {
                targetProfile.pomCount = Math.abs(n)
            } else {
                targetProfile.pomCount += n
            }
        }

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
