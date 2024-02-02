const mkekaMega = require('../database/mkeka-mega')
const waombajiModel = require('../database/waombaji')

const sendMkeka3 = async (ctx, delay, bot, imp) => {
    let defaultReplyMkp = {
        keyboard: [
            [
                { text: "💰 BET OF THE DAY (🔥)" }
            ]
        ],
        is_persistent: true,
        resize_keyboard: true
    }
    try {
        await ctx.sendChatAction('typing')
        await delay(1000)
        let nairobi = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let keka = await mkekaMega.find({ date: nairobi })
        await waombajiModel.findOneAndUpdate({ pid: '22bet' }, { $inc: { mk3: 1 } })
        let txt = `<b><u>🔥 Bet of the Day [ ${nairobi} ]</u></b>\n\n\n`
        let odds = 1
        if (keka.length > 0) {
            for (let m of keka) {
                txt = txt + `<u><i>${m.date},  ${m.time}</i></u>\n⚽️ ${m.match}\n<b>✅ ${m.bet}</b>\n<i>💰 Odds: ${m.odds}</i> \n\n\n`
                odds = (odds * m.odds).toFixed(2)
            }

            let bwTZ = `https://mkekawaleo.com/betway-tz/register`
            let gsb = 'https://mkekawaleo.com/gsb-tz/register'
            let pm = `https://pmaff.com/?serial=61291818&creative_id=1788`
            let ke = `https://mkekawaleo.com/22bet/register`
            let ug = `https://mkekawaleo.com/22bet/register`
            let t22 = `https://mkekawaleo.com/22bet-tz/register`
            let prm = `https://mkekawaleo.com/premierbet/register`

            let finaText = txt + `<b>🔥 Total Odds: ${odds}</b>\n\n▬▬▬▬▬▬▬▬▬▬▬▬\n\nThese bet options are available at <b>22bet</b> with a 200% bonus on your 1st deposit\n\n<b>✓ Register Now \n\n👤 (Kenya 🇰🇪)\n<a href="${ke}">https://22bet.co.ke/register\nhttps://22bet.co.ke/register</a>\n\n👤 (Uganda 🇺🇬)\n<a href="${ug}">https://22bet.ug/register</a>\n\n👤 (Tanzania 🇹🇿)\n<a href="${gsb}">https://22bet.co.tz/register</a>\n\n\n\n#WinWithEditha</b>`

            await ctx.reply(finaText, { parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: defaultReplyMkp })
        } else {
            await ctx.sendChatAction('typing')
            setTimeout(() => {
                ctx.reply('No available bets at this time... please try again later')
                    .catch(e => console.log(e.message))
            }, 1000)
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    sendMkeka3
}