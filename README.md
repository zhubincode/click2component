# Click2Component

一个 Vue.js 插件，让你能够快速定位并跳转到组件的源代码。支持 Vue 2 和 Vue 3。

## 特性

- 🚀 快速定位：按住 Alt 键即可看到可跳转的组件
- 🎯 精确跳转：自动定位到组件定义的确切行号
- 💡 智能提示：左上角实时显示文件路径
- ⚡️ 编辑器集成：支持 VS Code 和 Cursor

## 安装

```bash
npm install click2component
# 或
yarn add click2component
```

## 使用

### Vue 3

```js
import { createApp } from "vue";
import Click2Component from "click2component";

const app = createApp(App);
app.use(Click2Component);
app.mount("#app");
```

### Vue 2

```js
import Vue from "vue";
import Click2Component from "click2component";

Vue.use(Click2Component);
```

### 配置选项

```js
app.use(Click2Component, {
  enabled: true, // 是否启用插件
  key: "Alt", // 触发键：'Alt'|'Shift'|'Control'|'Meta'
  defaultEditor: "vscode", // 默认编辑器：'vscode'|'cursor'
});
```

## 使用方法

1. 按住 Alt 键（或自定义的触发键）
2. 鼠标移动到想要查看的组件上
3. 左上角会显示组件文件路径
4. 点击组件即可在编辑器中打开对应文件

## 特殊功能

### 第三方组件跳转

当点击第三方组件（如 Ant Design Vue 的组件）时，会自动跳转到你的代码中使用该组件的位置，而不是组件库的源码。

### 精确行号

- 优先使用最接近点击位置的文本节点行号
- 支持模板中的行号信息
- 自动处理嵌套组件的行号定位

### 文件路径显示

- 左上角实时显示完整文件路径
- 路径过长时自动省略中间部分
- 始终显示完整的文件名

## 编辑器支持

### VS Code

- 协议：`vscode://file`
- 行号格式：`:行号`

### Cursor

- 协议：`cursor://file`
- 行号格式：`:行号:1`

## 注意事项

1. 确保你的开发环境保留了源码位置信息（source map）
2. 第一次使用时需要选择默认编辑器
3. 编辑器需要支持通过 URL 协议打开文件

## ps：如果每次都是打开新的编辑器，而不是当前编辑器跳转到对应文件
确保在 VS Code 的设置中启用了“在当前窗口打开文件”的选项。这样可以避免每次点击链接时都打开新窗口。

打开 VS Code 设置 (Ctrl + , 或 Cmd + ,).
搜索 window.openFilesInNewWindow。
将设置值改为 off，这将确保文件在当前窗口打开。

## 调试信息

当成功跳转时，控制台会输出以下信息：

```js
[Click2Component] 跳转到: {
  file: "源文件路径",
  line: 行号
}
```

## 许可证

MIT
