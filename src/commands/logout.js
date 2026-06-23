import fs from 'node:fs';
import path from 'node:path';
import { outputJson } from '../utils/output.js';
import { DEFAULT_STORAGE_DIR } from '../core/bot.js';

export function register(program) {
  program
    .command('logout')
    .description('Clear stored credentials and log out')
    .action(async (options, cmd) => {
      let removed = 0;

      if (fs.existsSync(DEFAULT_STORAGE_DIR)) {
        for (const file of fs.readdirSync(DEFAULT_STORAGE_DIR)) {
          fs.rmSync(path.join(DEFAULT_STORAGE_DIR, file), { force: true, recursive: true });
          removed++;
        }
      }

      outputJson({
        success: true,
        removedFiles: removed,
        storageDir: DEFAULT_STORAGE_DIR,
      }, { pretty: cmd.optsWithGlobals().pretty });
    });
}
