//
//     State Configuration
//

const util = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const merge = require('deepmerge')

module.exports = class JSONConfig {
    constructor() {
        this.data = {}
    }

    async load(file) {
        this.file = file

        try {
            let contents = await readFile(file)

            this.data = JSON.parse(contents)
        } catch (e) {
            LOGGER().info({ error: e, file }, 'Unable to load JSONConfig file')
        }
    }

    get(term, defaults = null) {
        if (defaults) {
            return merge(defaults, this.data[term] || {})
        }

        return this.data[term]
    }

    set(term, v) {
        this.data[term] = v
    }

    async save() {
        if (this.file) {
            return writeFile(this.file, JSON.stringify(this.data))
        }
    }
}
