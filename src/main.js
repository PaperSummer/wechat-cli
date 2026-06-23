import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { register as registerLogin } from './commands/login.js';
import { register as registerSend } from './commands/send.js';
import { register as registerMessages } from './commands/messages.js';
import { register as registerStatus } from './commands/status.js';
import { register as registerLogout } from './commands/logout.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('wechat-cli')
  .description('WeChat CLI — send/receive messages via @wechatbot/wechatbot')
  .version(pkg.version)
  .option('--pretty', 'Pretty-print JSON output');

// Register all commands
registerLogin(program);
registerSend(program);
registerMessages(program);
registerStatus(program);
registerLogout(program);

program.parse(process.argv);
