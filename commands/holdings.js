import fetch from 'node-fetch';

const PORTFOLIO_URL = 'https://live.trading212.com/api/v0/equity/portfolio';
const INSTRUMENTS_URL = 'https://live.trading212.com/api/v0/equity/metadata/instruments';

export const data = {
  name: 'holdings',
  description: 'Show your Trading212 holdings',
};

export async function execute(interaction, apiKey) {
  await interaction.deferReply();
  try {
    const portfolioResp = await fetch(PORTFOLIO_URL, {
      headers: { Authorization: apiKey },
    });
    
    if (!portfolioResp.ok) {
      await interaction.editReply('Failed to fetch holdings. Please check your API key and permissions.');
      return;
    }

    const portfolio = await portfolioResp.json();
    const instrumentsResp = await fetch(INSTRUMENTS_URL, {
      headers: { Authorization: apiKey },
    });

    if (!instrumentsResp.ok) {
      await interaction.editReply('Failed to fetch instrument details.');
      return;
    }

    const instruments = await instrumentsResp.json();
    
    const instrumentMap = {};
    instruments.forEach(instrument => {
      if (instrument.ticker) {
        instrumentMap[instrument.ticker] = instrument;
      }
    });

    const owned = portfolio.filter(item => item.quantity && item.quantity > 0);
    if (owned.length === 0) {
      await interaction.editReply('You do not own any stocks.');
      return;
    }

    const holdings = owned.map(item => {
      const instrument = instrumentMap[item.ticker] || {};
      const name = instrument.shortName || instrument.displayName || item.ticker;
      const currency = instrument.currencyCode || '';
      
      const profitLoss = (item.currentPrice - item.averagePrice) * item.quantity;
      const profitLossStr = profitLoss >= 0 ? `+${profitLoss.toFixed(2)}` : profitLoss.toFixed(2);
      const profitLossEmoji = profitLoss >= 0 ? '📈' : '📉';
      
      return `**${name}**\n` +
             `> Shares: \`${item.quantity.toFixed(2)}\`\n` +
             `> Price: \`${item.currentPrice} ${currency}\`\n` +
             `> P/L: \`${profitLossStr} ${currency}\` ${profitLossEmoji}\n`;
    }).join('\n');

    const totalPL = owned.reduce((total, item) => {
      return total + ((item.currentPrice - item.averagePrice) * item.quantity);
    }, 0);

    const summaryMessage = `# Trading212 Portfolio\n${holdings}\n` +
                         `**Total P/L:** \`${totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)} GBP\` ` +
                         `${totalPL >= 0 ? '📈' : '📉'}`;

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