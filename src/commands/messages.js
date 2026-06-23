import { createBot } from '../core/bot.js';
import { outputJson, outputError } from '../utils/output.js';

export function register(program) {
  program
    .command('messages')
    .description('Pull recent messages (listens for N new messages, then stops)')
    .option('-c, --count <number>', 'Number of messages to collect', '5')
    .option('-t, --timeout <seconds>', 'Max wait time in seconds', '60')
    .action(async (options, cmd) => {
      const count = parseInt(options.count, 10);
      const timeoutMs = parseInt(options.timeout, 10) * 1000;

      if (isNaN(count) || count < 1) {
        outputError('--count must be a positive integer', 'INVALID_COUNT');
        return;
      }
      if (isNaN(timeoutMs) || timeoutMs < 0) {
        outputError('--timeout must be a non-negative integer', 'INVALID_TIMEOUT');
        return;
      }

      try {
        const bot = await createBot({});
        const messages = [];
        let finished = false;

        bot.onMessage((msg) => {
          messages.push({
            userId: msg.userId,
            text: msg.text,
            type: msg.type,
            timestamp: msg.timestamp,
            images: msg.images?.map(i => ({ url: i.url, width: i.width, height: i.height })) ?? [],
            files: msg.files?.map(f => ({ fileName: f.fileName, size: f.size, md5: f.md5 })) ?? [],
            videos: msg.videos?.map(v => ({ durationMs: v.durationMs, width: v.width, height: v.height })) ?? [],
            voices: msg.voices?.map(v => ({ durationMs: v.durationMs, text: v.text })) ?? [],
          });

          if (!finished && messages.length >= count) {
            stopAndOutput();
          }
        });

        const timer = setTimeout(() => {
          stopAndOutput();
        }, timeoutMs);

        function stopAndOutput() {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          try { bot.stop(); } catch {}
          outputJson({
            messages,
            total: messages.length,
            requested: count,
            timedOut: messages.length < count,
          }, { pretty: cmd.optsWithGlobals().pretty });
        }

        await bot.start();
        // bot.start() resolves when bot.stop() is called

      } catch (err) {
        outputError(err.message, 'MESSAGES_FAILED');
      }
    });
}
