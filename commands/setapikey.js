import { SlashCommandBuilder } from 'discord.js';
import { storeApiKey, retrieveApiKey } from '../db/index.js';

export const data = new SlashCommandBuilder()
    .setName('setapikey')
    .setDescription('Set your Trading212 API key')
    .addStringOption(option =>
        option.setName('key')
            .setDescription('Your Trading212 API key')
            .setRequired(true));

export async function execute(interaction) {
    const apiKey = interaction.options.getString('key');
    
    // Store the API key in the database
    storeApiKey(interaction.user.id, apiKey);
    
    await interaction.reply({ 
        content: '✅ Your Trading212 API key has been added.',
        flags: [1 << 6] // Using flags for ephemeral message
    });
}

// Function to get a user's API key
export function getApiKey(userId) {
    return retrieveApiKey(userId);
}