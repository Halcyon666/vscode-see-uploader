const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

const UPLOAD_URL = 'https://s.ee/api/v1/file/upload';

function stripJsonComments(input) {
  let output = '';
  let inString = false;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (lineComment) {
      if (char === '\n' || char === '\r') {
        lineComment = false;
        output += char;
      }
      continue;
    }

    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '/' && next === '/') {
      lineComment = true;
      i += 1;
      continue;
    }

    if (char === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }

    if (char === '"') {
      inString = true;
    }

    output += char;
  }

  return output;
}

function stripTrailingCommas(input) {
  return input.replace(/,(\s*[}\]])/g, '$1');
}

function parseJsonc(input) {
  return JSON.parse(stripTrailingCommas(stripJsonComments(input)));
}

function normalizeToken(token) {
  const normalized = String(token || '').trim();
  if (!normalized) {
    return '';
  }
  return normalized.startsWith('Bearer ') ? normalized : `Bearer ${normalized}`;
}

function resolveVSCodeSettingsPaths() {
  const homeDir = os.homedir();
  const appData = process.env.APPDATA;
  const paths = [];

  if (appData) {
    paths.push(path.join(appData, 'Code', 'User', 'settings.json'));
    paths.push(path.join(appData, 'Code - Insiders', 'User', 'settings.json'));
    paths.push(path.join(appData, 'VSCodium', 'User', 'settings.json'));
  }

  paths.push(path.join(homeDir, 'Library', 'Application Support', 'Code', 'User', 'settings.json'));
  paths.push(path.join(homeDir, 'Library', 'Application Support', 'Code - Insiders', 'User', 'settings.json'));
  paths.push(path.join(homeDir, '.config', 'Code', 'User', 'settings.json'));
  paths.push(path.join(homeDir, '.config', 'Code - Insiders', 'User', 'settings.json'));
  paths.push(path.join(homeDir, '.config', 'VSCodium', 'User', 'settings.json'));

  return Array.from(new Set(paths));
}

function readTokenFromVSCodeSettings() {
  const settingsPaths = resolveVSCodeSettingsPaths();

  for (const settingsPath of settingsPaths) {
    try {
      if (!fs.existsSync(settingsPath)) {
        continue;
      }

      const content = fs.readFileSync(settingsPath, 'utf8');
      const settings = parseJsonc(content);
      const token = String(settings['seeUploader.token'] || '').trim();
      if (token) {
        return token;
      }
    } catch (error) {
      continue;
    }
  }

  return '';
}

function getTokenFromEnvOrVSCode() {
  const envToken = String(process.env.SEE_UPLOADER_TOKEN || process.env.SEE_TOKEN || '').trim();
  if (envToken) {
    return envToken;
  }

  const settingsToken = readTokenFromVSCodeSettings();
  if (settingsToken) {
    return settingsToken;
  }

  throw new Error('S.EE token not configured. Set SEE_UPLOADER_TOKEN or configure seeUploader.token in VS Code Settings.');
}

function uploadFileToSEE(imagePath, token) {
  return new Promise((resolve, reject) => {
    if (!imagePath || !fs.existsSync(imagePath)) {
      reject(new Error(`Image file does not exist: ${imagePath}`));
      return;
    }

    const fileName = path.basename(imagePath);
    const fileContent = fs.readFileSync(imagePath);
    const authToken = normalizeToken(token);

    if (!authToken) {
      reject(new Error('S.EE token not configured.'));
      return;
    }

    const boundary = '----FormBoundary' + Date.now().toString(16);
    const header = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="smfile"; filename="${fileName}"\r\n` +
      'Content-Type: application/octet-stream\r\n\r\n'
    );
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([header, fileContent, footer]);

    const url = new URL(UPLOAD_URL);
    const req = https.request({
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
        'Authorization': authToken,
        'User-Agent': 'SEE-Image-Uploader/1.0'
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success && result.data && result.data.url) {
            resolve(result.data.url.trim());
            return;
          }

          reject(new Error(result.message || result.error || 'Upload failed'));
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = {
  getTokenFromEnvOrVSCode,
  readTokenFromVSCodeSettings,
  uploadFileToSEE
};
