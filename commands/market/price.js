const { SlashCommandBuilder } = require('discord.js');

const { createCanvas, loadImage } = require('canvas')
const { CanvasTable } = require('canvas-table')

const crypto = require('node:crypto');
const fs = require('node:fs');
const fetch = require("node-fetch");

const item = require('../../data/items.json');
const enchantment = require('../../data/enchantments.json');
const quality = require('../../data/qualities.json');

const item_map = require('../../data/items_map.json');
const quality_map = require('../../data/qualities_map.json');
const world_map = require('../../data/worlds_map.json');

const table_market = require('../../utils/table_market.js');
const time = require('../../utils/time.js');

function addChoiceByJson(option, entity) {
	entity.forEach(choice => option.addChoices({ name: choice.name, value: choice.value }));
	return option;
}

function get_url(base_url, item, enchantment, posfix = "") {
	var url = `${base_url}/${item}`
	var level_resource = ['WOOD', 'ROCK', 'ORE', 'HIDE', 'FIBER', 'PLANKS', 'STONEBLOCK', 'METALBAR', 'LEATHER', 'CLOTH'];
	for (var i = 0; i < level_resource.length; i++)
		if (item.includes(level_resource[i]) && item.length == level_resource[i].length + 3 && enchantment && enchantment != '0') {
			url = `${base_url}/${item}_LEVEL${enchantment}`;
			break;
		}
	if (enchantment && enchantment != '0') url += `@${enchantment}`;
	url += posfix
	return url;
}


async function jsonToTable(item, enchantment, json, id) {
	if (json.length == 0) {
		var data = [['No data', 'No data', 'No data', 'No data', 'No data', 'No data']];
	} else {
		var data = json.map(row => Object.values(row));
		var minSellValue = Math.min(...data.map(row => {
			if (row[2] == 0) return Infinity;
			return row[2];
		}));
		var maxBuyValue = Math.max(...data.map(row => {
			if (row[4] == 0) return -Infinity;
			return row[4];
		}));
		data = data.map(row => {
			if (row[2] && row[2] == minSellValue) {
				row[2] = { value: row[2].toLocaleString(), color: "#20b2aa" };
				row[3] = { value: row[3], color: "#20b2aa" };
			}
			else row[2] = row[2] ? row[2].toLocaleString() : "-";
			if (row[4] && row[4] == maxBuyValue) {
				row[4] = { value: row[4].toLocaleString(), color: "#20b2aa" };
				row[5] = { value: row[5], color: "#20b2aa" };
			}
			else row[4] = row[4] ? row[4].toLocaleString() : "-";
			return row;
		});
	}
	const canvas = createCanvas(table_market.WIDTH, 100 + 16 + 14 + (14 + 14) * data.length)
	if (!enchantment) enchantment = "0";
	var title = (item_map[item].slice(-1) == ".") ? item_map[item] + enchantment : item_map[item];
	const config = { columns: table_market.columns, data: data, options: table_market.options(title, "Price Market") };
	const ct = new CanvasTable(canvas, config);
	await ct.generateTable();
	try {
		var img = await loadImage(get_url('https://render.albiononline.com/v1/item', item, enchantment, '.png'));
		await ct.ctx.drawImage(img, table_market.WIDTH - table_market.ITEM_SIZE - table_market.PADDING, table_market.PADDING, table_market.ITEM_SIZE, table_market.ITEM_SIZE);
	} catch (err) { }
	await ct.renderToFile(`./table_${id}.png`);
	return;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('price')
		.setDescription('Search for an item price')
		.addStringOption(option => option.setName('item').setDescription('Item name').setAutocomplete(true).setRequired(true))
		.addStringOption(option => addChoiceByJson(option.setName('enchantment').setDescription('Enchantment Level'), enchantment))
		.addStringOption(option => addChoiceByJson(option.setName('quality').setDescription('Quality Level'), quality)),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const filtered = item.filter(choice => choice.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 25);
		await interaction.respond(
			filtered.map(choice => ({ name: choice.name, value: choice.value })),
		);
	},

	async execute(interaction) {
		await interaction.deferReply();
		const item = interaction.options.getString('item');
		const enchantment = interaction.options.getString('enchantment');
		const quality = interaction.options.getString('quality');

		if (!item_map[item]) {
			await interaction.followUp({ content: `Item **${item}** not found. Make sure you choose the item in the pop-up option above.`, ephemeral: true });
			return;
		}

		var url = get_url("https://east.albion-online-data.com/api/v2/stats/prices", item, enchantment);
		if (quality) url += `?qualities=${quality}`;
		var result = await fetch(url);
		var data = await result.json();
		data = data.map(item => {
			if (item.sell_price_min == 0 && item.buy_price_max == 0) return;
			return {
				city: world_map[item.city.padStart(4, '0')] ? world_map[item.city.padStart(4, '0')] : item.city,
				quality: quality_map[item.quality.toString()],
				sell_price_min: item.sell_price_min,
				sell_price_min_date: item.sell_price_min ? time.timeAgo.format(Date.parse(item.sell_price_min_date) + time.UTC * 60 * 60 * 1000) : '-',
				buy_price_max: item.buy_price_max,
				buy_price_max_date: item.buy_price_max ? time.timeAgo.format(Date.parse(item.buy_price_max_date) + time.UTC * 60 * 60 * 1000) : '-',
			};
		}).filter(item => item);
		var id = crypto.randomBytes(8).toString("hex");
		await jsonToTable(item, enchantment, data, id);
		await interaction.followUp({ files: [{ attachment: `table_${id}.png` }] });
		await fs.unlinkSync(`table_${id}.png`);
	},
};