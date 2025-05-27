import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import * as holdingsCommand from './commands/holdings.js';

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const TRADING212_API_KEY = process.env.TRADING212_API_KEY;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [holdingsCommand.data];

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

async function registerCommands() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registered.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'holdings') {
    await holdingsCommand.execute(interaction, TRADING212_API_KEY);
  }
});

(async () => {
  await registerCommands();
  client.login(DISCORD_TOKEN);
})();