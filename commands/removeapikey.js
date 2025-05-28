import { SlashCommandBuilder } from 'discord.js';
import { removeApiKey } from '../db/index.js';

export const data = new SlashCommandBuilder()
    .setName('removeapikey')
    .setDescription('Remove your stored Trading212 API key');

export async function execute(interaction) {
    removeApiKey(interaction.user.id);
    
    await interaction.reply({ 
        content: '✅ Your Trading212 API key has been removed. You will need to set a new one to use the bot\'s commands.',
        flags: [1 << 6] // Using flags for ephemeral message
    });
}