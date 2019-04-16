//
//     Middleware to load user profile in context
//

module.exports = (bot) => {
    const Profile = MODELS().Profile

    bot.addMiddleware(async (ctx, next) => {
        const userInfo = {
            tag: ctx.author.tag,
            avatarURL: ctx.author.avatarURL
        }

        let [profile, _] = await Profile.findOrCreate({
            where: {
                guildId: ctx.guild.id,
                userId: ctx.author.id
            },
            defaults: userInfo
        })

        if (
            profile.tag !== userInfo.tag ||
            profile.avatarURL !== userInfo.avatarURL
        ) {
            profile.tag = userInfo.tag
            profile.avatarURL = userInfo.avatarURL

            await profile.save()
        }

        ctx.profile = profile

        return next()
    })
}
