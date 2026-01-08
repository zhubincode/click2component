# Click2Component

[English](#english) | [中文](#中文)

## English

### Introduction

Click2Component is a Vue.js plugin that enables quick navigation to component source code, supporting both Vue 2 and Vue 3.

### Features

- Quick component location with Alt + Click
- Precise line number detection
- Smart file path hints
- Third-party component support
- Editor integration
- User-friendly UI

### Installation

```bash
npm install click2component -D
# 或
yarn add click2component -D
```

### Usage

#### Vue 3

```javascript
import { createApp } from "vue";
import Click2Component from "click2component";

const app = createApp(App);
app.use(Click2Component);
app.mount("#app");
```

#### Vue 2

```javascript
import Vue from "vue";
import Click2Component from "click2component";

Vue.use(Click2Component);
```

### Configuration

```javascript
app.use(Click2Component, {
  enabled: true, // Enable/disable the plugin
  key: "Alt", // Trigger key (Alt/Shift/Control/Meta)
  defaultEditor: "vscode", // Default editor
  editors: [
    // Custom editors (will merge with defaults)
    { name: "My Editor", protocol: "myeditor://file", icon: "🎯" }
  ]
});
```

### How to Use

1. Hold the Alt key (or your configured key)
2. Hover over a component to see its file path
3. Click to open the component in your editor

### Special Features

- **Third-party Component Navigation**: Supports jumping to node_modules source code
- **Precise Line Detection**: Accurately locates text content and elements
- **File Path Display**: Shows component file path in top-left corner when hovering

### Supported Editors

- VS Code (`vscode://file`)
- Cursor (`cursor://file`)
- Trae (`trae://file`)
- Windsurf (`windsurf://file`)
- Kiro (`kiro://file`)

### Important Notes

- Source maps must be enabled in your project
- Editor must support URL protocol opening

### Debugging

When navigating to components, the console will show:

```javascript
[Click2Component] Jump to: {
  file: "path/to/component.vue",
  line: 1
}
```

### Vue CLI 4.x Support

Click2Component now automatically detects the project root path in Vue CLI 4.x projects. No additional configuration is needed! The plugin will:

1. Automatically detect the webpack environment
2. Find the correct project root path from Vue CLI configuration
3. Resolve component paths correctly for editor navigation

Just install and use as normal:

```javascript
// Vue 3
import { createApp } from "vue";
import Click2Component from "click2component";

const app = createApp(App);
app.use(Click2Component);
app.mount("#app");

// Vue 2
import Vue from "vue";
import Click2Component from "click2component";

Vue.use(Click2Component);
```

### License

MIT

---

## 中文

### 简介

Click2Component 是一个 Vue.js 插件，支持快速定位并跳转到组件源代码，同时支持 Vue 2 和 Vue 3。

### 特性

- Alt + 点击快速定位组件
- 精确的行号检测
- 智能文件路径提示
- 支持第三方组件
- 编辑器集成
- 友好的用户界面

### 安装

```bash
npm install click2component -D
# 或
yarn add click2component -D
```

### 使用方法

#### Vue 3

```javascript
import { createApp } from "vue";
import Click2Component from "click2component";

const app = createApp(App);
app.use(Click2Component);
app.mount("#app");
```

#### Vue 2

```javascript
import Vue from "vue";
import Click2Component from "click2component";

Vue.use(Click2Component);
```

### 配置选项

```javascript
app.use(Click2Component, {
  enabled: true, // 启用/禁用插件
  key: "Alt", // 触发键 (Alt/Shift/Control/Meta)
  defaultEditor: "vscode", // 默认编辑器
  editors: [
    // 自定义编辑器（会与默认列表合并）
    { name: "My Editor", protocol: "myeditor://file", icon: "🎯" }
  ]
});
```

### 使用说明

1. 按住 Alt 键（或您配置的按键）
2. 鼠标悬停在组件上可以看到文件路径
3. 点击即可在编辑器中打开组件

### 特殊功能

- **第三方组件导航**：支持跳转到 node_modules 源代码
- **精确行号检测**：准确定位文本内容和元素
- **文件路径显示**：悬停时在左上角显示组件文件路径

### 支持的编辑器

- VS Code (`vscode://file`)
- Cursor (`cursor://file`)
- Trae (`trae://file`)
- Windsurf (`windsurf://file`)
- Kiro (`kiro://file`)

### 重要说明

- 项目中必须启用 Source Map
- 编辑器必须支持 URL 协议打开

### 调试信息

跳转组件时，控制台会显示：

```javascript
[Click2Component] 跳转到: {
  file: "path/to/component.vue",
  line: 1
}
```

### Vue CLI 4.x 支持

Click2Component 现在可以自动检测 Vue CLI 4.x 项目的根路径。无需额外配置！插件将：

1. 自动检测 webpack 环境
2. 从 Vue CLI 配置中找到正确的项目根路径
3. 正确解析组件路径以供编辑器导航

只需正常安装和使用即可：

```javascript
// Vue 3
import { createApp } from "vue";
import Click2Component from "click2component";

const app = createApp(App);
app.use(Click2Component);
app.mount("#app");

// Vue 2
import Vue from "vue";
import Click2Component from "click2component";

Vue.use(Click2Component);
```

### 许可证

MIT
