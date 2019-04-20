//

const Discord = require('discord.js')

module.exports = (bot) => {
    const handler = async ({ args, channel }) => {
        if (args.length > 0) {
            if (
                args.length === 1 &&
                (args[0].toLowerCase() === 'commands' ||
                    args[0].toLowerCase() === 'command')
            ) {
                channel.send({
                    embed: embeds.CommandsEmbed()
                })
            } else {
                channel.send(
                    `❌ Invalid options. Possible options: \`commands\`.`
                )
            }

            return
        }

        channel.send({
            embed: embeds
                .DefaultEmbed()
                .setDescription(
                    `The **PC-KOA** Pomodoro Event is a battle between Potential Central and Knights of Academia during the entire month of May. The goal is to get as many Pomodoros done every day as possible.`
                )
        })
    }

    bot.addCommand('event', handler)
    bot.addCommand('events', handler)
}

const embeds = {
    DefaultEmbed() {
        return new Discord.RichEmbed()
            .setColor(0xe74c3c)
            .setTitle('🍅  PC-KOA Pomodoro War  🍅')
    },

    CommandsEmbed() {
        return this.DefaultEmbed()
            .setDescription(
                'Description of the different event-related commands.'
            )
            .addField(
                '!event [commands]',
                `Show information about the war or the commands for this bot.`
            )
            .addField(
                '!pom',
                `Count a pom for you. It will be added to the server counter as well.`
            )
            .addField(
                '!warboard',
                `See the total pomodoros slain by PC and KOA.`
            )
    }
}
