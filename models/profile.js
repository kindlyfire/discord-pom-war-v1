//

const Seq = require('sequelize')

module.exports = {
    install(db, models) {
        models.Profile = db.define('profiles', {
            guildId: Seq.STRING(20),
            userId: Seq.STRING(20),
            tag: Seq.STRING(64),
            avatarURL: Seq.TEXT,
            pomCount: { type: Seq.INTEGER, defaultValue: 0 }
        })
    }
}
