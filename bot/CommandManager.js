//
//     Command manager
//

const Discord = require('discord.js')

module.exports = class CommandManager {
    constructor(bot) {
        this._bot = bot

        this._commands = new Discord.Collection()
        this._middleware = []
    }

    // Handle a Discord message
    handle(message) {
        if (
            message.author.bot ||
            !message.guild ||
            message.guild.id !== CONFIG().serverId
        ) {
            return
        }

        const content = message.content.trim()
        const prefix = this._bot.getPrefix()
        const parts = content.split(' ')

        if (content !== prefix.trim() && !content.startsWith(prefix)) {
            return
        }

        let args = content
            .slice(prefix.length)
            .trim()
            .split(/ +/g)

        // Make sure to have at least one empty arg
        args = args.length === 0 ? [''] : args

        const command = args.shift().toLowerCase()
        const handler = this._commands.get(command)

        if (handler) {
            this.execchain([...this._middleware, handler], {
                message,
                args,
                prefix,
                parts,
                command,
                channel: message.channel,
                author: message.author
            })
        }
    }

    // Execute a chain of middleware
    async execchain(callbacks, param) {
        let exec = async (i) => {
            if (i >= callbacks.length) {
                return
            }

            await callbacks[i](param, () => exec(i + 1))
        }

        await exec(0)
    }

    // Add a command
    addCommand(name, callback) {
        if (typeof name !== 'string' || typeof callback !== 'function') {
            throw new Error('addCommand called with invalid arguments')
        }

        this._commands.set(name, callback)
    }

    // Add middleware
    addMiddleware(callback) {
        if (typeof callback !== 'function') {
            throw new Error('addMiddleware called with invalid callback')
        }

        this._middleware.push(callback)
    }
}
