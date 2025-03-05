import { App, ComponentPublicInstance } from "vue";

interface Options {
  enabled?: boolean;
  key?: string;
  defaultEditor?: string;
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
];

const EDITOR_STORAGE_KEY = "click2component_editor";

const defaultOptions: Options = {
  enabled: true,
  key: "Alt",
  defaultEditor: "vscode",
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

  // 如果是文本节点的父节点，检查其子节点
  if (node.childNodes.length > 0) {
    let closestLine: number | undefined;
    let minDistance = Infinity;

    // 遍历所有子节点
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        // 获取文本节点的位置信息
        const rect = (child as any).getBoundingClientRect?.();
        if (rect) {
          const distance = Math.abs(rect.top + rect.height / 2 - clickY);
          const textLine = (child as any)?.__source?.start?.line;

          // 更新最近的行号
          if (textLine && distance < minDistance) {
            minDistance = distance;
            closestLine = textLine;
          }
        }
      }
    }

    if (closestLine !== undefined) {
      return closestLine;
    }
  }

  return sourceLine;
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

  // 确保路径是绝对路径
  const absolutePath = sourceCodeLocation.startsWith("/")
    ? sourceCodeLocation
    : `/${sourceCodeLocation}`;

  let fileUrl = `${editorConfig.protocol}${absolutePath}`;

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
  if (!pathTooltip) {
    pathTooltip = document.createElement("div");
    pathTooltip.className = "click2component-path-tooltip";
    document.body.appendChild(pathTooltip);
  }

  if (componentFile) {
    // 分割路径，保留最后一部分
    const parts = componentFile.split("/");
    const fileName = parts.pop() || "";
    const dirPath = parts.join("/");

    pathTooltip.innerHTML = `
      <span class="path-middle">${dirPath}/</span>
      <span class="path-end">${fileName}</span>
    `;
    pathTooltip.style.display = "flex";
  } else {
    pathTooltip.style.display = "none";
  }
}

function hidePathTooltip() {
  if (pathTooltip) {
    pathTooltip.style.display = "none";
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
    setTarget(target, "hover");
    const componentFile =
      instance.__file || instance.type?.__file || instance.$options?.__file;

    showPathTooltip(componentFile);
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
      line: line,
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

    window.addEventListener("keyup", (e) => {
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
        cleanTarget();
        document.body.removeAttribute("vue-click-to-component");
      }
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
