//
//     Bot configuration file
//

module.exports = {
    token: '',
    prefix: '!',

    guilds: [
        {
            id: '320183239304282112',
            name: 'Potential Central',
            slug: 'PC',
            managerRoleIds: [
                '321273060848304129',
                '479334433447608331',
                '554398692678041610',
                '553279234592866317'
            ],
            allowedChannels: ['570585267363119149', '456491387039252491']
        },
        {
            id: '382364344731828224',
            name: 'Knights of Academia',
            slug: 'KOA',
            managerRoleIds: ['528679110449561610', '547898687578177540'],
            allowedChannels: ['570690305930821663', '545718363012333569']
        }
    ],

    permissions: {
        admin: ['111473417932242944']
    },

    // MySQL database information
    mysql: {
        host: 'localhost',
        user: '',
        database: '',
        password: ''
    }
}
