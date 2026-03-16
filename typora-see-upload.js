#!/usr/bin/env node

const { getTokenFromEnvOrVSCode, uploadFileToSEE } = require('./lib/see-upload');

async function main() {
  const imagePaths = process.argv.slice(2);

  if (imagePaths.length === 0) {
    throw new Error('No image path provided.');
  }

  const token = getTokenFromEnvOrVSCode();
  const urls = [];

  for (const imagePath of imagePaths) {
    const url = await uploadFileToSEE(imagePath, token);
    urls.push(url);
  }

  process.stdout.write(urls.join('\n'));
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
