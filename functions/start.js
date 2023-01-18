const startFn = (bot, ugandanDb, kenyanDb, imp) => {
    bot.start(async ctx => {
        try {
            let payLoad = ctx.startPayload
    
            if (payLoad) {
                if (payLoad == 'ug_whores') {
                    let user = await ugandanDb.findOne({ chatid: ctx.chat.id })
                    if (!user) {
                        await ugandanDb.create({ chatid: ctx.chat.id, username: ctx.chat.first_name, blocked: false })
                        console.log('ugandan user created')
                    }
                    await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7569)
                }
    
                else if (payLoad == 'malaya_kenya') {
                    let user = await kenyanDb.findOne({ chatid: ctx.chat.id })
                    if (!user) {
                        await kenyanDb.create({ chatid: ctx.chat.id, username: ctx.chat.first_name, blocked: false })
                        console.log('kenyan user created')
                    }
                    await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7589)
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    
    })
}

module.exports = startFn