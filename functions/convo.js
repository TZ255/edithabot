

const convos = (imp, kenyanDb, ugandanDb, bot) => {
    bot.command('convo_ke', async ctx => {
        let myId = ctx.chat.id
        let txt = ctx.message.text
        let msg_id = Number(txt.split('/convo_ke-')[1].trim())
        if (myId == imp.shemdoe || myId == imp.halot) {
            try {
                let all_users = await kenyanDb.find()

                all_users.forEach((u, index) => {
                    if (u.blocked != true) {
                        setTimeout(() => {
                            if (index == all_users.length - 1) {
                                ctx.reply('Nimemaliza convo na Kenyans')
                            }
                            bot.telegram.copyMessage(u.chatid, imp.mikekaDB, msg_id)
                                .then(() => console.log('convo sent to ' + u.chatid))
                                .catch((err) => {
                                    if (err.message.includes('blocked') || err.message.includes('initiate')) {
                                        kenyanDb.findOneAndDelete({ chatid: u.chatid })
                                            .then(() => { console.log(u.chatid + ' is deleted') })
                                    }
                                })
                        }, index * 40)
                    }
                })
            } catch (err) {
                console.log(err.message)
            }
        }

    })

    //Ugandans Convo
    bot.command('convo_ug', async ctx => {
        let myId = ctx.chat.id
        let txt = ctx.message.text
        let msg_id = Number(txt.split('/convo_ug-')[1].trim())
        if (myId == imp.shemdoe || myId == imp.halot) {
            try {
                let all_users = await ugandanDb.find()

                all_users.forEach((u, index) => {
                    if (u.blocked != true) {
                        setTimeout(() => {
                            if (index == all_users.length - 1) {
                                ctx.reply('Nimemaliza convo na ugandans')
                            }
                            bot.telegram.copyMessage(u.chatid, imp.mikekaDB, msg_id)
                                .then(() => console.log('convo sent to ' + u.chatid))
                                .catch((err) => {
                                    if (err.message.includes('blocked') || err.message.includes('initiate')) {
                                        ugandanDb.findOneAndDelete({ chatid: u.chatid })
                                            .then(() => { console.log(u.chatid + ' is deleted') })
                                    }
                                })
                        }, index * 40)
                    }
                })
            } catch (err) {
                console.log(err.message)
            }
        }

    })
}

module.exports = convos