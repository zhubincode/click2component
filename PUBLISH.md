# 简化步骤
```
yarn build
npm pack
npm publish
```


# npm 发包完整指南

> 一份实用的 npm 包发布流程文档，覆盖从初始化到自动化发布的全过程。

---

## 一、前置准备

### 1. 注册并登录 npm
- 前往 [https://www.npmjs.com/signup](https://www.npmjs.com/signup) 注册账号。  
- 命令行登录：
  ```bash
  npm login
  ```
  输入用户名、密码、邮箱。提示 `Logged in as xxx` 表示成功。

---

## 二、初始化项目

执行：
```bash
npm init
```
或：
```bash
npm init -y
```

生成的 `package.json` 示例：
```json
{
  "name": "your-package-name",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

注意：
- `name` 必须在 npm 上唯一。
- `version` 每次发包必须递增。

---

## 三、配置发布内容

确定哪些文件要被发布：
1. 使用 `.npmignore`（类似 `.gitignore`）
2. 或在 `package.json` 中配置：
   ```json
   "files": [
     "dist",
     "src/index.js"
   ]
   ```

> 建议只发布必要文件，避免 `.env`、`.vscode`、`node_modules` 等意外上传。

---

## 四、发布前预览

执行：
```bash
npm pack
```
会在当前目录生成一个 `.tgz` 文件，可解压查看实际打包内容。

---

## 五、正式发布

执行：
```bash
npm publish
```

如果是 scoped 包（例如 `@yourname/utils`），请使用：
```bash
npm publish --access public
```

发布成功后会提示：
```
+ your-package-name@1.0.0
```

可用以下命令查看包信息：
```bash
npm info your-package-name
```

---

## 六、更新版本号

改完代码后可使用以下命令自动更新版本号：
```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

然后重新发布：
```bash
npm publish
```

---

## 七、撤销或废弃发布

撤销：
```bash
npm unpublish your-package-name@1.0.0
```
> 注意：仅在 24 小时内有效，过期后无法删除。

标记废弃：
```bash
npm deprecate your-package-name@"<2.0.0" "This version is deprecated due to a bug."
```

---

## 八、自动化发布脚本示例

可在项目中添加一个脚本文件 `scripts/publish.js`：

```js
#!/usr/bin/env node
import { execSync } from 'child_process'
import fs from 'fs'

function run(cmd) {
  console.log(`\n> ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

// 1. 检查登录状态
try {
  execSync('npm whoami', { stdio: 'ignore' })
} catch {
  console.error('请先执行 npm login')
  process.exit(1)
}

// 2. 自动升级 patch 版本
run('npm version patch')

// 3. 打包预览
run('npm pack')

// 4. 发布到 npm
run('npm publish --access public')

// 5. 推送 Git tag
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
run(`git push origin v${pkg.version}`)

console.log('\n✅ 发布成功！')
```

使用方式：
```bash
node scripts/publish.js
```

---

## 九、常见问题

| 问题 | 原因 | 解决办法 |
|------|------|-----------|
| `You do not have permission to publish` | 包名已被占用 | 换个包名，比如加前缀 |
| `403 Forbidden` | 未登录或权限问题 | 执行 `npm login` 重新登录 |
| 忘记加 `--access public` | scoped 包默认私有 | `npm publish --access public` |
| 发布了无关文件 | 未配置 .npmignore 或 files | 使用 `npm pack` 检查后再发 |
