//
//     Pomodoro Event Bot
//
// Author: Tijl Van den Brugghen <me@tijlvdb.me>
//

const bunyan = require('bunyan')
const path = require('path')
const database = require('./database')
const Bot = require('./bot')
const utils = require('./utils')
const JSONConfig = require('./utils/json-config')

// Setup logging
const logger = bunyan.createLogger({
    name: 'pom-event-bot',
    level: 'debug'
})

if (!['production', 'development'].includes(process.env.NODE_ENV)) {
    process.env.NODE_ENV = 'development'

    logger.info(`Updated environment to ${process.env.NODE_ENV}`)
}

const config = require('./config_' + process.env.NODE_ENV)

const startup = async () => {
    const bot = new Bot({
        logger: logger.child({ component: 'Bot' }),
        prefix: config.prefix
    })

    // Load database and models
    const { db, models } = await database(config.mysql)
    logger.debug('Database[connected]')

    // Set globals
    global.BOT = () => bot
    global.LOGGER = () => logger
    global.CONFIG = () => config
    global.CLIENT = () => bot.getClient()
    global.MODELS = () => models
    global.DB = () => db
    global.UTILS = () => utils

    // Connect to Discord
    await bot.connect(config.token)

    // Load command handlers
    await bot.autoexec(path.join(__dirname, 'commands'), [bot])

    // Load different components
    await bot.autoexec(path.join(__dirname, 'components', '*', 'index.js'), [
        bot
    ])

    logger.debug('Bot[connected]')
}

startup().catch((e) => {
    if (e.name === 'SequelizeConnectionRefusedError') {
        logger.fatal('Unable to connect to the MySQL database')
        return
    }

    logger.fatal({ error: e }, 'Startup failed')
    console.error(e)
})
