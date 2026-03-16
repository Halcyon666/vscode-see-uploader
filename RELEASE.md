# Release Notes

For publisher/testing only.

- GitHub secret required: `VSCE_PAT`
- Create PAT in Azure DevOps with `Marketplace -> Manage`
- Add the PAT to GitHub repo secrets as `VSCE_PAT`
- Auto-publish workflow: `.github/workflows/publish.yml`
- Install from VSIX in VS Code
- Configure `seeUploader.token`
- Verify `Ctrl+Alt+U` on Windows clipboard upload
- Verify `Ctrl+Alt+P` file picker upload

Release flow:
- Bump `package.json` version
- Update `CHANGELOG.md`
- Push commit to GitHub
- Create and push a matching tag like `v0.0.5`
- GitHub Actions publishes automatically
