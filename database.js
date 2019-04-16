//
//     Database connector
//

const globby = require('globby')
const path = require('path')
const Sequelize = require('sequelize')

module.exports = async (mysql) => {
    const db = new Sequelize(mysql.database, mysql.user, mysql.password, {
        host: mysql.host,
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 1
        },

        logging: false
    })

    // await db.authenticate()

    return {
        db,
        models: await loadModels(db)
    }
}

const loadModels = async (db) => {
    const files = await globby(path.join(__dirname, 'models'))
    const mods = files.map((f) => require(f))
    let models = {}

    // Call install on all of them
    for (let mod of mods.filter((m) => typeof m.install === 'function')) {
        mod.install(db, models)
    }

    // Call associate on all of them
    for (let mod of mods.filter((m) => typeof m.associate === 'function')) {
        mod.associate(db, models)
    }

    return models
}
