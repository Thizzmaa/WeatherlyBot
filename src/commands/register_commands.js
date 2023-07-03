// import .env for environment variables containing token and API keys
require('dotenv').config();
// import discord.js library
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

// define commands variable
const commands = [
	{
		name: 'weather',
		description: 'Send weather embed!',
		// set options
		options: [
			{
				name: 'zipcode',
				description: 'enter zip code',
				type: ApplicationCommandOptionType.Number,
				required: true,
			},
			{
				name: 'degree_type',
				description: 'select degree type - F° or C°',
				type: ApplicationCommandOptionType.String,
				required: true,
				// set choices for degree type
				choices: [
					{
						name: 'fahrenheit',
						value: 'Fahrenheit',
					},
					{
						name: 'celcius',
						value: 'Celcius',
					},
				],
			},
		],
	},
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Registering slash commands...');

		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: commands,
		});
		console.log('Slash commands were registered successfully!');
	} catch (error) {
		console.log(`There was an error: ${error}`);
	}
})();
