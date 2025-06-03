import fetch from 'node-fetch';

// Trading212 API endpoints
const PORTFOLIO_URL = 'https://live.trading212.com/api/v0/equity/portfolio';
const INSTRUMENTS_URL = 'https://live.trading212.com/api/v0/equity/metadata/instruments';

export const data = {
  name: 'holdings',
  description: 'Show your Trading212 holdings',
};

export async function execute(interaction, apiKey) {
  // Defer reply since API calls might take time
  await interaction.deferReply();
  try {
    // Fetch portfolio data from Trading212
    const portfolioResp = await fetch(PORTFOLIO_URL, {
      headers: { Authorization: apiKey },
    });
    
    if (!portfolioResp.ok) {
      await interaction.editReply('Failed to fetch holdings. Please check your API key and permissions.');
      return;
    }

    const portfolio = await portfolioResp.json();
    
    // Fetch instrument metadata
    const instrumentsResp = await fetch(INSTRUMENTS_URL, {
      headers: { Authorization: apiKey },
    });

    if (!instrumentsResp.ok) {
      await interaction.editReply('Failed to fetch instrument details.');
      return;
    }

    const instruments = await instrumentsResp.json();
    
    // Create lookup map for more efficient instrument data access
    const instrumentMap = {};
    instruments.forEach(instrument => {
      if (instrument.ticker) {
        instrumentMap[instrument.ticker] = instrument;
      }
    });

    // Filter to only show stocks with positive quantity
    const owned = portfolio.filter(item => item.quantity && item.quantity > 0);
    if (owned.length === 0) {
      await interaction.editReply('You do not own any stocks.');
      return;
    }

    // Format each holding with name, shares, price, total value and P/L
    const holdings = owned.map(item => {
      const instrument = instrumentMap[item.ticker] || {};
      const name = instrument.shortName || instrument.displayName || item.ticker;
      const currency = instrument.currencyCode || '';
      
      const totalValue = item.currentPrice * item.quantity;
      const profitLoss = (item.currentPrice - item.averagePrice) * item.quantity;
      const profitLossStr = profitLoss >= 0 ? `+${profitLoss.toFixed(2)}` : profitLoss.toFixed(2);
      const profitLossEmoji = profitLoss >= 0 ? '📈' : '📉';
      
      return `**${name}**\n` +
             `> Shares: \`${item.quantity.toFixed(2)}\`\n` +
             `> Price: \`${item.currentPrice} ${currency}\`\n` +
             `> Total Value: \`${totalValue.toFixed(2)} ${currency}\`\n` +
             `> Total P/L: \`${profitLossStr} ${currency}\` ${profitLossEmoji}\n`;
    }).join('\n');

    // Calculate total profit/loss across all holdings
    const totalPL = owned.reduce((total, item) => {
      return total + ((item.currentPrice - item.averagePrice) * item.quantity);
    }, 0);

    const summaryMessage = `# Trading212 Portfolio\n${holdings}\n` +
                         `**Total P/L:** \`${totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)} GBP\` ` +
                         `${totalPL >= 0 ? '📈' : '📉'}`;

    // Handle Discord's 2000 character message limit
    if (summaryMessage.length <= 2000) {
      await interaction.editReply(summaryMessage);
    } else {
      const chunks = summaryMessage.match(/([\s\S]{1,1990})(\n|$)/g);
      await interaction.editReply(chunks[0]);
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp(chunks[i]);
      }
    }
  } catch (err) {
    console.error('Error fetching holdings:', err);
    await interaction.editReply('An error occurred while fetching holdings.');
  }
}