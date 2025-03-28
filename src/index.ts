import { App, ComponentPublicInstance } from "vue";

// Declare global webpack types for Vue CLI compatibility
declare global {
  interface Window {
    __click2component_pending_file: string | null;
    __WEBPACK_CONFIG__?: {
      context?: string;
      output?: {
        publicPath?: string;
      };
    };
    webpackHotUpdate?: any; // 用于检测是否在 webpack 环境中
    __VUE_CLI_CONTEXT__?: string; // Vue CLI 上下文路径
    __vue_app_config__?: any;
    __webpack_public_path__?: string;
    process?: {
      env?: {
        BASE_URL?: string;
        VUE_APP_PROJECT_ROOT?: string; // 添加项目根路径环境变量
        HOME?: string; // 添加用户主目录环境变量
      };
    };
  }
}

interface Options {
  enabled?: boolean;
  key?: string;
  defaultEditor?: string;
  autoDetectRoot?: boolean;
}

interface ComponentLocation {
  start?: {
    line?: number;
  };
}

interface VueComponentType {
  __file?: string;
  name?: string;
  __loc?: ComponentLocation;
}

interface VueComponentInstance {
  type: VueComponentType;
  parent?: VueComponentInstance;
  component?: ComponentInstance;
  __file?: string;
}

interface Vue2Element extends Element {
  __vue__?: ComponentInstance;
}

interface Vue3Element extends Element {
  __vueParentComponent?: VueComponentInstance;
}

interface ComponentInstance extends Omit<ComponentPublicInstance, "$options"> {
  __file?: string;
  $options?:
    | {
        __file?: string;
        name?: string;
        __loc?: ComponentLocation;
      }
    | ComponentPublicInstance["$options"];
  type?: VueComponentType;
  parent?: VueComponentInstance;
}

interface EditorConfig {
  name: string;
  protocol: string;
  icon?: string;
}

const SUPPORTED_EDITORS: EditorConfig[] = [
  { name: "VS Code", protocol: "vscode://file", icon: "📝" },
  { name: "Cursor", protocol: "cursor://file", icon: "✨" },
  { name: "Trae", protocol: "trae://file", icon: "🚀" },
];

const EDITOR_STORAGE_KEY = "click2component_editor";

const defaultOptions: Options = {
  enabled: true,
  key: "Alt",
  defaultEditor: "vscode",
  autoDetectRoot: true,
};

function isVue2Element(el: Element): el is Vue2Element {
  return "__vue__" in el;
}

function isVue3Element(el: Element): el is Vue3Element {
  return "__vueParentComponent" in el;
}

function findTextNodeLine(node: Element, clickY: number): number | undefined {
  // 检查节点本身是否有行号信息
  const sourceLine = (node as any)?.__source?.start?.line;
  const vueSourceLine = (node as any)?.__vnode?.loc?.start?.line;

  // 如果是文本节点的父节点，检查其子节点
  if (node.childNodes.length > 0) {
    let closestLine: number | undefined;
    let minDistance = Infinity;

    // 遍历所有子节点
    for (const child of Array.from(node.childNodes)) {
      // 获取节点的位置信息
      const rect = (child as any).getBoundingClientRect?.();
      if (rect) {
        const distance = Math.abs(rect.top + rect.height / 2 - clickY);
        let textLine: number | undefined;

        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          // 文本节点
          textLine = (child as any)?.__source?.start?.line;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // 元素节点
          textLine = (child as any)?.__vnode?.loc?.start?.line;
        }

        // 更新最近的行号
        if (textLine && distance < minDistance) {
          minDistance = distance;
          closestLine = textLine;
        }
      }
    }

    if (closestLine !== undefined) {
      return closestLine;
    }
  }

  return vueSourceLine || sourceLine;
}

function findComponentInstance(
  el: Element,
  clickY: number
): { instance: ComponentInstance; line?: number } | null {
  // 从当前元素开始向上遍历，找到所有可能的组件实例
  let currentEl: Element | null = el;
  const instances: {
    instance: ComponentInstance;
    line?: number;
    depth: number;
    textLine?: number;
    distance?: number;
    isThirdParty?: boolean;
  }[] = [];
  let depth = 0;

  // 检查是否为第三方组件
  const isThirdPartyComponent = (file?: string) => {
    if (!file) return false;
    return file.includes("node_modules");
  };

  // 获取组件在模板中的位置
  const findTemplateLocation = (node: Element): number | undefined => {
    // 检查元素本身的位置信息
    const loc = (node as any)?.__vnode?.loc?.start?.line;
    if (loc) return loc;

    // 检查组件的渲染函数位置
    const renderLoc = (node as any)?.__vnode?.componentOptions?.Ctor?.options
      ?.__file;
    if (renderLoc) {
      const match = renderLoc.match(/:(\d+)$/);
      if (match) return parseInt(match[1], 10);
    }

    return undefined;
  };

  while (currentEl) {
    const rect = currentEl.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - clickY);

    // Vue 3
    if (isVue3Element(currentEl) && currentEl.__vueParentComponent) {
      let parent = currentEl.__vueParentComponent;
      while (parent) {
        if (parent?.type?.__file) {
          const textLine = findTextNodeLine(currentEl, clickY);
          const templateLine = findTemplateLocation(currentEl);
          const file = parent.type.__file;

          instances.push({
            instance: parent as unknown as ComponentInstance,
            line: templateLine || parent.type.__loc?.start?.line,
            textLine: textLine,
            depth: depth,
            distance: distance,
            isThirdParty: isThirdPartyComponent(file),
          });
        }
        if (!parent?.parent) break;
        parent = parent.parent;
        depth++;
      }
    }

    // Vue 2
    if (isVue2Element(currentEl) && currentEl.__vue__) {
      const instance = currentEl.__vue__;
      const textLine = findTextNodeLine(currentEl, clickY);
      const templateLine = findTemplateLocation(currentEl);
      const file = instance.__file || instance.$options?.__file;

      instances.push({
        instance,
        line: templateLine || instance.$options?.__loc?.start?.line,
        textLine: textLine,
        depth: depth,
        distance: distance,
        isThirdParty: isThirdPartyComponent(file),
      });
    }

    currentEl = currentEl.parentElement;
    depth++;
  }

  // 如果没有找到任何实例，返回null
  if (instances.length === 0) {
    return null;
  }

  // 首先按深度排序，然后按是否为第三方组件排序，最后按距离排序
  instances.sort((a, b) => {
    if (a.depth !== b.depth) {
      return a.depth - b.depth;
    }
    // 优先选择非第三方组件
    if (a.isThirdParty !== b.isThirdParty) {
      return a.isThirdParty ? 1 : -1;
    }
    return (a.distance || Infinity) - (b.distance || Infinity);
  });

  // 过滤掉没有文件路径的实例
  const validInstances = instances.filter(
    (item) =>
      item.instance.__file ||
      item.instance.type?.__file ||
      item.instance.$options?.__file
  );

  if (validInstances.length === 0) {
    return null;
  }

  // 返回最内层的有效实例，优先使用文本行号
  const result = validInstances[0];
  return {
    instance: result.instance,
    line: result.textLine || result.line, // 优先使用文本行号
  };
}

function setTarget(el: Element, type = "") {
  el.setAttribute("vue-click-to-component-target", type);
}

function cleanTarget(type?: string) {
  let targetElList: NodeListOf<Element>;

  if (type) {
    targetElList = document.querySelectorAll(
      `[vue-click-to-component-target="${type}"]`
    );
  } else {
    targetElList = document.querySelectorAll("[vue-click-to-component-target]");
  }

  targetElList.forEach((el) => {
    el.removeAttribute("vue-click-to-component-target");
  });
}

const openWithProtocol = (href: string) => {
  const link = document.createElement("a");
  link.href = href;
  link.click();
};

function getProjectRoot(): string | null {
  try {
    // 1. 检查是否在 webpack 环境中
    const isWebpack = typeof window.webpackHotUpdate !== "undefined";

    if (isWebpack) {
      // 2. 尝试从 webpack 配置中获取上下文路径（这是文件系统的实际路径）
      if (window.__WEBPACK_CONFIG__?.context) {
        console.log(
          "[Click2Component] 使用 webpack context:",
          window.__WEBPACK_CONFIG__.context
        );
        return window.__WEBPACK_CONFIG__.context;
      }

      // 3. 尝试从环境变量获取项目根路径
      const projectRoot = process?.env?.VUE_APP_PROJECT_ROOT;
      if (projectRoot) {
        console.log(
          "[Click2Component] 使用环境变量中的项目根路径:",
          projectRoot
        );
        return projectRoot;
      }

      // 4. 尝试从源码映射中获取项目根路径
      try {
        const sourceMapElement = document.querySelector(
          'script[src*=".js.map"]'
        );
        if (sourceMapElement) {
          const mapUrl = (sourceMapElement as HTMLScriptElement).src;
          const projectPath = mapUrl.split("/src/")[0];
          if (projectPath && !projectPath.startsWith("http")) {
            console.log(
              "[Click2Component] 使用源码映射推断的项目根路径:",
              projectPath
            );
            return projectPath;
          }
        }
      } catch (e) {
        console.warn("[Click2Component] 无法从源码映射获取项目路径:", e);
      }

      console.warn(
        "[Click2Component] 无法获取文件系统路径，请在 vue.config.js 中配置"
      );
      return null;
    }

    return null;
  } catch (error) {
    console.warn("[Click2Component] 自动检测项目根目录失败:", error);
    return null;
  }
}

// 添加路径处理工具函数
function joinPaths(...paths: string[]): string {
  return paths
    .map((path, index) => {
      // 移除开头和结尾的斜杠
      path = path.replace(/^\/+|\/+$/g, "");
      // 对于第一个部分，如果原始路径以斜杠开头，则保留
      if (index === 0 && paths[0].startsWith("/")) {
        path = "/" + path;
      }
      return path;
    })
    .filter((path) => path.length > 0)
    .join("/");
}

function resolveComponentPath(sourceCodeLocation: string): string {
  // 如果是绝对路径，直接返回
  if (
    sourceCodeLocation.startsWith("/") &&
    !sourceCodeLocation.startsWith("~/")
  ) {
    return sourceCodeLocation;
  }

  // 获取项目根目录
  const projectRoot = getProjectRoot();

  // 处理以 ~ 开头的路径
  if (sourceCodeLocation.startsWith("~")) {
    const home = process?.env?.HOME;
    if (home) {
      // 替换 ~ 为用户主目录
      const absolutePath = sourceCodeLocation.replace(/^~/, home);
      console.log("[Click2Component] 解析后的绝对路径:", absolutePath);
      return absolutePath;
    }
  }

  if (!projectRoot) {
    console.warn("[Click2Component] 无法检测到项目根目录");
    return sourceCodeLocation;
  }

  // 处理相对路径
  let normalizedPath = sourceCodeLocation;

  // 移除 ./ 前缀（如果存在）
  if (normalizedPath.startsWith("./")) {
    normalizedPath = normalizedPath.slice(2);
  }

  // 移除 src/ 前缀（如果存在）
  normalizedPath = normalizedPath.replace(/^src\//, "");

  // 如果路径中包含 node_modules，尝试从项目根目录解析
  if (normalizedPath.includes("node_modules")) {
    return joinPaths(projectRoot, normalizedPath);
  }

  // 对于项目组件，尝试在 src 目录下查找
  const srcPath = joinPaths(projectRoot, "src", normalizedPath);
  console.log("[Click2Component] 尝试在 src 目录下查找:", srcPath);

  // 如果不在 src 目录下，尝试在项目根目录下查找
  const rootPath = joinPaths(projectRoot, normalizedPath);
  console.log("[Click2Component] 尝试在项目根目录下查找:", rootPath);

  return srcPath;
}

function openEditor(sourceCodeLocation: string, line?: number) {
  const savedEditor = localStorage.getItem(EDITOR_STORAGE_KEY);
  if (!savedEditor) {
    window.__click2component_pending_file = sourceCodeLocation;
    selectedEditor = null;
    toggleOverlay(true);
    return;
  }

  const editorConfig = SUPPORTED_EDITORS.find(
    (e) => e.name.toLowerCase() === savedEditor.toLowerCase()
  );

  if (!editorConfig) {
    console.warn(`不支持的编辑器: ${savedEditor}`);
    return;
  }

  // 解析组件路径
  const absolutePath = resolveComponentPath(sourceCodeLocation);
  console.log("[Click2Component] 原始路径:", sourceCodeLocation);
  console.log("[Click2Component] 解析后的路径:", absolutePath);

  // 修复Windows路径格式问题
  let formattedPath = absolutePath;

  // 检测是否是Windows路径（以驱动器号开头，如D:）
  if (/^[A-Za-z]:/.test(formattedPath)) {
    // 确保路径使用正确的分隔符，添加前导斜杠
    formattedPath = "/" + formattedPath.replace(/\\/g, "/");
  }

  let fileUrl = `${editorConfig.protocol}${formattedPath}`;

  // 添加行号（根据不同编辑器使用不同格式）
  if (line) {
    if (editorConfig.name.toLowerCase() === "vscode") {
      fileUrl += `:${line}`;
    } else if (editorConfig.name.toLowerCase() === "cursor") {
      fileUrl += `:${line}:1`; // Cursor需要列号，我们默认使用1
    }
  }

  openWithProtocol(fileUrl);
}

const HIGHLIGHT_STYLE = `
<style type="text/css" key="vue-click-to-component-style">
  [vue-click-to-component] * {
    pointer-events: auto !important;
  }

  [vue-click-to-component-target] {
    cursor: pointer !important;
    outline: 2px solid #1890ff !important;
    outline-offset: 2px !important;
    background-color: rgba(24, 144, 255, 0.1) !important;
    transition: all 0.2s ease-in-out !important;
  }

  [vue-click-to-component-target]:hover {
    outline-color: #40a9ff !important;
    background-color: rgba(24, 144, 255, 0.2) !important;
  }

  [vue-click-to-component-target="hover"] {
    outline-style: dashed !important;
  }

  .click2component-path-tooltip {
    position: fixed;
    top: 0;
    left: 0;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 0 0 4px 0;
    z-index: 9999;
    font-family: monospace;
    font-size: 12px;
    color: #fff;
    pointer-events: none !important;
    max-width: 800px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
  }

  .click2component-path-tooltip .path-middle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 20px;
  }

  .click2component-path-tooltip .path-end {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
</style>`;

let overlay: HTMLDivElement | null = null;
let selectedEditor: string | null = null;
let pathTooltip: HTMLDivElement | null = null;

function createOverlay() {
  if (overlay) return overlay;

  overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px",
    background: "#fff",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    zIndex: "9999",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  });

  const title = document.createElement("div");
  title.textContent = "选择编辑器";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "8px";
  if (overlay) overlay.appendChild(title);

  SUPPORTED_EDITORS.forEach((editor) => {
    const button = document.createElement("button");
    button.textContent = `${editor.icon || ""} ${editor.name}`;
    Object.assign(button.style, {
      padding: "6px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      background:
        selectedEditor === editor.name.toLowerCase() ? "#e6f7ff" : "#fff",
      cursor: "pointer",
      marginBottom: "8px",
    });

    button.addEventListener("click", () => {
      selectedEditor = editor.name.toLowerCase();
      if (overlay) {
        SUPPORTED_EDITORS.forEach((_, i) => {
          const btn = overlay?.children[i + 1] as HTMLElement;
          if (btn.tagName === "BUTTON") {
            btn.style.background = "#fff";
          }
        });
      }
      button.style.background = "#e6f7ff";
    });
    if (overlay) overlay.appendChild(button);
  });

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "确定";
  Object.assign(confirmButton.style, {
    padding: "6px 12px",
    border: "1px solid #1890ff",
    borderRadius: "4px",
    background: "#1890ff",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
  });

  confirmButton.addEventListener("click", () => {
    if (selectedEditor) {
      localStorage.setItem(EDITOR_STORAGE_KEY, selectedEditor);
      toggleOverlay(false);
      const editorConfig = SUPPORTED_EDITORS.find(
        (e) => e.name.toLowerCase() === selectedEditor
      );
      if (editorConfig && window.__click2component_pending_file) {
        openEditor(window.__click2component_pending_file);
        window.__click2component_pending_file = null;
      }
    }
  });

  if (overlay) {
    overlay.appendChild(confirmButton);
    document.body.appendChild(overlay);
  }
  return overlay;
}

function toggleOverlay(show: boolean) {
  const overlay = createOverlay();
  overlay.style.display = show ? "flex" : "none";
}

function showPathTooltip(componentFile: string | undefined) {
  // 如果已经存在提示框，先移除它
  if (pathTooltip) {
    pathTooltip.remove();
    pathTooltip = null;
  }

  if (!componentFile) return;

  // 创建新的提示框
  pathTooltip = document.createElement("div");
  pathTooltip.className = "click2component-path-tooltip";

  // 分割路径，保留最后一部分
  const parts = componentFile.split("/");
  const fileName = parts.pop() || "";
  const dirPath = parts.join("/");

  pathTooltip.innerHTML = `
    <span class="path-middle">${dirPath}/</span>
    <span class="path-end">${fileName}</span>
  `;

  document.body.appendChild(pathTooltip);
}

function hidePathTooltip() {
  if (pathTooltip) {
    pathTooltip.remove();
    pathTooltip = null;
  }
}

function handleMouseMove(e: MouseEvent, options: Options) {
  if (!options.enabled) return;

  cleanTarget("hover");

  const isKeyPressed =
    options.key === "Alt" || options.key === "Option"
      ? e.altKey
      : options.key === "Shift"
      ? e.shiftKey
      : options.key === "Control"
      ? e.ctrlKey
      : options.key === "Meta"
      ? e.metaKey
      : e.altKey;

  if (!isKeyPressed) {
    document.body.removeAttribute("vue-click-to-component");
    hidePathTooltip();
    return;
  }

  document.body.setAttribute("vue-click-to-component", "");
  const target = e.target as Element;
  const result = findComponentInstance(target, e.clientY);

  if (result) {
    const { instance } = result;
    const componentFile =
      instance.__file || instance.type?.__file || instance.$options?.__file;

    setTarget(target, "hover");
    if (componentFile) {
      showPathTooltip(componentFile);
    }
  } else {
    hidePathTooltip();
  }
}

declare global {
  interface Window {
    __click2component_pending_file: string | null;
  }
}

window.__click2component_pending_file = null;

function handleClick(e: MouseEvent, options: Options) {
  if (!options?.enabled) return;

  const isKeyPressed =
    options.key === "Alt" || options.key === "Option"
      ? e.altKey
      : options.key === "Shift"
      ? e.shiftKey
      : options.key === "Control"
      ? e.ctrlKey
      : options.key === "Meta"
      ? e.metaKey
      : e.altKey;

  if (!isKeyPressed || e?.button !== 0) return;

  const target = e.target as Element;
  const result = findComponentInstance(target, e.clientY);

  if (!result) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const { instance, line } = result;
  const sourceCodeLocation =
    instance.__file || instance.type?.__file || instance.$options?.__file;

  if (sourceCodeLocation) {
    console.log("[Click2Component] 跳转到:", {
      file: sourceCodeLocation,
      line: line || 1,
    });
    openEditor(sourceCodeLocation, line);
  }
}

function install(app: App, options: Options = {}) {
  const finalOptions = { ...defaultOptions, ...options };

  if (!finalOptions.enabled) return;

  let initialized = false;
  const initialize = () => {
    if (initialized) return;

    document.head.insertAdjacentHTML("beforeend", HIGHLIGHT_STYLE);

    const clickHandler = (e: MouseEvent) => handleClick(e, finalOptions);
    const mouseMoveHandler = (e: MouseEvent) =>
      handleMouseMove(e, finalOptions);

    document.addEventListener("click", clickHandler, true);
    document.addEventListener("mousemove", mouseMoveHandler, true);

    window.addEventListener("keydown", (e) => {
      const isKeyPressed =
        finalOptions.key === "Alt" || finalOptions.key === "Option"
          ? e.altKey
          : finalOptions.key === "Shift"
          ? e.shiftKey
          : finalOptions.key === "Control"
          ? e.ctrlKey
          : finalOptions.key === "Meta"
          ? e.metaKey
          : e.altKey;

      if (!isKeyPressed) {
        hidePathTooltip();
      }
    });

    window.addEventListener("keyup", () => {
      cleanTarget();
      document.body.removeAttribute("vue-click-to-component");
      hidePathTooltip();
    });

    window.addEventListener("blur", () => {
      cleanTarget();
      document.body.removeAttribute("vue-click-to-component");
      hidePathTooltip();
    });

    initialized = true;
  };

  initialize();

  app.mixin({
    mounted() {
      initialize();
    },
  });

  if (app.config.globalProperties.$router) {
    app.config.globalProperties.$router.afterEach(() => {
      setTimeout(initialize, 0);
    });
  }
}

export default {
  install,
};
