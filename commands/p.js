//

const Discord = require('discord.js')

module.exports = (bot) => {
    const handler = async ({ args, channel }) => {
        channel.send(
            `A 'pom' or 'pomodoro' is simply a focused work session of 25 minutes. The 'Pomodoro Technique' involves alternating work periods of 25 minutes, with rest periods of 5 minutes. Every 4 work sessions, it's recommended to take a longer break of about 15 minutes.`
        )
    }

    bot.addCommand('p', handler)
    bot.addCommand('pt', handler)
}
