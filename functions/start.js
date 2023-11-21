const startFn = (bot, ugandanDb, kenyanDb, imp) => {
    bot.start(async ctx => {
        let defaultReplyMkp = {
            keyboard: [
                [{ text: "💰 BET OF THE DAY (🔥)" }]
            ],
            is_persistent: true,
            resize_keyboard: true
        }
        try {
            let payLoad = ctx.startPayload

            if (payLoad) {
                if (payLoad == 'ug_whores') {
                    let user = await ugandanDb.findOne({ chatid: ctx.chat.id })
                    if (!user) {
                        await ugandanDb.create({ chatid: ctx.chat.id, username: ctx.chat.first_name, blocked: false })
                        console.log('ugandan user created')
                    }
                    await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7569, {reply_markup: defaultReplyMkp})
                }

                else if (payLoad == 'malaya_kenya') {
                    let user = await kenyanDb.findOne({ chatid: ctx.chat.id })
                    if (!user) {
                        await kenyanDb.create({ chatid: ctx.chat.id, username: ctx.chat.first_name, blocked: false })
                        console.log('kenyan user created')
                    }
                    await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7589, {reply_markup: defaultReplyMkp})
                }
            } else {
                await ctx.reply(`Welcome ${ctx.chat.first_name}\n\nTo get the best bet of the day click this command /betslip`, {
                    reply_markup: defaultReplyMkp
                })
            }
        } catch (err) {
            console.log(err.message)
        }
    })
}

module.exports = startFn