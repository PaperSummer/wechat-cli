import { createBot } from '../core/bot.js';
import { renderQrCode } from '../utils/qr.js';
import { outputJson, outputError } from '../utils/output.js';

let qrShown = false;

export function register(program) {
  program
    .command('login')
    .description('Scan QR code to log in to WeChat')
    .option('--force', 'Force re-login even if credentials exist')
    .action(async (options, cmd) => {
      try {
        const loginCallbacks = {
          onQrUrl: async (url) => {
            if (qrShown) return;
            qrShown = true;
            try {
              process.stderr.write('Opening QR code in image viewer...\n');
              await renderQrCode(url);
              process.stderr.write('Please scan the QR code with WeChat.\n');
            } catch (err) {
              process.stderr.write(`Failed to render QR code: ${err.message}\n`);
            }
          },
          onScanned: () => {
            process.stderr.write('QR code scanned! Confirm on your phone...\n');
          },
          onExpired: () => {
            process.stderr.write('QR code expired, refreshing...\n');
            qrShown = false;
          },
        };

        const bot = await createBot({
          loginCallbacks,
          force: !!options.force,
        });
        const creds = bot.getCredentials();
        await bot.stop();

        if (!creds) {
          outputError('Login failed — no credentials returned', 'LOGIN_FAILED');
          return;
        }

        outputJson({
          success: true,
          userId: creds.userId,
          accountId: creds.accountId,
        }, { pretty: cmd.optsWithGlobals().pretty });
      } catch (err) {
        outputError(err.message, 'LOGIN_FAILED');
      }
    });
}
