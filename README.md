# Click2Component

一个用于在浏览器中通过点击元素来定位Vue组件文件的开发工具。支持Vue 2和Vue 3。

## 特性

- 支持Vue 2和Vue 3
- 开发环境下快速定位组件文件
- 简单的快捷键配置
- 轻量级，无依赖

## 安装

```bash
npm install click2component
# 或
yarn add click2component
```

## 使用方法

### Vue 3

```js
import { createApp } from 'vue'
import Click2Component from 'click2component'

const app = createApp(App)

app.use(Click2Component, {
  enabled: true,
  key: 'Alt'
});
```

### Vue 2

```js
import Vue from 'vue'
import Click2Component from 'click2component'

Vue.use(Click2Component, {
  // 配置选项
  enabled: process.env.NODE_ENV === 'development',
  key: 'Alt'
})
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| enabled | boolean | process.env.NODE_ENV === 'development' | 是否启用插件 |
| key | string | 'Alt' | 触发组件定位的快捷键 |

## 使用示例

1. 在开发环境中运行你的Vue应用
2. 按住Alt键（或你配置的其他快捷键）
3. 点击页面上的任意元素
4. 控制台将输出该元素对应的组件文件路径

## 注意事项

- 该工具仅在开发环境下工作
- 确保你的Vue组件文件中包含正确的文件路径信息
- 目前仅支持控制台输出文件路径，IDE集成功能正在开发中

## License

MIT