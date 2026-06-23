import path from 'node:path';
import os from 'node:os';
import { WeChatBot } from '@wechatbot/wechatbot';

export const DEFAULT_STORAGE_DIR = path.join(os.homedir(), '.wechat-cli');

/**
 * Create a WeChatBot instance, auto-load stored credentials.
 * Returns the bot ready to use (logged in, not yet started).
 * Does NOT call bot.start() — caller decides whether to poll.
 *
 * @param {object} [options]
 * @param {string} [options.storageDir] - Storage directory (default: ~/.wechat-cli)
 * @param {object} [options.loginCallbacks] - QR login callbacks
 * @param {boolean} [options.force] - Force re-login even if credentials exist
 */
export async function createBot({ storageDir = DEFAULT_STORAGE_DIR, loginCallbacks = {}, force } = {}) {
  const bot = new WeChatBot({
    storage: 'file',
    storageDir,
    logLevel: 'warn',
    loginCallbacks,
  });

  await bot.login({ force, callbacks: loginCallbacks });
  return bot;
}
