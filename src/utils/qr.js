import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import QRCode from 'qrcode';
import open from 'open';

/**
 * Generate a QR code PNG from a URL, save to temp dir, and open it.
 * Falls back to printing the URL if the image viewer cannot be launched.
 * @param {string} url - the QR URL to encode
 * @returns {Promise<{ filePath: string }>}
 */
export async function renderQrCode(url) {
  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'wechat-cli-qr-'));
  const filePath = path.join(tmpDir, 'wechat-login.png');

  await QRCode.toFile(filePath, url, {
    type: 'png',
    width: 400,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });

  try {
    await open(filePath);
  } catch {
    // Fallback: print the QR URL if open fails (e.g. headless/CI)
    process.stderr.write(`QR code image saved to: ${filePath}\n`);
    process.stderr.write(`QR code URL: ${url}\n`);
    process.stderr.write('Please open this URL in a browser to scan with WeChat.\n');
  }

  return { filePath };
}
