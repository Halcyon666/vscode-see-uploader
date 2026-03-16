const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');
const { uploadFileToSEE } = require('./lib/see-upload');

function getToken() {
  const config = vscode.workspace.getConfiguration('seeUploader');
  const token = config.get('token', '').trim();
  if (!token) {
    throw new Error('S.EE token not configured. Go to VS Code Settings > seeUploader.token');
  }
  return token;
}

function uploadToSEE(imagePath) {
  return uploadFileToSEE(imagePath, getToken());
}

async function readClipboardImage() {
  const isWindows = os.platform() === 'win32';

  if (!isWindows) {
    vscode.window.showInformationMessage(
      'Clipboard upload is only available on Windows. On macOS/Linux, use Ctrl+Alt+P to upload a local image.'
    );
    return;
  }

  // Windows: try to read clipboard via PowerShell
  const tempDir = os.tmpdir();
  const tempPath = path.join(tempDir, `see-clipboard-${Date.now()}.png`);

  const psScript = `
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    if ([System.Windows.Forms.Clipboard]::ContainsImage()) {
      $img = [System.Windows.Forms.Clipboard]::GetImage()
      $img.Save('${tempPath.replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Output 'OK'
    } else {
      Write-Error 'No image in clipboard'
    }
  `;

  return new Promise((resolve, reject) => {
    cp.execFile('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psScript], { windowsHide: true }, async (error, stdout, stderr) => {
      if (error || !stdout.includes('OK')) {
        vscode.window.showInformationMessage(
          'No image found in the clipboard. Use Ctrl+Alt+P to choose and upload a local image.'
        );
        return;
      }

      try {
        vscode.window.showInformationMessage('Uploading from clipboard...');
        const url = await uploadToSEE(tempPath);
        const markdown = `![](${url})`;
        await insertMarkdown(markdown);
        vscode.window.showInformationMessage('Image uploaded successfully.');
      } catch (err) {
        vscode.window.showErrorMessage(`Upload failed: ${err.message}`);
      } finally {
        try { fs.unlinkSync(tempPath); } catch (e) { /* ignore */ }
      }
    });
  });
}

async function insertMarkdown(markdown) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    await vscode.env.clipboard.writeText(markdown);
    vscode.window.showInformationMessage('Image uploaded. Markdown copied to clipboard.');
    return;
  }

  await editor.edit(editBuilder => {
    editBuilder.replace(editor.selection, markdown);
  });
}

async function uploadSelectedImage() {
  const selection = await vscode.window.showOpenDialog({
    canSelectMany: false,
    canSelectFiles: true,
    canSelectFolders: false,
    filters: {
      Images: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp']
    },
    openLabel: 'Upload Image'
  });

  if (!selection || selection.length === 0) {
    return;
  }

  const imagePath = selection[0].fsPath;
  if (!fs.existsSync(imagePath)) {
    throw new Error('Selected file does not exist');
  }

  vscode.window.showInformationMessage('Uploading image...');
  const url = await uploadToSEE(imagePath);
  const markdown = `![](${url})`;
  await insertMarkdown(markdown);
  vscode.window.showInformationMessage('Image uploaded successfully.');
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('seeUploader.uploadSelectedImage', async () => {
      try {
        await uploadSelectedImage();
      } catch (error) {
        vscode.window.showErrorMessage(`SEE upload failed: ${error.message}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('seeUploader.uploadClipboardImage', async () => {
      try {
        await readClipboardImage();
      } catch (error) {
        vscode.window.showErrorMessage(`SEE upload failed: ${error.message}`);
      }
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
