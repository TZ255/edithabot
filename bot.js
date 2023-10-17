const { Telegraf } = require('telegraf')
require('dotenv').config()
const nyumbuModel = require('./database/chats')
const ugandanDb = require('./database/chats')
const kenyanDb = require('./database/kenyanDb')
const my_channels_db = require('./database/my_channels')
const kenyan_channels_db = require('./database/kenyanChannels')
const mkekadb = require('./database/mkeka')
const vidb = require('./database/db')
const mkekaMega = require('./database/mkeka-mega')
const mongoose = require('mongoose')

//functions
const convos = require('./functions/convo')
const statsFn = require('./functions/stats')
const startFn = require('./functions/start')
const mkekaFn = require('./functions/mkeka')
const postToChannelsFn = require('./functions/post_to_channels')

const bot = new Telegraf(process.env.BOT_TOKEN)
    .catch((err) => console.log(err.message))

mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}@nodetuts-shard-00-00.ngo9k.mongodb.net:27017,nodetuts-shard-00-01.ngo9k.mongodb.net:27017,nodetuts-shard-00-02.ngo9k.mongodb.net:27017/ohmyNew?ssl=true&replicaSet=atlas-pyxyme-shard-0&authSource=admin&retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to OhMyNew database')
    }).catch((err) => {
        console.log(err)
        bot.telegram.sendMessage(741815228, err.message)
    })

const imp = {
    replyDb: -1001608248942,
    pzone: -1001352114412,
    prem_channel: -1001470139866,
    local_domain: 't.me/rss_shemdoe_bot?start=',
    prod_domain: 't.me/ohmychannelV2bot?start=',
    shemdoe: 741815228,
    halot: 1473393723,
    sh1xbet: 5755271222,
    xzone: -1001740624527,
    ohmyDB: -1001586042518,
    xbongo: -1001263624837,
    mylove: -1001748858805,
    mikekaDB: -1001696592315,
    matangazoDB: -1001570087172
}

const gsb_ug = `https://track.africabetpartners.com/visit/?bta=35468&nci=5559`
const btwy_ke = `https://www.betway.co.ke/?btag=P94949-PR23061-CM60798-TS1971458&`
const btwy_tz = `https://www.betway.co.tz/?btag=P94949-PR26073-CM84774-TS1971458&`

//delaying
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

//start function
startFn(bot, ugandanDb, kenyanDb, imp)

//making convons
convos(imp, kenyanDb, ugandanDb, bot)

//checking stats
statsFn(bot, ugandanDb, kenyanDb)

//post to channels UG & KE
postToChannelsFn(my_channels_db, kenyan_channels_db, bot, imp)

bot.command('/sll', async ctx => {
    await ugandanDb.updateMany({}, { $set: { blocked: false } })
    ctx.reply('Updated')
})

bot.command('copy', async ctx => {
    try {
        if (ctx.message.reply_to_message) {
            let userid = ctx.message.reply_to_message.text
            userid = Number(userid.split('id = ')[1].split('&mid')[0].trim())

            let pid = ctx.message.text
            pid = Number(pid.split(' ')[1])

            await bot.telegram.copyMessage(userid, imp.pzone, pid)
            await ctx.reply(`msg with id ${pid} was copied successfully to user with id ${userid}`)
        }
    } catch (err) {
        console.log(err)
        await ctx.reply(err.message).catch(e => console.log(e.message))
    }
})

bot.on('channel_post', async ctx => {
    let txt = ctx.channelPost.text
    let txtid = ctx.channelPost.message_id

    try {
        if (ctx.channelPost.text) {
            if (txt.toLowerCase().includes('add me ug')) {
                let ch_id = ctx.channelPost.sender_chat.id
                let ch_title = ctx.channelPost.sender_chat.title

                let check_ch = await my_channels_db.findOne({ ch_id })
                if (!check_ch) {
                    await my_channels_db.create({ ch_id, ch_title })
                    let uj = await ctx.reply('channel added to db')
                    await bot.telegram.deleteMessage(ch_id, txtid)
                    setTimeout(() => {
                        bot.telegram.deleteMessage(ch_id, uj.message_id)
                            .catch((err) => console.log(err))
                    }, 1000)
                } else {
                    let already = await ctx.reply('Channel Already existed')
                    setTimeout(() => {
                        bot.telegram.deleteMessage(ch_id, already.message_id)
                            .catch((err) => console.log(err))
                    }, 1000)
                }
            }
            else if (txt.toLowerCase().includes('add me ke')) {
                let ch_id = ctx.channelPost.sender_chat.id
                let ch_title = ctx.channelPost.sender_chat.title

                let check_ch = await kenyan_channels_db.findOne({ ch_id })
                if (!check_ch) {
                    await kenyan_channels_db.create({ ch_id, ch_title })
                    let uj = await ctx.reply('channel added to db')
                    await bot.telegram.deleteMessage(ch_id, txtid)
                    setTimeout(() => {
                        bot.telegram.deleteMessage(ch_id, uj.message_id)
                            .catch((err) => console.log(err))
                    }, 1000)
                } else {
                    let already = await ctx.reply('Channel Already existed')
                    setTimeout(() => {
                        bot.telegram.deleteMessage(ch_id, already.message_id)
                            .catch((err) => console.log(err))
                    }, 1000)
                }
            }
        }

        if (ctx.channelPost.reply_to_message && ctx.channelPost.chat.id == imp.pzone) {
            let rp_id = ctx.channelPost.reply_to_message.message_id
            let rp_msg = ctx.channelPost.reply_to_message.text

            if (txt.toLowerCase() == 'post gal') {
                await mkekadb.create({ mid: rp_id, brand: 'gal' })
                await ctx.reply('Mkeka uko live Gal Sport')
            } else if (txt.toLowerCase() == 'post 10bet') {
                await mkekadb.create({ mid: rp_id, brand: '10bet' })
                await ctx.reply('Mkeka uko live 10bet')
            }
        }

    } catch (err) {
        console.log(err)
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
        }
    }
})

bot.command('p_videos', async ctx => {
    try {
        await bot.telegram.copyMessage(ctx.chat.id, imp.matangazoDB, 74)
    } catch (err) {
        console.log(err.message)
    }
})

bot.on('text', async ctx => {
    try {
        if (ctx.message.reply_to_message && ctx.chat.id == imp.halot) {
            if (ctx.message.reply_to_message.text) {
                let my_msg = ctx.message.text
                let myid = ctx.chat.id
                let my_msg_id = ctx.message.message_id
                let umsg = ctx.message.reply_to_message.text
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let mid = Number(ids.split('&mid=')[1])

                if (my_msg == 'block 666') {
                    await ugandanDb.findOneAndUpdate({ chatid: userid }, { blocked: true })
                    await ctx.reply(userid + ' blocked for mass massaging')
                }

                else if (my_msg == 'unblock 666') {
                    await ugandanDb.findOneAndUpdate({ chatid: userid }, { blocked: false })
                    await ctx.reply(userid + ' unblocked for mass massaging')
                }

                else {
                    await bot.telegram.copyMessage(userid, myid, my_msg_id, { reply_to_message_id: mid })
                }

            }

            else if (ctx.message.reply_to_message.photo) {
                let my_msg = ctx.message.text
                let umsg = ctx.message.reply_to_message.caption
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let mid = Number(ids.split('&mid=')[1])


                await bot.telegram.sendMessage(userid, my_msg, { reply_to_message_id: mid })
            }
        }


        else {
            let userid = ctx.chat.id
            let txt = ctx.message.text
            let username = ctx.chat.first_name
            let mid = ctx.message.message_id

            if (txt == '💰 BET OF THE DAY (🔥)') {
                await mkekaFn.sendMkeka3(ctx, delay, bot, imp)
            }
            else {
                await bot.telegram.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML', disable_notification: true })
            }
        }

    } catch (err) {
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
        }
    }
})

bot.on('photo', async ctx => {
    try {
        let mid = ctx.message.message_id
        let username = ctx.chat.first_name
        let chatid = ctx.chat.id
        let cap = ctx.message.caption

        if (ctx.message.reply_to_message && chatid == imp.halot) {
            if (ctx.message.reply_to_message.text) {
                let umsg = ctx.message.reply_to_message.text
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let rmid = Number(ids.split('&mid=')[1])


                await bot.telegram.copyMessage(userid, chatid, mid, {
                    reply_to_message_id: rmid
                })
            }

            else if (ctx.message.reply_to_message.photo) {
                let umsg = ctx.message.reply_to_message.caption
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let rmid = Number(ids.split('&mid=')[1])


                await bot.telegram.copyMessage(userid, chatid, mid, {
                    reply_to_message_id: rmid
                })
            }
        }


        else {
            await bot.telegram.copyMessage(imp.halot, chatid, mid, {
                caption: cap + `\n\nfrom = <code>${username}</code>\nid = <code>${chatid}</code>&mid=${mid}`,
                parse_mode: 'HTML'
            })
        }
    } catch (err) {
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
            console.log(err)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
            console.log(err)
        }
    }
})


bot.launch()
    .then((console.log('Bot is running')))
    .catch((err) => {
        console.log('Bot is not running')
        bot.telegram.sendMessage(imp.shemdoe, err.message)
    })


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

process.on('unhandledRejection', (reason, promise) => {
    bot.telegram.sendMessage(imp.shemdoe, reason + ' It is an unhandled rejection...')
    console.log(reason)
    //on production here process will change from crash to start cools
})

//caught any exception
process.on('uncaughtException', (err) => {
    console.log(err)
    bot.telegram.sendMessage(741815228, err.message + ' - It is uncaught exception.')
        .catch((err) => {
            console.log(err.message + ' while sending you')
            process.exit()
        })
})