require('dotenv').config(); // require .env for environment variables containing token and API keys
const {
	Attachment,
	Client,
	Collection,
	Events,
	IntentsBitField,
	EmbedBuilder,
} = require('discord.js'); // import discord.js library
const axios = require('axios'); // require axios for http requests for weather API
const GphApiClient = require('giphy-api')(process.env.gihpyAPIKey);

// Create new client instance
const client = new Client({
	// Define bot permissions/intents
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

// Start the bot
client.once('ready', (c) => {
	console.log(`${c.user.tag} is online and ready ✅`);
});

// Log the bot in to Discord using client's TOKEN
client.login(process.env.TOKEN);

// create annonmous function for the WeatheAPI using Axios to make the get request
async function getWeatherData(zipCode) {
	const response = await axios.get(
		`http://api.weatherapi.com/v1/forecast.json?key=${process.env.weatherAPIKey}&q=${zipCode}&days=3&aqi=no&alerts=no`
	);
	return response.data;
}

async function giphyApiCall(query) {
	const response =
		await axios.get(`http://api.giphy.com/v1/gifs/search?q=${query}
    &api_key=${process.env.giphyAPIKey}&limit=10`);
	return response.data;
}

// Create interaction for slash commands.
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	client.channels.fetch(interaction.channelId).then((interactionChannel) => {
		const { commandName, options } = interaction;
		if (interaction.commandName === 'weather') {
			const zipCodeOption = options.get('zipcode');
			const degreeOption = options.get('degree_type');

			const zipCode = zipCodeOption.value;
			const degreeType = degreeOption.value;
			const tempScale = degreeType === 'Fahrenheit' ? 'F' : 'C';

			if (!(zipCode.toString().length === 5)) {
				interaction.reply({
					content:
						'Invalid ZIP code. Please provide a valid ZIP code.',
					ephemeral: true,
				});
			} else {
				getWeatherData(zipCode).then((weatherData) => {
					const weather = new EmbedBuilder()
						.setTitle(
							`Current weather of ${weatherData.location.name}, ${weatherData.location.region}`
						)
						.setColor('Blurple')
						.addFields({
							name: 'Temperature',
							value: `${
								tempScale === 'F'
									? weatherData.current.temp_f
									: weatherData.current.temp_c
							}°${tempScale}`,
							inline: true,
						})
						.addFields({
							name: 'Feels Like',
							value: `${
								tempScale === 'F'
									? weatherData.current.feelslike_f
									: weatherData.current.feelslike_c
							}°${tempScale}`,
							inline: true,
						})
						.addFields({
							name: 'Weather Condition',
							value: `${weatherData.current.condition.text}`,
						})
						.addFields({
							name: ' ',
							value: ' ',
						})
						.addFields({
							name: ' ',
							value: ' ',
						})
						.addFields({
							name: `3 Day Forecast for ${weatherData.location.name}, ${weatherData.location.region}`,
							value: ' ',
						});
					weatherData.forecast.forecastday.forEach((threeDay) => {
						weather
							.addFields({
								name: 'Date',
								value: threeDay.date,
							})
							.addFields({
								name: 'High',
								value: `${
									tempScale === 'F'
										? threeDay.day.maxtemp_f
										: threeDay.day.maxtemp_c
								}°${tempScale}`,
								inline: true,
							})
							.addFields({
								name: 'Low',
								value: `${
									tempScale === 'F'
										? threeDay.day.mintemp_f
										: threeDay.day.mintemp_c
								}°${tempScale}`,
								inline: true,
							})
							.addFields({
								name: 'Condition',
								value: threeDay.day.condition.text,
								inline: true,
							});
					});
					interaction.reply({ embeds: [weather] });

					giphyApiCall(weatherData.current.condition.text).then(
						(giphyData) => {
							interactionChannel.send(
								giphyData.data[
									Math.floor(
										Math.random() * giphyData.data.length
									)
								].url
							);
						}
					);
				});
			}
		}
	});
});
