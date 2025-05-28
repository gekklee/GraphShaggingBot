import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialise database
const db = new Database(join(__dirname, 'apikeys.db'));

// Create the API keys table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
        user_id TEXT PRIMARY KEY,
        api_key TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

// Input validation
function validateInput(userId, apiKey = null) {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
    }
    
    if (apiKey !== null) {
        if (typeof apiKey !== 'string' || apiKey.length < 1) {
            throw new Error('Invalid API key');
        }
    }
}

// Prepare statements
const setApiKey = db.prepare('INSERT OR REPLACE INTO api_keys (user_id, api_key) VALUES (?, ?)');
const getApiKey = db.prepare('SELECT api_key FROM api_keys WHERE user_id = ?');
const deleteApiKey = db.prepare('DELETE FROM api_keys WHERE user_id = ?');

export function storeApiKey(userId, apiKey) {
    validateInput(userId, apiKey);
    setApiKey.run(userId, apiKey);
}

export function retrieveApiKey(userId) {
    validateInput(userId);
    const result = getApiKey.get(userId);
    return result ? result.api_key : null;
}

export function removeApiKey(userId) {
    validateInput(userId);
    deleteApiKey.run(userId);
}

// Close the database connection when the process exits
process.on('exit', () => db.close());