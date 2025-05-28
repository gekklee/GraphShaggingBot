import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import * as holdingsCommand from './commands/holdings.js';
import * as checkapiCommand from './commands/checkapi.js';
import * as setapikeyCommand from './commands/setapikey.js';
import * as removeapikeyCommand from './commands/removeapikey.js';

dotenv.config();

// Environment variables for bot configuration
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

// Initialise Discord client with minimal required permissions
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Store commands in Collection
client.commands = new Collection();

// Register all available commands
const commandModules = [holdingsCommand, checkapiCommand, setapikeyCommand, removeapikeyCommand];
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
        if (interaction.commandName === 'setapikey' || interaction.commandName === 'removeapikey') {
            // Handle commands that don't need an existing API key
            await command.execute(interaction);
        } else {
            // For other commands, get the user's API key
            const apiKey = setapikeyCommand.getApiKey(interaction.user.id);
            if (!apiKey) {
                await interaction.reply({ 
                    content: 'Please set your Trading212 API key first using the `/setapikey` command.',
                    flags: [1 << 6] // Using flags for ephemeral message
                });
                return;
            }
            // Pass user's API key to the command
            await command.execute(interaction, apiKey);
        }
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        
        try {
            // Only try to respond if we haven't already
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: 'There was an error executing this command.',
                    flags: [1 << 6] // Using flags for ephemeral message
                });
            } else if (interaction.deferred) {
                // If the interaction was deferred, edit the reply
                await interaction.editReply('There was an error executing this command.');
            }
        } catch (err) {
            // If we can't respond to the interaction, log it
            console.error('Error handling command error:', err);
        }
    }
});

// Initialise bot
(async () => {
    await registerCommands();
    client.login(DISCORD_TOKEN);
})();