/**
 * Write JSON result to stdout.
 * @param {*} data - data to serialize
 * @param {{ pretty?: boolean }} options
 */
export function outputJson(data, options = {}) {
  const space = options.pretty ? 2 : undefined;
  const text = JSON.stringify(data, null, space) + '\n';
  process.stdout.write(text);
}

/**
 * Write error JSON to stderr and exit.
 * @param {string} message
 * @param {string} [code]
 * @param {number} [exitCode]
 */
export function outputError(message, code = 'UNKNOWN_ERROR', exitCode = 1) {
  const error = { error: true, code, message };
  const text = JSON.stringify(error) + '\n';
  process.stderr.write(text);
  process.exit(exitCode);
}
