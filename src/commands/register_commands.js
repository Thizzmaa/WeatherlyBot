require('dotenv').config(); // import .env for environment variables containing token and API keys
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');// import discord.js library

// Define commands variable
const commands = [
	{
		name: 'weather',
		description: 'Get current weather and 3 day forecast!',
		// Set options for weather embed
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
				// Set choices for degree type
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

// Create new REST to make REST requests to Discord API
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Register slash commands
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
