# GraphShaggingBot

GraphShaggingBot is a Discord bot made for my friend group discord server that fetches and displays your holdings from the Trading212 API.

## Features
- Slash command `/holdings` to fetch and display your Trading212 holdings. (WIP)
- Slash command `/checkapi` to verify Trading212 API connectivity.

## Prerequisites
- Node.js
- A Discord bot token
- A Trading212 API key (With the 'Portfolio' permission enabled)
- Your Discord application's client ID and guild ID

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/gekklee/GraphShaggingBot.git
cd GraphShaggingBot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up the `.env` File
Create a `.env` file in the root directory and add the following keys:

```
DISCORD_TOKEN=your_discord_bot_token
TRADING212_API_KEY=your_trading212_api_key
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_GUILD_ID=your_discord_guild_id
```

Replace the placeholders with your actual values:
- `DISCORD_TOKEN`: Your Discord bot token.
- `TRADING212_API_KEY`: Your Trading212 API key.
- `DISCORD_CLIENT_ID`: Your Discord application's client ID.
- `DISCORD_GUILD_ID`: The ID of the Discord server where the bot will be used.

### 4. Run the Bot
Start the bot using the following command:
```bash
node bot.js
```

## Usage
- Use the `/holdings` command in your Discord server to fetch and display your Trading212 holdings.
- Use the `/checkapi` command to verify if the Trading212 API is reachable and working.

## License
This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
