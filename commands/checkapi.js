import fetch from 'node-fetch';

const INSTRUMENTS_URL = 'https://live.trading212.com/api/v0/equity/metadata/instruments';

export const data = {
  name: 'checkapi',
  description: 'Check if Trading212 API is accessible',
};

export async function execute(interaction, apiKey) {
  await interaction.deferReply({ flags: [1 << 6] }); // Using flags for ephemeral message
  
  try {
    // Test API connectivity
    const response = await fetch(INSTRUMENTS_URL, {
      headers: { Authorization: apiKey },
    });
    
    if (response.ok) {
      await interaction.editReply({
        content: '✅ Trading212 API is accessible and working properly.',
        flags: [1 << 6]
      });
    } else {
      const status = response.status;
      let errorMessage = '❌ Trading212 API is not accessible. ';
      
      // Map common HTTP error codes to user friendly messages
      switch (status) {
        case 401:
          errorMessage += 'Invalid API key or unauthorised access.';
          break;
        case 403:
          errorMessage += 'API key does not have sufficient permissions.';
          break;
        case 429:
          errorMessage += 'Rate limit exceeded. Please try again later.';
          break;
        default:
          errorMessage += `Server returned status code ${status}.`;
      }
      
      await interaction.editReply({
        content: errorMessage,
        flags: [1 << 6]
      });
    }
  } catch (err) {
    console.error('Error checking API:', err);
    await interaction.editReply({
      content: '❌ Failed to connect to Trading212 API. Please check your internet connection or try again later.',
      flags: [1 << 6]
    });
  }
}