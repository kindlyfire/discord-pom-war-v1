//
//     Bot Class
//

const Discord = require('discord.js')
const globby = require('globby')

const CommandManager = require('./CommandManager')

module.exports = class Bot {
    constructor(c) {
        this._logger = c.logger
        this._prefix = c.prefix
        this._client = null
        this._commands = new CommandManager(this)
    }

    // Connect the Discord client
    connect(token) {
        this._client = new Discord.Client()

        this._client.setMaxListeners(1000)
        this._client.on('error', (e) => {
            this._logger.warn({ error: e }, 'Client error')

            if (e.code === 'EHOSTUNREACH' || e.code === 'EAI_AGAIN') {
                // Exit the program to allow it to be rebooted by the supervisor
                setTimeout(() => process.exit(1), 250)
            }
        })
        this._client.on('message', (...a) => this._commands.handle(...a))

        return new Promise((resolve, reject) => {
            this._client.login(token)
            this._client.once('ready', resolve)
        })
    }

    // Require any execute any file matched by the paths
    // Autoloader of some kind
    async autoexec(paths, args = []) {
        let files = await globby(paths)

        for (let file of files) {
            let mod = require(file)

            try {
                if (typeof mod === 'function') {
                    mod(...args)
                } else throw new Error('Module is not a function')
            } catch (e) {
                this._logger.warn({ file, error: e }, 'Unable to autoexec file')
                console.log(e)
            }
        }
    }

    //
    //     GETTERS & SETTERS
    //

    getClient() {
        return this._client
    }

    getPrefix() {
        return this._prefix
    }

    //
    //     PROXIES
    //

    addCommand(...a) {
        this._commands.addCommand(...a)
    }

    addMiddleware(...a) {
        this._commands.addMiddleware(...a)
    }
}
