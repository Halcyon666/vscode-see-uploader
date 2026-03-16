@echo off
setlocal

set "EXT_BASE=%USERPROFILE%\.vscode\extensions"
set "SCRIPT="

for /d %%D in ("%EXT_BASE%\candyjack.see-image-uploader-*") do (
  if exist "%%~fD\typora\typora-see-upload.cmd" set "SCRIPT=%%~fD\typora\typora-see-upload.cmd"
)

if not defined SCRIPT (
  >&2 echo SEE Image Uploader Typora script not found under %EXT_BASE%.
  exit /b 1
)

call "%SCRIPT%" %*
