# Typora Upload Helper

这个目录提供给 Typora 使用的 S.EE 图片上传脚本。

## 文件说明

- `typora-see-upload.cmd`：Windows 包装脚本，Typora 中优先推荐用这个
- `typora-see-upload.sh`：macOS/Linux 包装脚本
- `typora-see-upload.js`：实际执行上传的 Node.js 脚本

## 上传前准备

你需要先准备一个可用的 S.EE token：`https://s.ee/`

脚本会按下面顺序读取 token：

1. 环境变量 `SEE_UPLOADER_TOKEN`
2. 环境变量 `SEE_TOKEN`
3. VS Code 用户设置里的 `seeUploader.token`

如果你已经在 VS Code 里配置过：

```json
"seeUploader.token": "your-token-here"
```

通常就不需要再额外配置环境变量。

## Typora 配置

Typora -> Preferences -> Image -> When Insert Local Images -> Upload Service -> Custom Command

### Windows

推荐直接填写：

```text
"E:\all-project\vscode-see-uploader\typora\typora-see-upload.cmd"
```

如果你的仓库不在这个位置，请改成你自己的实际路径。

### macOS

推荐填写：

```text
/bin/sh "/path/to/vscode-see-uploader/typora/typora-see-upload.sh"
```

把 `/path/to/vscode-see-uploader` 替换成你自己的实际路径。

## 工作方式

- Typora 把待上传的图片文件路径传给脚本
- 脚本把图片上传到 S.EE
- 脚本把图片 URL 输出给 Typora
- Typora 再把返回的 URL 插入到文档里

## 常见问题

### 提示 token 未配置

先检查：

- VS Code 设置里是否存在 `seeUploader.token`
- 或者是否配置了 `SEE_UPLOADER_TOKEN`
- S.EE token 是否有效

### Typora 校验命令失败

常见原因：

- 命令路径写错
- 没有安装 Node.js
- 路径里有空格但没有加引号

可以先在终端里手动测试。

Windows：

```bat
"E:\all-project\vscode-see-uploader\typora\typora-see-upload.cmd" "C:\path\to\test.png"
```

macOS：

```bash
/bin/sh "/path/to/vscode-see-uploader/typora/typora-see-upload.sh" "/path/to/test.png"
```
