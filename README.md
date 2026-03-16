# SEE Image Uploader

在 VS Code 中上传剪贴板图片或本地图片到 S.EE。

Upload clipboard and local images to S.EE from VS Code.

## 功能

- 上传剪贴板图片（Windows）
- 选择本地图片上传
- 自动把 Markdown 图片链接插入当前编辑器
- 如果当前没有激活编辑器，则复制结果到剪贴板

English:

- Upload clipboard images on Windows
- Upload local image files
- Insert Markdown image links into the active editor
- Copy the result to clipboard when no editor is active

## 使用前准备

- VS Code 1.80.0+
- 一个可用的 S.EE token：`https://s.ee/`

获取 token：

1. 访问 https://s.ee/ 注册/登录
2. 个人中心 → API Token
3. 复制 token

English:

1. Visit https://s.ee/
2. Open User Center -> API Token
3. Copy your token

## 配置

在 VS Code Settings 中添加：

```json
"seeUploader.token": "your-token-here"
```

也可以直接在设置里搜索 `seeUploader.token` 后粘贴。

English: search `seeUploader.token` in VS Code Settings and paste your token.

## 命令

- `SEE Image Uploader: Upload Clipboard Image`
- `SEE Image Uploader: Upload Image File`

## 快捷键

- `Ctrl+Alt+U` - Windows 下上传剪贴板图片
- `Ctrl+Alt+P` - 选择本地图片并上传

English:

- `Ctrl+Alt+U` - Upload clipboard image on Windows
- `Ctrl+Alt+P` - Choose and upload a local image

## 说明

- Windows 支持剪贴板直接上传图片
- macOS/Linux 请使用 `Ctrl+Alt+P` 选择本地图片上传
- Token 配置在 VS Code Settings 中：`seeUploader.token`

English:

- Clipboard upload is available on Windows
- On macOS/Linux, use `Ctrl+Alt+P` to upload a local image
- Configure your token with `seeUploader.token` in VS Code Settings

## Typora

- Typora can use the uploader through its `Custom Command` image upload option
- Windows 推荐使用 `typora/typora-see-upload.cmd`
- macOS 推荐使用 `typora/typora-see-upload.sh`
- 脚本会优先读取 `SEE_UPLOADER_TOKEN` / `SEE_TOKEN`，否则回退读取 VS Code Settings 里的 `seeUploader.token`
- Windows 示例：`"E:\all-project\vscode-see-uploader\typora\typora-see-upload.cmd"`
- macOS 示例：`/bin/sh "/path/to/vscode-see-uploader/typora/typora-see-upload.sh"`
- 更多 Typora 配置和排错说明见 `typora/README.md`
