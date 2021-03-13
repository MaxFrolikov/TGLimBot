const TOKEN = require('./key').token
const TelegramBot = require('node-telegram-bot-api'); 
const bot = new TelegramBot(TOKEN, {polling: true});

chats = new Map()
spm = new Map()
tmr = []


bot.on('message', (msg) => {if(msg.text == undefined){let id
	chats.set(msg.chat.id, [msg.from.id, (msg.from.username || msg.from.first_name) + ':\n', id])
}})


bot.on('text', (msg) => {
	let cId = msg.chat.id
	let uId = msg.from.id
	let id 
	let txt = (msg.from.username || msg.from.first_name) + ':\n'
	
	if(!chats.has(cId)) chats.set(cId, [uId, txt, id])
	
	let arr = chats.get(cId)
	
	if(arr[0] != uId) arr = [uId, txt, id]
	
	arr[1] += '\n-> ' + msg.text
	arr.push(msg.message_id)
	

	if(arr[2]){
		bot.deleteMessage(cId, msg.message_id)

		if(spm.has(cId)){
			clearTimeout(tmr[`${cId}`])
			tmr[`${cId}`] = setTimeout(() => {
				bot.editMessageText(arr[1], {
					chat_id: cId,
					message_id: arr[2]
				})
			}, 1500)
		}
		else {
			bot.editMessageText(arr[1], {
				chat_id: cId,
				message_id: arr[2]
			})
			clearTimeout(tmr[`${cId}`])
		}
		spm.set(cId)
		setTimeout(() => spm.delete(cId), 3000)
	}

	if(arr.length == 6 ){
		for(let i = 3; i < arr.length; i++){
			bot.deleteMessage(cId, arr[i])
		}
		bot.sendMessage(cId, arr[1]).then((mss) => {
			arr[2] = mss.message_id
		})
	}
	chats.set(cId, arr)
})