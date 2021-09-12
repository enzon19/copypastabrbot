process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const token = process.env['telegram_token'];
const bot = new TelegramBot(token, { polling: true });
const axios = require("axios");
const fs = require('fs');

let returned;
let pathSettings = fs.readFileSync(__dirname + '/settings.json');
let settings = JSON.parse(pathSettings);
const options = ["do desenvolvedor do bot", "da Wiki Fandom", "do Reddit"]

bot.on('message', (msg) => {

	let content = msg.text.toString().toLowerCase();

	if (content.startsWith("/")) {

		switch (content) {

			case '/start':
			case '/start@copypastabrbot':

				bot.sendMessage(msg.chat.id, '<b>Copypasta Bot (copypastabrbot)</b>\n\nO Copypasta Bot funciona através do modo inline, ou seja, ao escrever @copypastabrbot e pesquisar por uma copypasta. Envie /bancodedados para alterar o banco de dados das copypastas. <a href="https://github.com/enzon19/copypastabrbot">Qualquer pessoa pode usar o bot, ver o código principal e criar códigos baseados</a>.\n\n<i>O desenvolvedor deste bot leva a privacidade a sério, por isso você pode checar a <a href="https://telegra.ph/Pol%C3%ADtica-de-Privacidade-do-Copypasta-Bot-09-11">política de privacidade informal</a>.</i>\n\nCaso tenha alguma dúvida, envie /ajuda.\n\n<i>Versão do bot: 0.1 (BETA)</i>', { parse_mode: "HTML", disable_notification: true, disable_web_page_preview: true, reply_markup: {inline_keyboard: [[{text: "Começar a usar o bot", switch_inline_query: ""}]]}});

			break;

			case '/bancodedados':
			case '/bancodedados@copypastabrbot':

				if (settings[msg.from.id] == undefined) {
					
					settings[msg.from.id] = {
						"choosed": 0,
						"timeframe": "year",
						"listing": "hot"
					}

					fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 4));
					
				}

				bot.sendMessage(msg.chat.id, `*O que são bancos de dados?*\n\nÉ uma coleção de dados para facilitar pesquisas, no caso do nosso bot, as copypastas.\n\n*Quais são os bancos de dados para o bot?*\n\nO banco de dados do desenvolvedor do bot, o banco de dados da [Wiki Fandom Copypasta BR](https://copypasta-br.fandom.com/pt-br/wiki/Wiki_Copypasta_BR) e o banco de dados do [Subreddit Copypastabr](https://www.reddit.com/r/copypastabr/).\n\n*Qual é a diferença entre eles?*\n\n*Banco de Dados do Desenvolvedor do Bot (padrão)*:\n• Administração melhor, maior estabilidade e maior velocidade\n• As copypastas podem ser personalizadas\n• Não contém material inadequado\n• Menor quantidade de copypastas\n\n*Banco de Dados da Wiki Fandom Copypasta BR*:\n• Administração e edição feita por qualquer um da internet, menor estabilidade e velocidade média\n• As copypastas não podem ser personalizadas\n• Contém material inadequado\n• Quantidade de copypastas média\n\n*Banco de Dados do Subreddit Copypastabr*:\n• Administração e edição feita por qualquer um da internet, menor estabilidade e menor velocidade\n• As copypastas não podem ser personalizadas\n• Contém material inadequado\n• Maior quantidade de copypastas, porém limitadas por 100, saiba mais ao enviar /reddit\n\n\n_Você está usando o banco de dados ${options[settings[msg.from.id].choosed]}_`, { parse_mode: "Markdown", disable_notification: true, disable_web_page_preview: true, reply_markup: {inline_keyboard: [[{text: `Usar banco de dados ${options[otherOption(settings[msg.from.id].choosed)]}`, callback_data: settings[msg.from.id].choosed}]]}});

			break;

			case '/reddit':
			case '/reddit@copypastabrbot':

				bot.sendMessage(msg.chat.id, `⚠️ Verifique se você está usando o banco de dados do Reddit em /bancodedados.\n\nInfelizmente, o Reddit não permite mostrar mais de 100 copypastas, por isso você pode escolher o filtro por data e ordem. O padrão é por ano e os destaques.\n\nVocê atualmente filtra por *${translate(settings[msg.from.id].timeframe)}* e por *${translate(settings[msg.from.id].listing)}*.`, { parse_mode: "Markdown", disable_notification: true, disable_web_page_preview: true, reply_markup: {inline_keyboard: [[{text: 'Mês', callback_data: 'timeframe month'}, {text: 'Ano', callback_data: 'timeframe year'}, {text: 'Tudo', callback_data: 'timeframe all'}], [{text: 'Novos', callback_data: 'listing new'}, {text: 'Destaque', callback_data: 'listing hot'}, {text: 'Aleatórios', callback_data: 'listing random'}, {text: 'Populares', callback_data: 'listing top'}]]}});

			break;

			case '/ajuda':
			case '/ajuda@copypastabrbot':

				if (settings[msg.from.id] == undefined) {
					
					settings[msg.from.id] = {
						"choosed": 0,
						"timeframe": "year",
						"listing": "hot"
					}

					fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 4));
					
				}

				let configs;

				if (settings[msg.from.id].choosed == 0) {
					
					configs = { 

						parse_mode: "Markdown", 
						disable_notification: true, 
						disable_web_page_preview: true, 
						reply_markup: {
							inline_keyboard: [[{
								text: "Começar a usar o bot", 
								switch_inline_query: ""
								}],
								[{
								text: "Personalizar copypasta", 
								switch_inline_query: "cabeludinho @" + msg.from.first_name
								}]
								]
							}
					}

				} else {
					
					configs = { 

						parse_mode: "Markdown", 
							disable_notification: true, 
							disable_web_page_preview: true, 
							reply_markup: {
								inline_keyboard: [[{
									text: "Começar a usar o bot", 
									switch_inline_query: ""
									}]]
								}

					}

				}

				bot.sendMessage(msg.chat.id, `Para usar o bot, basta digitar o nome dele (@copypastabrbot) e começar a escrever uma copypasta.\n\nO bot oferece mais de um banco de dados e você pode obter mais informações e alterar o banco de dados ao usar /bancodedados.\n\nCaso você esteja usando o banco de dados do desenvolvedor do bot (você está usando o ${options[settings[msg.from.id].choosed]}), para personalizar uma copypasta basta procurar por ela normal e digitar @<Nome da pessoa>`, configs);

			break;


		}

	}

});

bot.on('inline_query', (msg) =>{

	returned = [];

	if (settings[msg.from.id] != undefined && settings[msg.from.id].choosed == 1) {

		if (msg.query == "") {

			bot.answerInlineQuery(msg.id, [], {switch_pm_text: "Você está usando dados da Wiki", switch_pm_parameter: "start", cache_time: 1});

		} else {

			axios.get(`https://copypasta-br.fandom.com/pt-br/api.php?action=opensearch&search=${msg.query}&format=json`).then(async(res) => {

				for (i = 0; i < res.data[3].length; i++) {

					let item = res.data[3][i].replace("https://copypasta-br.fandom.com/pt-br/wiki/", "");

					const res2 = await axios.get(`https://copypasta-br.fandom.com/pt-br/api.php?action=query&prop=revisions&titles=${item}&rvprop=content&format=json`)

						returned.push({ 

										type: 'article', 
										id: Object.values(res2.data.query.pages)[0].pageid,
										title: Object.values(res2.data.query.pages)[0].title,
										description: Object.values(res2.data.query.pages)[0].revisions[0]["*"].substr(0, 35) + "...",
										input_message_content: { message_text: Object.values(res2.data.query.pages)[0].revisions[0]["*"].substr(0, 4095).split("[[")[0] }

									});

						returned = returned.filter(e => e != null);

						returned = returned.filter(
							function(v,i,a) {
								return a.findIndex(
								function(t) {
									return JSON.stringify(t) === JSON.stringify(v);
								}
								) === i;
							}
						);

				}

				bot.answerInlineQuery(msg.id, returned, {cache_time: 1});

			});

		}
	
	} else if (settings[msg.from.id] != undefined && settings[msg.from.id].choosed == 2) {

		returned = [];
		let results;

		if (msg.query == "") {

			bot.answerInlineQuery(msg.id, [], {switch_pm_text: "Você está usando dados do Reddit", switch_pm_parameter: "start", cache_time: 1});

		} else {

			axios.get(`https://www.reddit.com/r/copypastabr/${settings[msg.from.id].listing}.json?limit=100&t=${settings[msg.from.id].timeframe}`).then(async(res) => {

				let datacomplete = {};

				for (i = 0; i < 100; i++) { 

					datacomplete[res.data.data.children[i].data.selftext] = {
						type: 'article',
						id: res.data.data.children[i].data.id,
						title: res.data.data.children[i].data.title,
						message_text: res.data.data.children[i].data.selftext.substr(0, 4095)
					}

				}

				results = Object.keys(datacomplete).filter(e => e.toLowerCase().includes(msg.query.toLowerCase()));

				//console.log(datacomplete[results[0]].message_text);

				for (i = 0; i < results.length; i++) {

					returned[i] = { 

						type: datacomplete[results[i]].type, 
						id: decodeURIComponent(datacomplete[results[i]].id),
						description: decodeURIComponent(datacomplete[results[i]].message_text.substr(0, 35)) + "...",
						title: decodeURIComponent(datacomplete[results[i]].title),
						input_message_content: { message_text: decodeURIComponent(datacomplete[results[i]].message_text) } 

					}

				}

				bot.answerInlineQuery(msg.id, returned, {cache_time: 1});

			});

		}	
	
	} else {

		if (msg.query == "") {

			bot.answerInlineQuery(msg.id, [], {switch_pm_text: "Você está usando dados do desenvolvedor", switch_pm_parameter: "start", cache_time: 1});

		} else {

			let pathLocal = fs.readFileSync(__dirname + '/local.json');
			let local = JSON.parse(pathLocal);

			let results;
			let mention;

			if (msg.query.toLowerCase().includes("@")) { 

				results = Object.keys(local).filter(e => e.toLowerCase().includes(msg.query.toLowerCase().split('@')[0]));
				mention = msg.query.split('@')[1];

			} else {

				results = Object.keys(local).filter(e => e.toLowerCase().includes(msg.query.toLowerCase()));
				mention = msg.query.split('@')[1];

			}

			let returned = [];

			for (i = 0; i < results.length; i++) {

				returned[i] = { 

					type: local[results[i]].type, 
					id: local[results[i]].id,
					description: local[results[i]].message_text.substr(0, 35) + "...",
					title: local[results[i]].title,
					input_message_content: { message_text: local[results[i]].message_text } 

				}

				if (returned[i].title.includes('{PH}') && mention != undefined) {

					returned[i].title = returned[i].title.replace(/{PH}/g, mention);

				} else if (returned[i].title.includes('{PH}') && mention == undefined) {

					returned[i].title = returned[i].title.replace(/{PH}/g, local[results[i]].defaultTitle);

				}

				if (returned[i].input_message_content.message_text.includes('{PH}') && mention != undefined) {

					returned[i].input_message_content.message_text = returned[i].input_message_content.message_text.replace(/{PH}/g, mention);

				} else if (returned[i].input_message_content.message_text.includes('{PH}') && mention == undefined) {

					returned[i].input_message_content.message_text = returned[i].input_message_content.message_text.replace(/{PH}/g, local[results[i]].defaultMessage);

				}
				
			}

			bot.answerInlineQuery(msg.id, returned, {cache_time: 1});

		}

	}

});

bot.on("callback_query", (callbackQuery) => {

	let msg = callbackQuery.message

	if (callbackQuery.data >= 0) {

		settings[callbackQuery.from.id].choosed = otherOption(settings[callbackQuery.from.id].choosed);

		fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 4));

		bot.editMessageText(`*O que são bancos de dados?*\n\nÉ uma coleção de dados para facilitar pesquisas, no caso do nosso bot, as copypastas.\n\n*Quais são os bancos de dados para o bot?*\n\nO banco de dados do desenvolvedor do bot, o banco de dados da [Wiki Fandom Copypasta BR](https://copypasta-br.fandom.com/pt-br/wiki/Wiki_Copypasta_BR) e o banco de dados do [Subreddit Copypastabr](https://www.reddit.com/r/copypastabr/).\n\n*Qual é a diferença entre eles?*\n\n*Banco de Dados do Desenvolvedor do Bot (padrão)*:\n• Administração melhor, maior estabilidade e maior velocidade\n• As copypastas podem ser personalizadas\n• Não contém material inadequado\n• Menor quantidade de copypastas\n\n*Banco de Dados da Wiki Fandom Copypasta BR*:\n• Administração e edição feita por qualquer um da internet, menor estabilidade e velocidade média\n• As copypastas não podem ser personalizadas\n• Contém material inadequado\n• Quantidade de copypastas média\n\n*Banco de Dados do Subreddit Copypastabr*:\n• Administração e edição feita por qualquer um da internet, menor estabilidade e menor velocidade\n• As copypastas não podem ser personalizadas\n• Contém material inadequado\n• Maior quantidade de copypastas, porém limitadas por 100, saiba mais ao enviar /reddit\n\n\n_Você está usando o banco de dados ${options[settings[callbackQuery.from.id].choosed]}_`, {chat_id: msg.chat.id, message_id: msg.message_id, parse_mode: "Markdown", disable_notification: true, disable_web_page_preview: true, reply_markup: {inline_keyboard: [[{text: `Usar banco de dados ${options[otherOption(settings[callbackQuery.from.id].choosed)]}`, callback_data: settings[callbackQuery.from.id].choosed}]]}});

	} else if (callbackQuery.data.includes("listing")) {

		let listing = callbackQuery.data.split(' ')[1];

		settings[callbackQuery.from.id].listing = listing;
		fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 4));

		bot.editMessageText(`⚠️ Verifique se você está usando o banco de dados do Reddit em /bancodedados.\n\nInfelizmente, o Reddit não permite mostrar mais de 100 copypastas, por isso você pode escolher o filtro por data e ordem. O padrão é por ano e os destaques.\n\nVocê atualmente filtra por *${translate(settings[callbackQuery.from.id].timeframe)}* e por *${translate(settings[callbackQuery.from.id].listing)}*.`, {chat_id: msg.chat.id, message_id: msg.message_id, parse_mode: "Markdown", disable_notification: true, reply_markup: {inline_keyboard: [[{text: 'Mês', callback_data: 'timeframe month'}, {text: 'Ano', callback_data: 'timeframe year'}, {text: 'Tudo', callback_data: 'timeframe all'}], [{text: 'Novos', callback_data: 'listing new'}, {text: 'Destaques', callback_data: 'listing hot'}, {text: 'Aleatórios', callback_data: 'listing random'}, {text: 'Populares', callback_data: 'listing top'}]]}});

	} else if (callbackQuery.data.includes("timeframe")) {

		let timeframe = callbackQuery.data.split(' ')[1];

		settings[callbackQuery.from.id].timeframe = timeframe;
		fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 4));

		bot.editMessageText(`⚠️ Verifique se você está usando o banco de dados do Reddit em /bancodedados.\n\nInfelizmente, o Reddit não permite mostrar mais de 100 copypastas, por isso você pode escolher o filtro por data e ordem. O padrão é por ano e os destaques.\n\nVocê atualmente filtra por *${translate(settings[callbackQuery.from.id].timeframe)}* e por *${translate(settings[callbackQuery.from.id].listing)}*.`, {chat_id: msg.chat.id, message_id: msg.message_id, parse_mode: "Markdown", disable_notification: true, reply_markup: {inline_keyboard: [[{text: 'Mês', callback_data: 'timeframe month'}, {text: 'Ano', callback_data: 'timeframe year'}, {text: 'Tudo', callback_data: 'timeframe all'}], [{text: 'Novos', callback_data: 'listing new'}, {text: 'Destaques', callback_data: 'listing hot'}, {text: 'Aleatórios', callback_data: 'listing random'}, {text: 'Populares', callback_data: 'listing top'}]]}});

	}

});

function otherOption (choosedNumber) {

	switch (choosedNumber) {

		case 0:

			return 1;

		break;

		case 1:

			return 2;

		break;

		case 2:

			return 0;

		break;
	}

}


function translate (term) {

	switch (term) {

		case 'month':

			return 'mês';

		break;

		case 'year':

			return 'ano';

		break;

		case 'all':

			return 'tudo';

		break;

		case 'new':

			return 'novos';

		break;

		case 'hot':

			return 'destaques';

		break;

		case 'random':

			return 'aleatórios';

		break;

		case 'top':

			return 'populares';

		break;

	}

}

bot.on('polling_error', error => console.log(error));

require('./server')();
