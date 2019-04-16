//
//     !pom command
//

module.exports = (bot) => {
    const handler = ({ channel }) => {
        channel.send('Ok !')
    }

    bot.addCommand('pom', handler)
}
