# Typora Upload Helper

这个目录提供给 Typora 使用的 S.EE 图片上传脚本。

## 文件说明

- `typora-see-upload.cmd`：Windows 包装脚本，Typora 中优先推荐用这个
- `typora-see-upload-user.cmd`：固定路径版 Windows 启动脚本模板，建议复制到 `%USERPROFILE%\typora-see-upload.cmd`
- `typora-see-upload.sh`：macOS/Linux 包装脚本
- `typora-see-upload.js`：实际执行上传的 Node.js 脚本

## 上传前准备

你需要先准备一个可用的 S.EE token：`https://s.ee/`

脚本会按下面顺序读取 token：

1. 系统或用户环境变量 `SEE_UPLOADER_TOKEN`
2. 系统或用户环境变量 `SEE_TOKEN`
3. VS Code 用户设置里的 `seeUploader.token`

如果你已经在 VS Code 里配置过：

```json
"seeUploader.token": "your-token-here"
```

通常就不需要再额外配置这些系统/用户环境变量。

## Typora 配置

Typora -> Preferences -> Image -> When Insert Local Images -> Upload Service -> Custom Command

### Windows

更稳定的做法：先把仓库里的 `typora-see-upload-user.cmd` 复制到用户目录，再让 Typora 永远指向这个固定路径。

建议执行一次：

```bat
copy /Y "%USERPROFILE%\.vscode\extensions\candyjack.see-image-uploader-<version>\typora\typora-see-upload-user.cmd" "%USERPROFILE%\typora-see-upload.cmd"
```

建议固定脚本路径：

```text
%USERPROFILE%\typora-see-upload.cmd
```

Typora 推荐填写：

```text
"%USERPROFILE%\typora-see-upload.cmd"
```

如果你仍然想直接指向仓库里的脚本，也建议写成变量路径：

```text
"%USERPROFILE%\.vscode\extensions\candyjack.see-image-uploader-<version>\typora\typora-see-upload.cmd"
```

固定路径方案的好处是：扩展版本更新后，不需要重新修改 Typora 配置。

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
"%USERPROFILE%\typora-see-upload.cmd" "C:\path\to\test.png"
```

macOS：

```bash
/bin/sh "/path/to/vscode-see-uploader/typora/typora-see-upload.sh" "/path/to/test.png"
```
