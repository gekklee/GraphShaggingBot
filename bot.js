import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import * as holdingsCommand from './commands/holdings.js';
import * as checkapiCommand from './commands/checkapi.js';

dotenv.config();

// Environment variables for bot configuration
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const TRADING212_API_KEY = process.env.TRADING212_API_KEY;

// Initialise Discord client with minimal required permissions
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Store commands in Collection
client.commands = new Collection();

// Register all available commands
const commandModules = [holdingsCommand, checkapiCommand];
commandModules.forEach(command => {
    client.commands.set(command.data.name, command);
});

// Initialise Discord REST API client for registering commands
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// Register slash commands with Discord
async function registerCommands() {
    try {
        const commandData = commandModules.map(command => command.data);
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commandData }
        );
        console.log('Slash commands registered.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

// Bot ready event handler
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Command interaction handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        // Pass Trading212 API key to all commands
        await command.execute(interaction, TRADING212_API_KEY);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        const errorMessage = 'There was an error executing this command.';
        // Handle errors for both deferred and immediate replies
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});

// Initialise bot
(async () => {
    await registerCommands();
    client.login(DISCORD_TOKEN);
})();