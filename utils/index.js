//
//     Utility functions
//

const Discord = require('discord.js')
const util = require('util')
const fs = require('fs')
const path = require('path')

const readFile = util.promisify(fs.readFile)

module.exports = {
    hasPermission(userId, perm) {
        let user = this.getGuildMember(userId)
        let p = CONFIG().permissions

        if (!user) {
            return false
        }

        // If the user is administrator, bypass check
        if (user.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
            return true
        }

        // If the role is set as a bot admin, all ok
        if (p.admin.filter((roleId) => user.roles.has(roleId)).length) {
            return true
        }

        return false
    },

    getGuildMember(userId) {
        let guild = CLIENT().guilds.get(CONFIG().serverId)

        if (guild) {
            return guild.member(userId)
        }

        return null
    },

    async readDataFile(file) {
        file = path.join(__dirname, '..', 'data', file)

        return readFile(file, { encoding: 'UTF-8' })
    },

    randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    }
}
