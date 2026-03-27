import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const createBotSource = fs.readFileSync(path.join(repoRoot, 'src/bot/createBot.js'), 'utf8');
const webhookSource = fs.readFileSync(path.join(repoRoot, 'api/webhook.js'), 'utf8');

if (!createBotSource.includes('export async function createBot()')) {
  throw new Error('createBot must be async');
}

if (!createBotSource.includes('bot.init()')) {
  throw new Error('createBot must initialize the grammy bot');
}

if (!webhookSource.includes('const bot = await createBot();')) {
  throw new Error('webhook must await createBot before handling updates');
}

console.log('OK: telegram bot init contract present');
