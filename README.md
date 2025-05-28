# GraphShaggingBot

GraphShaggingBot is a Discord bot made for my friend group discord server that fetches and displays your holdings from the Trading212 API.

## Features
- Slash command `/holdings` to fetch and display your Trading212 holdings. (WIP)
- Slash command `/checkapi` to verify Trading212 API connectivity.
- Slash command `/setapikey` to securely set your personal Trading212 API key.
- Multi-user support: Each user can set their own API key privately.

## Prerequisites
- Node.js
- A Discord bot token
- Your Discord application's client ID and guild ID
- Each user needs their own Trading212 API key (With the 'Portfolio' permission enabled)

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
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_GUILD_ID=your_discord_guild_id
```

Replace the placeholders with your actual values:
- `DISCORD_TOKEN`: Your Discord bot token.
- `DISCORD_CLIENT_ID`: Your Discord application's client ID.
- `DISCORD_GUILD_ID`: The ID of the Discord server where the bot will be used.

### 4. Run the Bot
Start the bot using the following command:
```bash
node bot.js
```

## Usage
1. Each user should first use the `/setapikey` command to privately set their Trading212 API key. The key will be stored securely and not visible in chat.
2. Use the `/holdings` command to fetch and display your Trading212 holdings.
3. Use the `/checkapi` command to verify if your Trading212 API key is working properly.

## License
This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
