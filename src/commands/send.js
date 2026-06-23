import fs from 'node:fs';
import path from 'node:path';
import { createBot } from '../core/bot.js';
import { outputJson, outputError } from '../utils/output.js';

export function register(program) {
  program
    .command('send')
    .description('Send a message to a user')
    .argument('<userId>', 'Target user ID (e.g. xxx@im.wechat)')
    .argument('<type>', 'Message type: text | image | video | file')
    .argument('<content>', 'Text content (for text type) or file path (for image/video/file)')
    .option('-c, --caption <text>', 'Caption for image/video/file')
    .action(async (userId, type, content, options, cmd) => {
      try {
        const validTypes = ['text', 'image', 'video', 'file'];
        if (!validTypes.includes(type)) {
          outputError(`Invalid type "${type}". Must be one of: ${validTypes.join(', ')}`, 'INVALID_TYPE');
          return;
        }

        const bot = await createBot({});
        await bot.contextStore.load();

        if (type === 'text') {
          await bot.send(userId, { text: content });
          await bot.stop();
          outputJson({ success: true, userId, type }, { pretty: cmd.optsWithGlobals().pretty });
          return;
        }

        // For media types: read file
        const filePath = path.resolve(content);
        if (!fs.existsSync(filePath)) {
          outputError(`File not found: ${filePath}`, 'FILE_NOT_FOUND');
          return;
        }
        const data = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        if (type === 'image') {
          await bot.send(userId, { image: data, caption: options.caption });
        } else if (type === 'video') {
          await bot.send(userId, { video: data, caption: options.caption });
        } else {
          await bot.send(userId, { file: data, fileName, caption: options.caption });
        }

        await bot.stop();

        outputJson({
          success: true,
          userId,
          type,
        }, { pretty: cmd.optsWithGlobals().pretty });

      } catch (err) {
        if (err.name === 'NoContextError' || err.code === 'NO_CONTEXT') {
          outputError(
            `No context token for user "${userId}". First receive a message from them via "wechat-cli messages"`,
            'NO_CONTEXT', 2);
        } else {
          outputError(err.message, 'SEND_FAILED');
        }
      }
    });
}
