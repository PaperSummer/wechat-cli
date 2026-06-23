import path from 'node:path';
import fs from 'node:fs';
import { outputJson } from '../utils/output.js';
import { DEFAULT_STORAGE_DIR } from '../core/bot.js';

export function register(program) {
  program
    .command('status')
    .description('Show login status')
    .action(async (options, cmd) => {
      const credentialsPath = path.join(DEFAULT_STORAGE_DIR, 'credentials.json');
      const credsExist = fs.existsSync(credentialsPath);

      let credentials = null;
      let contextCount = 0;

      if (credsExist) {
        try {
          const raw = fs.readFileSync(credentialsPath, 'utf-8');
          credentials = JSON.parse(raw);
          // Count cached context tokens
          const tokensPath = path.join(DEFAULT_STORAGE_DIR, 'context_tokens.json');
          if (fs.existsSync(tokensPath)) {
            const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
            contextCount = Object.keys(tokens).length;
          }
        } catch {}
      }

      outputJson({
        loggedIn: !!credentials,
        userId: credentials?.userId ?? null,
        accountId: credentials?.accountId ?? null,
        savedAt: credentials?.savedAt ?? null,
        storageDir: DEFAULT_STORAGE_DIR,
        cachedUsers: contextCount,
      }, { pretty: cmd.optsWithGlobals().pretty });
    });
}
