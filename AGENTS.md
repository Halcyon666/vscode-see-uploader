# AGENTS.md - Agent Guidelines for SEE Image Uploader

## Project Overview

This is a **VS Code extension** written in **plain JavaScript** (not TypeScript). It uploads images directly to S.EE image hosting service using HTTPS API calls.

**Repository**: https://github.com/Halcyon666/fix-windows-envs.git

---

## Build, Lint, and Test Commands

### Package Extension
```powershell
# Package the extension into a .vsix file
vsce package
```

### Development Workflow
- **No build step required** - Plain JavaScript, no compilation
- **No linting configured** - No ESLint, Prettier, or other lint tools
- **No test suite** - No tests exist in this project
- **Dependencies** - Node.js built-ins only (`fs`, `path`, `https`)

### Manual Testing
To test the extension:
1. Run `vsce package` to generate `.vsix` file
2. Install the extension: VS Code > Extensions > "Install from VSIX..."
3. Configure token in VS Code Settings: `seeUploader.token`
4. Use commands:
   - `Ctrl+Alt+U` - Upload clipboard image on Windows
   - `Ctrl+Alt+P` - Open file picker on all platforms

---

## Code Style Guidelines

### Language
- **JavaScript (ES6+)** - Uses `const`, arrow functions, `async/await`, Promises
- Target: VS Code 1.80.0+
- **Cross-platform** - Works on Windows/macOS/Linux; PowerShell used only for clipboard on Windows

### File Structure
```
.
├── extension.js          # Main entry point (~190 lines)
├── package.json          # Extension manifest
├── media/
│   └── icon.png          # Extension icon (256x256 PNG)
```

### JavaScript Conventions

**Imports (Node.js built-ins only):**
```javascript
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const https = require('https');
```

**Naming:**
- Functions: `camelCase` (e.g., `getToken`, `uploadToSEE`)
- Variables: `camelCase` (e.g., `imagePath`, `markdown`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `UPLOAD_URL`)

**Async/Await:**
- Use `async/await` for asynchronous operations
- Always wrap async calls in try/catch for error handling

**Error Handling:**
```javascript
try {
  await uploadSelectedImage();
} catch (error) {
  vscode.window.showErrorMessage(`SEE upload failed: ${error.message}`);
}
```

**VS Code API Patterns:**
- Register commands in `activate()` function
- Use `vscode.commands.registerCommand`
- Push disposables to `context.subscriptions`
- Use `vscode.window` for UI (showOpenDialog, showInformationMessage, showErrorMessage)

### What NOT to Do
- Do NOT add TypeScript - this is a simple JavaScript extension
- Do NOT add external npm dependencies (keeps extension lightweight)
- Do NOT add ESLint/Prettier - keep it simple
- Do NOT create a test suite unless explicitly requested
- Do NOT change the activation events or command IDs without good reason

### Configuration
The extension supports token configuration:
```json
"seeUploader.token": ""
```
- Get token from https://s.ee/
- Configure in VS Code Settings > seeUploader.token

---

## Key Implementation Details

### API Integration
- Endpoint: `POST https://s.ee/api/v1/file/upload`
- Auth: Bearer token from `seeUploader.token` setting
- Content-Type: `multipart/form-data` with field `smfile`
- Uses Node.js `https` module (no external dependencies)

### Command Handlers
- `seeUploader.uploadClipboardImage` - Reads clipboard via PowerShell (Windows), shows instructions (macOS/Linux)
- `seeUploader.uploadSelectedImage` - Opens file picker, uploads, inserts markdown

### Markdown Insertion
- If an editor is active, inserts `![](url)` at cursor position
- If no editor, copies markdown to clipboard and shows info message

---

## Quick Reference

| Item | Value |
|------|-------|
| Main file | `extension.js` |
| Dependencies | None (Node.js built-ins only) |
| Test runner | None |
| Linter | None |
| VS Code API | `vscode` module |
| Min VS Code | 1.80.0 |
| Platform | Cross-platform (Windows/macOS/Linux) |
